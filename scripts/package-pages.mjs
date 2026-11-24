import { build } from 'esbuild';
import { writeFile, readFile, readdir, stat } from 'node:fs/promises';
const manifest = await readFile('.cloudflare/manifest.json', 'utf8');
await build({ entryPoints: ['cloudflare/worker.ts'], outfile: 'out/_worker.js', bundle: true, define: { PAGES_MANIFEST: manifest }, format: 'esm', platform: 'browser', target: 'es2022', minify: true });
// Only extensionless requests enter Functions. Next RSC payloads, media,
// CSS/JS/fonts and every generated PNG are served directly by Pages.
await writeFile('out/_routes.json', JSON.stringify({ version: 1, include: ['/*'], exclude: ['/_next/*', '/brand/*', '/fonts/*', '/video/*', '/social/*', '/*.*'] }, null, 2));
// Static files skip the Function, so pages.dev hosts (the production alias and
// every preview) get their noindex header here; cloudflare/routing.ts covers HTML.
// Group articles to keep the header count bounded as the blog grows.
const payloads = JSON.parse(manifest).paths
  .filter((path) => !/^\/(?:es\/)?blog\//.test(path))
  .map((path) => path === '/' ? '/index.txt' : `${path}.txt`);
payloads.push('/blog/*.txt', '/es/blog/*.txt');
await writeFile('out/_headers', [
  '/_next/static/*', '  Cache-Control: public, max-age=31536000, immutable',
  '/social/*', '  Cache-Control: public, max-age=3600, must-revalidate',
  ...payloads.flatMap((path) => [path, '  X-Robots-Tag: noindex']),
  'https://brilliant-ai.pages.dev/*', '  X-Robots-Tag: noindex',
  'https://:version.brilliant-ai.pages.dev/*', '  X-Robots-Tag: noindex',
].join('\n') + '\n');
// Keep Pages Free limits visible before deployment (especially videos).
let count = 0;
async function check(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await check(path);
    else { count++; if ((await stat(path)).size > 25 * 1024 * 1024) throw Error(`Pages asset exceeds 25 MiB: ${path}`); }
  }
}
await check('out');
if (count > 20000) throw Error(`Pages Free file limit exceeded: ${count}`);
console.log(`Pages ready: ${count} files, all <=25 MiB.`);
