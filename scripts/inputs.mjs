// Inputs are created on first use under .cache/inputs, so every machine builds the same files.
import fs from 'node:fs';
import path from 'node:path';
import { CACHE, cached, exec, listFiles, toPosix } from './util.mjs';

const INPUTS = path.join(CACHE, 'inputs');

// The three.js r108 sources, the same as rolldown's `just setup-bench`.
async function threeSrc() {
  const dir = path.join(INPUTS, 'three-r108');
  await cached(dir, 'r108', () => {
    console.log('[setup] git clone three.js r108 (src only)');
    exec('git', ['clone', '-q', '--depth', '1', '--branch', 'r108', '--filter=blob:none', '--sparse', 'https://github.com/mrdoob/three.js.git', dir]);
    exec('git', ['-C', dir, 'sparse-checkout', 'set', 'src']);
  });
  return path.join(dir, 'src');
}

// Ten copies of three.js behind one entry, the same as rolldown's `three10x` bench input.
export async function three10x() {
  const src = await threeSrc();
  const dir = path.join(INPUTS, 'three10x');
  await cached(dir, 'v1', () => {
    const lines = [];
    for (let i = 1; i <= 10; i++) {
      fs.cpSync(src, path.join(dir, `copy${i}`), { recursive: true });
      lines.push(`import * as three${i} from './copy${i}/Three.js'; export { three${i} }`);
    }
    fs.writeFileSync(path.join(dir, 'entry.js'), `${lines.join('\n')}\n`);
  });
  return { dir, entry: path.join(dir, 'entry.js') };
}

// three10x with one dynamic import per file, which gives about 3,700 chunks.
export async function manyChunks() {
  const { dir } = await three10x();
  const entry = path.join(dir, 'many-chunks-entry.js');
  if (!fs.existsSync(entry)) {
    const files = listFiles(dir, (file) => file.endsWith('.js') && /copy\d+/.test(file));
    const lines = files.map((file, i) => `  m${i}: () => import('./${toPosix(path.relative(dir, file))}'),`);
    fs.writeFileSync(entry, `export const loaders = {\n${lines.join('\n')}\n};\n`);
  }
  return { dir, entry };
}

// The synthetic input of #10985 and #10984: 200 modules of about 10 KB, re-exported by one entry.
export async function synthetic(modules = 200) {
  const dir = path.join(INPUTS, `synthetic-${modules}`);
  await cached(dir, 'v1', () => {
    const entry = [];
    for (let m = 0; m < modules; m++) {
      const fns = [];
      for (let f = 0; f < 40; f++) {
        fns.push(
          `export function f${m}_${f}(a, b) { const o = { a, b, k: 'value-${m}-${f}' }; return Object.keys(o).map((k) => k + o[k]).join(','); }`,
        );
      }
      fns.push(`export class C${m} { #x = ${m}; get x() { return this.#x; } render() { return \`<div>\${this.#x}</div>\`; } }`);
      fs.writeFileSync(path.join(dir, `m${m}.js`), fns.join('\n'));
      entry.push(`export * from './m${m}.js';`);
    }
    fs.writeFileSync(path.join(dir, 'entry.js'), entry.join('\n'));
  });
  return { dir, entry: path.join(dir, 'entry.js') };
}

// A directory with pinned npm packages installed.
export async function npmPackages(name, dependencies) {
  const dir = path.join(INPUTS, name);
  await cached(dir, JSON.stringify(dependencies), () => {
    console.log(`[setup] npm install for ${name}`);
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ private: true, dependencies }, null, 2));
    exec('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts'], { cwd: dir });
  });
  return { dir };
}
