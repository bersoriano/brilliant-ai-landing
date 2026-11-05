# Migration verification — 2026-10-29

Local implementation verified on Node 26.8.1, Next 15.5.28, Wrangler 4.156.0,
Chrome desktop (1440×1000) and mobile (390×844). No production deployment,
DNS change, service purchase, or real inquiry email occurred.

| Check | Result |
| --- | --- |
| `npm test` | 54 passed (baseline 49) |
| `npm run typecheck` | Passed |
| `npm run build` | Static export: 40 localized pages, 16 PNGs, 155 files; assets below 25 MiB |
| `npm run verify:seo -- http://127.0.0.1:3100` | 40 pages, 7 articles × 2 locales, 1,046 internal links, article PNGs, sitemap, robots, 404/noindex |
| `npm run test:pages` | Explicit/saved locale, cookies, bots, query retention, clean redirects, no-store, API exclusions, static bypass and invalid URLs |
| `npm run test:runtime` | Built Worker in workerd; mocked Resend and HTTPS webhook, rejection/network errors/unconfigured transport, missing limiter, honeypot, trusted geo/spoofed headers; atomic D1 concurrency, sliding window and expiry |
| `npm run test:browser` | 10 passed across desktop/mobile; locale state retention, metadata/JSON-LD, blog MDX navigation, download, inquiry success/fallback, responsive width, links, FAQ/menu keyboard behavior, reduced motion and active animation |
| `node scripts/check-export-secrets.mjs` | No configured runtime secret values in export |
| `git diff --check` | Passed |

D1 concurrency test admitted exactly five of twelve concurrent attempts and
returned 429 for seven. Delivery requests are intercepted by local runtime;
browser inquiries and all external browser requests are mocked. No real
credentials are used by transport tests. Screenshots were inspected for desktop,
mobile and a generated Spanish article PNG. Existing design/CSS is retained.

Independent review identified stale keywords/OG alt/alternate locales after
in-place language changes. Regression test failed against the initial change;
fix now passes and reviewer confirmed closure. No further concrete findings.

Still required on remote staging: real Cloudflare ingress country metadata,
custom-domain/TLS and DNS behavior, account quotas/CPU metrics, verified sender
or intended webhook credentials, and intended PostHog ingestion. Remote Pages
project and preview/production D1 IDs are not provisioned; config contains
explicit placeholders. Follow [runbook](CLOUDFLARE.md) before owner-approved cutover.
No known local visitor-feature gap remains. Dynamic behavior is limited by
Free quotas; documented fail-open/fail-closed tradeoff applies when exhausted.

## Remote staging — 2026-11-05

Pages project `brilliant-ai` (Git: `bersoriano/brilliant-ai-landing`), preview
deployment `https://a7f7e5f2.brilliant-ai.pages.dev` from commit `4497500` on
`feat/cloudflare-pages`. D1 databases `brilliant-inquiry-rate-limit` and
`brilliant-inquiry-rate-limit-preview` are provisioned with the schema applied;
their IDs are in `wrangler.jsonc`. Preview has `INQUIRY_RATE_SALT` and no
delivery transport. Build variables come from `wrangler.jsonc` `vars`; the build
command (`npm run build`) is set in the dashboard.

| Check | Result |
| --- | --- |
| `npm run verify:seo -- <preview>` | 40 pages, 7 posts in both languages, 1,032 internal links, 14 article images, sitemap, robots, 404s |
| `node scripts/test-pages.mjs <preview>` | Passed |
| `TEST_BASE_URL=<preview> npm run test:browser` | 10 passed (desktop and mobile) |
| Country routing from a Mexican connection | `/` and `/security` redirect 307 to `/es` and `/es/security` |
| Preview headers | `x-robots-tag: noindex`, `cache-control: private, no-store`, valid TLS |
| `POST /api/inquiry`, valid body, no transport | 502 `unconfigured` (form offers the email draft); GET is 405 |

Vercel Analytics is removed: it only collects on Vercel.

## Production cutover — 2026-11-05

`main` at `0007eef` (PR #52, plus post #53) deployed as Pages production;
brilliant.dev and www.brilliant.dev attached as custom domains (zone already on
Cloudflare nameservers; MX and SPF records untouched). Production secrets:
`INQUIRY_RATE_SALT`, `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL`, `INQUIRY_TO_EMAIL`.
Vercel automatic builds are off; its last deployment is the rollback.

| Check | Result |
| --- | --- |
| Merged `main` locally | Typecheck, `npm test` 57/57, build 165 files, no secrets in export |
| `node scripts/test-pages.mjs https://brilliant.dev` | Passed |
| `TEST_BASE_URL=https://brilliant.dev npm run test:browser` | 10 passed (desktop and mobile) |
| `npm run verify:seo -- https://brilliant.dev` | 42 pages, 8 posts in both languages, 1,074 internal links, 14 article images, sitemap, robots, 404s. It failed until zone Email Address Obfuscation was turned off; that setting rewrote `mailto:` links |
| `www.brilliant.dev` | 301 to `https://brilliant.dev`, keeping path and query (zone Redirect Rule) |
| 13 key URLs, both languages, new post | 200; unknown path 404 |
| Country routing from a Mexican connection | `/security` redirects 307 to `/es/security` |
| Production headers | `server: cloudflare`, no `x-robots-tag`, no `noindex`, canonical `https://brilliant.dev` |
| Controlled submission (`POST /api/inquiry`, marked as a test) | 200 `{"ok":true}` |
| PostHog | `POST us.i.posthog.com/e/` 200 from a desktop browser. Headless checks must mask `navigator.webdriver`, or PostHog drops events as bot traffic |
