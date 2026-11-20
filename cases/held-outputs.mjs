import { three10x } from '../scripts/inputs.mjs';

// The shape of the Rolldown Dashboard "peak memory" series: back-to-back builds in one process,
// and JS has not collected the earlier outputs when the next build runs.
export const meta = {
  title: 'three.js x10, 10 back-to-back builds that keep their outputs (dashboard shape)',
  rounds: 3,
  variants: {
    sourcemap: { builds: 10, output: { sourcemap: true } },
    plain: { builds: 10, output: {} },
  },
};

export const setup = () => three10x();

export async function run({ rolldown, experimental, variant, input, mark, time, gc, sleep }) {
  experimental.resetNativeMemoryStats?.();
  let outputs = [];
  await time('all builds', async () => {
    for (let i = 1; i <= variant.builds; i++) {
      const bundle = await rolldown.rolldown({ input: input.entry, logLevel: 'silent' });
      outputs.push(await bundle.generate(variant.output));
      await bundle.close();
    }
  });
  mark(`${variant.builds} outputs held`);
  outputs = null;
  await gc();
  mark('after gc');
  await sleep(2000);
  mark('idle 2s');
}
