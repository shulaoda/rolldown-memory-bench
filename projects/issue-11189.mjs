// #11189: bundled dev (`vite --experimentalBundle`) grows with every rebuild until a full GC.
// The files in projects/issue-11189 are the issue's repro, on the newest versions of its packages.
// Steps from its measure.mjs: request the whole app, then edit a file 20 times and request it again.
const VITE = 'node_modules/vite/bin/vite.js';

const editLoop =
  (file, { gc = false } = {}) =>
  async ({ crawl, edit, mark, sleep }) => {
    await crawl('/');
    await sleep(5000);
    await mark('after load', { gc });
    for (let i = 1; i <= 20; i++) {
      edit(file, `\n// edit ${i}\n`);
      await sleep(1500);
      await crawl('/');
      await sleep(1500);
      if (i % 5 === 0) await mark(`edit ${i}`, { gc });
    }
  };

export default {
  title: 'Bundled dev rebuilds (synthetic React app, 1,500 modules)',
  issues: [11189],
  rounds: 3,
  overrides: {
    vite: 'latest',
    react: 'latest',
    'react-dom': 'latest',
    tailwindcss: 'latest',
    '@tailwindcss/vite': 'latest',
    '@vitejs/plugin-react': 'latest',
  },
  prepare({ run }) {
    run('node', ['generate.mjs']);
  },
  cases: {
    bundled: { args: [VITE, '--experimentalBundle'], script: editLoop('src/main.tsx') },
    unbundled: { args: [VITE], script: editLoop('src/main.tsx') },
    // A full GC before each mark shows how much of the growth can be collected.
    'bundled-gc': { args: ['--expose-gc', VITE, '--experimentalBundle'], script: editLoop('src/main.tsx', { gc: true }) },
    // With Tailwind every edit also rebuilds the CSS, and leaf edits grow too.
    'bundled-tailwind-leaf': {
      args: [VITE, '--experimentalBundle'],
      env: { PLUGINS: 'tailwind,react' },
      script: editLoop('src/modules/M10.tsx'),
    },
  },
};
