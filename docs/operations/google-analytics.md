# Google Analytics 4

GA4 property for brilliant.dev, Measurement ID **`G-3BCEW8MTNM`**. Code
follows the landing-page-ga skill's shared baseline, so the module, event
names and privacy rules match the other landing pages.

## Where things live

| What | Where |
| --- | --- |
| Measurement ID | `wrangler.jsonc` top-level `vars.NEXT_PUBLIC_GA_ID` (production builds only). Pages copies it into the production environment, and the build inlines it. Mechanism and evidence: [CLOUDFLARE.md → How the build receives `NEXT_PUBLIC_*`](../deployment/CLOUDFLARE.md#how-the-build-receives-next_public_-checked-2026-11-15) |
| Pure helpers, taxonomy (`ANALYTICS_EVENTS`, `CtaType`) | `lib/analytics.ts` |
| `createAnalytics`, GA destination, `track()` / `trackPageView()` | `lib/analytics.client.ts` |
| PostHog destination (unchanged privacy settings) | `lib/analytics.posthog.ts` |
| Start-up | `instrumentation-client.ts` → `initAnalytics()`, before hydration, no inline script |
| Page views, sections, read progress, CTA clicks | `components/analytics/PageAnalytics.tsx` (root layout) |
| Inquiry form events | `components/sections/FinalCta.tsx` |
| Tests | `tests/analytics.test.cjs` (the skill's contract cases plus this site's) |

Components call only `track()`; never `gtag()` or `posthog.capture()`.

## Gates (all must pass, or nothing loads)

1. Host is `NEXT_PUBLIC_SITE_URL`'s hostname (`brilliant.dev`). Previews,
   `*.brilliant-ai.pages.dev` and localhost send nothing, unless
   `NEXT_PUBLIC_GA_DEBUG=true` (then with `debug_mode`, for DebugView; the flag
   is ignored on the production host).
2. No Do Not Track and no Global Privacy Control in the browser (GPC since
   2026-11-15; both tools).
3. A valid `G-…` ID was present at build time.

Privacy baseline: settings queued with `gtag('set')` before `js`;
`send_page_view: false` (one manual `page_view` per route, page fields re-`set`
on each so automatic `user_engagement` hits carry the current page); addresses
keep only `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`,
`utm_content`; external referrers reduced to their origin; Google signals and
ad personalization off; `_ga` cookies about 13 months. No secret URLs exist on
this site, so `isTrackablePath` is not configured.

**Consent Mode:** not used. The site targets Mexico and the US, not the
EEA/UK; revisit before any campaign aimed there.

## Events

| Event | Fires when | Parameters |
| --- | --- | --- |
| `page_view` | Each route (initial load included), from `PageAnalytics` | `page_type` (`landing`, `blog_index`, `blog_post`, `supporting`), `locale` (`en`, `es`), `blog_slug` on posts |
| `section_view` | Section ≥25% of itself or the viewport visible, once per page view | `section_id` |
| `read_progress` | Blog body reaches 25/50/75/100% | `percent`, `content_type: "article"` |
| `cta_click` | Booking (Haab Calendar), WhatsApp, business email, or a `#contact` link; beacon transport | `cta_type` (`booking`, `whatsapp`, `email`, `form`), `cta_location`, `link_domain` (outbound) |
| `form_submit` | Valid inquiry starts sending | `form_name: "contact"` |
| `generate_lead` | `/api/inquiry` returned 2xx | `form_name: "contact"` |
| `form_error` | Delivery failed (email fallback shown) | `form_name`, `error_type` (`validation` 4xx, `rate_limited` 429, `server` 5xx, `network`) |

Every event also carries `page_location`, `page_referrer` and `page_title`.
`cta_location` is the nearest `data-cta-location` (`sticky_cta`), `blog_body`,
`data-analytics-section`, section or article `id`, then `header`/`footer`/`nav`.
CTAs are found from the link address (`linkProperties`); a `data-cta="<type>"`
attribute also works for anything that is not a recognizable link.

## Rename on 2026-11-15

Events before this date used the site's own names. Reports and PostHog
insights spanning the date need both names.

| Before | From 2026-11-15 |
| --- | --- |
| `section_viewed` | `section_view` |
| `blog_read_progress` | `read_progress` + `content_type: "article"` |
| `cta_clicked` (`source_section`, `cta_type` `inquiry`) | `cta_click` (`cta_location`, `cta_type` `form`) |
| `inquiry_submitted` | `form_submit` |
| `inquiry_succeeded` | `generate_lead` |
| `inquiry_failed` | `form_error` + `error_type` |
| `blog_link_clicked` | dropped (no insight used it; the next `page_view` has the previous page as referrer) |

Same day: GPC honored; campaign tags widened from three to five (`utm_term`,
`utm_content`), to match the other sites and GA's manual term / ad content
dimensions. These are set by whoever builds the link, so never put merge tags
or personal data in them.

## GA Admin (manual, Editor access)

- [ ] Enhanced measurement **OFF** (Admin → Data streams → web stream). Required: its events read the raw URL and double-count page views.
- [ ] Data retention 14 months.
- [ ] Developer traffic filter **Active** (Admin → Data filters).
- [ ] Unwanted referrals: `haabcalendar.com`.
- [ ] Custom dimensions (event scope): `page_type`, `locale`, `blog_slug`, `cta_type`, `cta_location`, `link_domain`, `form_name`, `error_type`, `section_id`, `content_type`. Optional custom metric: `percent`.
- [ ] Key event: `generate_lead`.
- [ ] Derived event `book_review` (event_name = `cta_click` AND `cta_type` = `booking`), marked as a key event.
- [ ] Google signals stays off.

## Verify

```sh
npm test && npm run build
grep -rl "G-3BCEW8MTNM" out/_next/static | head       # build carries the ID
bash ~/.claude/skills/landing-page-ga/scripts/audit.sh . --live https://brilliant.dev
```

After a deploy, open
`https://brilliant.dev/?utm_source=qa&utm_medium=test&utm_campaign=ga&gclid=x&email=a`
in a clean profile with DevTools filtered by `collect`: one `en=page_view`, `dl`
keeping only the three `utm_*`, `npa=1`, no `_dbg`. Navigate once: one more
`page_view` with the previous page as `dr`. Or use Tag Assistant on the live
URL. With DNT or GPC on, there must be no `gtag/js` request.
