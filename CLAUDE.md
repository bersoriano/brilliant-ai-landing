# Brilliant AI: notes for Claude

Next.js 15 (App Router), React 19, TypeScript, Tailwind 4 (imported, but styling is plain CSS). The site ships in English (`/`) and Mexican Spanish (`/es`).

## Rules
- **Copy goes through `t()`** (`useLanguage`). English source strings are the keys in `lib/es-MX.json`. Every new literal `t("…")` needs a Spanish entry, or `npm test` fails.
- **CTA labels come from constants:** `PRIMARY_CTA`, `NAV_CTA` (short form), `ONSITE_CTA`, `CRM_CTA`, `WHATSAPP_CTA` in `lib/site.ts`. Never reword them inline.
- **Audience:** the homepage speaks to finance and healthcare only (`HOMEPAGE_INDUSTRIES`). Operations/sales stay in the data and reach the form as "Other".
- **Positioning: operator, not consultancy.** Authority comes from how the work runs (exceptions, approvals, measurement), not from advisory language. No "AI strategy", roadmaps, transformation programs, change management or readiness/maturity framing, and never describe Brilliant as a consultancy ("consulting arm", "consultoría") (`CONSULTANCY_PHRASES` in `lib/insights.ts`; a test enforces it in homepage copy, the dictionary and posts). No team bios or credential lists. Authority content links back to the 20-minute review, never competes with it.
- **Notes linked from the homepage** ("What we've learned", the calculator, Trust) and the finance/healthcare pages are registered in `INSIGHTS` (`lib/insights.ts`); a test keeps each one published in both languages.
- **Mexican Spanish uses *tú*** with the visitor ("ustedes" when the visitor addresses us: "Ayúdennos"). A test rejects *usted* and Spain-only forms in `lib/es-MX.json`. Use Mexican nouns: CFDI, OC, RFC, preautorización, aseguradora, iguala, junta.
- **Currency follows the language:** USD in English, MXN in Spanish (no FX conversion; editable defaults per currency).
- **Honesty:**
  - Workflows are examples; tool names are potential integrations.
  - The case study renders only via `shouldRenderCaseStudy`.
  - The ROI is capacity-first (see `lib/roi.ts`).
  - Never invent stats, clients or certifications. Security copy describes a process the client controls (`/security`); it never claims SOC 2, HIPAA attestation, or CFDI/MXN invoicing.
  - Employer names (BCG, BofA, Merrill Lynch, Banorte, BNY Mellon, Accenture, IBM) live only on `/about` with the "not clients" hedge; a test keeps them off the homepage.
  - Document scenes (`lib/scenes.ts`) are illustrative: invented names and numbers, labelled "Sample data" in the exhibit header.
  - The custom CRM offer (homepage `#crm`, the `/custom-crm` landing, data in `lib/crm.ts`) is white-label: the site says "open-source foundation" and never names the project, here or anywhere in this public repo (a test enforces it). List only features that foundation ships. The base-plan price lives in `CRM_PRICE`, set per currency (no FX conversion).
- **Blog posts** are MDX in `content/posts/<slug>/en.mdx` + `es.mdx` (both required, same `date` and `draft`). Frontmatter: `title`, `description`, `date` (YYYY-MM-DD), optional `updated`, `draft`. Drafts render in dev only. Start the body with a paragraph (the page renders the `h1`); images go in `public/blog/<slug>/`, never remote. `npm test` compiles every post and applies the honesty and *tú* rules to it. Reader: `lib/posts.server.ts`; pages: `app/blog/`. Linked from the nav, the footer, and the homepage `#blog` section (`homepageTeaser`: latest 3 that aren't `INSIGHTS` notes or the CRM post; hidden when empty). `/custom-crm` and the homepage `#crm` link to `CRM_POST_SLUG` (`lib/crm.ts`); a test keeps that post published. Draft new posts with `/new-post <topic>` (`.claude/commands/new-post.md`).
- **Design system (B5 "Ink"):**
  - Tokens, type classes and primitives live in `app/globals.css`; section layout goes in co-located `*.module.css`.
  - Fonts are local via `lib/fonts.ts`; don't add third-party font or image requests.
  - Radius 0, one teal accent, no gradients or shadows.
  - Legibility: Bodoni is pinned to its text optical size (`"opsz" 11` on `html`) and headings use weight 600; its display sizes have hairlines that vanish on navy. Don't re-enable `font-optical-sizing: auto` or `-webkit-font-smoothing: antialiased`.
  - Light sections use `.band-paper` (redefines the tokens; every pair ≥ 4.5:1). Keep navy for hero, calculator and close.
  - Exhibits are live demos (see "Live exhibits" in `docs/conversion/NOTES.md`): they end with a `.control` line ("Stays with you", sand = needs a person), and motion only comes from `useFirstView`/`Reveal`, which show the final state under reduced motion.
  - Spec: `docs/redesign/B5-SPEC.md`.
- **Keep a11y behavior:** tab keyboard handling, `aria-pressed` / `aria-selected`, native `<details>`, skip link, focus return in the mobile nav.

## Commands
`npm run typecheck` · `npm test` · `npm run build` · `npm run dev`
