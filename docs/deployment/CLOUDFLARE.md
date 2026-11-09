# Cloudflare Pages migration runbook

Prepared 2026-10-29. **Cut over 2026-11-05:** brilliant.dev and
www.brilliant.dev are served by Pages project `brilliant-ai`, which deploys
production from `main`. Vercel project `brilliant-ai-landing` is kept, with
automatic builds off, as the rollback target. Results are in
[VERIFICATION.md](VERIFICATION.md). Removing Vercel needs separate owner
authorization.

Gotchas found during cutover:
- Production secrets must be type **Secret**. `wrangler.jsonc` `vars` replace
  the dashboard's plain-text variables.
- Secrets and variables apply only to new deployments. Retry the latest
  deployment after changing them.
- A Git build can sit in "Queued" indefinitely. Retry it (dashboard or
  `POST …/deployments/<id>/retry`).
- Zone **Email Address Obfuscation** (Scrape Shield) rewrites every `mailto:`
  link to `/cdn-cgi/l/email-protection` and injects a script. Keep it off for
  brilliant.dev; `verify:seo` fails while it is on.
- `www` → apex is a zone Redirect Rule (301, keeps path and query), not code.

## Architecture and build

Next.js 15.5.28 / React 19 source stays intact. `app/[[...path]]` statically
exports the existing page components in `views/` at every public English and
Spanish URL. No request headers/cookies, rewrites, server actions, SSR or image
optimizer are required. `getPosts` reads trusted repository MDX at build time;
each localized article is compiled into its static HTML/RSC payload. Drafts
are excluded from production paths, images and sitemap.

Build: `npm ci && npm run build`. Working directory: repository root. Output:
`out/`. Next intermediate output: `.next/`; generated build manifest/script:
`.cloudflare/`; generated social PNGs: `public/social/` copied into `out/social/`.
These generated directories are ignored. Build fails on an asset over 25 MiB or
more than 20,000 files. Current export: 40 localized pages, 16 PNGs, 155 files.
Use Node 22 LTS (`.node-version`), npm with lockfile. Toolchain requires Node
>=22; package engines also permit 24/26. This migration was tested on Node
26.8.1. Cloudflare build setting `NODE_VERSION=22` selects the pinned LTS family.
Pages runtime uses Web APIs with compatibility date `2026-10-29`; no Node
compatibility flag or server process is needed.

`npm run dev` is useful for UI work only. Production verification uses
Wrangler/workerd, never `next start`. Social files are refreshed by `build`.

## Variables and bindings

Build settings (public; copied into browser JS, so never put secrets here):

| Variable | Value/use |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://brilliant.dev` or actual canonical production origin; keep production canonicals during preview QA |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Monitored public mailbox; default `hello@brilliant.dev` |
| `NEXT_PUBLIC_POSTHOG_KEY` | Public project token; omit to disable analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | Existing US/EU ingestion host |
| `NEXT_PUBLIC_POSTHOG_DEBUG` | Normally `false`; production builds initialize when token exists |
| `NODE_VERSION` | `22` in Pages build settings |

Runtime settings, separately for **preview and production**:

| Setting | Required |
| --- | --- |
| D1 `INQUIRY_RATE_LIMIT` | Dedicated database, schema in `cloudflare/migrations/`; separate preview and production databases |
| Secret `INQUIRY_RATE_SALT` | Random 32+ byte secret, e.g. `openssl rand -hex 32`; stable per environment |
| Secret `RESEND_API_KEY` | Resend option; use verified sending domain |
| `INQUIRY_FROM_EMAIL`, `INQUIRY_TO_EMAIL` | Required with Resend; set destination explicitly at runtime |
| Secret `INQUIRY_WEBHOOK_URL` | Alternative HTTPS delivery URL; treat embedded tokens as secret |

Complete Resend configuration takes priority over webhook. Without a complete
transport, response is `502 {ok:false,error:"unconfigured"}`. Delivery rejection,
network timeout (10 seconds), or limiter failure returns existing `failed` 502;
UI offers email draft. Invalid/honeypot is 400; throttled is 429 with Retry-After;
success is `{ok:true}`. GET returns 405. No credentials or message bodies are
logged or stored. `NEXT_PUBLIC_CONTACT_EMAIL` runtime fallback remains supported,
but build variables are not automatically runtime bindings: prefer
`INQUIRY_TO_EMAIL` explicitly.

Local: copy `.dev.vars.example` to ignored `.dev.vars`. Wrangler prioritizes
`.dev.vars` over `.env*`; use no delivery credentials during tests. Unit and
workerd tests always inject fake credentials and intercept every outbound
request. Browser tests intercept inquiry and PostHog. Never use real test emails.
PostHog implementation/privacy filters are unchanged: no autocapture, replay,
form values, private query strings, URL fragments or identified profiles; DNT
respected; session storage only. Public analytics values must exist at build.

## Throttling and quotas

D1 enforces at most five admitted attempts per client IP in a sliding 60-second
window. One atomic upsert filters old timestamps and admits only while count is
below five. Unlike isolate memory or eventually consistent KV, concurrent
instances share the primary write serialization. Platform-overwritten
CF-Connecting-IP is HMACed with the runtime secret; D1 stores only hash, up to
five timestamps, and expiry. An indexed delete removes expired rows on inquiry
traffic. Idle expired rows remain until the next inquiry; no long-term lead
storage. Shared NAT users share the five-attempt allowance, as with old limiter.
Missing binding/salt, D1 errors or quota exhaustion fail closed to email fallback.
Abusive blocked attempts still incur Function/D1 reads and expiry cleanup.

`out/_routes.json` intentionally includes extensionless requests and excludes
`/_next/*`, `/brand/*`, `/fonts/*`, `/video/*`, `/social/*`, and `/*.*`.
Thus CSS/JS/fonts/media, HTML aliases, RSC `.txt`, PNGs, sitemap and robots bypass
Functions. Both English **and Spanish HTML page requests** execute routing:
English needs cookie/geo/browser preference; Spanish still needs `?lang=en`,
cookie persistence and clean redirects. Bots and unknown extensionless URLs
also invoke the Function. Normal page requests consume one invocation; automatic
English-to-Spanish redirects generally consume two. Client-only language changes
on non-blog pages do not fetch another page. Legacy `/og?post=slug` and `/es/og`
invoke the Function to select an already-built PNG (200, no image generation).
New metadata points directly at `/social/{en|es}/{slug|home}.png`, which bypasses
Functions. `/api/*` never redirects for language; inquiry invokes delivery.

Expected hosting cost: **$0/month** while staying within account-wide free
quotas. Dynamic requests are not unlimited:

- Workers/Pages Functions: 100,000 requests/day shared across account, resets
  midnight UTC; Workers Free CPU allowance also applies. Static bypass requests
  are free/unlimited. A site with 20,000 page loads/day and 10,000 language
  redirect hops uses roughly 30,000 invocations plus inquiry/legacy OG/404 traffic.
- D1: 5 million rows read/day, 100,000 rows written/day, 5 GB total storage.
  Each admitted attempt writes a row and maintained indexes; deletion also
  counts as writes. Monitor actual D1 row metrics rather than equating
  submissions with billable rows. Abuse can exhaust quotas; Free stops
  operations at limits.
- Pages Free: 500 builds/month, one concurrent build, 20-minute build timeout,
  20,000 files, 25 MiB per file.

Select Pages **fail open** for quota exhaustion if continued static availability
is priority: locale auto-redirects and legacy OG compatibility stop while
exported URLs remain available. Inquiry must use email fallback. Fail closed
instead blocks page requests when allowance is exhausted. This is a deliberate
operational choice; neither option preserves all dynamic behavior past quotas.
Do not purchase an upgrade automatically. Workers Paid starts at $5/month plus usage; review current pricing before changing plans.
Domain renewal and booking service retain existing costs. [Resend Free](https://resend.com/pricing)
includes 3,000 emails/month and 100/day; webhook automation may have its own fees.
[PostHog analytics](https://posthog.com/pricing) includes 1 million events/month;
section events count toward that quota. No new paid service is required; D1 is free
within the limits above.

## Stage without affecting Vercel

1. Keep changes on a review branch outside Vercel's production auto-deploy path.
   Create a new **Pages** project via Git integration, framework preset None,
   repository root, build command `npm run build`, output `out`. Pick a project
   name, then update `name` in `wrangler.jsonc` to match. Alternatively create a
   Direct Upload project and use the CLI commands below; do not mix project types.
2. Create two free D1 databases, using a Cloudflare account already authorized
   for the site. Creation commands below create resources but do not buy plans:

   ```sh
   npx wrangler d1 create brilliant-inquiry-rate-limit
   npx wrangler d1 create brilliant-inquiry-rate-limit-preview
   ```

   Replace placeholder IDs in top-level and `env.preview.d1_databases` config
   with returned IDs. Top-level is production/local; preview is independent.
   Apply schema before enabling delivery:

   ```sh
   npx wrangler d1 migrations apply INQUIRY_RATE_LIMIT --remote
   npx wrangler d1 migrations apply INQUIRY_RATE_LIMIT --remote --env preview
   ```

3. Set build variables and preview/production runtime secrets in Pages Settings.
   Preview must initially have **no real delivery transport**; set its salt so
   throttling can be checked. Use a controlled HTTPS mock receiver for staging
   transport QA, or intercept locally. Keep production transport credentials out
   of preview. CLI secrets alternative:
   `npx wrangler pages secret put INQUIRY_RATE_SALT --project-name <project>`;
   use dashboard to ensure correct preview/production scope.
4. Build/check locally:

   ```sh
   npm ci
   npm test
   npm run build
   npm run typecheck
   node scripts/check-export-secrets.mjs
   cp .dev.vars.example .dev.vars
   npm run pages:migrate:local
   npm run pages:dev
   # Separate terminal:
   npm run verify:seo -- http://127.0.0.1:3100
   npm run test:pages
   npm run test:runtime
   npm run test:browser
   ```

   Browser suite uses installed Chrome (`channel: chrome`); install Chrome or
   adapt to an installed Playwright Chromium for CI. No real delivery occurs.
   Runtime test creates an isolated temporary D1, intercepts Resend requests,
   and verifies concurrent limits. `test:pages` defaults to localhost or takes
   origin argument. No POST with real transport is part of HTTP smoke tests.
5. Deploy a preview branch through Git, or, for Direct Upload:

   ```sh
   npx wrangler pages project create <project> --production-branch main
   npx wrangler pages deploy out --project-name <project> --branch cloudflare-staging
   ```

   Deploy `out` using Wrangler/Git, not dashboard drag-and-drop: advanced
   `_worker.js` and routing config must be deployed with the assets.
6. On returned preview URL run `verify:seo` and `test:pages` with that origin;
   run browser suite with `TEST_BASE_URL=https://<preview-host> npm run test:browser`
   only with controlled analytics/transport configuration. Confirm TLS,
   country-based routing through real Cloudflare ingress, caching headers,
   EN/ES pages and article bodies, images, footer explicit-language links,
   calculator/download, menu/Escape, booking/WhatsApp URLs, inquiry mocked
   success/failure and fallback. Preview Pages may add `X-Robots-Tag: noindex`;
   preserve production canonical URLs and do not remove preview protection.
   Actual distributed-edge geo, account quotas, sender verification and live
   PostHog ingestion require staging verification; local emulation cannot prove them.
7. Record preview URL, commit SHA, test results, D1 IDs, existing DNS records/TTLs,
   Vercel project/deployment URL and production env backup securely. Review with
   owner. No production cutover until explicit authorization.

## Production cutover — only after authorization

1. Keep Vercel running. Freeze changes, capture rollback deployment and DNS
   values; reduce relevant DNS TTL ahead of cutover if owner authorizes it.
2. Configure production salt/D1 and real delivery credentials. Verify verified
   Resend sender or intended HTTPS receiver without sending unsolicited emails.
3. Deploy tested commit as Pages production (`main` or configured production
   branch). For CLI: `npx wrangler pages deploy out --project-name <project>
   --branch main`. Confirm production pages.dev origin first.
4. In Pages > Custom domains, associate apex and any existing www hostname
   **before** creating CNAME records. For apex, Cloudflare requires the zone on
   Cloudflare nameservers; if not already there, plan zone migration separately
   and preserve all mail/MX/TXT/DNS records. For a subdomain, CNAME it to
   `<project>.pages.dev` after association. Set existing apex/www canonical
   redirect policy to preserve public host behavior; never use a blanket HTML
   cache rule that bypasses the Function or caches personalized redirects.
5. Change only approved web DNS records, wait for Pages certificate/domain Active
   and DNS propagation. Run SEO/HTTP/browser checks on production host; verify
   preview noindex header is absent on production, existing public canonical is
   correct, actual country routing and cookie overrides work, and runtime
   secrets are not present in JS. Validate delivery with an owner-approved
   controlled submission, and PostHog in the intended project.
6. Monitor Functions invocations/errors/CPU, D1 row operations, 429/502 outcomes
   and delivery-provider metrics. Retain Vercel through rollback window. Removing
   Vercel or buying an upgrade requires separate owner authorization.

## Rollback

Before DNS cutover: leave production Vercel unchanged; fix/redeploy preview.
After DNS cutover: restore captured web DNS targets to Vercel (captured
2026-11-05: apex `A 76.76.21.21`, `www CNAME cname.vercel-dns.com`; remove the
Pages custom domains first) and verify its
retained deployment and TLS. If deploying this branch triggered Vercel, restore
the captured previous deployment first. Keep inquiry secrets configured on the
old deployment. Existing language cookie and public URLs remain compatible.
Within Pages, redeploy last known-good artifact or use dashboard rollback; D1
schema is additive and independent of content, so no destructive rollback is
needed. Never drop D1 or rotate its salt during an incident unless required:
rotation resets rate-limit identities. Keep both platforms until stable.

## Verified documentation

Implementation follows current primary docs checked 2026-10-29:

- [Next static export](https://nextjs.org/docs/app/guides/static-exports):
  build-time Server Components, static params, no request APIs or middleware.
- [Pages advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/),
  [routing](https://developers.cloudflare.com/pages/functions/routing/),
  [Wrangler config](https://developers.cloudflare.com/pages/functions/wrangler-configuration/),
  [D1 bindings](https://developers.cloudflare.com/pages/functions/bindings/#d1-databases).
- [Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/),
  [Pages limits](https://developers.cloudflare.com/pages/platform/limits/),
  [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/),
  [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/),
  [serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).
- [Workers rate-limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
  is approximate and location-local; Pages config does not expose it. D1 was
  chosen for a Pages-supported shared atomic limiter without a separate Worker.
