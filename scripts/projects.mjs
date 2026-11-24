// Real projects live in projects/<dir>, most of them git submodules pinned to a commit.
// After install, every `rolldown` package in the pnpm store becomes a link to the slot
// .cache/<platform>/slots/<id>, and a run points the slot at the target. So one install serves
// every target, and it does not depend on how a pnpm version handles `link:` overrides.
import fs from 'node:fs';
import path from 'node:path';
import { PLATFORM_CACHE, ROOT, exec, findPackage, linkDir, readJson, toPosix } from './util.mjs';

const RECORD = '.bench-relinked.json';
const MARKER = '.bench-ready';

const projectDir = (id) => path.join(ROOT, 'projects', id);
const slotPath = (id) => path.join(PLATFORM_CACHE, 'slots', id);

function isSubmodule(dir) {
  const rel = toPosix(path.relative(ROOT, dir));
  try {
    return exec('git', ['config', '-f', '.gitmodules', '--get-regexp', 'path'], { cwd: ROOT })
      .split('\n')
      .some((line) => line.split(' ')[1] === rel);
  } catch {
    return false;
  }
}

function ensureCheckout(dir) {
  if (!isSubmodule(dir) || fs.existsSync(path.join(dir, '.git'))) return false;
  console.log(`[setup] git submodule update ${path.relative(ROOT, dir)}`);
  exec('git', ['submodule', 'update', '--init', path.relative(ROOT, dir)], { cwd: ROOT, inherit: true });
  return true;
}

// Puts `overrides` at the top of the `overrides:` block of pnpm-workspace.yaml.
function setPnpmOverrides(dir, overrides) {
  const file = path.join(dir, 'pnpm-workspace.yaml');
  const lines = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n') : [];
  let start = lines.findIndex((line) => /^overrides:\s*$/.test(line));
  if (start === -1) {
    lines.push('overrides:');
    start = lines.length - 1;
  }
  let end = start + 1;
  while (end < lines.length && (lines[end].trim() === '' || /^\s/.test(lines[end]))) end++;
  const keyOf = (line) => line.trim().match(/^(['"]?)([^'":]+)\1\s*:/)?.[2];
  const kept = lines.slice(start + 1, end).filter((line) => !Object.hasOwn(overrides, keyOf(line) ?? ''));
  const added = Object.entries(overrides).map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`);
  lines.splice(start + 1, end - start - 1, ...added, ...kept);
  fs.writeFileSync(file, lines.join('\n'));
}

// Replaces every `rolldown` package in the pnpm store with a link to `slot`. Store entries that are
// links (a global virtual store) are only re-pointed. The record lets `restoreRolldown` undo it.
function relinkRolldown(dir, slot) {
  const store = path.join(dir, 'node_modules', '.pnpm');
  const recordFile = path.join(store, RECORD);
  const record = readJson(recordFile) ?? [];
  const entries = fs.existsSync(store) ? fs.readdirSync(store).filter((name) => name.startsWith('rolldown@')) : [];
  if (entries.length === 0) throw new Error(`No rolldown package in ${store}`);
  for (const entry of entries) {
    const pkg = path.join(store, entry, 'node_modules', 'rolldown');
    if (!record.some((item) => item.path === pkg)) {
      if (fs.lstatSync(pkg).isSymbolicLink()) {
        record.push({ path: pkg, link: fs.readlinkSync(pkg) });
      } else {
        fs.renameSync(pkg, `${pkg}.bench-orig`);
        record.push({ path: pkg, moved: `${pkg}.bench-orig` });
      }
      fs.writeFileSync(recordFile, JSON.stringify(record, null, 2));
    }
    linkDir(slot, pkg);
  }
}

function restoreRolldown(dir) {
  const recordFile = path.join(dir, 'node_modules', '.pnpm', RECORD);
  for (const item of readJson(recordFile) ?? []) {
    try {
      fs.unlinkSync(item.path);
    } catch {}
    if (item.moved) fs.renameSync(item.moved, item.path);
    else linkDir(item.link, item.path);
  }
  fs.rmSync(recordFile, { force: true });
}

const latestVersions = new Map();

// The newest npm version of a package, so projects stay on the newest vite and friends.
function latest(name) {
  if (!latestVersions.has(name)) latestVersions.set(name, exec('npm', ['view', name, 'version']));
  return latestVersions.get(name);
}

function headOf(dir) {
  try {
    return exec('git', ['-C', dir, 'rev-parse', 'HEAD']);
  } catch {
    return 'local';
  }
}

export async function setupProject(id, project, target) {
  const dir = projectDir(id);
  const fresh = ensureCheckout(dir);
  const slot = slotPath(id);
  linkDir(target.pkgDir, slot);
  const marker = path.join(dir, MARKER);
  // `latest` in overrides means the newest npm version. A new vite release sets every project up again.
  const overrides = project.overrides
    ? Object.fromEntries(Object.entries(project.overrides).map(([k, v]) => [k, v === 'latest' ? latest(k) : v]))
    : undefined;
  const key = JSON.stringify([
    isSubmodule(dir) ? headOf(dir) : 'local',
    overrides,
    latest('vite'),
    String(project.install ?? ''),
    String(project.prepare ?? ''),
  ]);
  if (!fresh && fs.existsSync(marker) && fs.readFileSync(marker, 'utf8') === key) {
    relinkRolldown(dir, slot);
    return;
  }
  fs.rmSync(marker, { force: true });
  restoreRolldown(dir);
  // Start from the pinned files, since a past setup or a crashed run may have changed them.
  if (isSubmodule(dir)) exec('git', ['-C', dir, 'checkout', '-q', '-f', 'HEAD']);
  if (overrides) setPnpmOverrides(dir, overrides);
  const ctx = {
    latest,
    run: (cmd, args) => exec(cmd, args, { cwd: dir, inherit: true }),
    replace(file, from, to) {
      const full = path.join(dir, file);
      const text = fs.readFileSync(full, 'utf8');
      const found = from instanceof RegExp ? from.test(text) : text.includes(from);
      if (!found) throw new Error(`${file} has no ${from}`);
      fs.writeFileSync(full, text.replace(from, to));
    },
  };
  console.log(`[setup] install ${id}`);
  if (project.install) await project.install(ctx);
  else ctx.run('pnpm', ['install', '--no-frozen-lockfile']);
  if (project.prepare) await project.prepare(ctx);
  relinkRolldown(dir, slot);
  fs.writeFileSync(marker, key);
}

// The rolldown that vite loads in `cwd`. Node looks for it from the real path of vite.
function usedRolldown(cwd) {
  const vite = findPackage(cwd, 'vite');
  if (!vite) throw new Error(`No vite installed for ${cwd}`);
  const rolldown = findPackage(fs.realpathSync(vite), 'rolldown');
  return rolldown && fs.realpathSync(rolldown);
}

// Points the project at `target` and returns the directory to run the case in.
export function switchProject(id, projectCase, target) {
  const dir = projectDir(id);
  if (!fs.existsSync(path.join(dir, MARKER))) throw new Error(`${id} is not set up. Run \`just setup\`.`);
  linkDir(target.pkgDir, slotPath(id));
  const cwd = path.join(dir, projectCase.cwd ?? '');
  const used = usedRolldown(cwd);
  if (used !== target.pkgDir) {
    throw new Error(`vite in ${cwd} loads rolldown from ${used}, not from the target ${target.pkgDir}`);
  }
  for (const item of projectCase.clean ?? []) fs.rmSync(path.join(cwd, item), { recursive: true, force: true });
  return cwd;
}
