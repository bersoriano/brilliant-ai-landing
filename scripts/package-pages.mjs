import { build } from 'esbuild';
import { writeFile, readFile, readdir, stat } from 'node:fs/promises';
await build({ entryPoints: ['cloudflare/worker.ts'], outfile: 'out/_worker.js', bundle: true, define: { PAGES_MANIFEST: await readFile('.cloudflare/manifest.json', 'utf8') }, format: 'esm', platform: 'browser', target: 'es2022', minify: true });
// Only extensionless requests enter Functions. Next RSC payloads, media,
// CSS/JS/fonts and every generated PNG are served directly by Pages.
await writeFile('out/_routes.json', JSON.stringify({ version: 1, include: ['/*'], exclude: ['/_next/*', '/brand/*', '/fonts/*', '/video/*', '/social/*', '/*.*'] }, null, 2));
await writeFile('out/_headers', `/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n/social/*\n  Cache-Control: public, max-age=3600, must-revalidate\n`);
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
