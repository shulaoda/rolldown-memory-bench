// Runs a dev server with the probe, drives it with a case script, and asks the probe for marks
// and the final report over IPC.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, sleep } from './util.mjs';

const PROBE = pathToFileURL(path.join(ROOT, 'scripts', 'probe.mjs')).href;

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

// Requests every static and dynamic import reachable from `url`, like a browser that opens every
// lazy route. Taken from the #11189 repro.
export async function crawl(url) {
  const origin = new URL(url).origin;
  const importPattern = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)["']([^"']+)["']|<script[^>]+src=["']([^"']+)["']/g;
  const seen = new Set([url]);
  const queue = [url];
  while (queue.length > 0) {
    const batch = queue.splice(0, 16);
    const bodies = await Promise.all(
      batch.map(async (next) => {
        const response = await fetch(next).catch(() => undefined);
        const type = response?.headers.get('content-type') ?? '';
        return response?.ok && /javascript|html/.test(type) ? [next, await response.text()] : undefined;
      }),
    );
    for (const [from, body] of bodies.filter(Boolean)) {
      for (const match of body.matchAll(importPattern)) {
        const next = new URL(match[1] ?? match[2], from).toString();
        if (next.startsWith(origin) && !seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
  }
  return seen.size;
}

async function launchBrowser() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    throw new Error('Playwright is missing. Run `just setup`.');
  }
  return playwright.chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] });
}

async function waitReady(url, child, timeout) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (child.exitCode !== null || child.signalCode !== null) throw new Error('the dev server exited before it was ready');
    const ok = await fetch(url).then(
      () => true,
      () => false,
    );
    if (ok) return;
    await sleep(500);
  }
  throw new Error(`the dev server was not ready after ${timeout / 1000}s`);
}

async function stop(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise((resolve) => child.once('exit', resolve));
  child.kill('SIGTERM');
  const timer = setTimeout(() => child.kill('SIGKILL'), 5000);
  await exited;
  clearTimeout(timer);
}

export async function runDev({ dir, args, env, log, script, readyTimeout = 180_000 }) {
  const port = await freePort();
  const url = `http://127.0.0.1:${port}/`;
  const serverArgs = [`--import=${PROBE}`, ...args, '--host', '127.0.0.1', '--port', String(port), '--strictPort'];
  const start = performance.now();
  const child = spawn(process.execPath, serverArgs, {
    cwd: dir,
    env: { ...process.env, ...env, BENCH_PROBE_IPC: '1' },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });
  const logStream = fs.createWriteStream(log);
  child.stdout.pipe(logStream, { end: false });
  child.stderr.pipe(logStream, { end: false });

  const pending = new Map();
  let nextId = 0;
  child.on('message', (message) => {
    if (message?.type !== 'bench') return;
    pending.get(message.id)?.(message.data);
    pending.delete(message.id);
  });
  const ask = (message) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, resolve);
      child.send({ type: 'bench', id, ...message });
      setTimeout(() => pending.delete(id) && reject(new Error('the probe did not answer')), 120_000);
    });

  const edited = new Map();
  const browsers = [];
  const metrics = {};
  try {
    await waitReady(url, child, readyTimeout);
    metrics.ready = { value: Math.round(performance.now() - start), unit: 'ms' };
    await script({
      url,
      dir,
      sleep,
      // `gc` runs a full GC in the server first. The server needs `--expose-gc` for that.
      mark: (label, { gc = false } = {}) => ask({ action: 'mark', label, gc }),
      crawl: (pathname = '/') => crawl(new URL(pathname, url).toString()),
      async open(pathname = '/', { wait = 0 } = {}) {
        const browser = await launchBrowser();
        browsers.push(browser);
        const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await page.goto(new URL(pathname, url).toString(), { waitUntil: 'load', timeout: 300_000 });
        await page.waitForTimeout(wait);
        await browser.close();
      },
      edit(file, text) {
        const full = path.join(dir, file);
        if (!edited.has(full)) edited.set(full, fs.readFileSync(full, 'utf8'));
        fs.appendFileSync(full, text);
      },
    });
    const report = await ask({ action: 'report' });
    report.metrics = { ...metrics, ...report.metrics };
    return { ok: true, wall: Math.round(performance.now() - start), report };
  } catch (error) {
    logStream.write(`\n[bench] ${error.stack}\n`);
    return { ok: false, code: child.exitCode, signal: child.signalCode, wall: Math.round(performance.now() - start), report: null };
  } finally {
    for (const [file, text] of edited) fs.writeFileSync(file, text);
    for (const browser of browsers) await browser.close().catch(() => {});
    await stop(child);
    logStream.end();
  }
}
