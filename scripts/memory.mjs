import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PLATFORM_CACHE, ROOT } from './util.mjs';

const MB = 1024 * 1024;
export const toMB = (bytes) => (Number.isFinite(bytes) ? Math.round((bytes / MB) * 10) / 10 : null);

// The metric each platform reports. Numbers are only comparable on the same machine.
export const KIND = {
  darwin: { mem: 'phys_footprint', peak: 'phys_footprint' },
  linux: { mem: 'RssAnon', peak: 'VmHWM' },
  win32: { mem: 'private bytes', peak: 'commit' },
}[process.platform] ?? { mem: 'rss', peak: 'rss' };

const FOOTPRINT = path.join(PLATFORM_CACHE, 'tools', 'footprint');

// Builds the macOS helper. Call it in the parent, before any child needs it.
export function prepareTools() {
  if (process.platform !== 'darwin' || fs.existsSync(FOOTPRINT)) return;
  fs.mkdirSync(path.dirname(FOOTPRINT), { recursive: true });
  const result = spawnSync('cc', ['-O2', '-o', FOOTPRINT, path.join(ROOT, 'scripts', 'footprint.c')], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Building the footprint helper failed. Install the Xcode command line tools.\n${result.stderr}`);
  }
}

function darwin(pid) {
  const [mem, peak] = execFileSync(FOOTPRINT, [String(pid)], { encoding: 'utf8' }).trim().split(' ').map(Number);
  return { mem, peak };
}

function linux(pid) {
  const status = fs.readFileSync(`/proc/${pid}/status`, 'utf8');
  const kB = (key) => Number(status.match(new RegExp(`^${key}:\\s+(\\d+) kB`, 'm'))?.[1]) * 1024;
  return { mem: kB('RssAnon'), peak: kB('VmHWM'), rss: kB('VmRSS') };
}

// PeakPagedMemorySize64 is PeakPagefileUsage, the peak commit charge. It takes about half a second.
function win32(pid) {
  const script = `$p = Get-Process -Id ${pid}; "$($p.PrivateMemorySize64) $($p.PeakPagedMemorySize64) $($p.WorkingSet64)"`;
  const out = execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
    encoding: 'utf8',
  });
  const [mem, peak, rss] = out.trim().split(/\s+/).map(Number);
  return { mem, peak, rss };
}

const readers = { darwin, linux, win32 };

// Current and peak memory of a process, in MB.
export function readProcess(pid) {
  const read = readers[process.platform];
  if (!read) return { mem: null, peak: null };
  const { mem, peak, rss } = read(pid);
  return { mem: toMB(mem), peak: toMB(peak), rss: toMB(rss) };
}
