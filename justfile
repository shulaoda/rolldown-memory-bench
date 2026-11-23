set windows-shell := ["powershell.exe", "-NoLogo", "-NoProfile", "-Command"]

_default:
    @just --list

# Fetch the project submodules, install the bench's tools, and prepare every input and project.
setup:
    git submodule update --init --jobs 4
    npm install --no-audit --no-fund
    npx playwright install --only-shell chromium
    node scripts/bench.mjs setup all

# Move every project to the newest commit of its branch, then set the changed ones up again.
update:
    git submodule update --init --remote --force --jobs 4
    node scripts/bench.mjs setup all

# Run cases: just bench [names...] [--pr <number>] [--local[=<path>]] [--bin <spec>]. Without names it runs every API case. Writes BENCHMARKS.md, or the file of --out <file>.
bench *args:
    node scripts/bench.mjs run {{ args }}

# Check that this machine reads memory right: allocate 512 MiB in a child, then free it.
selftest:
    node scripts/bench.mjs selftest

# List the cases and projects.
list:
    node scripts/bench.mjs list

# Print the tables of saved runs again and write BENCHMARKS.md, or the file of --out <file>, from them: just report <results.json>... [--out BENCHMARKS-LINUX.md]. Several runs of the same --bin list are merged.
report +files:
    node scripts/bench.mjs report {{ files }}
