// The small repro from #9330: React with @lobehub/ui, a cold dev server and Chrome.
// Steps from its scripts/measure.mjs: open the page, wait 25 s, close the browser, wait 30 s.
export default {
  title: 'Small #9330 repro, vite dev with @lobehub/ui',
  issues: [9330],
  // It pins vite 8.0. Use the newest vite, which matches current rolldown.
  overrides: { vite: 'latest' },
  rounds: 3,
  cases: {
    dev: {
      args: ['node_modules/vite/bin/vite.js', '--force'],
      clean: ['node_modules/.vite'],
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
