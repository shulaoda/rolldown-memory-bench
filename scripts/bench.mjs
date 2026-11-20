#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { runDev } from './dev.mjs';
import { KIND, prepareTools } from './memory.mjs';
import { setupProject, switchProject } from './projects.mjs';
import { summarize } from './report.mjs';
import { CHILD, runNode, tail } from './runner.mjs';
import { parseTarget, resolveTarget, sameFile } from './targets.mjs';
import { RESULTS, ROOT } from './util.mjs';

const HELP = `Usage (\`just bench\` is \`run\`):
  node scripts/bench.mjs list
  node scripts/bench.mjs run [<name>[:<variant>] ...] [--pr <number>] [--bin [label=]<spec>] ...
                             [--rounds N] [--env K=V]
  node scripts/bench.mjs setup [<name> ...]
  node scripts/bench.mjs report <results.json>

A name is a case or a project from \`list\`, or a group: cases (the default), projects, all.

--pr <number> is the pkg.pr.new preview of a PR. --local is the rolldown repo next to this one
(../rolldown), and --local=<path> another repo or worktree. With only one of --pr, --local or
--bin, the newest npm release is added as the baseline, so the tables show the change from it.

A debug binding stops the run, since its memory is far from a release one. Build the repo with
\`just build-rolldown-release\`, or pass --allow-debug.

A --bin spec is one of:
  1.3.3, latest           an npm version
  pr:11655                the preview of a PR's head commit (needs the "trigger: preview" label)
  main, commit:<sha>      the preview of the newest main commit, or of one commit
  ../rolldown             a rolldown repo or worktree (build it first)
  path/to/rolldown        a built rolldown package directory
  path/to/x.node          a binding file. The JS comes from the rolldown package the file is in,
                          or from --base <spec>.

Each round runs every --bin once in a fresh process, and the order flips every round.

Examples:
  just bench --pr 11655
  just bench lobehub --local
  just bench --local=../rolldown-wt-11655 --pr 11655
  just bench issue-11143-api-idle --bin pr=../rolldown-wt-11655
  just bench lobehub:build-sourcemap --bin a=./a.node --bin b=./b.node --base ../rolldown`;

// `--local` takes no value, `--local=<path>` names the repo. parseArgs has no optional values.
const localPaths = [];
const argv = process.argv.slice(2).flatMap((arg) => {
  if (arg === '--local') localPaths.push(path.join(ROOT, '..', 'rolldown'));
  else if (arg.startsWith('--local=')) localPaths.push(path.resolve(arg.slice('--local='.length)));
  else return [arg];
  return [];
});

const { values, positionals } = parseArgs({
  args: argv,
  allowPositionals: true,
  options: {
    bin: { type: 'string', short: 'b', multiple: true },
    pr: { type: 'string', multiple: true },
    'allow-debug': { type: 'boolean' },
    base: { type: 'string' },
    rounds: { type: 'string', short: 'r' },
    env: { type: 'string', multiple: true },
    help: { type: 'boolean', short: 'h' },
  },
});

async function loadDefinitions() {
  const load = async (dir, pick) => {
    const map = new Map();
    const files = fs.readdirSync(path.join(ROOT, dir)).filter((file) => file.endsWith('.mjs'));
    for (const file of files.sort()) {
      const full = path.join(ROOT, dir, file);
      map.set(file.slice(0, -4), { file: full, ...pick(await import(pathToFileURL(full).href)) });
    }
    return map;
  };
  return {
    cases: await load('cases', (mod) => ({ mod, meta: mod.meta, variants: mod.meta.variants })),
    projects: await load('projects', (mod) => ({ project: mod.default, meta: mod.default, variants: mod.default.cases })),
  };
}

function select(names, defs) {
  const groups = { cases: [...defs.cases.keys()], projects: [...defs.projects.keys()] };
  groups.all = [...groups.cases, ...groups.projects];
  const expanded = (names.length ? names : ['cases']).flatMap((name) => groups[name] ?? [name]);
  return expanded.map((name) => {
    const [id, sub] = name.split(':');
    const kind = defs.cases.has(id) ? 'case' : defs.projects.has(id) ? 'project' : null;
    if (!kind) throw new Error(`Unknown case "${id}". Run \`just list\`.`);
    const def = (kind === 'case' ? defs.cases : defs.projects).get(id);
    const selected = sub ? [sub] : Object.keys(def.variants);
    for (const v of selected) if (!def.variants[v]) throw new Error(`${id} has no variant "${v}"`);
    return { kind, id, ...def, selected };
  });
}

function machine() {
  return {
    platform: process.platform,
    arch: process.arch,
    release: os.release(),
    cpu: os.cpus()[0]?.model?.trim(),
    cores: os.availableParallelism(),
    memGB: Math.round(os.totalmem() / 2 ** 30),
    node: process.version,
    date: new Date().toISOString(),
  };
}

const parseEnv = (list = []) =>
  Object.fromEntries(list.map((kv) => [kv.slice(0, kv.indexOf('=')), kv.slice(kv.indexOf('=') + 1)]));
const safe = (s) => s.replace(/[^\w.-]+/g, '_');

async function resolveBins({ baseline }) {
  const specs = [
    ...(values.pr ?? []).map((n) => `pr-${n}=pr:${n}`),
    ...localPaths.map((dir, i) => `${i ? `local-${i + 1}` : 'local'}=${dir}`),
    ...(values.bin ?? []),
  ];
  if (specs.length === 0) throw new Error('Pass what to measure with --pr, --local or --bin. See --help.');
  const bins = [];
  for (const arg of specs) bins.push(await resolveTarget(parseTarget(arg), { base: values.base }));
  if (baseline && bins.length === 1) {
    const latest = await resolveTarget({ name: null, spec: 'latest' });
    if (latest.pkgDir !== bins[0].pkgDir) bins.unshift(latest);
  }
  if (new Set(bins.map((b) => b.name)).size !== bins.length) {
    throw new Error('Two --bin have the same label. Label them like --bin a=<spec>.');
  }
  for (const b of bins) {
    const where = b.git ? `${b.pkgDir} @ ${b.git}` : b.pkgDir;
    console.log(`bin ${b.name}: rolldown ${b.version} (${b.kind}) ${where}`);
    console.log(`  binding ${b.binding} (${b.bindingMB} MB, ${b.bindingTime})`);
    if (b.stale) console.log(`  WARNING: the binding is older than the last commit (${b.git}). Rebuild it?`);
    if (b.debug && !values['allow-debug']) {
      throw new Error(
        `${b.name}: the binding is ${b.bindingMB} MB, a debug build. Run \`just build-rolldown-release\` there, or pass --allow-debug.`,
      );
    }
    if (b.debug) console.log('  WARNING: this binding is a debug build');
  }
  return bins;
}

async function setup(job, bin) {
  if (job.kind === 'case') return (await job.mod.setup?.()) ?? null;
  await setupProject(job.id, job.project, bin);
  return null;
}

async function runOne(job, variant, bin, input, { log, probeDir, env }) {
  if (job.kind === 'case') {
    const jobEnv = { BENCH_JOB: JSON.stringify({ caseFile: job.file, variant, target: bin, input }) };
    const variantEnv = job.variants[variant].env;
    return runNode({ args: ['--expose-gc', CHILD], env: { ...variantEnv, ...env, ...jobEnv }, log, probeDir });
  }
  const projectCase = job.project.cases[variant];
  const cwd = switchProject(job.id, job.project, projectCase, bin);
  const caseEnv = { ...job.project.env, ...projectCase.env, ...env };
  if (projectCase.script) {
    return runDev({ dir: cwd, args: projectCase.args, env: caseEnv, log, script: projectCase.script });
  }
  return runNode({ args: projectCase.args, cwd, env: caseEnv, log, probeDir });
}

async function run(names) {
  const jobs = select(names, await loadDefinitions());
  const bins = await resolveBins({ baseline: true });
  prepareTools();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const runDir = path.join(RESULTS, `${stamp}-${process.platform}-${process.arch}`);
  fs.mkdirSync(path.join(runDir, 'logs'), { recursive: true });
  const record = { machine: machine(), args: process.argv.slice(2), targets: bins, runs: [] };
  const save = () => fs.writeFileSync(path.join(runDir, 'results.json'), `${JSON.stringify(record, null, 2)}\n`);
  const env = parseEnv(values.env);
  console.log(`memory metric: ${KIND.mem}, peak metric: ${KIND.peak}`);

  for (const job of jobs) {
    const input = await setup(job, bins[0]);
    const rounds = Number(values.rounds ?? job.meta.rounds ?? 3);
    for (const variant of job.selected) {
      for (let round = 0; round < rounds; round++) {
        for (const bin of round % 2 ? [...bins].reverse() : bins) {
          const name = `${job.id}:${variant}`;
          const log = path.join(runDir, 'logs', safe(`${name}-${bin.name}-${round + 1}.log`));
          const probeDir = path.join(runDir, 'probe');
          const result = await runOne(job, variant, bin, input, { log, probeDir, env });
          const report = result.report ?? {};
          const wrong = (report.bindings ?? []).filter((file) => !sameFile(file, bin.binding));
          if (wrong.length) throw new Error(`${name} with ${bin.name} loaded ${wrong.join(', ')}, not ${bin.binding}`);
          const { marks = [], metrics = {}, peak, maxRss, cpu, rustPeak, kind, bindings } = report;
          record.runs.push({
            case: job.id,
            variant,
            target: bin.name,
            round,
            ok: result.ok,
            code: result.code,
            wall: result.wall,
            kind,
            peak,
            maxRss,
            cpu,
            rustPeak,
            bindings,
            marks,
            metrics,
          });
          save();
          const last = marks.at(-1);
          const parts = [`peak ${peak ?? maxRss} MB`, `wall ${(result.wall / 1000).toFixed(2)}s`];
          if (last) parts.push(`${last.label} ${last.mem} MB`);
          const status = result.ok ? parts.join('  ') : `FAILED (code ${result.code}, signal ${result.signal}), log ${log}`;
          console.log(`[${round + 1}/${rounds}] ${name}  ${bin.name}  ${status}`);
          if (!result.ok) console.log(tail(log));
        }
      }
    }
  }
  console.log(summarize(record));
  console.log(`\nSaved ${path.join(runDir, 'results.json')}`);
}

async function list() {
  const { cases, projects } = await loadDefinitions();
  const issues = (meta) => (meta.issues ? ` [${meta.issues.map((n) => `#${n}`).join(', ')}]` : '');
  console.log('Cases, run with the rolldown API (group: cases):');
  for (const [id, { meta }] of cases) {
    console.log(`  ${id}${issues(meta)}  ${meta.title}`);
    console.log(`    variants: ${Object.keys(meta.variants).join(', ')}`);
  }
  console.log('\nProjects, run with vite (group: projects):');
  for (const [id, { project }] of projects) {
    console.log(`  ${id}${issues(project)}  ${project.title}`);
    const names = Object.entries(project.cases).map(([name, c]) => `${name}${c.script ? ' (dev)' : ''}`);
    console.log(`    cases: ${names.join(', ')}`);
  }
}

const [command, ...names] = positionals;
try {
  if (values.help || !command) console.log(HELP);
  else if (command === 'list') await list();
  else if (command === 'run') await run(names);
  else if (command === 'setup') {
    const jobs = select(names.length ? names : ['all'], await loadDefinitions());
    // Projects need some rolldown to install against. The bench re-points it before every run.
    const needsBin = jobs.some((job) => job.kind === 'project');
    const bin = needsBin ? await resolveTarget({ name: null, spec: 'latest' }) : undefined;
    prepareTools();
    for (const job of jobs) await setup(job, bin);
    console.log('Setup done.');
  } else if (command === 'report') {
    console.log(summarize(JSON.parse(fs.readFileSync(names[0], 'utf8'))));
  } else throw new Error(`Unknown command "${command}"\n\n${HELP}`);
} catch (error) {
  console.error(`error: ${error.message}`);
  process.exitCode = 1;
}
