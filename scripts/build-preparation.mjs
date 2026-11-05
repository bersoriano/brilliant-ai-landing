import { build } from 'esbuild';
await build({ entryPoints: ['scripts/prepare-pages.ts'], outfile: '.cloudflare/prepare.mjs', bundle: true, jsx: 'automatic', packages: 'external', platform: 'node', format: 'esm', target: 'node22' });
