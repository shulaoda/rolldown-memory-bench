import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const CACHE = path.join(ROOT, '.cache');
// Native files and node_modules differ per platform, so a directory shared by two systems keeps them apart.
export const PLATFORM_CACHE = path.join(CACHE, `${process.platform}-${process.arch}`);
export const RESULTS = path.join(ROOT, 'results');
export const isWin = process.platform === 'win32';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const quote = (arg) => (/[\s"&|<>^]/.test(arg) ? `"${arg.replaceAll('"', '""')}"` : arg);

// npm and pnpm are .cmd files on Windows, and those only run through a shell.
export function exec(cmd, args, { cwd, env, inherit = false } = {}) {
  const shell = isWin && !['git', process.execPath].includes(cmd);
  const result = spawnSync(shell ? [cmd, ...args].map(quote).join(' ') : cmd, shell ? [] : args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: inherit ? 'inherit' : 'pipe',
    shell,
    encoding: 'utf8',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`\`${cmd} ${args.join(' ')}\` failed with code ${result.status}\n${result.stderr ?? ''}`);
  }
  return (result.stdout ?? '').trim();
}

export function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return undefined;
  }
}

// Points `link` at the directory `target`. Windows uses a junction, which needs no admin rights.
export function linkDir(target, link) {
  try {
    fs.unlinkSync(link);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  fs.mkdirSync(path.dirname(link), { recursive: true });
  fs.symlinkSync(target, link, isWin ? 'junction' : 'dir');
}

// Runs `create(dir)` once per `key`. A changed key or an interrupted run starts over.
export async function cached(dir, key, create) {
  const marker = path.join(dir, '.bench-ready');
  if (fs.existsSync(marker) && fs.readFileSync(marker, 'utf8') === key) return dir;
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  await create(dir);
  fs.writeFileSync(marker, key);
  return dir;
}

export function listFiles(dir, filter = () => true, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(file, filter, out);
    else if (filter(file)) out.push(file);
  }
  return out;
}

export const toPosix = (file) => file.replaceAll('\\', '/');
