import { synthetic } from '../scripts/inputs.mjs';

// #10985: `rolldown()` + `generate()` + `close()` in a loop, a fresh bundle each time.
// #10984: one bundle, `generate()` called again and again.
// Both use the reporter's synthetic input: 200 modules, iife, whitespace-only minify.
export const meta = {
  title: 'Memory across 150 builds in a tight loop, then idle',
  issues: [10985, 10984],
  rounds: 3,
  variants: {
    close: { builds: 150, fresh: true },
    generate: { builds: 150, fresh: false },
  },
};

const output = {
  format: 'iife',
  name: 'Repro',
  minify: { compress: false, mangle: false, codegen: { removeWhitespace: true } },
};

export const setup = () => synthetic(200);

export async function run({ rolldown, variant, input, mark, time, gc, sleep }) {
  const options = { input: input.entry, logLevel: 'silent' };
  await time('all builds', async () => {
    let bundle = variant.fresh ? null : await rolldown.rolldown(options);
    for (let i = 1; i <= variant.builds; i++) {
      if (variant.fresh) bundle = await rolldown.rolldown(options);
      await bundle.generate(output);
      if (variant.fresh) await bundle.close();
      if (i % 25 === 0) {
        await gc();
        mark(`build ${i}`, { cheap: true });
      }
    }
    if (!variant.fresh) await bundle.close();
  });
  await gc();
  await sleep(5000);
  mark('idle 5s');
}
