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

- `NEXT_PUBLIC_CONTACT_EMAIL`: the monitored business mailbox. The existing
  `hello@brilliant.ai` address is the default; confirm ownership and delivery
  before publishing.
- `NEXT_PUBLIC_SITE_URL`: your production website origin, used for social preview
  URLs. Vercel production domains are detected automatically when this is unset.
- `NEXT_PUBLIC_BOOKING_URL`: optional HTTPS scheduling URL. With no booking URL,
  calls to action scroll to the inquiry form. Public environment variables are
  included at build time, so rebuild after changing them.

The contact form validates required fields and opens a **draft in the visitor’s
email application**. The visitor sends that email. This site does not claim the
message has been delivered, collect leads in a database, or offer a simulated
newsletter subscription. Contact form copy makes the email behavior explicit.

A native CRM submission or hosted scheduling integration requires your actual
provider configuration. No credentials are required for the current email flow.

## Page behavior

- Finance/healthcare tabs each offer three selectable workflow examples, including
  their trigger, example tools, deliverable, and human approval point. Arrow keys,
  Home, and End switch industries; workflow buttons expose their selected state.
- “Discuss this workflow” carries the chosen example into the contact form without
  navigation, network requests, or browser storage. Existing name, email, and notes
  remain intact. Visitors can clear the selection or change industry; the email
  draft includes the chosen workflow. Additional notes are optional with a selection.
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
- `app/globals.css`: colors, typography, layout, and responsive styles.
- `components/sections`: page sections and interactive components.
- `components/ui/Icon.tsx`: shared icons and brand mark.
- `lib/site.ts`: contact settings, public URL, and navigation.
- `lib/seo.ts`: metadata, hreflang, and JSON-LD.
- `app/sitemap.ts` / `app/robots.ts`: crawl files.
- `lib/roi.ts`: calculator mathematics, formatting, and export labels.
- `public/fonts`: locally served Manrope fonts and their OFL license.

## Before publishing

Verify the contact mailbox, set the scheduling URL if desired, and check the
inquiry flow on a device with an email application. Confirm that service and
privacy descriptions match your operating practices and hosting provider.
Tool names represent potential integrations, not client endorsements. Workflow
examples use illustrative data; no testimonials, performance claims, or
compliance certifications are invented.

### English and Mexican Spanish

English is served at `/` (United States and Canada). Mexican Spanish is served at `/es`
(Mexico). `/privacy` and `/es/privacy` follow the same split. The sitemap and `hreflang`
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
