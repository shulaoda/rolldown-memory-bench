// Loaded with `--import` into every measured process. On exit it writes the peak memory, the CPU
// time and the marks to `$BENCH_PROBE_OUT.<pid>.json`. A dev server, which never exits on its own,
// answers the same report over IPC instead.
import fs from 'node:fs';
import { isMainThread } from 'node:worker_threads';
import { KIND, readMimalloc, readProcess, toMB } from './memory.mjs';

const start = performance.now();
const marks = [];
const metrics = {};
let nativeStats = null;

// `getNativeMemoryStats` from `rolldown/experimental`. It returns numbers only in a binding
// built with the `tracking_allocator` feature.
export function useNativeStats(fn) {
  nativeStats = typeof fn === 'function' ? fn : null;
}

// Records the memory now. With `cheap`, it skips the slow readers. Windows then records the working
// set, and macOS leaves out the mimalloc part.
export function mark(label, { cheap = false } = {}) {
  const usage = process.memoryUsage();
  const slowOs = process.platform === 'win32' && cheap;
  const os = slowOs ? {} : readProcess(process.pid);
  const entry = {
    label,
    t: Math.round(performance.now() - start),
    mem: os.mem ?? toMB(usage.rss),
    rss: toMB(usage.rss),
    jsHeap: toMB(usage.heapUsed),
  };
  if (slowOs || os.mem == null) entry.memKind = 'rss';
  if (os.commit != null) entry.commit = os.commit;
  const mimalloc = cheap ? null : readMimalloc(process.pid);
  if (mimalloc != null) entry.mimalloc = mimalloc;
  const native = nativeStats?.();
  if (native) entry.rustLive = toMB(native.liveBytes);
  marks.push(entry);
  return entry;
}

export function metric(name, value, unit = 'ms') {
  metrics[name] = { value: Math.round(value * 10) / 10, unit };
}

function loadedBindings() {
  try {
    const files = process.report.getReport().sharedObjects ?? [];
    return files.filter((file) => /rolldown-binding\.[\w-]+\.node$/.test(file));
  } catch {
    return [];
  }
}

function report(code) {
  const usage = process.resourceUsage();
  let os = {};
  try {
    os = readProcess(process.pid);
  } catch {}
  const native = nativeStats?.();
  return {
    code,
    kind: KIND,
    peak: os.peak ?? null,
    maxRss: toMB(usage.maxRSS * 1024),
    cpu: Math.round((usage.userCPUTime + usage.systemCPUTime) / 1000),
    peakCommit: os.peakCommit ?? undefined,
    rustPeak: native ? toMB(native.peakBytes) : undefined,
    bindings: loadedBindings(),
    marks,
    metrics,
  };
}

// Two full GCs with a turn of the event loop after each, so objects that wait for one turn, such as
// WeakRef targets, are collected too. Without `--expose-gc` it does nothing.
export async function fullGc() {
  for (let i = 0; i < 2; i++) {
    globalThis.gc?.();
    await new Promise((resolve) => setImmediate(resolve));
  }
}

if (isMainThread && process.env.BENCH_PROBE_OUT) {
  const out = `${process.env.BENCH_PROBE_OUT}.${process.pid}.json`;
  process.on('exit', (code) => fs.writeFileSync(out, JSON.stringify(report(code))));
}

if (isMainThread && process.send && process.env.BENCH_PROBE_IPC) {
  // The channel must not keep the process alive, or change when it exits.
  process.channel?.unref();
  process.on('message', async (message) => {
    if (message?.type !== 'bench') return;
    if (message.gc) await fullGc();
    const data = message.action === 'mark' ? mark(message.label) : report(null);
    process.send({ type: 'bench', id: message.id, data });
  });
}
