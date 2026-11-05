import { readFile, readdir } from 'node:fs/promises';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const names = ['RESEND_API_KEY', 'INQUIRY_WEBHOOK_URL', 'INQUIRY_RATE_SALT'];
const secrets = names.map(name => [name, process.env[name]]).filter(([, value]) => value && value.length >= 8);
async function check(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await check(path);
    else {
      const data = await readFile(path);
      for (const [name, value] of secrets) if (data.includes(Buffer.from(value))) throw Error(`Runtime secret ${name} found in ${path}`);
    }
  }
}
await check('out');
console.log('Export contains no configured runtime secret values.');
