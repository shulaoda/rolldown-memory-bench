// Runs one case in a fresh process: node --expose-gc --import=probe.mjs child.mjs
import { pathToFileURL } from 'node:url';
import { fullGc, mark, metric, useNativeStats } from './probe.mjs';
import { sleep } from './util.mjs';

const job = JSON.parse(process.env.BENCH_JOB);
const mod = await import(pathToFileURL(job.caseFile).href);
const rolldown = await import(pathToFileURL(job.target.entry).href);
const experimental = job.target.experimentalEntry ? await import(pathToFileURL(job.target.experimentalEntry).href) : {};
useNativeStats(experimental.getNativeMemoryStats);

async function time(name, fn) {
  const start = performance.now();
  const result = await fn();
  metric(name, performance.now() - start);
  return result;
}

await mod.run({
  rolldown,
  experimental,
  variant: mod.meta.variants[job.variant],
  input: job.input,
  mark,
  metric,
  time,
  gc: fullGc,
  sleep,
});
process.exit(0);
