import { three10x } from '../scripts/inputs.mjs';
import { median } from '../scripts/util.mjs';

// Builds again and again with a pause between them, like watch mode or a build service. Each
// output is dropped and never collected by hand. A pause longer than the time the allocator waits
// before it returns memory makes the next build take the memory back from the OS.
export const meta = {
  title: 'three.js x10 with sourcemap, 10 builds with a pause between them',
  rounds: 5,
  variants: {
    'gap-0': { builds: 10, gap: 0 },
    'gap-300ms': { builds: 10, gap: 300 },
    'gap-1s': { builds: 10, gap: 1000 },
    'gap-3s': { builds: 10, gap: 3000 },
  },
};

export const setup = () => three10x();

const MARKS = new Set([2, 5, 10]);

export async function run({ rolldown, variant, input, mark, metric, sleep }) {
  const times = [];
  for (let i = 1; i <= variant.builds; i++) {
    if (i > 1 && variant.gap) await sleep(variant.gap);
    if (MARKS.has(i)) mark(`before build ${i}`, { cheap: true });
    const start = performance.now();
    const bundle = await rolldown.rolldown({ input: input.entry, logLevel: 'silent' });
    await bundle.generate({ sourcemap: true });
    await bundle.close();
    times.push(performance.now() - start);
  }
  metric('later builds (median)', median(times.slice(1)));
  metric('first build', times[0]);
  metric('later builds (max)', Math.max(...times.slice(1)));
}
