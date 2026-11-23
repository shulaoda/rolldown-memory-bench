// The project of #9330. A very large SPA: about 30,000 modules, peak about 7 GB with sourcemaps.
const build = (extra = []) => ({
  args: ['node_modules/vite/bin/vite.js', 'build', ...extra],
  clean: ['dist/desktop', 'public/_spa'],
  env: { NODE_OPTIONS: '--max-old-space-size=8192' },
});

// The steps of #9349: Chrome on the page for 25 s, then idle. The JS heap is collected only 90 to
// 180 s after the page closes, and memory stops dropping by 270 s. No `--max-old-space-size`, like
// its `dev:spa` script.
const dev = (extra = []) => ({
  args: ['node_modules/vite/bin/vite.js', ...extra],
  async script({ open, mark, sleep }) {
    await mark('ready');
    await open('/', { wait: 25_000 });
    await mark('page closed');
    for (const seconds of [90, 180, 270]) {
      await sleep(90_000);
      await mark(`idle ${seconds}s`);
    }
  },
});

export default {
  title: 'lobehub SPA',
  issues: [9330],
  // It pins vite 8.0. Use the newest vite, which matches current rolldown.
  overrides: { vite: 'latest' },
  rounds: 3,
  cases: {
    build: build(),
    'build-sourcemap': build(['--sourcemap']),
    // A cold dev server: `--force` and no deps cache, so rolldown bundles the dependencies.
    dev: { ...dev(['--force']), clean: ['node_modules/.vite'] },
    // A warm dev server: it reuses the deps cache that the run before left, so rolldown bundles
    // nothing. The log has no "[optimizer] bundling dependencies" line when the cache was used.
    'dev-warm': dev(),
  },
};
