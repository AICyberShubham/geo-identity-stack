import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, '.output', 'public');
const serverEntry = path.join(rootDir, '.output', 'server', 'index.mjs');

if (!fs.existsSync(serverEntry)) {
  console.error(`Server entry not found at ${serverEntry}`);
  process.exit(1);
}

const base = process.env.BASE_PATH || (process.env.GITHUB_PAGES === 'true' ? '/geo-identity-stack/' : '/');
const normalizedBase = base.endsWith('/') ? base : `${base}/`;

async function main() {
  console.log(`Prerendering static HTML with base path: ${normalizedBase}`);
  const { default: server } = await import(pathToFileURL(serverEntry).href);

  const context = { waitUntil() {} };

  const routes = [
    { route: '', file: 'index.html' },
    { route: 'app', file: 'app/index.html' },
    { route: '404', file: '404.html' },
  ];

  for (const { route, file } of routes) {
    const url = `http://localhost${normalizedBase}${route}`;
    console.log(`Fetching: ${url}`);
    const res = await server.fetch(new Request(url), {}, context);
    if (res.status !== 200 && res.status !== 404) {
      console.warn(`Warning: ${url} returned status ${res.status}`);
    }
    const html = await res.text();
    const dest = path.join(publicDir, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, html, 'utf-8');
    console.log(`Wrote ${dest} (${html.length} bytes)`);
  }

  // Ensure .nojekyll exists so GitHub Pages serves assets properly
  fs.writeFileSync(path.join(publicDir, '.nojekyll'), '', 'utf-8');

  // If 404.html is missing or empty, copy index.html to 404.html for SPA routing on GitHub Pages
  const indexFile = path.join(publicDir, 'index.html');
  const fallbackFile = path.join(publicDir, '404.html');
  if (fs.existsSync(indexFile)) {
    fs.copyFileSync(indexFile, fallbackFile);
    console.log(`Created GitHub Pages SPA fallback: 404.html`);
  }

  console.log('Static export completed successfully!');
}

main().catch((err) => {
  console.error('Static export error:', err);
  process.exit(1);
});
