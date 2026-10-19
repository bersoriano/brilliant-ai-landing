# Brilliant AI

A responsive landing page for AI automation services in finance and healthcare.
Built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4. Fonts are served
locally; the page does not depend on third-party image or font requests.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To verify and serve the production build:

```sh
npm run typecheck
npm run build
npm start
```

## Contact configuration

Copy `.env.example` to `.env.local`, then configure:

- `NEXT_PUBLIC_CONTACT_EMAIL`: the monitored business mailbox. The
  `hello@brilliant.dev` address is the default; confirm ownership and delivery
  before publishing.
- `NEXT_PUBLIC_SITE_URL`: your production website origin, used for social preview
  URLs. Defaults to `https://brilliant.dev` in production when unset.
Booking CTAs use the Haab Calendar URL in `lib/site.ts`.

## PostHog analytics

Set `NEXT_PUBLIC_POSTHOG_KEY` to your **public project token**, and
`NEXT_PUBLIC_POSTHOG_HOST` to `https://us.i.posthog.com` (US) or
`https://eu.i.posthog.com` (EU). Never use a personal API key. Add these values to
your deployment's environment and rebuild: Next.js embeds public variables at
build time. Without a token, no PostHog requests or tracking listeners start.
Development stays disabled unless `NEXT_PUBLIC_POSTHOG_DEBUG=true`; use a test
project when checking locally. Setup follows the
[PostHog Next.js integration](https://posthog.com/docs/libraries/next-js).

All events include `page_path`, `page_type` (`landing`, `blog_index`,
`blog_post`, or `supporting`), and `locale` (`en` or `es`). Article events also
include `blog_slug`, which groups translations of the same post.

| Event | What it measures | Extra properties |
| --- | --- | --- |
| `$pageview` | Initial load and route/language changes; anchor jumps do not add views | `traffic_source`, `referring_domain`, `utm_source`, `utm_medium`, `utm_campaign` when present |
| `section_viewed` | First time at least 25% of the section or viewport, whichever is smaller, is visible per page visit | `section_id` (existing section/service ID, `blog-list`, or indexed `blog-heading-*`) |
| `blog_read_progress` | Article body reaches viewport at 25%, 50%, 75%, 100%; each once per page visit | `percent` |
| `blog_link_clicked` | Internal links to blog index or articles, including homepage teaser and notes | `source_section`, `destination_path`, `destination_slug` for articles |
| `cta_clicked` | Scheduling, business email, WhatsApp, and links to inquiry form | `source_section`, `cta_type` (`booking`, `email`, `whatsapp`, `inquiry`) |
| `inquiry_submitted` | Validated form begins sending | No form values |
| `inquiry_succeeded` | Inquiry endpoint confirms delivery | No form values |
| `inquiry_failed` | Delivery fails and email fallback appears | No form values |

`initial_traffic_source`, `initial_referring_domain`, and available
`initial_utm_*` tags persist as event properties within the tab. `$direct` means
no referrer was available; `$internal` means a link from this website. Referrer
policies, browser restrictions, and blockers can limit attribution and delivery.
Random anonymous identity lives in session storage, not an analytics cookie;
new tabs or sessions can count the same person again. This measures visits and
engagement, not precise cross-session unique people. Reading progress records
how much content reached the viewport, not proof that someone read it.

Suggested PostHog insights:

- Traffic: count `$pageview`, break down by `initial_traffic_source`,
  `initial_utm_campaign`, `locale`, or `page_path`.
- Landing engagement: unique sessions with `section_viewed`, break down by
  `section_id`, filter `page_type=landing`.
- CTA use: count `cta_clicked`, break down by `source_section` and `cta_type`.
- Blog engagement: `blog_read_progress`, filter `percent=100`, break down by
  `blog_slug`; compare with blog `$pageview` and booking `cta_clicked`.
- Inquiry funnel: `inquiry_submitted` → `inquiry_succeeded`; monitor
  `inquiry_failed` separately. A booking click measures intent; completed
  appointments require a separate scheduling-provider integration.

Form contents, calculator values, mail draft bodies, URL query strings, and
fragments are excluded from analytics. Only the three explicit UTM tags above
are kept. Autocapture, session replay, heatmaps, surveys, exception capture, and
performance capture are disabled; no identified person profiles are created.
Browser Do Not Track is respected. The English and Spanish privacy notices
describe this behavior.

To verify, configure a test project, enable the development flag, restart, then
open `/?utm_source=qa&utm_medium=test&utm_campaign=analytics` and inspect
PostHog's live events. Scroll through services, use a booking CTA, open a blog
post, scroll its body, and switch languages. Check one page view per navigation,
one event per section/milestone per visit, correct source sections, and no form
values or private query parameters. Test inquiry success and failure only with
your intended delivery transport or an intercepted local response.

The contact form validates required fields and opens a **draft in the visitor’s
email application**. The visitor sends that email. This site does not claim the
message has been delivered, collect leads in a database, or offer a simulated
newsletter subscription. Contact form copy makes the email behavior explicit.

A native CRM submission or hosted scheduling integration requires your actual
provider configuration. No credentials are required for the current email flow.

## Page behavior

- Finance and healthcare tabs each offer three selectable
  workflow examples, including their trigger, example tools, deliverable, and
  human approval point. Arrow keys, Home, and End switch industries; workflow
  buttons expose their selected state.
- Finance and healthcare service pages expand those examples with their trigger,
  deliverable, and approval point. Homepage, footer, and sitemap link to both.
- The ROI calculator updates locally, explains its assumptions, and downloads a
  plain-text breakdown without collecting an email address. Values describe
  reclaimed capacity, not cash savings. Implementation and operating costs are
  excluded; examples are not promises or client results.
- FAQs use native disclosure controls. Mobile navigation supports Escape and
  returns focus to the toggle. Anchor links account for the sticky header.
- Focus indicators, a skip link, and reduced-motion preferences are supported.
- `/privacy` explains the actual site behavior. A favicon, social preview
  image, robots.txt, sitemap, hreflang tags, and structured data are included.
  English targets the United States and Canada; Mexican Spanish targets Mexico
  at `/es`.

## Structure

- `app/page.tsx`: page composition.
- `app/globals.css`: B5 "Ink" design tokens, type classes, and shared primitives (buttons, chips, exhibits, forms).
- `components/sections`: page sections and interactive components, each with a co-located `*.module.css` for its layout.
- `components/ui`: primitives (`Kicker`, `Exhibit`, `RichTemplate`, `DocumentScene`, `CapacityWeek`, `AgentPlays`, `Reveal`, and the motion hooks in `motion.ts`) plus `Icon.tsx` (icons and the wordmark).
- `lib/scenes.ts`: illustrative document scenes (what arrives → what the team receives) for each finance and healthcare workflow.
- `app/security`, `app/about`: the trust page and the background page (prior employers, hedged).
- `app/finance-automation`, `app/healthcare-automation`: focused service pages.
- `lib/fonts.ts`: Bodoni Moda (display), Geist (UI), and Geist Mono (labels), all served locally.
- `lib/site.ts`: CTA labels, contact settings (email, WhatsApp, domain), public URL, and navigation.
- `lib/seo.ts`: metadata, hreflang, and JSON-LD.
- `app/sitemap.ts` / `app/robots.ts`: crawl files.
- `lib/roi.ts`: calculator mathematics, formatting, and export labels.
- `public/fonts`: locally served Bodoni Moda and Geist fonts with their OFL licenses; `public/fonts/og` holds static cuts for the Open Graph image.

## Before publishing

Verify the contact mailbox, confirm the Haab Calendar booking URL, and check the
inquiry flow on a device with an email application. Confirm that service and
privacy descriptions match your operating practices and hosting provider.
Tool names represent potential integrations, not client endorsements. Workflow
examples use illustrative data; no testimonials, performance claims, or
compliance certifications are invented.

### English and Mexican Spanish

English is served at `/` (United States and Canada). Mexican Spanish is served at `/es`
(Mexico). Service and supporting pages follow the same split. The sitemap and `hreflang`
tags advertise `en-US`, `en-CA`, `es-MX`, and `x-default`. Search-engine crawlers receive
the URL they request and are not redirected by language or location.

The header includes an EN / ES switch. Manual selection updates the page immediately,
preserves calculator/form state, changes the URL to `/` or `/es`, and saves
`brilliant-language=en|es` in a first-party cookie for one year (Path=/, SameSite=Lax,
Secure on HTTPS). Footer English / Español links use `?lang=en|es`, which sets the cookie
and redirects to the clean language URL. Clearing the cookie restores automatic detection
for human visitors. With cookies blocked, selection lasts for the current page session.

For human visitors on an English URL, the first matching signal chooses Spanish:
1. Valid saved language cookie.
2. A trusted country code for Spanish-speaking Latin America and the Caribbean,
   including Mexico. The United States, Canada, and Brazil stay on English.
3. The highest-priority supported English/Spanish browser language from Accept-Language
   (quality values honored; q=0 ignored).
4. English fallback.

On Vercel, country detection uses `x-vercel-ip-country`. Other deployments can configure
`GEO_COUNTRY_HEADER` as `cf-ipcountry`, `cloudfront-viewer-country`, or
`x-vercel-ip-country` only behind a trusted ingress that overwrites it. Without such
configuration, location headers are ignored. No external IP lookup or location prompt
is used. Local development uses browser language unless a trusted header is configured.
Do not publicly cache locale-dependent HTML across visitors; Next renders these routes
dynamically using request headers/cookies.

Mexican Spanish covers page copy, workflow examples, accessibility labels, privacy,
metadata, calculator exports, and prepared email drafts. Company/product names and
visitor-entered text remain unchanged. Currency stays USD; language does not convert amounts.
