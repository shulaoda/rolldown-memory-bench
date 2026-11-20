import { three10x } from '../scripts/inputs.mjs';

export const meta = {
  title: 'three.js x10, one build: peak, output held, after GC, idle',
  rounds: 5,
  variants: {
    plain: {},
    sourcemap: { output: { sourcemap: true } },
    'sourcemap-minify': { output: { sourcemap: true, minify: true } },
  },
};

export const setup = () => three10x();

export async function run({ rolldown, variant, input, mark, time, gc, sleep }) {
  let output = await time('build', async () => {
    const bundle = await rolldown.rolldown({ input: input.entry, logLevel: 'silent' });
    const result = await bundle.generate(variant.output);
    await bundle.close();
    return result;
  });
  mark('output held');
  output = null;
  await gc();
  mark('after gc');
  await sleep(2000);
  mark('idle 2s');
}
