import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './util.mjs';

const PROBE = pathToFileURL(path.join(ROOT, 'scripts', 'probe.mjs')).href;
export const CHILD = path.join(ROOT, 'scripts', 'child.mjs');

// Runs `node --import=probe.mjs ...args` and returns the probe report and the wall time in ms.
export function runNode({ args, cwd, env, log, probeDir }) {
  return new Promise((resolve) => {
    fs.mkdirSync(probeDir, { recursive: true });
    const probeOut = path.join(probeDir, 'probe');
    const childEnv = { ...process.env, ...env, BENCH_PROBE_OUT: probeOut };
    // Every napi-rs loader reads this, so it would also replace other native modules.
    delete childEnv.NAPI_RS_NATIVE_LIBRARY_PATH;
    const start = performance.now();
    const child = spawn(process.execPath, [`--import=${PROBE}`, ...args], {
      cwd,
      env: childEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const logStream = fs.createWriteStream(log);
    child.stdout.pipe(logStream, { end: false });
    child.stderr.pipe(logStream, { end: false });
    child.on('close', (code, signal) => {
      const wall = Math.round(performance.now() - start);
      logStream.end();
      const file = `${probeOut}.${child.pid}.json`;
      const report = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
      fs.rmSync(probeDir, { recursive: true, force: true });
      resolve({ ok: code === 0 && report !== null, code, signal, wall, report });
    });
  });
}

export function tail(file, lines = 15) {
  try {
    return fs.readFileSync(file, 'utf8').trimEnd().split('\n').slice(-lines).join('\n');
  } catch {
    return '';
  }
}
