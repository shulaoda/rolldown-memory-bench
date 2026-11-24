import { median } from './util.mjs';

function format(value, unit) {
  if (unit === 'count') return String(Math.round(value));
  if (unit === 'ms') return value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${Math.round(value)}ms`;
  return value >= 100 ? String(Math.round(value)) : value.toFixed(1);
}

function rowsFor(runs) {
  const kind = runs[0].kind ?? {};
  const rows = [{ id: 'peak', label: `peak ${kind.peak ?? 'memory'} (MB)`, unit: 'MB', get: (r) => r.peak ?? r.maxRss }];
  // A case that times its own builds also sleeps, so the process wall time says little there.
  const timed = runs.some((r) => Object.values(r.metrics ?? {}).some((m) => m.unit === 'ms'));
  if (!timed) rows.push({ id: 'wall', label: 'process wall time', unit: 'ms', get: (r) => r.wall });
  rows.push({ id: 'cpu', label: 'process cpu time', unit: 'ms', get: (r) => r.cpu });
  const seen = new Set();
  for (const run of runs) {
    for (const [name, { unit }] of Object.entries(run.metrics ?? {})) {
      if (seen.has(`m:${name}`)) continue;
      seen.add(`m:${name}`);
      rows.push({ id: 'metric', name, label: name, unit, get: (r) => r.metrics?.[name]?.value });
    }
  }
  for (const run of runs) {
    for (const mark of run.marks ?? []) {
      if (seen.has(`k:${mark.label}`)) continue;
      seen.add(`k:${mark.label}`);
      const memKind = mark.memKind ?? kind.mem ?? 'mem';
      const get = (r) => r.marks?.find((m) => m.label === mark.label)?.mem;
      rows.push({ id: 'mark', name: mark.label, label: `${memKind} @ ${mark.label} (MB)`, unit: 'MB', get });
    }
  }
  if (runs.some((r) => r.rustPeak != null)) {
    rows.push({ id: 'rust', label: 'rust heap peak (MB)', unit: 'MB', get: (r) => r.rustPeak });
  }
  for (const run of runs) {
    for (const mark of run.marks ?? []) {
      if (mark.rustLive == null || seen.has(`r:${mark.label}`)) continue;
      seen.add(`r:${mark.label}`);
      const get = (r) => r.marks?.find((m) => m.label === mark.label)?.rustLive;
      rows.push({ id: 'rust', label: `rust heap @ ${mark.label} (MB)`, unit: 'MB', get });
    }
  }
  return rows;
}

const percent = (pct) => `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;

// The change of `other` from `base`. Memory also shows the change in MB, since a small number can
// change by a large percentage. A change is marked as noise when the ranges of the rounds overlap,
// or when a side has fewer than 3 rounds: then it is not clear that the two differ. Two sides of 2
// rounds each fall apart by chance one time in three, of 3 rounds one in ten, of 5 one in 126.
function change(base, other, unit) {
  if (!base || !other || !base.median) return '-';
  const notes = [];
  if (unit === 'MB') {
    const diff = other.median - base.median;
    notes.push(`${diff > 0 ? '+' : diff < 0 ? '-' : ''}${format(Math.abs(diff), unit)} MB`);
  }
  if (base.n < 3 || other.n < 3 || (other.min <= base.max && base.min <= other.max)) notes.push('noise');
  const pct = percent(((other.median - base.median) / base.median) * 100);
  return notes.length ? `${pct} (${notes.join(', ')})` : pct;
}

// One group per case and variant. Each row has the median (min-max) of every target, and the
// change of every later target from the first one.
function groups(record) {
  const names = record.targets.map((t) => t.name);
  const byKey = new Map();
  for (const run of record.runs) {
    const key = run.variant ? `${run.case}:${run.variant}` : run.case;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(run);
  }
  return [...byKey].map(([key, runs]) => {
    const ok = runs.filter((r) => r.ok);
    const group = {
      key,
      case: runs[0].case,
      rounds: Math.max(...runs.map((r) => r.round + 1)),
      failed: runs.length - ok.length,
      loads: runs.map((r) => r.load).filter((load) => typeof load === 'number'),
      rows: [],
    };
    if (ok.length === 0) return group;
    for (const row of rowsFor(ok)) {
      const stats = names.map((name) => {
        const values = ok.filter((r) => r.target === name).map(row.get).filter((v) => typeof v === 'number');
        if (values.length === 0) return null;
        return { median: median(values), min: Math.min(...values), max: Math.max(...values), n: values.length };
      });
      const cells = stats.map((s) => {
        if (!s) return '-';
        const m = format(s.median, row.unit);
        return s.n > 1 ? `${m} (${format(s.min, row.unit)}-${format(s.max, row.unit)})` : m;
      });
      const deltas = stats.slice(1).map((s) => change(stats[0], s, row.unit));
      group.rows.push({ ...row, cells, deltas });
    }
    return group;
  });
}

function textTable(lines) {
  const widths = lines[0].map((_, i) => Math.max(...lines.map((line) => line[i].length)));
  return lines.map((line) => line.map((cell, i) => cell.padEnd(widths[i])).join('   ').trimEnd()).join('\n');
}

function header(record) {
  const names = record.targets.map((t) => t.name);
  return ['', ...names, ...names.slice(1).map((name) => `${name} vs ${names[0]}`)];
}

function roundsText(group) {
  const loads = group.loads.filter((load) => load > 0);
  const load = loads.length ? `, load ${Math.min(...loads)} to ${Math.max(...loads)}` : '';
  return `${group.rounds} round${group.rounds === 1 ? '' : 's'}${group.failed ? `, ${group.failed} failed` : ''}${load}`;
}

export function summarize(record) {
  const out = [];
  for (const group of groups(record)) {
    out.push(`\n${group.key}  (${roundsText(group)})`);
    if (group.rows.length === 0) continue;
    out.push(textTable([header(record), ...group.rows.map((row) => [row.label, ...row.cells, ...row.deltas])]));
  }
  return out.join('\n');
}

// Several saved runs of the same targets on the same machine, as one record. A case in a later
// run replaces the same case in an earlier one.
export function mergeRecords(records) {
  const same = (a, b) => ['name', 'spec', 'git', 'bindingTime'].every((key) => a[key] === b[key]);
  const machineKey = (m) => [m.platform, m.arch, m.cpu, m.memGB].join(' ');
  const [first] = records;
  for (const record of records.slice(1)) {
    if (machineKey(record.machine) !== machineKey(first.machine)) {
      throw new Error('These runs are from different machines. Numbers from different machines do not compare.');
    }
    if (record.targets.length !== first.targets.length || !record.targets.every((t, i) => same(t, first.targets[i]))) {
      throw new Error('These runs measured different bins. Merge only runs of the same --bin list.');
    }
  }
  const runs = new Map();
  for (const record of records) {
    const keys = new Set(record.runs.map((r) => `${r.case}:${r.variant}`));
    for (const key of keys) runs.set(key, record.runs.filter((r) => `${r.case}:${r.variant}` === key));
  }
  return {
    machine: records.at(-1).machine,
    targets: records.at(-1).targets,
    sources: records.flatMap((r) => r.sources ?? [{ date: r.machine.date, args: r.args }]),
    runs: [...runs.values()].flat(),
  };
}

const issueLinks = (issues = []) =>
  issues.map((n) => `[#${n}](https://github.com/rolldown/rolldown/issues/${n})`).join(', ');
const mdRow = (cells) => `| ${cells.map((c) => String(c).replaceAll('|', '\\|')).join(' | ')} |`;

function binSource(target) {
  if (target.kind === 'npm') return `npm \`${target.spec}\``;
  if (target.kind === 'preview') return `pkg.pr.new \`${target.spec}\``;
  return `${target.kind} \`${target.spec}\``;
}

// `info` maps a case or project id to its `{ title, issues }`.
export function markdown(record, info = new Map()) {
  const names = record.targets.map((t) => t.name);
  const m = record.machine;
  const sources = record.sources ?? [{ date: m.date, args: record.args }];
  const order = [...info.keys()];
  const rank = (group) => (order.includes(group.case) ? order.indexOf(group.case) : order.length);
  const all = groups(record).sort((a, b) => rank(a) - rank(b));
  const kind = record.runs.find((r) => r.kind)?.kind ?? {};
  // Windows has no load average and reports 0.
  const loads = record.runs.map((r) => r.load).filter((load) => load > 0);
  const lines = [
    '# Benchmarks',
    '',
    '`just bench` writes this file after every run, and `just report <results.json> ...` writes it again from saved runs.',
    '',
    `- Machine: ${m.platform} ${m.arch} (${m.release}), ${m.cpu}, ${m.cores} cores, ${m.memGB} GB, Node ${m.node}`,
    ...sources.map((s) => `- Run ${s.date.slice(0, 16).replace('T', ' ')} UTC: \`just bench ${s.args.slice(1).join(' ')}\``),
    `- Memory: \`${kind.mem ?? 'rss'}\`, peak: the highest \`${kind.peak ?? 'rss'}\` of the process. Numbers compare only on the same machine.`,
    ...(loads.length ? [`- Load average (1 min) when a run started: ${Math.min(...loads)} to ${Math.max(...loads)}, on ${m.cores} cores`] : []),
    '',
    mdRow(['Bin', 'rolldown', 'From', 'Commit']),
    mdRow(['---', '---', '---', '---']),
    ...record.targets.map((t) => mdRow([t.name, t.version, binSource(t), t.git ?? '-'])),
    '',
    `Every number is the median over the rounds, with the range in parentheses. A change is from \`${names[0]}\`. A change marked noise is not a clear difference: its ranges overlap, or a side has fewer than 3 rounds.`,
    '',
    '## Summary',
    '',
  ];

  const later = names.slice(1);
  const change = (row) => (row ? row.deltas.map((d, i) => (later.length > 1 ? `${later[i]} ${d}` : d)).join('<br>') : '-');
  const labeled = (row) => (row ? `${row.name ?? row.label}: ${change(row)}` : '-');
  lines.push(mdRow(['Case', 'Peak', 'CPU time', 'Time', 'Memory at the last mark']));
  lines.push(mdRow(['---', '---:', '---:', '---:', '---:']));
  for (const group of all) {
    if (group.rows.length === 0) {
      lines.push(mdRow([group.key, 'failed', '', '', '']));
      continue;
    }
    const peak = group.rows.find((r) => r.id === 'peak');
    const cpu = group.rows.find((r) => r.id === 'cpu');
    const time = group.rows.find((r) => r.id === 'wall') ?? group.rows.find((r) => r.id === 'metric' && r.unit === 'ms');
    const lastMark = group.rows.filter((r) => r.id === 'mark').at(-1);
    lines.push(mdRow([group.key, change(peak), change(cpu), labeled(time), labeled(lastMark)]));
  }

  let current = null;
  for (const group of all) {
    if (group.case !== current) {
      current = group.case;
      const { title, issues } = info.get(group.case) ?? {};
      if (lines.at(-1) !== '') lines.push('');
      lines.push(`## ${group.case}`, '');
      if (title) lines.push(issues?.length ? `${title}. Issues: ${issueLinks(issues)}.` : `${title}.`, '');
    }
    lines.push(`### ${group.key}`, '', `${roundsText(group)}.`, '');
    if (group.rows.length === 0) continue;
    const head = header(record);
    lines.push(mdRow(head), mdRow(head.map((_, i) => (i ? '---:' : '---'))));
    for (const row of group.rows) lines.push(mdRow([row.label, ...row.cells, ...row.deltas]));
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}
