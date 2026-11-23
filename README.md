# rolldown-memory-bench

Memory benchmarks for rolldown. Each case reproduces a memory issue or builds a real project,
and compares two or more rolldown builds on the same machine. It runs on macOS, Linux and
Windows, with Node scripts only.

## Requirements

- Node 22 or newer, git, npm, pnpm, [just](https://github.com/casey/just)
- macOS: the Xcode command line tools (`cc` builds a small helper that reads the footprint)
- Linux: the system libraries Chromium needs, for the dev cases (`npx playwright install-deps`)

## Quick start

```sh
just setup                                   # submodules, Playwright, inputs, project installs
just selftest                                # check that this machine reads memory right
just list
just bench --pr 11655                        # the PR's preview against the newest release
just bench lobehub --pr 11655                # every lobehub case
just bench --local                           # ../rolldown against the newest release
just bench --local=../rolldown-wt-11655 --pr 11655
just bench issue-11143-api-idle --bin ../rolldown-wt-11655
just bench lobehub:build-sourcemap --bin a=./a.node --bin b=./b.node --base ../rolldown
just report results/<run>/results.json       # print a saved run again, and write BENCHMARKS.md from it
just report results/<linux run>/results.json --out BENCHMARKS-LINUX.md
just update                                  # move every project to its newest commit
```

`just setup` can be run again at any time. It only redoes what changed. Results go to
`results/<date>-<platform>-<arch>/`, with `results.json` and one log per run.

Every `just bench` also writes [BENCHMARKS.md](BENCHMARKS.md): the machine, the bins, a summary
with one row per case, and the full tables. `just report` writes it again from saved runs. Give it
several `results.json` of the same `--bin` list on the same machine, and it merges them, so a case
run again later replaces its old numbers. `--out <file>` writes another file instead, for example
`BENCHMARKS-LINUX.md` for the runs of a Linux machine, so they do not replace the macOS tables.

## What to measure: `--pr`, `--local` and `--bin`

The usual comparison is the newest npm release against a PR. With only one of `--pr`, `--local`
or `--bin`, the bench adds the newest release (`latest`) as the first one, so the tables show the
change from it.

`--pr <number>` uses the pkg.pr.new preview of the PR's head commit, so no machine needs to build
rolldown. A PR gets a preview only after it has the `trigger: preview` label and the
"Publish to pkg.pr.new" run finished. Every main commit gets one.

`--local` uses the rolldown repo next to this one (`../rolldown`), and `--local=<path>` another
repo or worktree. Build it with `just build-rolldown-release` first. The bench warns when the
binding is older than the last commit, and stops on a debug binding, since its memory is far
from a release one (about twice the peak on three10x). `--allow-debug` runs it anyway.

`--bin [label=]<spec>`, repeated. A spec is one of:

- an npm version: `1.3.3`, `latest`
- a pkg.pr.new preview: `pr:11655`, `main` (the newest main commit with a preview),
  `commit:<sha>`, or a `https://pkg.pr.new/rolldown@<sha>` URL
- a rolldown repo or worktree: `../rolldown`, which uses its `packages/rolldown`. Build it with
  `just build-rolldown-release` first.
- a built `rolldown` package directory
- a `.node` binding file. The JS comes from the rolldown package the file is in, or from
  `--base <spec>`. The bench makes a copy of that package's `dist` with this binding in it.

The bench prints the binding of each one. After every run it checks that the process loaded
that binding and no other one.

## Names

`just bench` takes case names, `case:variant`, `project:case`, or a group: `cases` (every API
case, the default), `projects`, `all`.

## How a run works

Every run is a fresh process. Before the rounds of a case, one run of the first `--bin` warms
the file cache, and its numbers are dropped (`--no-warmup` skips it). Then each round runs every
`--bin` once, and the order flips every round (A B, then B A). The tables show the median and the
range over the rounds, and the change from the first `--bin`.

`--rounds N` overrides the default of a case. `--env K=V` sets an environment variable for every
run, for example `--env MIMALLOC_ALLOW_THP=0`.

Each run also records the 1-minute load average. The bench warns when it is above a quarter of
the cores, and the tables show its range for every case.

## Metrics

Numbers are only comparable on the same machine. Do not compare platforms.

| Platform | Memory now | Peak |
| --- | --- | --- |
| macOS | `phys_footprint` (Activity Monitor "Memory") | lifetime max `phys_footprint` |
| Linux | `RssAnon` from `/proc/<pid>/status` | `VmHWM` |
| Windows | private bytes (commit) | peak commit (`PeakPagedMemorySize64`) |

On Windows, reading the commit takes PowerShell about half a second. Marks inside a loop record
the working set instead, and the table labels them `rss`. The Windows code is not tested yet.

With a binding built with the `tracking_allocator` feature, the tables also show the Rust heap.

On Linux the peak (`VmHWM`) also counts file pages, such as the node binary and the binding, so
it is about 45 MB above `RssAnon` at the same moment. Compare peaks with peaks, and marks with
marks.

A dev case reads the server process only, not the browser. A project build reports the process
wall time, which includes Node startup and loading the vite config.

## How reliable the numbers are

Checked on an M4 Pro and on an arm64 Linux VM on 2026-11-23.

- The reader. `just selftest` allocates 512 MiB in a child, frees it, and checks what the reader
  saw. It passes on macOS and Linux. On macOS the helper reads the same as `vmmap` and
  `footprint`. Run it once on every new machine, Windows above all.
- Garbage collection. The `gc()` of the API cases collects every output object (checked with
  `WeakRef`), so the idle marks are not held up by JS. Buffers that JS frees go back to the OS a
  few seconds after the GC.
- The first run of a case read its files from disk and took up to 50% longer. The warm-up run
  removes that.
- Noise, from runs that measure the same bin twice under two labels:
  - Peaks and marks: the medians were within 3% for most cases, and within 10% for the memory
    that rolldown 1.3 keeps in `issue-11233-optimizer-threads` and `issue-10985-tight-loop`,
    which depends on which threads did the work. After the idle cleanup of #11655 the two were
    within 2 MB.
  - Time: within 3% on a quiet machine. When the load average rose from 2 to 4 to 20, single
    runs took twice as long, and memory moved by up to 25%.
  - Running first or second in a round made no difference beyond 3%.

Reading a change: it is the change of the medians. A change marked noise is not a clear
difference, because the ranges overlap or a side has fewer than 3 rounds. A change without the
mark can still be chance: one time in ten with 3 rounds, one in 126 with 5. Trust a change that
is not marked noise and is larger than the noise above. Run a case again with more rounds when it
matters, like the lobehub peak with sourcemaps, which moves by about 1 GB from run to run
(`--rounds 9`).

## Cases (rolldown API)

| Case | Issues | What it shows |
| --- | --- | --- |
| `three10x` | | One build of three.js x10. Peak, then memory with the output held, after GC, and idle |
| `many-chunks` | | three10x with one dynamic import per file, about 3,700 chunks |
| `held-outputs` | | 10 back-to-back builds that keep their outputs, the Rolldown Dashboard shape |
| `rebuild-gaps` | | 10 builds with a pause of 0, 300 ms, 1 s or 3 s between them, like watch mode. Time of each build and memory between builds |
| `issue-10985-tight-loop` | #10985, #10984 | 150 builds in a tight loop (`close`: a fresh bundle each time, `generate`: one bundle) |
| `issue-11143-api-idle` | #11143 | In-memory files with maps and `sourcemap: true`, then outputs dropped and idle |
| `issue-11233-optimizer-threads` | #11233 | One optimizer-like pass (typescript, codemirror, vue) with default vs 4 threads |

## Projects (vite)

| Project | Issues | Cases |
| --- | --- | --- |
| `lobehub` | #9330 | `build`, `build-sourcemap`, `dev` (Chrome on the page 25 s, then 270 s idle), `dev-warm` (the same steps with the deps cache of the run before, so rolldown bundles nothing) |
| `rolldown-9330-repro` | #9330 | `dev`, the reporter's small repro with `@lobehub/ui` (Chrome on the page 25 s, then 90 s idle) |
| `issue-11189` | #11189 | `bundled`, `unbundled`, `bundled-gc`, `bundled-tailwind-leaf`: 20 edits with requests |
| `vue-vben-admin` | | `build` of `apps/web-antd` |
| `vinext` | | `build` of its 33-route benchmark app, `playground-build` |

The projects are git submodules, except `issue-11189`, whose files are in this repo. A submodule
is pinned to a commit, and `just update` moves all of them to the newest commit of their branch.
Every project runs on the newest vite: `overrides` in `projects/<id>.mjs` set it to `latest`,
which setup turns into the newest npm version. A new vite release or a new project commit makes
setup install that project again.

After install, every `rolldown` package in the project's pnpm store is replaced by a link to
`.cache/<platform>/slots/<id>`, and each run points that link at its `--bin`. So one install
serves every `--bin`. The originals are kept, and setup puts them back before it installs again.

Dev cases start the server with `--force` and an empty optimizer cache, except `lobehub:dev-warm`,
wait until it answers, then follow the case script. The bench asks the server for its memory over
IPC, so the numbers come from the same reader as the other cases.

The #9330 dev cases follow the measure script of #9349: Chrome on the page for 25 s, close it,
then read the memory every 90 s until it stops dropping. That takes 90 s for the small repro and
270 s for lobehub, whose JS heap is collected only 90 to 180 s after the page closes.

## Adding a case

A file in `cases/` exports `meta` (title, issues, rounds, variants), an optional `setup()` that
runs once in the parent and returns the input, and `run(ctx)`, which runs in the child.
`ctx` has `rolldown`, `experimental`, `variant`, `input`, `mark(label)`, `metric(name, value)`,
`time(name, fn)`, `gc()` and `sleep(ms)`. Keep anything you want to free inside `run`, since a
variable at module top level keeps its value alive.

A file in `projects/` describes a project: `overrides` for pnpm (`latest` means the newest npm
version), optional `install` and `prepare` steps, and `cases`. A case has `args` for node, and optional `cwd`, `env` and `clean`.
A dev case also has a `script`, which gets `mark(label, { gc })`, `open(path, { wait })` (headless
Chromium), `crawl(path)` (request every import, like the #11189 repro), `edit(file, text)`
(undone after the run) and `sleep(ms)`. The tables show how many requests the page made and how
many failed, and how many URLs a crawl found, so a run whose page did not load stands out.

To add a submodule: `git submodule add --depth 1 <url> projects/<id>`, then set `shallow = true`,
`ignore = dirty` and `branch` for it in `.gitmodules`.

## Layout

- `justfile`: the commands
- `scripts/`: the bench itself. `bench.mjs` is the CLI, `probe.mjs` is loaded into every measured
  process, `dev.mjs` drives dev servers, `projects.mjs` installs and links the projects,
  `selftest.mjs` is the child of `just selftest`.
- `cases/`: the API cases
- `projects/`: one `<id>.mjs` per project, and the project itself in `projects/<id>/`
- `.cache/`: inputs, npm installs and tools, made by setup. `results/`: the runs.
- `BENCHMARKS.md`: the tables of the last run

## Notes

- Close other heavy apps while measuring, and look at the load in the tables. A busy machine
  moves the peak by hundreds of MB.
- Use one checkout per machine. Project `node_modules` are installed in place.
- Linux with transparent huge pages can grow idle memory again after it was returned
  (khugepaged). `--env MIMALLOC_ALLOW_THP=0` turns it off for a run.
- Linux distributions that Playwright does not know yet need
  `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE`, for example `ubuntu24.04-arm64`.
