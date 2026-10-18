# Brilliant AI: notes for Claude

Next.js 15 (App Router), React 19, TypeScript, Tailwind 4 (imported, but styling is plain CSS). The site ships in English (`/`) and Mexican Spanish (`/es`).

## Rules
- **Copy goes through `t()`** (`useLanguage`). English source strings are the keys in `lib/es-MX.json`. Every new literal `t("…")` needs a Spanish entry, or `npm test` fails.
- **CTA labels come from constants:** `PRIMARY_CTA`, `NAV_CTA` (short form), `ONSITE_CTA`, `CRM_CTA`, `WHATSAPP_CTA` in `lib/site.ts`. Never reword them inline.
- **Audience:** the homepage speaks to finance and healthcare only (`HOMEPAGE_INDUSTRIES`). Operations/sales stay in the data and reach the form as "Other".
- **Services** (`#services`, `components/sections/Services.tsx`, data in `lib/services.ts`): four offers as one set after the calculator: workflows and agents for the repetitive work, the CRM (`#crm`) for clients and pipeline, the ERP (`#erp`) for the rest of the operations. Every block keeps approvals with a named person; the section closes on `PRIMARY_CTA`. Business terms only: a test rejects build-stack and technical names (open-source, model plumbing, the foundations underneath) in its copy, English and Spanish.
- **Positioning: operator, not consultancy.** Authority comes from how the work runs (exceptions, approvals, measurement), not from advisory language. No "AI strategy", roadmaps, transformation programs, change management or readiness/maturity framing, and never describe Brilliant as a consultancy ("consulting arm", "consultoría") (`CONSULTANCY_PHRASES` in `lib/insights.ts`; a test enforces it in homepage copy, the dictionary and posts). No team bios or credential lists. Authority content links back to the 20-minute review, never competes with it. **Link, don't lecture:** the homepage shows a rule in one line and links the note that explains it; no explanatory paragraphs on the homepage (a test keeps "What we've learned" to three one-line rules, each linking a note).
- **Notes linked from the homepage** ("What we've learned", the calculator) and the finance/healthcare pages are registered in `INSIGHTS` (`lib/insights.ts`); a test keeps each one published in both languages.
- **Mexican Spanish uses *tú*** with the visitor ("ustedes" when the visitor addresses us: "Ayúdennos"). A test rejects *usted* and Spain-only forms in `lib/es-MX.json`. Use Mexican nouns: CFDI, OC, RFC, preautorización, aseguradora, iguala, junta.
- **Currency follows the language:** USD in English, MXN in Spanish (no FX conversion; editable defaults per currency).
- **Honesty:**
  - Workflows are examples; tool names are potential integrations.
  - The case study renders only via `shouldRenderCaseStudy`.
  - The ROI is capacity-first (see `lib/roi.ts`).
  - Never invent stats, clients or certifications. Security copy describes a process the client controls (`/security`); it never claims SOC 2, HIPAA attestation, or CFDI/MXN invoicing.
  - Employer names (BCG, BofA, Merrill Lynch, Banorte, BNY Mellon, Accenture, IBM) live only on `/about` with the "not clients" hedge; a test keeps them off the homepage.
  - Document scenes (`lib/scenes.ts`) are illustrative: invented names and numbers, labelled "Sample data" in the exhibit header.
  - The custom CRM offer (homepage `#crm`, the `/custom-crm` landing, data in `lib/crm.ts`) is white-label: `/custom-crm` says "open-source foundation" (the homepage doesn't) and never names the project, here or anywhere in this public repo (a test enforces it). List only features that foundation ships. The base-plan price lives in `CRM_PRICE`, set per currency (no FX conversion).
  - The custom ERP offer (homepage `#erp`, data in `lib/erp.ts`) is white-label the same way: never name the system underneath, here or anywhere in this public repo (a test enforces it). List only features it ships. The starting price lives in `ERP_PRICE` (same level as the CRM today), set per currency. Spanish ERP copy doesn't promise CFDI invoicing ("cuentas por cobrar y por pagar", not "facturación").
- **Blog posts** are MDX in `content/posts/<slug>/en.mdx` + `es.mdx` (both required, same `date` and `draft`). Frontmatter: `title`, `description`, `date` (YYYY-MM-DD), optional `updated`, `draft`. Drafts render in dev only. Start the body with a paragraph (the page renders the `h1`); end with a `## Next step` that invites the reader to the 20-minute review, then `<BookReview />` (the booking button with `PRIMARY_CTA`; the page adds no other, and a test requires exactly one per post). Images go in `public/blog/<slug>/`, never remote. `npm test` compiles every post and applies the honesty and *tú* rules to it. Reader: `lib/posts.server.ts`; pages: `app/blog/`. Linked from the nav, the footer, and the homepage `#blog` section (`homepageTeaser`: latest 3 that aren't `INSIGHTS` notes or the CRM post; hidden when empty). `/custom-crm` and the homepage `#crm` link to `CRM_POST_SLUG` (`lib/crm.ts`); a test keeps that post published. Draft new posts with `/new-post <topic>` (`.claude/commands/new-post.md`).
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
