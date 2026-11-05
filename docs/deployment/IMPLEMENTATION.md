# Cloudflare migration implementation

Scope: preserve Next/React UI and URLs; build English and Spanish HTML/MDX and PNG previews. No production changes.

1. Replace request-localized rendering with explicit build parameters and shared page registry. Keep component trees; pass bilingual note data to client components so language switching can use history replacement without losing calculator/form state.
2. Build social PNGs with existing ImageResponse design; generate route manifest, deliberate _routes.json and advanced Pages Function bundle.
3. Move inquiry transport unchanged to Web APIs/runtime bindings; enforce five attempts per sliding minute with atomic D1 updates, hashed client keys, fail closed to existing email-draft fallback.
4. Test locale precedence, cookie/cache behavior, 404s, metadata/export, mocked transports, local D1 concurrency, and browser interactions against Wrangler.
5. Document staging, secrets, quotas, DNS cutover and rollback. Leave Vercel intact.
