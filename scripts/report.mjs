function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function format(value, unit) {
  if (unit === 'ms') return value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${Math.round(value)}ms`;
  return value >= 100 ? String(Math.round(value)) : value.toFixed(1);
}

function rowsFor(runs) {
  const kind = runs[0].kind ?? {};
  const rows = [{ label: `peak ${kind.peak ?? 'memory'} (MB)`, unit: 'MB', get: (r) => r.peak ?? r.maxRss }];
  // A case that times its own builds also sleeps, so the process wall time says little there.
  const timed = runs.some((r) => Object.values(r.metrics ?? {}).some((m) => m.unit === 'ms'));
  if (!timed) rows.push({ label: 'wall time', unit: 'ms', get: (r) => r.wall });
  rows.push({ label: 'process cpu time', unit: 'ms', get: (r) => r.cpu });
  const seen = new Set();
  for (const run of runs) {
    for (const [name, { unit }] of Object.entries(run.metrics ?? {})) {
      if (seen.has(`m:${name}`)) continue;
      seen.add(`m:${name}`);
      rows.push({ label: name, unit, get: (r) => r.metrics?.[name]?.value });
    }
  }
  for (const run of runs) {
    for (const mark of run.marks ?? []) {
      if (seen.has(`k:${mark.label}`)) continue;
      seen.add(`k:${mark.label}`);
      const memKind = mark.memKind ?? kind.mem ?? 'mem';
      rows.push({ label: `${memKind} @ ${mark.label} (MB)`, unit: 'MB', get: (r) => r.marks?.find((m) => m.label === mark.label)?.mem });
    }
  }
  if (runs.some((r) => r.rustPeak != null)) {
    rows.push({ label: 'rust heap peak (MB)', unit: 'MB', get: (r) => r.rustPeak });
  }
  for (const run of runs) {
    for (const mark of run.marks ?? []) {
      if (mark.rustLive == null || seen.has(`r:${mark.label}`)) continue;
      seen.add(`r:${mark.label}`);
      rows.push({ label: `rust heap @ ${mark.label} (MB)`, unit: 'MB', get: (r) => r.marks?.find((m) => m.label === mark.label)?.rustLive });
    }
  }
  return rows;
}

function table(lines) {
  const widths = lines[0].map((_, i) => Math.max(...lines.map((line) => line[i].length)));
  return lines.map((line) => line.map((cell, i) => cell.padEnd(widths[i])).join('   ').trimEnd()).join('\n');
}

// One table per case and variant: median (min-max) for each target, and the change from the first target.
export function summarize(record) {
  const names = record.targets.map((t) => t.name);
  const groups = new Map();
  for (const run of record.runs) {
    const key = run.variant ? `${run.case}:${run.variant}` : run.case;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(run);
  }
  const out = [];
  for (const [key, runs] of groups) {
    const ok = runs.filter((r) => r.ok);
    const failed = runs.length - ok.length;
    const rounds = Math.max(...runs.map((r) => r.round + 1));
    out.push(`\n${key}  (${rounds} rounds${failed ? `, ${failed} failed` : ''})`);
    if (ok.length === 0) continue;
    const header = ['', ...names];
    for (const name of names.slice(1)) header.push(`${name} vs ${names[0]}`);
    const lines = [header];
    for (const row of rowsFor(ok)) {
      const medians = [];
      const cells = names.map((name) => {
        const values = ok.filter((r) => r.target === name).map(row.get).filter((v) => typeof v === 'number');
        if (values.length === 0) {
          medians.push(null);
          return '-';
        }
        const m = median(values);
        medians.push(m);
        const min = Math.min(...values);
        const max = Math.max(...values);
        return values.length > 1 ? `${format(m, row.unit)} (${format(min, row.unit)}-${format(max, row.unit)})` : format(m, row.unit);
      });
      const deltas = medians.slice(1).map((m) => {
        if (m == null || !medians[0]) return '-';
        const pct = ((m - medians[0]) / medians[0]) * 100;
        return `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;
      });
      lines.push([row.label, ...cells, ...deltas]);
    }
    out.push(table(lines));
  }
  return out.join('\n');
}
