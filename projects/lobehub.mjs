// The project of #9330. A very large SPA: about 30,000 modules, peak about 7 GB with sourcemaps.
const build = (extra = []) => ({
  args: ['node_modules/vite/bin/vite.js', 'build', ...extra],
  clean: ['dist/desktop', 'public/_spa'],
  env: { NODE_OPTIONS: '--max-old-space-size=8192' },
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
    // The #9330 steps: a cold dev server, Chrome on the page for 25 s, then idle.
    dev: {
      args: ['node_modules/vite/bin/vite.js', '--force'],
      clean: ['node_modules/.vite'],
      env: { NODE_OPTIONS: '--max-old-space-size=8192' },
      async script({ open, mark, sleep }) {
        await mark('ready');
        await open('/', { wait: 25_000 });
        await mark('page +25s');
        await sleep(30_000);
        await mark('idle 30s');
      },
    },
  },
};
