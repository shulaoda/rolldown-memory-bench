import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { PLATFORM_CACHE, cached, exec, linkDir, readJson } from './util.mjs';

// `name=spec` or `spec`. A spec is an npm version (`1.3.3`, `latest`), a pkg.pr.new preview
// (`pr:11655`, `main`, `commit:<sha>`), a rolldown repo or worktree, a built `rolldown` package
// directory, or a `.node` binding file.
export function parseTarget(arg) {
  const eq = arg.indexOf('=');
  if (eq > 0 && !/[\\/:]/.test(arg.slice(0, eq))) return { name: arg.slice(0, eq), spec: arg.slice(eq + 1) };
  return { name: null, spec: arg };
}

const NPM_SPEC = /^(?:npm:|rolldown@)?(\d+\.\d+\.\d+(?:-[\w.]+)?|latest|canary|next)$/;

async function install(key, spec) {
  const dir = path.join(PLATFORM_CACHE, 'npm', key);
  await cached(dir, spec, () => {
    console.log(`[setup] npm install ${spec}`);
    fs.writeFileSync(path.join(dir, 'package.json'), '{ "private": true }\n');
    exec('npm', ['install', '--no-audit', '--no-fund', spec], { cwd: dir });
  });
  return path.join(dir, 'node_modules', 'rolldown');
}

async function github(pathname) {
  const headers = { accept: 'application/vnd.github+json' };
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`https://api.github.com/repos/rolldown/rolldown${pathname}`, { headers });
  if (!response.ok) throw new Error(`GitHub API ${pathname} answered ${response.status}`);
  return response.json();
}

const hasPreview = async (sha) => (await fetch(`https://pkg.pr.new/rolldown@${sha}`, { method: 'HEAD' })).ok;

// Every main commit gets a preview. A PR gets one only with the "trigger: preview" label.
async function previewOf(spec) {
  const pr = spec.match(/^(?:pr:|#)(\d+)$/)?.[1];
  if (pr) {
    const sha = (await github(`/pulls/${pr}`)).head.sha.slice(0, 7);
    if (await hasPreview(sha)) return { sha, label: `pr-${pr}` };
    throw new Error(
      `PR #${pr} has no preview for its head commit ${sha}. Add the "trigger: preview" label to the PR and wait for the "Publish to pkg.pr.new" run, or build the PR locally.`,
    );
  }
  if (spec === 'main') {
    for (const commit of await github('/commits?sha=main&per_page=20')) {
      const sha = commit.sha.slice(0, 7);
      if (await hasPreview(sha)) return { sha, label: `main-${sha}` };
    }
    throw new Error('None of the last 20 main commits has a preview');
  }
  const sha = (
    spec.match(/^commit:([0-9a-f]{7,40})$/) ?? spec.match(/^https:\/\/pkg\.pr\.new\/(?:rolldown\/rolldown\/)?rolldown@([0-9a-f]{7,40})$/)
  )?.[1]?.slice(0, 7);
  if (!sha) return null;
  if (!(await hasPreview(sha))) throw new Error(`Commit ${sha} has no preview on pkg.pr.new`);
  return { sha, label: sha };
}

function gitInfo(repo) {
  try {
    const sha = exec('git', ['-C', repo, 'rev-parse', '--short=10', 'HEAD']);
    const dirty = exec('git', ['-C', repo, 'status', '--porcelain', '--untracked-files=no']) !== '';
    return dirty ? `${sha}+dirty` : sha;
  } catch {
    return undefined;
  }
}

function exportPath(pkgDir, pkg, key) {
  let entry = pkg.exports?.[key];
  while (entry && typeof entry === 'object') entry = entry.import ?? entry.default;
  return entry ? path.join(pkgDir, entry) : undefined;
}

const BINDING_PACKAGES = {
  darwin: ['darwin-arm64', 'darwin-x64'],
  linux: ['linux-x64-gnu', 'linux-arm64-gnu', 'linux-x64-musl', 'linux-arm64-musl'],
  win32: ['win32-x64-msvc', 'win32-arm64-msvc'],
}[process.platform] ?? [];

// The loader takes a `.node` file next to the JS first, then the `@rolldown/binding-*` package.
function findBinding(pkgDir) {
  for (const dir of [path.join(pkgDir, 'dist'), path.join(pkgDir, 'dist', 'shared')]) {
    const file = fs.existsSync(dir) && fs.readdirSync(dir).find((name) => /^rolldown-binding\..+\.node$/.test(name));
    if (file) return path.join(dir, file);
  }
  const require = createRequire(path.join(pkgDir, 'package.json'));
  for (const suffix of BINDING_PACKAGES) {
    try {
      const dir = path.dirname(require.resolve(`@rolldown/binding-${suffix}/package.json`));
      const file = fs.readdirSync(dir).find((name) => name.endsWith('.node'));
      if (file) return path.join(dir, file);
    } catch {}
  }
  return undefined;
}

// True when two paths are the same file: one inode, or the same bytes.
export function sameFile(a, b) {
  try {
    const [x, y] = [fs.statSync(a), fs.statSync(b)];
    if (x.dev === y.dev && x.ino === y.ino) return true;
    if (x.size !== y.size) return false;
    const hash = (file) => createHash('sha1').update(fs.readFileSync(file)).digest('hex');
    return hash(a) === hash(b);
  } catch {
    return false;
  }
}

function enclosingPackage(file) {
  for (let dir = path.dirname(file); dir !== path.dirname(dir); dir = path.dirname(dir)) {
    if (readJson(path.join(dir, 'package.json'))?.name === 'rolldown') return dir;
  }
  return undefined;
}

// A package that loads `nodeFile` with the JS of `base`: a copy of the base `dist` with the binding
// next to the loader, and the base's dependencies linked in.
async function overlay(nodeFile, base) {
  const stat = fs.statSync(nodeFile);
  const key = [nodeFile, stat.size, stat.mtimeMs, base.pkgDir, base.version].join('|');
  const dir = path.join(PLATFORM_CACHE, 'bins', createHash('sha1').update(key).digest('hex').slice(0, 12));
  const pkgDir = path.join(dir, 'rolldown');
  await cached(dir, key, () => {
    fs.mkdirSync(pkgDir);
    fs.copyFileSync(path.join(base.pkgDir, 'package.json'), path.join(pkgDir, 'package.json'));
    fs.cpSync(path.join(base.pkgDir, 'dist'), path.join(pkgDir, 'dist'), {
      recursive: true,
      filter: (src) => !src.endsWith('.node'),
    });
    // Loaders of different versions look in `dist` or in `dist/shared`, so put it in both.
    for (const sub of ['dist', path.join('dist', 'shared')]) {
      if (!fs.existsSync(path.join(pkgDir, sub))) continue;
      const file = path.join(pkgDir, sub, path.basename(base.binding));
      try {
        fs.linkSync(nodeFile, file);
      } catch {
        fs.copyFileSync(nodeFile, file);
      }
    }
    const installed = base.kind === 'npm' || base.kind === 'preview';
    const deps = installed ? path.dirname(base.pkgDir) : path.join(base.pkgDir, 'node_modules');
    linkDir(deps, path.join(pkgDir, 'node_modules'));
  });
  return pkgDir;
}

// Whether Node finds `name` from `dir`, which looks in every node_modules up the tree.
function hasPackage(dir, name) {
  for (let current = dir; ; current = path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'node_modules', name, 'package.json'))) return true;
    if (path.dirname(current) === current) return false;
  }
}

export async function resolveTarget({ name, spec }, { base: baseSpec } = {}) {
  if (spec.endsWith('.node')) {
    const nodeFile = fs.realpathSync(path.resolve(spec));
    const baseDir = baseSpec ?? enclosingPackage(nodeFile);
    if (!baseDir) throw new Error(`Pass --base <spec> to give ${spec} the JS of a rolldown build`);
    const base = await resolveTarget({ name: null, spec: baseDir });
    const pkgDir = sameFile(nodeFile, base.binding) ? base.pkgDir : await overlay(nodeFile, base);
    return {
      ...(await resolveTarget({ name, spec: pkgDir })),
      name: name ?? path.basename(nodeFile, '.node'),
      spec,
      kind: 'binding',
      base: base.spec,
      binding: nodeFile,
    };
  }
  let pkgDir;
  let kind;
  let git;
  let headTime;
  const npmTag = spec.match(NPM_SPEC)?.[1];
  const preview = npmTag ? null : await previewOf(spec);
  if (npmTag) {
    const version = /^\d/.test(npmTag) ? npmTag : exec('npm', ['view', `rolldown@${npmTag}`, 'version']);
    pkgDir = await install(`rolldown@${version}`, `rolldown@${version}`);
    kind = 'npm';
  } else if (preview) {
    pkgDir = await install(`rolldown@pkg.pr.new-${preview.sha}`, `https://pkg.pr.new/rolldown@${preview.sha}`);
    kind = 'preview';
    git = preview.sha;
    name ??= preview.label;
  } else {
    const dir = path.resolve(spec);
    if (fs.existsSync(path.join(dir, 'packages', 'rolldown', 'package.json'))) {
      pkgDir = path.join(dir, 'packages', 'rolldown');
      kind = 'repo';
      git = gitInfo(dir);
      headTime = Number(exec('git', ['-C', dir, 'log', '-1', '--format=%ct'])) * 1000;
    } else if (readJson(path.join(dir, 'package.json'))?.name === 'rolldown') {
      pkgDir = dir;
      kind = 'package';
    } else {
      throw new Error(`"${spec}" is not an npm version, a rolldown repo, or a rolldown package directory`);
    }
  }
  pkgDir = fs.realpathSync(pkgDir);
  const pkg = readJson(path.join(pkgDir, 'package.json'));
  const entry = exportPath(pkgDir, pkg, '.');
  if (!entry || !fs.existsSync(entry)) {
    throw new Error(`${pkgDir} is not built. Run \`just build-rolldown-release\` in the repo first.`);
  }
  if (kind === 'repo' || kind === 'package') {
    const missing = Object.keys(pkg.dependencies ?? {}).filter((dep) => !hasPackage(pkgDir, dep));
    if (missing.length) throw new Error(`${pkgDir} cannot load ${missing.join(', ')}. Run \`pnpm install\` in its repo.`);
  }
  const binding = findBinding(pkgDir);
  if (!binding) throw new Error(`No rolldown binding for ${process.platform}-${process.arch} in ${pkgDir}`);
  const bindingMB = Math.round(fs.statSync(binding).size / 1048576);
  // A release binding is 20 to 40 MB. A debug one is several times larger and much slower.
  const debug = bindingMB > 80;
  // A binding built before the last commit does not have that commit in it.
  const stale = headTime !== undefined && fs.statSync(binding).mtimeMs < headTime;
  return {
    name: name ?? (kind === 'npm' ? pkg.version : path.basename(kind === 'repo' ? path.dirname(path.dirname(pkgDir)) : pkgDir)),
    spec,
    kind,
    version: pkg.version,
    git,
    pkgDir,
    entry,
    experimentalEntry: exportPath(pkgDir, pkg, './experimental'),
    binding,
    bindingMB,
    bindingTime: fs.statSync(binding).mtime.toISOString(),
    debug,
    stale,
  };
}
