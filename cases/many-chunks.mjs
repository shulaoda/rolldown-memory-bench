import { manyChunks } from '../scripts/inputs.mjs';

export const meta = {
  title: 'three.js x10 with one dynamic import per file (about 3,700 chunks), one build',
  rounds: 5,
  variants: {
    plain: {},
    sourcemap: { output: { sourcemap: true } },
  },
};

export const setup = () => manyChunks();

export async function run({ rolldown, variant, input, mark, metric, time, gc, sleep }) {
  let output = await time('build', async () => {
    const bundle = await rolldown.rolldown({ input: input.entry, logLevel: 'silent' });
    const result = await bundle.generate(variant.output);
    await bundle.close();
    return result;
  });
  metric('chunks', output.output.filter((item) => item.type === 'chunk').length, 'count');
  mark('output held');
  output = null;
  await gc();
  mark('after gc');
  await sleep(2000);
  mark('idle 2s');
}
