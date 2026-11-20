// Generates a synthetic React app: MODULES leaf components and ROUTES lazy routes that each import a slice of them.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const MODULES = Number(process.env.MODULES ?? 1500);
const ROUTES = Number(process.env.ROUTES ?? 30);

rmSync('src', { recursive: true, force: true });
mkdirSync('src/modules', { recursive: true });
mkdirSync('src/routes', { recursive: true });

for (let i = 0; i < MODULES; i++) {
  const deps = [i - 1, i - 2].filter((d) => d >= 0 && d % 50 !== 49);
  writeFileSync(
    `src/modules/M${i}.tsx`,
    `${deps.map((d) => `import { M${d} } from './M${d}';`).join('\n')}
import { useState } from 'react';

export function M${i}({ label = 'module ${i}' }: { label?: string }) {
  const [count, setCount] = useState(${i});

  return (
    <div className="m-${i % 12} p-${i % 8} flex items-center gap-${i % 6} rounded-lg border text-sm">
      <button className="bg-slate-${(i % 9 + 1) * 100} px-2" onClick={() => setCount(count + 1)}>{label}: {count}</button>
      ${deps.map((d) => `<M${d} label="nested ${d}" />`).join('\n      ')}
    </div>
  );
}
`,
  );
}

const perRoute = Math.floor(MODULES / ROUTES);

for (let r = 0; r < ROUTES; r++) {
  const ids = Array.from({ length: perRoute }, (_, k) => r * perRoute + k).filter((id) => id % 50 === 49);
  writeFileSync(
    `src/routes/R${r}.tsx`,
    `${ids.map((id) => `import { M${id} } from '../modules/M${id}';`).join('\n')}

export default function R${r}() {
  return <main>${ids.map((id) => `<M${id} />`).join('')}</main>;
}
`,
  );
}

writeFileSync(
  'src/main.tsx',
  `import './index.css';
import { lazy, Suspense, useState } from 'react';
import { createRoot } from 'react-dom/client';

const routes = [
${Array.from({ length: ROUTES }, (_, r) => `  lazy(() => import('./routes/R${r}')),`).join('\n')}
];

function App() {
  const [route, setRoute] = useState(0);
  const Route = routes[route];

  return (
    <Suspense fallback="loading">
      <nav>{routes.map((_, r) => <button key={r} onClick={() => setRoute(r)}>{r}</button>)}</nav>
      <Route />
    </Suspense>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
`,
);
writeFileSync('src/index.css', `@import 'tailwindcss';\n`);
console.log(`generated ${MODULES} modules and ${ROUTES} routes`);
