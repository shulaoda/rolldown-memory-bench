#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { runDev } from './dev.mjs';
import { KIND, prepareTools } from './memory.mjs';
import { setupProject, switchProject } from './projects.mjs';
import { markdown, mergeRecords, summarize } from './report.mjs';
import { CHILD, runNode, tail } from './runner.mjs';
import { parseTarget, resolveTarget, sameFile } from './targets.mjs';
import { RESULTS, ROOT, exec } from './util.mjs';

const HELP = `Usage (\`just bench\` is \`run\`):
  node scripts/bench.mjs list
  node scripts/bench.mjs run [<name>[:<variant>] ...] [--pr <number>] [--bin [label=]<spec>] ...
                             [--rounds N] [--env K=V] [--no-warmup] [--out <file>]
  node scripts/bench.mjs setup [<name> ...]
  node scripts/bench.mjs report <results.json> ... [--out <file>]
  node scripts/bench.mjs selftest

A name is a case or a project from \`list\`, or a group: cases (the default), projects, all, quick.
quick is the cases a PR description reports, with 3 rounds each. \`case:a,b\` runs two variants.

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

Each round runs every --bin once in a fresh process, and the order flips every round. Before the
rounds of a case, one run of the first --bin warms the file cache, and its numbers are dropped.
A run writes its tables to BENCHMARKS.md, or to the file of --out, such as BENCHMARKS-LINUX.md.
\`report\` writes it again from saved runs, and merges several runs of the same --bin list.

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
    'no-warmup': { type: 'boolean' },
    out: { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
});

// The markdown file a run or `report` writes, relative to the bench root.
const outFile = () => path.resolve(ROOT, values.out ?? 'BENCHMARKS.md');

function parseRounds(text) {
  if (text === undefined) return undefined;
  const rounds = Number(text);
  if (!Number.isInteger(rounds) || rounds < 1) throw new Error(`--rounds takes a whole number of 1 or more, not "${text}"`);
  return rounds;
}

function parseEnv(list = []) {
  const pairs = list.map((kv) => {
    const eq = kv.indexOf('=');
    if (eq < 1) throw new Error(`--env takes K=V, not "${kv}"`);
    return [kv.slice(0, eq), kv.slice(eq + 1)];
  });
  return Object.fromEntries(pairs);
}

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

function caseInfo(defs) {
  const info = new Map();
  for (const [id, { meta }] of [...defs.cases, ...defs.projects]) info.set(id, { title: meta.title, issues: meta.issues });
  return info;
}

// The cases a PR description reports, for a shorter run. A list of variants runs after one warm-up.
const QUICK = [
  'held-outputs:sourcemap',
  'issue-10985-tight-loop:close',
  'issue-11143-api-idle:6-builds',
  'issue-11233-optimizer-threads:default-threads',
  'many-chunks:sourcemap',
  'rebuild-gaps',
  'three10x:sourcemap',
  'issue-11189:bundled',
  'lobehub:build,build-sourcemap,dev',
  'rolldown-9330-repro:dev',
  'vinext:build',
  'vue-vben-admin:build',
];

function select(names, defs) {
  const groups = { cases: [...defs.cases.keys()], projects: [...defs.projects.keys()], quick: QUICK };
  groups.all = [...groups.cases, ...groups.projects];
  const expanded = (names.length ? names : ['cases']).flatMap((name) => groups[name] ?? [name]);
  return expanded.map((name) => {
    const [id, sub] = name.split(':');
    const kind = defs.cases.has(id) ? 'case' : defs.projects.has(id) ? 'project' : null;
    if (!kind) throw new Error(`Unknown case "${id}". Run \`just list\`.`);
    const def = (kind === 'case' ? defs.cases : defs.projects).get(id);
    const selected = sub ? sub.split(',') : Object.keys(def.variants);
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
    thp: thpSetting(),
    date: new Date().toISOString(),
  };
}

// By default mimalloc returns memory only in whole 2 MiB ranges when this is not `never`.
function thpSetting() {
  if (process.platform !== 'linux') return undefined;
  try {
    return fs.readFileSync('/sys/kernel/mm/transparent_hugepage/enabled', 'utf8').match(/\[(\w+)\]/)?.[1];
  } catch {
    return undefined;
  }
}

const safe = (s) => s.replace(/[^\w.-]+/g, '_');

// The bins to compare. With only one, the newest npm release comes first as the baseline.
async function resolveBins() {
  const specs = [
    ...(values.pr ?? []).map((n) => `pr:${n}`),
    ...localPaths.map((dir, i) => `${i ? `local-${i + 1}` : 'local'}=${dir}`),
    ...(values.bin ?? []),
  ];
  if (specs.length === 0) throw new Error('Pass what to measure with --pr, --local or --bin. See --help.');
  const bins = [];
  for (const arg of specs) bins.push(await resolveTarget(parseTarget(arg), { base: values.base }));
  if (bins.length === 1) {
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
  const published = bins.filter((b) => b.kind === 'npm' || b.kind === 'preview').length;
  if (published > 0 && published < bins.length) {
    console.log(
      'WARNING: published and local builds are mixed, so the change also includes how they were built. To measure a PR, build both sides locally.',
    );
  }
  compareCommits(bins);
  return bins;
}

const commits = (n) => `${n} commit${n === 1 ? '' : 's'}`;

// A later repo bin must contain the commit of the first bin. Otherwise its change also includes the
// commits it lacks.
function compareCommits([first, ...rest]) {
  const base = first.git?.replace('+dirty', '');
  if (!base) return;
  for (const bin of rest) {
    if (bin.kind !== 'repo' || !bin.git) continue;
    let counts;
    try {
      counts = exec('git', ['-C', bin.repo, 'rev-list', '--left-right', '--count', `${base}...${bin.git.replace('+dirty', '')}`]);
    } catch {
      continue;
    }
    const [lacks, has] = counts.split(/\s+/).map(Number);
    console.log(`${bin.name} has ${commits(has)} that ${first.name} does not have`);
    if (lacks > 0) {
      console.log(
        `  WARNING: ${bin.name} lacks ${commits(lacks)} of ${first.name}, so the change also includes ${lacks === 1 ? 'that commit' : 'those commits'}. Merge the commit of ${first.name} into ${bin.name}, or build ${first.name} from the merge base of the two.`,
      );
    }
  }
}

// Prepares the input of a case, or installs a project against `bin`.
async function setup(job, bin) {
  if (job.kind === 'case') return (await job.mod.setup?.()) ?? null;
  await setupProject(job.id, job.project, bin);
  return null;
}

async function setupAll(names) {
  const jobs = select(names.length ? names : ['all'], await loadDefinitions());
  // Projects need some rolldown to install against. The bench re-points it before every run.
  const needsBin = jobs.some((job) => job.kind === 'project');
  const bin = needsBin ? await resolveTarget({ name: null, spec: 'latest' }) : undefined;
  prepareTools();
  for (const job of jobs) await setup(job, bin);
  console.log('Setup done.');
}

// One measured run in a fresh process. `env` is the `--env` of the command line.
async function runOne(job, variant, bin, input, { log, env }) {
  if (job.kind === 'case') {
    const jobEnv = { BENCH_JOB: JSON.stringify({ caseFile: job.file, variant, target: bin, input }) };
    const variantEnv = job.variants[variant].env;
    return runNode({ args: ['--expose-gc', CHILD], env: { ...variantEnv, ...env, ...jobEnv }, log });
  }
  const projectCase = job.project.cases[variant];
  const cwd = switchProject(job.id, projectCase, bin);
  const caseEnv = { ...projectCase.env, ...env };
  if (projectCase.script) {
    return runDev({ dir: cwd, args: projectCase.args, env: caseEnv, log, script: projectCase.script });
  }
  return runNode({ args: projectCase.args, cwd, env: caseEnv, log });
}

// A run must load the binding of its bin and no other one, or the numbers belong to another build.
function checkBinding(name, bin, result) {
  const loaded = result.report?.bindings ?? [];
  const wrong = loaded.filter((file) => !sameFile(file, bin.binding));
  if (wrong.length || (result.ok && loaded.length === 0)) {
    throw new Error(`${name} with ${bin.name} loaded ${loaded.join(', ') || 'no rolldown binding'}, not ${bin.binding}`);
  }
}

async function run(names) {
  const roundsOption = parseRounds(values.rounds);
  const env = parseEnv(values.env);
  const defs = await loadDefinitions();
  const jobs = select(names, defs);
  const bins = await resolveBins();
  prepareTools();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const runDir = path.join(RESULTS, `${stamp}-${process.platform}-${process.arch}`);
  fs.mkdirSync(path.join(runDir, 'logs'), { recursive: true });
  const record = { machine: machine(), args: process.argv.slice(2), targets: bins, runs: [] };
  const save = () => fs.writeFileSync(path.join(runDir, 'results.json'), `${JSON.stringify(record, null, 2)}\n`);
  console.log(`memory metric: ${KIND.mem}, peak metric: ${KIND.peak}`);

  for (const job of jobs) {
    const input = await setup(job, bins[0]);
    const rounds = roundsOption ?? (names.includes('quick') ? 3 : (job.meta.rounds ?? 3));
    // The first run of a case reads its files from disk, and it was up to 50% slower.
    if (!values['no-warmup']) {
      const variant = job.selected[0];
      const log = path.join(runDir, 'logs', safe(`${job.id}:${variant}-warmup.log`));
      const result = await runOne(job, variant, bins[0], input, { log, env });
      console.log(`[warmup] ${job.id}:${variant}  ${bins[0].name}  ${result.ok ? 'done, numbers dropped' : `FAILED, log ${log}`}`);
    }
    for (const variant of job.selected) {
      const name = `${job.id}:${variant}`;
      for (let round = 0; round < rounds; round++) {
        for (const bin of round % 2 ? [...bins].reverse() : bins) {
          const log = path.join(runDir, 'logs', safe(`${name}-${bin.name}-${round + 1}.log`));
          // Other work on the machine moves the numbers, so the record keeps how busy it was.
          const load = Math.round(os.loadavg()[0] * 10) / 10;
          if (load > os.availableParallelism() / 4) {
            console.log(`  WARNING: the machine is busy (load ${load} on ${os.availableParallelism()} cores), so numbers move more`);
          }
          const result = await runOne(job, variant, bin, input, { log, env });
          checkBinding(name, bin, result);
          const { marks = [], metrics = {}, peak, maxRss, cpu, peakCommit, rustPeak, kind, bindings } = result.report ?? {};
          record.runs.push({
            case: job.id,
            variant,
            target: bin.name,
            round,
            load,
            ok: result.ok,
            code: result.code,
            wall: result.wall,
            kind,
            peak,
            maxRss,
            cpu,
            peakCommit,
            rustPeak,
            bindings,
            marks,
            metrics,
          });
          save();
          const last = marks.at(-1);
          const parts = [`peak ${peak ?? maxRss} MB`, `wall ${(result.wall / 1000).toFixed(2)}s`, `load ${load}`];
          if (last) parts.push(`${last.label} ${last.mem} MB`);
          const status = result.ok ? parts.join('  ') : `FAILED (code ${result.code}, signal ${result.signal}), log ${log}`;
          console.log(`[${round + 1}/${rounds}] ${name}  ${bin.name}  ${status}`);
          if (!result.ok) console.log(tail(log));
        }
      }
    }
  }
  console.log(summarize(record));
  fs.writeFileSync(outFile(), markdown(record, caseInfo(defs)));
  console.log(`\nSaved ${path.join(runDir, 'results.json')} and ${outFile()}`);
}

// Checks the memory reader of this machine: a child allocates 512 MiB and frees it.
async function selftest() {
  prepareTools();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bench-selftest-'));
  const log = path.join(dir, 'selftest.log');
  const child = path.join(ROOT, 'scripts', 'selftest.mjs');
  const result = await runNode({ args: ['--expose-gc', child], env: {}, log });
  if (!result.ok) throw new Error(`The selftest process failed:\n${tail(log)}`);
  const { marks, peak } = result.report;
  const [start, allocated, freed] = marks.map((mark) => mark.mem);
  const checks = [
    ['memory grows by 512 MiB', allocated - start, (mb) => Math.abs(mb - 512) <= 26],
    ['the peak includes it', peak - allocated, (mb) => mb >= -1],
    ['freed memory goes back', freed - start, (mb) => mb < 64],
  ];
  console.log(`memory metric: ${KIND.mem}, peak metric: ${KIND.peak}`);
  console.log(`start ${start} MB, after allocating ${allocated} MB, peak ${peak} MB, after freeing ${freed} MB`);
  for (const [name, mb, pass] of checks) {
    console.log(`${pass(mb) ? 'pass' : 'FAIL'}  ${name} (${mb > 0 ? '+' : ''}${Math.round(mb * 10) / 10} MB)`);
    if (!pass(mb)) process.exitCode = 1;
  }
  fs.rmSync(dir, { recursive: true, force: true });
}

// Prints saved runs again and writes the markdown file from them. Several runs of the same bins
// are merged, and a case in a later run replaces the same case in an earlier one.
async function report(files) {
  if (files.length === 0) throw new Error('Pass one or more results.json files.');
  const records = files.map((file) => JSON.parse(fs.readFileSync(file, 'utf8')));
  const record = records.length > 1 ? mergeRecords(records) : records[0];
  console.log(summarize(record));
  fs.writeFileSync(outFile(), markdown(record, caseInfo(await loadDefinitions())));
  console.log(`\nWrote ${outFile()}`);
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
  else if (command === 'selftest') await selftest();
  else if (command === 'setup') await setupAll(names);
  else if (command === 'report') await report(names);
  else throw new Error(`Unknown command "${command}"\n\n${HELP}`);
} catch (error) {
  console.error(`error: ${error.message}`);
  process.exitCode = 1;
}
