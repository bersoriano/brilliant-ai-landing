# Buyer-first homepage: component notes and QA

The homepage answers five questions for a finance or healthcare operations
buyer in the US or Mexico: what we automate (in their nouns), what it looks
like running, what proof exists, what happens to data and approvals, and what
to do in the next 20 minutes.

## Section order (`app/page.tsx`)

Nav + geo/lang → Hero (Exhibit 1) → Solutions: Finance | Healthcare switcher
with the workflow exhibit (Exhibit 2, paper band) → Pain → ROI calculator →
How it works (Review → Pilot → We run it, the 20-minute review, pricing shape,
"What's in the work") → What we've learned (four operator rules, each linked
to a note) → Trust (paper band, opens with the approval point of view) → Proof
→ Custom CRM (agent playbook exhibit, features, pricing) → FAQ → Blog teaser
(posts not already featured) → Onsite → Contact → Footer, plus the sticky
mobile CTA.

Pages: `/security`, `/about`, `/custom-crm` (the full CRM offer: pipeline and
conversation exhibits, features, setup steps, pricing) (and `/es/…`). The "what the 20 minutes covers"
content is the in-page anchor `#review`.

## Components

### Document scene (`components/ui/DocumentScene.tsx`, `lib/scenes.ts`)

- Two app windows, each with a title bar split from the scene's channel
  ("Teams · Approvals" → **Teams** | Approvals): **What arrives** (sender,
  subject, attachment, and a paper document whose lines get checked and whose
  problem line gets flagged) and **What your team receives** (a workflow post
  with the approval card: checks marked ok / flag / owner / hold, attachments,
  status, and the action).
- The action ("Approve to record", "Mark ready to schedule"…) is drawn, not a
  control: `aria-disabled`, dashed, with "Waits for a person to act." The
  optional `approver` row and `control` line ("Stays with you") say who acts.
- `step` (0–3) drives the run: nothing is checked before Match, nothing is
  flagged before Flag, and the card posts at Your approval. Without `step` the
  scene renders its final state, which is also what the server and
  reduced-motion visitors get.
- ≤ 700px: stacks with the inbound window first and the team's window directly
  below it; the hero's extra inbox rows are hidden.
- One scene per finance/healthcare workflow. All names and numbers are
  invented; exhibits carry a "Sample data" tag. Spanish scenes use Mexican nouns
  (CFDI, OC, RFC, provisiones, preautorización, aseguradora), in the *tú*
  register; `toolsMx` swaps
  QuickBooks → CONTPAQi and the close system → SAP on `/es`.
- The paper document is always light, whatever band it sits in.

### Authority layer (`components/sections/Approach.tsx`, `lib/insights.ts`)

- Link, don't lecture: the homepage gives a rule in one line and links the
  note that explains it. "What we've learned" is three ruled rows, each a rule
  beside its note (design for the exception first; one decision per approval,
  where your team already works; agents prepare, your team decides). A test
  keeps it to three one-line rules, each linking a note. The intro line names
  invoices, month-end, referrals and missing documents so both buyers see
  their work. The block is server-rendered so links carry each note's own
  title, and the review link is its accent link. `/security` is Trust's only
  link, one section down.
- The notes (`content/posts/why-invoice-automation-stalls`,
  `approval-points-without-bottlenecks`, `measuring-capacity-reclaimed`,
  `agents-in-regulated-work`) are operator notes: no statistics, no client
  claims, examples labelled as examples. The calculator links to the measuring
  note from its disclaimer, where that question comes up; the finance and
  healthcare pages link the invoice and agents notes. Each note page ends with
  the review button.
- The homepage blog teaser (`homepageTeaser`) skips those notes and the CRM
  post, which `#crm` already links and whose market commentary would read as
  our view under a finance-and-healthcare heading. It stays hidden until
  another note is published.
- Placement rule: authority sits after the process (How it works) and before
  the controls (Trust), so it reads as the reasoning behind both.

### Live exhibits (motion and control)

- **Exhibit 1 (`HeroVisual`)**: the invoice run. A step rail (Collect → Match
  → Flag → Your approval) plays once when the exhibit first scrolls into view,
  with a progress fill on the current step, and stops on the step that needs a
  person ("Waiting", sand). Every step is a button (`aria-pressed`) and
  "Replay" restarts the run. Step changes made by the visitor are announced.
- **Exhibit 2 (`Solution`)**: the selected task's scene in its final state,
  under the workflow's stages drawn as a connected flow whose last stage (the
  handoff to your team) is sand. The approval sentence is the control line.
- **Exhibit 3 (`CapacityWeek`)**: one row per person (max six; larger teams
  show five and "+ N more people with the same week") and one square per
  repetitive hour, filled where Brilliant handles the work. Headline numbers:
  hours per week (accent), capacity value, payback (hours per year when no
  budget is set).
- **Services** (paper band, after the calculator): four ruled blocks, each the
  pitch on the left and what it looks like on the right. Workflows and agents
  open with what starts them ("Starts with a trigger" / "Starts with a
  request") and show three examples as chains: the trigger in teal, the work
  in grey, the person who decides in sand. Each ends with a `.control` line.
  How it works keeps only Review → Pilot → Run, costs and what's in the work.
- **Exhibits 4 and 5 (`AgentPlays`)**: the CRM and ERP playbooks. Each trigger
  is a vertical tab; the selected one shows what the agent (or the system)
  does → you approve → you measure. Grey rules; sand only on "You approve".
  Below each: two short notes (ask in plain language, ask for something new)
  and one ruled row with the price and the included features (titles only on
  phones). The CRM's assistant, custom work and reasons live on
  `/custom-crm`. The gated case study is Exhibit 6.
- **Page rhythm**: `.section-rule` draws a content-width hairline between
  consecutive sections on the same band (Approach, FAQ, Blog). Headings
  are `.h2` up to 56px and `.h2-sm` up to 44px.
- **Rhino (`Proof`)**: before (three areas in separate software) → what we
  built (modules of one system over shared APIs) → now, using only the three
  existing sentences as captions.
- **Motion rules**: `useFirstView` / `Reveal` (`components/ui/motion.ts`)
  render the final state on the server, hide only what is still below the
  fold, and return `"static"` under `prefers-reduced-motion`. Use them for
  exhibits and cards only.
- **The control line** (`.control` in `globals.css`): sand rule and label
  "Stays with you". Every exhibit ends with what stays with a person.
- **Demo language**: exhibits carry a "Sample data" (or "Examples") tag in the
  header instead of "Illustrative." captions, here and on `/custom-crm`; the
  calculator says "An estimate from your inputs, not a guarantee." Accuracy
  stays: names and numbers are invented, tools are examples.

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
| **8-second hero** | Above the fold at 1440×900: eyebrow names finance + healthcare, H1 names the outcome (a bigger team's capacity without hiring), sub says who runs it ("We build and run"), names the job in their nouns (invoices, referrals, follow-ups) and where it runs, then "Your team keeps every approval."; primary CTA visible (EN and ES, also at 1024×768). "See a workflow in motion" jumps to Exhibit 1, directly below the hero | Pass |
| **Logo honesty** | Test "Employer names stay off the homepage…"; names only on `/about` with the hedge | Pass |
| **HIPAA / LFPDPPP presence** | `/security` has "Healthcare in the United States (HIPAA)" and "Mexico: personal data and residency (LFPDPPP)"; no certification claims | Pass |
| **Mexico noun test** | `/es`: CFDI, OC, RFC, provisiones, preautorización, aseguradora, CONTPAQi/SAP in tools; "Revisión en sitio en México" | Pass |
| **Register** | Test "Mexican Spanish uses tú with the visitor, not usted or Spain forms" over the whole dictionary (the visitor addressing us stays "ustedes") | Pass |
| **CTA friction** | One primary ask everywhere ("Book a 20-minute workflow review"); WhatsApp and email as alternates; the form requires 5 fields (name, email, organization, country, industry) plus "What task should we look at?" unless a workflow example is already selected, with phone optional; "No technical brief needed" sits beside the booking button in the contact section, and the Review step offers recording the task once instead of explaining it | Pass |
| Overflow | No horizontal scroll on `/`, `/es`, `/security`, `/about` (EN/ES) at any width | Pass |
| Keyboard | Tabs respond to arrow/Home/End keys; all 61 focusable controls show a focus indicator; mobile nav Escape returns focus | Pass |
| Headings | One `h1` then `h2`s, in order, on every page | Pass |

## Still open

- **Booking URL:** CTAs use the Haab Calendar URL in `lib/site.ts`. The hero,
  contact section, onsite review, and footer disclose the booking partner.
- **Real proof:** when the pilot outcome is cleared, fill `lib/caseStudy.ts`
  and set `approved: true`. The proof block then renders it instead of the
  fallback line.
- **Depth assets (P2-11):** the 60–90s screen recording and the "What the
  20-minute review covers" one-pager PDF are not built.
- **Later:** separate `/finance` and `/healthcare` landings reusing
  `DocumentScene`.
