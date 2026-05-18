import { copyFile, mkdir } from 'node:fs/promises';

await copyFile('dist/index.html', 'dist/404.html');
await mkdir('dist/race', { recursive: true });
await copyFile('dist/index.html', 'dist/race/index.html');
