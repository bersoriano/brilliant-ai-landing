const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText, f);
const { routeLanguage } = require('../cloudflare/routing.ts');
const request = (path, headers = {}) => new Request(`https://example.com${path}`, { headers });
test('explicit language wins, removes lang only, sets secure cookie and prevents shared caching', () => {
  const r = routeLanguage(request('/es/services?lang=en&utm=x', { cookie: 'brilliant-language=es' }));
  assert.equal(r.status, 307);
  assert.equal(r.headers.get('location'), 'https://example.com/services?utm=x');
  assert.match(r.headers.get('set-cookie'), /brilliant-language=en; Path=\/; Max-Age=31536000; SameSite=Lax; Secure/);
  assert.match(r.headers.get('cache-control'), /no-store/);
});
test('explicit OG language preserves query compatibility and cookie', () => {
  const r = routeLanguage(request('/og?post=why-invoice-automation-stalls&lang=es'));
  assert.equal(r.headers.get('location'), 'https://example.com/es/og?post=why-invoice-automation-stalls');
  assert.match(r.headers.get('set-cookie'), /brilliant-language=es/);
});
test('canonical language URLs stay stable with conflicting cookies and browser preferences', () => {
  for (const path of ['/', '/services', '/blog', '/blog/why-invoice-automation-stalls']) {
    assert.equal(routeLanguage(request(`${path}?utm=x`, { cookie: 'brilliant-language=es', 'accept-language': 'en-US' })), null);
    assert.equal(routeLanguage(request(path, { 'accept-language': 'es-MX', 'user-agent': 'Mozilla/5.0' })), null);
  }
  assert.equal(routeLanguage(request('/es/blog', { cookie: 'brilliant-language=en' })), null);
  for (const path of ['/api/inquiry?lang=es', '/api?lang=es', '/_next/a?lang=es', '/video/file.mp4?lang=es', '/og', '/es/og'])
    assert.equal(routeLanguage(request(path)), null);
});
const { handleInquiry } = require('../cloudflare/inquiry.ts');
const valid = { name: 'Ada', email: 'ada@example.com', industry: 'finance', message: 'Review process', locale: 'es' };
const post = body => new Request('https://example.com/api/inquiry', { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.1' }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const limiter = async () => true;
test('validation, malformed JSON, honeypot, and unconfigured fallback preserve contracts', async () => {
  for (const body of ['{', {}, { ...valid, company: 'bot' }, { ...valid, email: 'bad' }, { ...valid, industry: 'unknown' }, { ...valid, message: '' }]) {
    const r = await handleInquiry(post(body), {}, { limit: limiter });
    assert.equal(r.status, 400); assert.deepEqual(await r.json(), { ok: false, error: 'invalid' });
  }
  const r = await handleInquiry(post(valid), {}, { limit: limiter });
  assert.equal(r.status, 502); assert.deepEqual(await r.json(), { ok: false, error: 'unconfigured' });
});
test('Resend priority, webhook HTTPS, rejection, network errors, throttle and limiter failure', async () => {
  let calls = [];
  const send = async (url, options) => { calls.push([url, options]); return new Response('', { status: 200 }); };
  const env = { RESEND_API_KEY: 'test', INQUIRY_TO_EMAIL: 'to@example.com', INQUIRY_FROM_EMAIL: 'from@example.com', INQUIRY_WEBHOOK_URL: 'https://example.com/webhook' };
  let r = await handleInquiry(post({ ...valid, name: 'Ada\r\nInjected' }), env, { limit: limiter, fetch: send });
  assert.deepEqual(await r.json(), { ok: true });
  assert.equal(calls[0][0], 'https://api.resend.com/emails');
  assert.equal(JSON.parse(calls[0][1].body).reply_to, valid.email);
  assert.doesNotMatch(JSON.parse(calls[0][1].body).subject, /[\r\n]/);
  calls = [];
  r = await handleInquiry(post(valid), { INQUIRY_WEBHOOK_URL: env.INQUIRY_WEBHOOK_URL }, { limit: limiter, fetch: send });
  assert.equal(r.status, 200); assert.equal(calls[0][0], env.INQUIRY_WEBHOOK_URL);
  for (const fetch of [async () => new Response('', { status: 500 }), async () => { throw Error('offline'); }]) {
    r = await handleInquiry(post(valid), env, { limit: limiter, fetch });
    assert.equal(r.status, 502); assert.equal((await r.json()).error, 'failed');
  }
  r = await handleInquiry(post(valid), env, { limit: async () => false, fetch: send });
  assert.equal(r.status, 429); assert.equal((await r.json()).error, 'rate_limited');
  r = await handleInquiry(post(valid), env, { limit: async () => { throw Error('database unavailable'); }, fetch: send });
  assert.equal(r.status, 502); assert.equal((await r.json()).error, 'failed');
});
test('pages.dev alias moves to the canonical domain; previews stay reachable but noindex', () => {
  const { hostPolicy, PAGES_HOST } = require('../cloudflare/routing.ts');
  const r = hostPolicy(new URL(`https://${PAGES_HOST}/es/services?utm_source=x`), 'https://brilliant.dev');
  assert.equal(r.status, 308);
  assert.equal(r.headers.get('location'), 'https://brilliant.dev/es/services?utm_source=x');
  assert.equal(hostPolicy(new URL(`https://seo-fixes.${PAGES_HOST}/`), 'https://brilliant.dev'), 'noindex');
  assert.equal(hostPolicy(new URL(`https://1a2b3c4d.${PAGES_HOST}/blog`), 'https://brilliant.dev'), 'noindex');
  assert.equal(hostPolicy(new URL('https://brilliant.dev/'), 'https://brilliant.dev'), null);
  assert.equal(hostPolicy(new URL('https://evil-brilliant-ai.pages.dev/'), 'https://brilliant.dev'), null);
});
test('HTML revalidates on every visit without no-store, so the back/forward cache still works', () => {
  const { pageCacheHeaders } = require('../cloudflare/routing.ts');
  assert.deepEqual(pageCacheHeaders(), { 'Cache-Control': 'public, max-age=0, must-revalidate' });
});
