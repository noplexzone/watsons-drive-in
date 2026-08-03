import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const item of ['index.html', 'styles.css', 'script.js', 'data', '_headers', '_redirects']) {
  cpSync(resolve(root, item), resolve(dist, item), { recursive: true });
}

console.log('Built static site into dist/');
