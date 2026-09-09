import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Clean temporary root HTML files so Nitro/Vite doesn't treat them as static SSR templates during build
for (const file of ['index.html', '404.html']) {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
