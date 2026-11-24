# Brilliant AI

A responsive landing page for AI automation services in finance and healthcare.
Built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4. Fonts are served
locally; the page does not depend on third-party image or font requests.

Production target: statically exported Next.js on Cloudflare Pages. English and
Spanish HTML, repository MDX, and social PNGs are built before deployment.
Language routing and inquiry delivery are minimal Pages Functions.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To verify and serve the production build:

```sh
npm run build
npm run typecheck
npm run pages:migrate:local
cp .dev.vars.example .dev.vars
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

## Analytics (PostHog and Google Analytics 4)

Both tools receive the same events through one capture path, `track()` in
`lib/analytics.client.ts` (GA4 built in, PostHog in `lib/analytics.posthog.ts`).
Event names follow the shared landing-page taxonomy; the full list, GA setup and
the 2026-11-15 rename are in [docs/operations/google-analytics.md](docs/operations/google-analytics.md).

Set `NEXT_PUBLIC_POSTHOG_KEY` to your **public project token**, and
`NEXT_PUBLIC_POSTHOG_HOST` to `https://us.i.posthog.com` (US) or
`https://eu.i.posthog.com` (EU). Never use a personal API key. Set
`NEXT_PUBLIC_GA_ID` to the GA4 Measurement ID. Next.js embeds public variables at
build time, so add them where the build reads them and rebuild. Without a token
or ID, that tool sends nothing. Both run only on the `NEXT_PUBLIC_SITE_URL` host;
`NEXT_PUBLIC_POSTHOG_DEBUG=true` / `NEXT_PUBLIC_GA_DEBUG=true` let localhost or a
preview send to a test project (PostHog) or DebugView (GA). Setup follows the
[PostHog Next.js integration](https://posthog.com/docs/libraries/next-js).

PostHog events include `page_path`, `page_type` (`landing`, `blog_index`,
`blog_post`, or `supporting`), and `locale` (`en` or `es`). Article events also
include `blog_slug`, which groups translations of the same post. In GA those
three fields travel on `page_view`; every GA event carries the clean page address.

| Event (PostHog / GA) | What it measures | Extra properties |
| --- | --- | --- |
| `$pageview` / `page_view` | Initial load and route/language changes; anchor jumps do not add views | PostHog only: `traffic_source`, `referring_domain`, `utm_*` when present |
| `section_view` | First time at least 25% of the section or viewport, whichever is smaller, is visible per page visit | `section_id` (existing section/service ID, `blog-list`, or indexed `blog-heading-*`) |
| `read_progress` | Article body reaches viewport at 25%, 50%, 75%, 100%; each once per page visit | `percent`, `content_type` (`article`) |
| `cta_click` | Scheduling, business email, WhatsApp, and links to the inquiry form | `cta_type` (`booking`, `email`, `whatsapp`, `form`), `cta_location`, `link_domain` (outbound) |
| `form_submit` | Validated inquiry begins sending | `form_name` (`contact`); no form values |
| `generate_lead` | Inquiry endpoint confirms delivery | `form_name` |
| `form_error` | Delivery fails and email fallback appears | `form_name`, `error_type` (`validation`, `rate_limited`, `server`, `network`) |

Until 2026-11-15 these were `section_viewed`, `blog_read_progress`,
`cta_clicked` (`source_section`, `cta_type` `inquiry`), `inquiry_submitted`,
`inquiry_succeeded`, `inquiry_failed` and `blog_link_clicked` (dropped: the next
page view shows where a visitor came from). Insights over a range that spans the
switch need both names.

`initial_traffic_source`, `initial_referring_domain`, and available
`initial_utm_*` tags persist as event properties within the tab. `$direct` means
no referrer was available; `$internal` means a link from this website. Referrer
policies, browser restrictions, and blockers can limit attribution and delivery.
Random anonymous identity lives in session storage, not an analytics cookie;
new tabs or sessions can count the same person again. This measures visits and
engagement, not precise cross-session unique people. Reading progress records
how much content reached the viewport, not proof that someone read it.
Click events send immediately through the browser's beacon transport so
leaving a page does not leave the click waiting for the next batch flush.

Suggested PostHog insights:

- Traffic: count `$pageview`, break down by `initial_traffic_source`,
  `initial_utm_campaign`, `locale`, or `page_path`.
- Landing engagement: unique sessions with `section_view`, break down by
  `section_id`, filter `page_type=landing`.
- CTA use: count `cta_click`, break down by `cta_location` and `cta_type`.
- Blog engagement: `read_progress`, filter `percent=100`, break down by
  `blog_slug`; compare with blog `$pageview` and `cta_click` with `cta_type=booking`.
- Inquiry funnel: `form_submit` → `generate_lead`; monitor `form_error`
  separately, broken down by `error_type`. A booking click measures intent;
  completed appointments require a separate scheduling-provider integration.

Form contents, calculator values, mail draft bodies, URL query strings, and
fragments are excluded from analytics. Only the five campaign tags (`utm_source`,
`utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) are kept, so never put
merge tags or personal data in campaign links. Autocapture, session replay,
heatmaps, surveys, exception capture, and performance capture are disabled; no
identified person profiles are created. Browser Do Not Track and Global Privacy
Control are respected: neither tool starts. The English and Spanish privacy
notices describe this behavior.

To verify, configure a test project, enable the development flag, restart, then
open `/?utm_source=qa&utm_medium=test&utm_campaign=analytics` and inspect
PostHog's live events. Scroll through services, use a booking CTA, open a blog
post, scroll its body, and switch languages. Check one page view per navigation,
one event per section/milestone per visit, correct CTA locations, and no form
values or private query parameters. Test inquiry success and failure only with
your intended delivery transport or an intercepted local response.

The contact form submits to `/api/inquiry`, a Cloudflare Pages Function. It
validates inputs and delivers through Resend or an HTTPS webhook. If delivery
fails or runtime configuration is missing, the visitor can open an email draft.
Secrets remain in Pages runtime bindings; no submissions are stored. A D1
binding stores only HMACed client identifiers and five attempt timestamps for
a shared sliding-minute throttle. See the [migration runbook](docs/deployment/CLOUDFLARE.md).

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
tags advertise `en-US`, `en-CA`, `es-MX`, and `x-default`. The URL determines the
language for every request.

The header and footer link to each version of the current page. The switch
highlights a different preferred language using a saved choice or the browser’s
first supported language. Selecting a language with JavaScript saves the choice
in `brilliant-language=en|es` for one year and preserves query and fragment when
navigating. The calculator and form keep their state on in-place switches.
Existing `?lang=en|es` URLs still set the cookie and redirect to the clean path.
See [routing details](docs/i18n/MIDDLEWARE.md) and
[deployment/cost runbook](docs/deployment/CLOUDFLARE.md).

Mexican Spanish covers page copy, workflow examples, accessibility labels, privacy,
metadata, calculator exports, and prepared email drafts. Company/product names and
visitor-entered text remain unchanged. Calculator currency follows language (USD/MXN) and reseeds monetary defaults;
people/hours and entered form text survive switching. No exchange-rate conversion.
