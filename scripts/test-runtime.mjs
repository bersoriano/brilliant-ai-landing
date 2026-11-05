import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

let delivery = 'success';
const sent = [];
const options = {
  cf: { country: 'MX' }, modules: true, scriptPath: 'out/_worker.js', compatibilityDate: '2026-10-29',
  d1Databases: ['INQUIRY_RATE_LIMIT'],
  bindings: { INQUIRY_RATE_SALT: 'test-only', RESEND_API_KEY: 'fake', INQUIRY_FROM_EMAIL: 'test@example.com', INQUIRY_TO_EMAIL: 'test@example.com' },
  serviceBindings: { ASSETS: async req => new Response('asset') },
  // Every outbound delivery intercepted here; network delivery is impossible.
  outboundService: async req => {
    assert.ok(['api.resend.com', 'mock-webhook.example.test'].includes(new URL(req.url).hostname));
    sent.push(await req.json());
    if (delivery === 'throw') throw Error('mock network failure');
    return new Response('{}', { status: delivery === 'success' ? 200 : 503 });
  },
};
const mf = new Miniflare(convertV4MiniflareOptions(options));
try {
  const db = await mf.getD1Database('INQUIRY_RATE_LIMIT');
  await db.exec((await readFile('cloudflare/migrations/0001_inquiry_limits.sql', 'utf8')).replaceAll('\n', ' '));
  const submit = (ip, body = { name: 'Test', email: 'test@example.com', industry: 'finance', message: 'Mock only' }) => mf.dispatchFetch('https://example.com/api/inquiry', { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip }, body: JSON.stringify(body) });
  assert.equal((await submit('192.0.2.1')).status, 200);
  delivery = 'failure';
  assert.deepEqual(await (await submit('192.0.2.2')).json(), { ok: false, error: 'failed' });
  delivery = 'throw';
  assert.equal((await submit('192.0.2.5')).status, 502);
  delivery = 'success';
  // Concurrent writes all share one D1 primary: exactly five admitted attempts.
  const responses = await Promise.all(Array.from({ length: 12 }, () => submit('192.0.2.3')));
  assert.equal(responses.filter(r => r.status === 200).length, 5);
  assert.equal(responses.filter(r => r.status === 429).length, 7);
  const rows = await db.prepare('SELECT key,hits FROM inquiry_limits').all();
  assert.ok(rows.results.every(row => /^[a-f0-9]{64}$/.test(row.key)));
  assert.ok(rows.results.every(row => JSON.parse(row.hits).length <= 5));
  // Exercise sliding pruning without expiring the row itself.
  const now = Date.now();
  await db.prepare('UPDATE inquiry_limits SET hits = ?, expires = ?').bind(JSON.stringify([now - 61_000, now, now, now, now]), now + 60_000).run();
  assert.equal((await submit('192.0.2.3')).status, 200);
  assert.equal((await submit('192.0.2.3')).status, 429);
  // Expiry releases the limit; cleanup leaves no expired identifiers.
  await db.prepare('UPDATE inquiry_limits SET expires = 0').run();
  assert.equal((await submit('192.0.2.3')).status, 200);
  assert.equal((await db.prepare('SELECT count(*) AS n FROM inquiry_limits').first()).n, 1);
  assert.equal((await submit('192.0.2.4', { company: 'bot' })).status, 400);
  const geo = await mf.dispatchFetch('https://example.com/services?utm=x', { redirect: 'manual', cf: { country: 'MX' } });
  assert.equal(geo.status, 307);
  assert.equal(geo.headers.get('location'), 'https://example.com/es/services?utm=x');
  const spoof = await mf.dispatchFetch('https://example.com/services', { redirect: 'manual', headers: { 'cf-ipcountry': 'MX', 'x-vercel-ip-country': 'MX' }, cf: { country: 'US' } });
  assert.equal(spoof.status, 200);
  await mf.setOptions(convertV4MiniflareOptions({ ...options, bindings: { INQUIRY_RATE_SALT: 'test-only', INQUIRY_WEBHOOK_URL: 'https://mock-webhook.example.test/inquiry' } }));
  assert.equal((await submit('192.0.2.6')).status, 200);
  assert.equal(sent.at(-1).locale, 'en');
  await mf.setOptions(convertV4MiniflareOptions({ ...options, bindings: { INQUIRY_RATE_SALT: 'test-only' } }));
  assert.deepEqual(await (await submit('192.0.2.7')).json(), { ok: false, error: 'unconfigured' });
  await mf.setOptions(convertV4MiniflareOptions({ ...options, bindings: {} }));
  assert.deepEqual(await (await submit('192.0.2.8')).json(), { ok: false, error: 'failed' });
  console.log(`Runtime checks passed: mocked success/failure, ${sent.length} intercepted deliveries, concurrent D1 throttle, expiry, hashed identifiers, honeypot, trusted geo.`);
} finally { await mf.dispose(); }
