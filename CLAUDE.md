# Brilliant AI: notes for Claude

Next.js 15 (App Router), React 19, TypeScript, Tailwind 4 (imported, but styling is plain CSS). The site ships in English (`/`) and Mexican Spanish (`/es`).

## Rules
- **Copy goes through `t()`** (`useLanguage`). English source strings are the keys in `lib/es-MX.json`. Every new literal `t("…")` needs a Spanish entry, or `npm test` fails.
- **CTA labels come from constants:** `PRIMARY_CTA`, `NAV_CTA` (short form), `ONSITE_CTA`, `WHATSAPP_CTA` in `lib/site.ts`. Never reword them inline.
- **Audience:** the homepage speaks to finance and healthcare only (`HOMEPAGE_INDUSTRIES`). Operations/sales stay in the data and reach the form as "Other".
- **Mexican Spanish uses *usted*** (and "ustedes" when the visitor addresses us). A test rejects *tú* forms in `lib/es-MX.json`. Use Mexican nouns: CFDI, OC, RFC, preautorización, aseguradora, iguala.
- **Honesty:**
  - Workflows are examples; tool names are potential integrations.
  - The case study renders only via `shouldRenderCaseStudy`.
  - The ROI is capacity-first (see `lib/roi.ts`).
  - Never invent stats, clients or certifications. Security copy describes a process the client controls (`/security`); it never claims SOC 2, HIPAA attestation, or CFDI/MXN invoicing.
  - Employer names (BCG, BofA, Banorte, BNY Mellon, Accenture, IBM) live only on `/about` with the "not clients" hedge; a test keeps them off the homepage.
  - Document scenes (`lib/scenes.ts`) are illustrative: invented names and numbers, labelled as such.
- **Design system (B5 "Ink"):**
  - Tokens, type classes and primitives live in `app/globals.css`; section layout goes in co-located `*.module.css`.
  - Fonts are local via `lib/fonts.ts`; don't add third-party font or image requests.
  - Radius 0, one teal accent, no gradients or shadows.
  - Light sections use `.band-paper` (redefines the tokens; every pair ≥ 4.5:1). Keep navy for hero, calculator and close.
  - Spec: `docs/redesign/B5-SPEC.md`.
- **Keep a11y behavior:** tab keyboard handling, `aria-pressed` / `aria-selected`, native `<details>`, skip link, focus return in the mobile nav.

## Commands
`npm run typecheck` · `npm test` · `npm run build` · `npm run dev`
