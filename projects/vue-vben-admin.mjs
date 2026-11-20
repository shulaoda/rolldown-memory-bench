// A large Vue admin template in a pnpm monorepo.
export default {
  title: 'vue-vben-admin, the web-antd app',
  overrides: { vite: 'latest' },
  rounds: 3,
  cases: {
    build: {
      cwd: 'apps/web-antd',
      // vite is installed at the repo root, not in the app.
      args: ['../../node_modules/vite/bin/vite.js', 'build', '--mode', 'production'],
      clean: ['dist', 'dist.zip'],
      env: { NODE_OPTIONS: '--max-old-space-size=8192' },
    },
  },
};
