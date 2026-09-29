# Brilliant AI: notes for Claude

Next.js 15 (App Router), React 19, TypeScript, Tailwind 4 (imported, but styling is plain CSS). The site ships in English (`/`) and Mexican Spanish (`/es`).

## Rules
- **Copy goes through `t()`** (`useLanguage`). English source strings are the keys in `lib/es-MX.json`. Every new literal `t("…")` needs a Spanish entry, or `npm test` fails.
- **CTA labels come from constants:** `PRIMARY_CTA` / `ONSITE_CTA` in `lib/site.ts`. Never reword them inline.
- **Honesty:**
  - Workflows are examples; tool names are potential integrations.
  - The case study renders only via `shouldRenderCaseStudy`.
  - The ROI is capacity-first (see `lib/roi.ts`).
  - Never invent stats, clients or certifications.
- **Design system (B5 "Ink"):**
  - Tokens, type classes and primitives live in `app/globals.css`; section layout goes in co-located `*.module.css`.
  - Fonts are local via `lib/fonts.ts`; don't add third-party font or image requests.
  - Radius 0, one teal accent, no gradients or shadows.
  - Spec: `docs/redesign/B5-SPEC.md`.
- **Keep a11y behavior:** tab keyboard handling, `aria-pressed` / `aria-selected`, native `<details>`, skip link, focus return in the mobile nav.

## Commands
`npm run typecheck` · `npm test` · `npm run build` · `npm run dev`
