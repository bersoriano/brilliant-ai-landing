# Language routing on Cloudflare Pages

`middleware.ts` and request headers/cookies are no longer part of rendering.
`app/[[...path]]` exports actual English and Spanish HTML using static params.
Existing components live in `views/`; shared locale helpers remain in `lib/locale.ts`.

`cloudflare/routing.ts` runs in the advanced Pages Function (`out/_worker.js`):

1. API, Next assets and file requests bypass language handling.
2. Valid `?lang=en|es` wins even for bots and Spanish URLs. Remove only `lang`,
   retain other query parameters, set a one-year Path=/ SameSite=Lax cookie,
   Secure on HTTPS, and return a private/no-store 307 to the clean locale URL.
3. Bots, Spanish URLs and image/icon endpoints skip preference redirection.
4. Saved language wins; otherwise trusted `request.cf.country` selects Spanish
   for the existing Latin American market list; otherwise parse Accept-Language
   by descending quality, excluding q=0/invalid values; English is fallback.
5. Spanish preference redirects English URLs to their /es counterpart. Missing
   pages still become 404 after preference handling; no SPA fallback is used.
6. Known trailing-slash URLs canonicalize with 308. Page responses and personalized
   redirects are no-store; no redirect caching or cross-visitor preference reuse.

Never trust incoming x-brilliant-*, x-vercel-ip-country, or cf-ipcountry headers
for locale rendering or country detection. API delivery trusts Cloudflare's
platform-overwritten CF-Connecting-IP for throttling.

On client-rendered pages, language switching writes the cookie and replaces native
history (integrated with Next usePathname). Build-time bilingual note data updates
with the language context; calculator/form instances, inputs, scroll and selected
workflow survive. Existing currency reseeding remains intentional. Blog/archive
switches request the other exported page through `?lang=`; query and hash survive.
Footer language links retain their existing request-based behavior.

See [deployment runbook](../deployment/CLOUDFLARE.md) for function quotas, assets
excluded from execution, and staging checks.
