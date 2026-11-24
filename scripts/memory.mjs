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
  win32: { mem: 'private working set', peak: 'PeakWorkingSet' },
}[process.platform] ?? { mem: 'rss', peak: 'rss' };

const FOOTPRINT = path.join(PLATFORM_CACHE, 'tools', 'footprint');
const WINMEM = path.join(PLATFORM_CACHE, 'tools', 'winmem.exe');
const CSC = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'Microsoft.NET', 'Framework64', 'v4.0.30319', 'csc.exe');

function build(cmd, args, out, hint) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const result = spawnSync(cmd, args, { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`Building ${path.basename(out)} failed. ${hint}\n${result.error?.message ?? ''}${result.stdout ?? ''}${result.stderr ?? ''}`);
  }
}

// Builds the helper that reads the memory on macOS and Windows. Call it in the parent, before any
// child needs it.
export function prepareTools() {
  if (process.platform === 'darwin' && !fs.existsSync(FOOTPRINT)) {
    const source = path.join(ROOT, 'scripts', 'footprint.c');
    build('cc', ['-O2', '-o', FOOTPRINT, source], FOOTPRINT, 'Install the Xcode command line tools.');
  }
  const source = path.join(ROOT, 'scripts', 'winmem.cs');
  const stale = () => fs.statSync(WINMEM).mtimeMs < fs.statSync(source).mtimeMs;
  if (process.platform === 'win32' && (!fs.existsSync(WINMEM) || stale())) {
    build(CSC, ['-nologo', '-optimize', `-out:${WINMEM}`, source], WINMEM, `It needs ${CSC}, the C# compiler of the .NET Framework 4.`);
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

// The private working set, like macOS footprint and Linux RssAnon. Private bytes (commit) is not
// used: V8 keeps freed heap pages committed after it discards them, so the commit stayed 134 MB
// above the start after the selftest freed everything. Windows keeps no peak of the private working
// set, so the peak is the peak working set, which also counts shared pages, like Linux VmHWM.
// A read takes about 40 ms.
function win32(pid) {
  const out = execFileSync(WINMEM, [String(pid)], { encoding: 'utf8' });
  const [mem, peak, commit, peakCommit] = out.trim().split(' ').map(Number);
  return { mem, peak, commit, peakCommit };
}

const readers = { darwin, linux, win32 };

// Current and peak memory of a process, in MB.
export function readProcess(pid) {
  const read = readers[process.platform];
  if (!read) return { mem: null, peak: null };
  const { mem, peak, rss, commit, peakCommit } = read(pid);
  return { mem: toMB(mem), peak: toMB(peak), rss: toMB(rss), commit: toMB(commit), peakCommit: toMB(peakCommit) };
}

// The part of the footprint that mimalloc, rolldown's allocator, holds, in MB. mimalloc tags its
// memory with VM tag 100, which `footprint` lists as "IOAccelerator". macOS only, about 25 ms.
export function readMimalloc(pid) {
  if (process.platform !== 'darwin') return null;
  try {
    const out = execFileSync('footprint', ['-p', String(pid), '-f', 'bytes'], { encoding: 'utf8' });
    const line = out.split('\n').find((text) => /\sIOAccelerator\s*$/.test(text));
    return line ? toMB(Number(line.trim().split(/\s+/)[0])) : 0;
  } catch {
    return null;
  }
}
