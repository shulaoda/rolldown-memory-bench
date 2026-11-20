import { npmPackages } from '../scripts/inputs.mjs';

// #11233: one dependency optimization pass, like Vite's optimizer: every dependency is an entry,
// esm with sourcemaps. The reporter saw the memory kept after it grow with the thread count.
const dependencies = {
  typescript: '5.9.3',
  '@codemirror/autocomplete': '6.20.4',
  '@codemirror/commands': '6.11.1',
  '@codemirror/lang-css': '6.3.1',
  '@codemirror/lang-html': '6.4.12',
  '@codemirror/lang-javascript': '6.2.5',
  '@codemirror/lang-json': '6.0.2',
  '@codemirror/lang-markdown': '6.5.2',
  '@codemirror/language': '6.13.1',
  '@codemirror/lint': '6.9.8',
  '@codemirror/search': '6.7.2',
  '@codemirror/state': '6.7.6',
  '@codemirror/view': '6.43.15',
  vue: '3.5.45',
};

const FOUR_THREADS = { ROLLDOWN_WORKER_THREADS: '4', ROLLDOWN_MAX_BLOCKING_THREADS: '4', RAYON_NUM_THREADS: '4' };

export const meta = {
  title: 'One optimizer-like pass over typescript, codemirror and vue, then idle',
  issues: [11233],
  rounds: 5,
  variants: {
    'default-threads': {},
    '4-threads': { env: FOUR_THREADS },
  },
};

export async function setup() {
  const { dir } = await npmPackages('optimizer-deps', dependencies);
  return { dir, entries: Object.keys(dependencies) };
}

export async function run({ rolldown, input, mark, time, gc, sleep }) {
  const entries = Object.fromEntries(input.entries.map((name) => [name.replace(/\W+/g, '_'), name]));
  let output = await time('build', async () => {
    const bundle = await rolldown.rolldown({ input: entries, cwd: input.dir, platform: 'browser', logLevel: 'silent' });
    const result = await bundle.generate({ format: 'esm', sourcemap: true });
    await bundle.close();
    return result;
  });
  mark('output held');
  output = null;
  await gc();
  const start = performance.now();
  for (const at of [2000, 10000]) {
    await sleep(at - (performance.now() - start));
    mark(`idle ${at / 1000}s`);
  }
}
