import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, readJson } from './util.mjs';

const PROBE = pathToFileURL(path.join(ROOT, 'scripts', 'probe.mjs')).href;
export const CHILD = path.join(ROOT, 'scripts', 'child.mjs');

// Starts `node --import=probe.mjs ...args`. The process writes its output straight to `log`, so the
// log is complete as soon as the process is gone. The file is opened for append, so the bench can
// add its own lines while the process still writes.
export function startNode({ args, cwd, env, log, ipc = false }) {
  const childEnv = { ...process.env, ...env };
  // Every napi-rs loader reads this, so it would also replace other native modules.
  delete childEnv.NAPI_RS_NATIVE_LIBRARY_PATH;
  const out = fs.openSync(log, 'a');
  try {
    return spawn(process.execPath, [`--import=${PROBE}`, ...args], {
      cwd,
      env: childEnv,
      stdio: ['ignore', out, out, ...(ipc ? ['ipc'] : [])],
    });
  } finally {
    fs.closeSync(out);
  }
}

// Runs a process to its end, and returns the report the probe wrote on exit and the wall time in ms.
export function runNode({ args, cwd, env, log }) {
  // Processes that the measured one forks load the probe too, and write their reports here as well.
  const probeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bench-probe-'));
  const probeOut = path.join(probeDir, 'probe');
  const start = performance.now();
  const child = startNode({ args, cwd, env: { ...env, BENCH_PROBE_OUT: probeOut }, log });
  return new Promise((resolve) => {
    child.on('close', (code, signal) => {
      const wall = Math.round(performance.now() - start);
      const report = readJson(`${probeOut}.${child.pid}.json`) ?? null;
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
