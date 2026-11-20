// vinext, Next.js on Vite: React Server Components and several environments in one build.
// vinext uses @voidzero-dev/vite-plus-core, which has rolldown built in. So build the packages with
// it first, then switch to plain vite. The root postinstall is skipped, since its last step needs
// apps/web, which the filters leave out.
const filters = [
  '--filter',
  'vinext-monorepo',
  '--filter',
  'vinext...',
  '--filter',
  'benchmark-vinext...',
  '--filter',
  'ecosystem-app-router-playground...',
];

const build = (cwd) => ({
  cwd,
  args: ['node_modules/vite/bin/vite.js', 'build'],
  clean: ['dist'],
  env: { NODE_OPTIONS: '--max-old-space-size=8192' },
});

export default {
  title: 'vinext, Next.js on Vite',
  rounds: 3,
  install({ run, replace, latest }) {
    run('pnpm', ['install', '--frozen-lockfile', '--ignore-scripts', ...filters]);
    for (const pkg of ['@cloudflare/workers-response-store', '@vinext/cloudflare', 'vinext']) {
      run('pnpm', ['exec', 'vp', 'run', `${pkg}#build`]);
    }
    replace('pnpm-workspace.yaml', /^ {2}vite: npm:@voidzero-dev\/vite-plus-core@.*$/m, `  vite: ${latest('vite')}`);
    // The release age check fails on packages whose metadata has no publish time, and the
    // second install only swaps vite.
    replace('pnpm-workspace.yaml', /^minimumReleaseAge: \d+$/m, 'minimumReleaseAge: 0');
    run('pnpm', ['install', '--no-frozen-lockfile', '--ignore-scripts', ...filters]);
  },
  prepare({ run }) {
    run('node', ['benchmarks/generate-app.mjs']);
  },
  cases: {
    // The 33-route app of vinext's own benchmarks.
    build: build('benchmarks/vinext'),
    // The App Router playground, with the Cloudflare plugin and MDX.
    'playground-build': build('examples/app-router-playground'),
  },
};
