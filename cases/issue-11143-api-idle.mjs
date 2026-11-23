import fs from 'node:fs';
import path from 'node:path';
import { three10x } from '../scripts/inputs.mjs';
import { listFiles } from '../scripts/util.mjs';

// #11143: a long-lived process bundles files it holds in memory, each with a `.map`, with
// `sourcemap: true`. After the outputs are dropped, the memory should go back down.
export const meta = {
  title: 'API builds with in-memory files and maps, then outputs dropped and idle',
  issues: [11143],
  rounds: 5,
  variants: {
    '6-builds': { builds: 6 },
    '1-build': { builds: 1 },
  },
};

export const setup = () => three10x();

function inMemoryFiles(dir) {
  const files = new Map();
  for (const file of listFiles(dir, (f) => f.endsWith('.js') && /copy\d+/.test(f))) {
    const code = fs.readFileSync(file, 'utf8');
    const lines = code.split('\n').length;
    const map = { version: 3, sources: [file], sourcesContent: [code], names: [], mappings: 'AAAA;'.repeat(lines) };
    files.set(file, { code, map: JSON.stringify(map) });
  }
  return files;
}

export async function run({ rolldown, variant, input, mark, time, gc, sleep }) {
  const files = inMemoryFiles(input.dir);
  const plugin = {
    name: 'in-memory',
    resolveId(id, importer) {
      if (!importer || !id.startsWith('.')) return null;
      const file = path.resolve(path.dirname(importer), id);
      return files.has(file) ? file : null;
    },
    load(id) {
      return files.get(id) ?? null;
    },
  };
  mark('before builds');
  let outputs = [];
  await time('all builds', async () => {
    for (let i = 0; i < variant.builds; i++) {
      const bundle = await rolldown.rolldown({ input: input.entry, plugins: [plugin], logLevel: 'silent' });
      outputs.push(await bundle.generate({ format: 'esm', sourcemap: true }));
      await bundle.close();
    }
  });
  mark('outputs held');
  outputs = null;
  await gc();
  const start = performance.now();
  for (const at of [1500, 4000, 12000]) {
    await sleep(at - (performance.now() - start));
    mark(`idle ${at / 1000}s`);
  }
}
