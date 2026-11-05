import assert from 'node:assert/strict';
const origin = process.argv[2] || 'http://127.0.0.1:3100';
const get = (path, headers = {}, method = 'GET') => fetch(`${origin}${path}`, { method, headers: { cookie: 'brilliant-language=en', ...headers }, redirect: 'manual' });
let r = await get('/services?lang=es&utm_source=test');
assert.equal(r.status, 307);
assert.equal(new URL(r.headers.get('location')).pathname, '/es/services');
assert.equal(new URL(r.headers.get('location')).search, '?utm_source=test');
assert.match(r.headers.get('set-cookie'), /SameSite=Lax/);
if (origin.startsWith('https:')) assert.match(r.headers.get('set-cookie'), /Secure/);
else assert.doesNotMatch(r.headers.get('set-cookie'), /Secure/);
assert.match(r.headers.get('cache-control'), /no-store/);
r = await get('/es/services?lang=en');
assert.equal(new URL(r.headers.get('location')).pathname, '/services');
r = await get('/services?x=1', { cookie: 'brilliant-language=es' });
assert.equal(new URL(r.headers.get('location')).pathname, '/es/services');
for (const path of ['/services', '/es/services']) {
  r = await get(path, { 'user-agent': 'Googlebot', cookie: 'brilliant-language=es' });
  assert.equal(r.status, 200);
  assert.match(r.headers.get('cache-control'), /no-store/);
}
r = await get('/services/?x=1');
assert.equal(r.status, 308);
assert.equal(new URL(r.headers.get('location')).pathname, '/services');
assert.equal(new URL(r.headers.get('location')).search, '?x=1');
for (const path of ['/missing', '/es/missing', '/blog/missing', '/api/missing?lang=es']) {
  r = await get(path); assert.equal(r.status, 404); assert.equal(r.headers.get('location'), null);
}
r = await get('/api/inquiry?lang=es');
assert.equal(r.status, 405); assert.equal(r.headers.get('location'), null);
for (const path of ['/social/es/home.png', '/hero-threshold.jpg', '/robots.txt', '/es.txt']) {
  r = await get(`${path}?lang=es`, { cookie: 'brilliant-language=es' });
  assert.equal(r.status, 200, path);
  assert.equal(r.headers.get('location'), null);
  assert.doesNotMatch(r.headers.get('cache-control') || '', /private, no-store/, `${path}: static bypass`);
}
console.log('Pages HTTP checks passed: explicit/saved language, bots, cookies, query strings, clean redirects, cache isolation, API exclusions, static bypass and 404s.');
