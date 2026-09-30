# Buyer-first homepage: component notes and QA

The homepage answers five questions for a finance or healthcare operations
buyer in the US or Mexico: what we automate (in their nouns), what it looks
like running, what proof exists, what happens to data and approvals, and what
to do in the next 20 minutes.

## Section order (`app/page.tsx`)

Nav + geo/lang → Hero (Exhibit 1) → Solutions: Finance | Healthcare switcher
with the workflow exhibit (Exhibit 2, paper band) → Pain → ROI calculator →
How it works (Review → Pilot → We run it, the 20-minute review, pricing shape,
"What's in the work") → Trust (paper band) → Proof → FAQ → Onsite → Contact →
Footer, plus the sticky mobile CTA.

Pages: `/security`, `/about` (and `/es/…`). The "what the 20 minutes covers"
content is the in-page anchor `#review`.

## Components

### Document scene (`components/ui/DocumentScene.tsx`, `lib/scenes.ts`)

- Two panels: **What arrives** (channel, sender, subject, attachment, and a
  paper document with the problem line highlighted and flagged) and **What your
  team receives** (approval card: checks marked ok / flag / owner / hold,
  attachments, status, and the action).
- The action ("Approve to record", "Mark ready to schedule"…) is drawn, not a
  control: `aria-disabled`, dashed, with "Waits for a person to act."
- Optional `steps` prop animates a four-step strip once (Collect → Match →
  Flag → Your approval), about 6 seconds, and respects `prefers-reduced-motion`
  through the global rule.
- ≤ 700px: stacks with the inbound document first and the approval card
  directly below it, never below other headlines.
- One scene per finance/healthcare workflow. All names and numbers are
  invented and captioned "Illustrative". Spanish scenes use Mexican nouns
  (CFDI, OC, RFC, provisiones, preautorización, aseguradora), in the *tú*
  register; `toolsMx` swaps
  QuickBooks → CONTPAQi and the close system → SAP on `/es`.
- The paper document is always light, whatever band it sits in.

### Calculator currency (`components/sections/RoiCalculator.tsx`)

- The currency follows the language: **USD in English, MXN in Spanish**. There
  is no FX rate. Each currency has its own editable defaults (USD 60/h and
  30,000; MXN 1,000/h and 500,000), and switching language reseeds them.
  Formatting comes from `fmtCurrency(n, locale, currency)`.
- Defaults are 4 people × 8 repetitive hours a week. Hours lead, money follows.
- The disclaimer is a visible callout: "The $ figure is capacity value, not
  cash savings. Implementation cost is scoped after the review."
- Sharing: Copy summary (clipboard, with a status message), Email this
  estimate (`mailto:` with the summary), Save estimate (.txt).

### Sticky mobile CTA (`components/sections/StickyCta.tsx`)

- Only at ≤ 700px. Appears after 40% of the page, and steps aside while
  `#contact` is on screen (IntersectionObserver).
- Uses `NAV_CTA` ("Book review" / "Agenda tu revisión"). It is out of the tab
  order and `aria-hidden` while hidden. The footer reserves room for it.

### Paper band (`.band-paper` in `app/globals.css`)

Redefines the colour tokens (ink on paper, a deeper shade of the same teal),
so every primitive keeps working. All text pairs are ≥ 4.5:1 on both the band
and its cells. It's used for the workflow exhibit and Trust; navy stays for
the hero, calculator and close.

## Honesty decisions

- **Proof:** the case study stays gated by `shouldRenderCaseStudy`. Until it
  is approved, the proof block is the fallback line "Built by operators who
  have worked on finance and technology systems at global banks and consulting
  firms", linking to `/about`. There is no logo row. Employer names (including
  Merrill Lynch) appear only on `/about`, with the "not clients or partners"
  hedge.
- **Security:** terms are set by each client, so the page describes a process
  the client controls: providers and training terms, scoped/logged/revocable
  access, BAA/DPA/NDA as the client requires, HIPAA via BAA, and LFPDPPP and
  residency written into the scope. It claims **no** certifications and
  invites a security questionnaire.
- **Pricing shape:** the review is free (20 min); the pilot is fixed scope,
  typically 3–6 weeks, priced after discovery; then a monthly operating
  retainer. Proposals separate implementation, third-party/API costs and
  ongoing care. It doesn't mention CFDI or MXN invoicing, because we don't
  offer them yet.
- **Team strip:** removed by decision; there are no faces or names.

## QA checklist

Automated items run in `npm test`; the rest were checked in a production build
in Chrome at 360 / 390 / 700 / 900 / 1150 / 1440px, EN and ES.

| Test | How | Result |
|---|---|---|
| **8-second hero** | Above the fold at 1440×900: eyebrow names finance + healthcare, H1 names the job in their nouns (invoices, reports, referrals, follow-ups), sub says approvals stay with them, primary CTA visible, Exhibit 1 shows the mismatch and the approval card | Pass |
| **Logo honesty** | Test "Employer names stay off the homepage…"; names only on `/about` with the hedge | Pass |
| **HIPAA / LFPDPPP presence** | `/security` has "Healthcare in the United States (HIPAA)" and "Mexico: personal data and residency (LFPDPPP)"; no certification claims | Pass |
| **Mexico noun test** | `/es`: CFDI, OC, RFC, provisiones, preautorización, aseguradora, CONTPAQi/SAP in tools; "Revisión en sitio en México" | Pass |
| **Register** | Test "Mexican Spanish uses tú with the visitor, not usted or Spain forms" over the whole dictionary (the visitor addressing us stays "ustedes") | Pass |
| **CTA friction** | One primary ask everywhere ("Book a 20-minute workflow review"); WhatsApp and email as alternates; the form asks for 5 required fields + optional phone; "No technical brief" stated in the hero micro-copy, Review step, and form | Pass |
| Overflow | No horizontal scroll on `/`, `/es`, `/security`, `/about` (EN/ES) at any width | Pass |
| Keyboard | Tabs respond to arrow/Home/End keys; all 61 focusable controls show a focus indicator; mobile nav Escape returns focus | Pass |
| Headings | One `h1` then `h2`s, in order, on every page | Pass |

## Still open

- **Booking URL:** set `NEXT_PUBLIC_BOOKING_URL` (https) once you have it. The
  CTAs switch to it, and the contact column shows "Pick a time on the
  calendar".
- **Real proof:** when the pilot outcome is cleared, fill `lib/caseStudy.ts`
  and set `approved: true`. The proof block then renders it instead of the
  fallback line.
- **Depth assets (P2-11):** the 60–90s screen recording and the "What the
  20-minute review covers" one-pager PDF are not built.
- **Later:** separate `/finance` and `/healthcare` landings reusing
  `DocumentScene`.
