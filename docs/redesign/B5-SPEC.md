# B5 "Ink" redesign: build spec

The visual redesign of the landing page. It is a **restyle and reorder**, not a rewrite: every existing behavior, data source, translation, test and honesty rule stays. Where this spec and the reference disagree, **this spec wins**.

- Visual reference: `docs/redesign/reference/b5-desktop-{1,2,3}.png` (read the images; only open `b5-desktop.html` when you need an exact value).
- Ready-made code: `docs/redesign/kit/` (fonts, global CSS, UI primitives, Spanish strings).

---

## 1. Principles

1. **Calm, editorial, consultancy.** Like a strategy-firm report: serif display headlines, mono rubrics, thin rules, numbered "Exhibits". No gradients, glows, rounded cards, shadows or emoji.
2. **One accent, used sparingly.** Teal `--accent` marks the kicker bar, italic emphasis, the primary button, selected states and "ready" states. It never signals errors. `--caution` (sand) only marks "needs a person".
3. **Capacity first, money second.** Keep the framing rules in `lib/roi.ts`.
4. **Honesty rules stay.** Workflows are "Example only"; tool names are potential integrations; the case study stays gated by `shouldRenderCaseStudy`; no invented stats.
5. **Sharp geometry.** `border-radius: 0` everywhere. Rules are 1px `--line` / `--line-strong`; exhibit heads use a 2px `--text` rule.

## 2. Foundation (from `kit/`)

| Kit file | Destination | Notes |
|---|---|---|
| `kit/fonts.ts` | `lib/fonts.ts` | Bodoni Moda (display), Geist (UI), Geist Mono (labels). Fonts are already in `public/fonts/{bodoni-moda,geist}`. |
| `kit/globals.css` | `app/globals.css` | Tokens, base, type classes, buttons, chips, exhibits, forms. Move the old file to `app/legacy.css` first. |
| `kit/ui/*.tsx` | `components/ui/` | `Kicker`, `Exhibit`, `StackedBar`, `RichTemplate` (+ `lowerFirst`). |
| `kit/es-MX.b5.json` | merge into `lib/es-MX.json` | New keys only; never overwrite existing keys. |

In `app/layout.tsx`, replace the Manrope `localFont` with `fontVariables` from `lib/fonts.ts` on `<html>` (not `<body>`: the `--font-*` theme tokens are declared on `:root`, so the font variables must exist there too). Keep `manrope-*.ttf` until the OG image is migrated, then delete them.

**Styling approach:** global primitives live in `globals.css`. Each section gets a co-located `Section.module.css` for its layout. Don't add new global selectors per section, and don't read `app/legacy.css` (it's 3,400 lines and will be deleted).

### Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0B1520` | page |
| `--surface` | `#111D2A` | ROI band, exhibit cells, cards |
| `--line` / `--line-strong` | `#1F2D3B` / `#2C3C4D` | rules, chip borders, chart track |
| `--text` / `--text-2` | `#EEF0EE` / `#C9D0D6` | headings / secondary text |
| `--muted` / `--faint` | `#A9B3BC` / `#7D8995` | body / captions, labels (both ≥ 4.5:1) |
| `--accent` / `--on-accent` | `#86C5C0` / `#0B1520` | see principle 2 |
| `--caution` | `#E2C48A` | "Needs review" only |

### Type classes (already in `globals.css`)

| Class | Spec |
|---|---|
| `.display` | Bodoni 500, clamp(54→118px), lh .92, ls −.035em. `<em>` = italic 400 teal |
| `.h2` / `.h2-sm` / `.statement` | Bodoni 500 at clamp(40→80) / (34→64) / (44→104) |
| `.h3` | Geist 600 24px, ls −.015em |
| `.lead` / `.body` / `.caption` | Geist 21 / 17 / 13px, muted/faint |
| `.kicker` | 32×4 teal bar above Geist Mono 12px, .14em, uppercase, teal |
| `.label` | Geist Mono 11px, .14em, uppercase, faint |
| `.numeral` | Bodoni 500 clamp(48→72px), tabular lining figures |
| `.roman` / `.roman--lg` | Bodoni italic step numbers "i." "ii." "iii." |

Layout: `.shell` (max 1440, gutter clamp 20→64), `.section` (padding clamp 72→128), `.grid-12` (12 columns, gap clamp 16→32; collapses to 1 column at ≤ 900px). Breakpoints: **1150 / 900 / 700**.

## 3. Page order (`app/page.tsx`)

`Navbar` → `Hero` → `TrustBar` → `Solution` → `Problem` + `RoiCalculator` (one shared `--surface` band) → `CaseStudy` (gated) → `Services` → `HowItWorks` → `WhyBrilliant` → `PastExperience` → `Faq` → `OnsiteConsulting` → `FinalCta` → `Footer`.

The only move is `Problem`, which now sits after `Solution` as the lead-in to the calculator. Keep every section `id` and anchor that nav, footer or tests use.

Exhibit numbering: 1 = Hero, 2 = Solution, 3 = ROI chart, 4 = Case study (only when rendered). Use `t("Exhibit {number}", { number })`.

## 4. Sections

Copy marked **(existing)** already has a Spanish entry; use the exact English key. New keys are in `kit/es-MX.b5.json`.

### 4.1 Navbar
- **Utility bar** (40px, not sticky, bottom rule `--line`): left `.label` "United States · Canada · México"; right the existing `LanguageSwitch` restyled as two mono labels (the active one in `--text`).
- **Header** (88px, sticky, `--bg`, bottom rule `--line`):
  - Wordmark "Brilliant" in Bodoni italic 600 32px, followed by an upright teal "."; keep the home link's aria-label.
  - `NAV_LINKS` in Geist 15/500 `--text-2`.
  - CTA `.button.button--outline` with `t(PRIMARY_CTA)` → `DISCOVERY_CALL_HREF`.
- **≤ 900:** hamburger; the panel lists the links in Bodoni 32px with the CTA as a full-width `.button`. Keep the existing Escape and focus-return behavior.

### 4.2 Hero (`Hero`, `HeroVisual` → Exhibit 1)
- `.grid-12`: copy spans 7 columns, exhibit spans 5 (column 8), vertically centered. Padding 112px top, 104px bottom.
- **Copy:**
  - `.kicker` "Done-for-you AI automation" (existing).
  - `h1.display`: "Busywork in." `<br>` `<em>`"Finished work out."`</em>`.
  - `.lead`: the existing hero paragraph.
  - Actions, gap 32: `.button` `t(PRIMARY_CTA)` and `.text-link` "See what we can automate" (existing) with an arrow → `#solutions`.
  - Footnote `.caption`: "20 minutes. Bring one repetitive task." (existing).
- **Exhibit 1** (`<Exhibit>`):
  - Label "Exhibit {number}" = 1; status `live` "Running"; title "How an invoice moves through an automated approval".
  - Rows come from `WORKFLOWS` id `invoice-approvals` → `stages[0..3]`, translated. Row grid `44px 1fr auto`, 16px padding, top rule `--line`.
  - Row content: `.roman` numeral, 16px text, `.status`.
  - Statuses: i, ii `done` "Done"; iii `review` "Needs review" (numeral in `--caution`); iv `ready` "Your approval" (numeral in teal).
  - Caption: "Illustrative. Exceptions always go to a person before anything is approved."
- Drop "Built around your people…" and the "Scroll to explore" bar. They repeat `WhyBrilliant`.
- **≤ 900:** stack, exhibit below. **≤ 700:** actions stack full-width.

### 4.3 TrustBar
- A single ruled strip inside `.shell`: 1px rules top and bottom, 24px padding.
- Left `.label` "Tools we can connect" (existing). Right: tool names in Bodoni italic 22px `--muted`, gap 52.
- **≤ 900:** names wrap in 2 columns. Keep the existing tool list and its "not endorsements" note.

### 4.4 Solution: the fill-in sentence (Exhibit 2)
Keep **all** of `Solution.tsx`'s state and a11y: `active` industry, per-industry `selectedIds`, the tablist with arrow/Home/End keys, `aria-pressed` workflow buttons, the `role="status"` announcement, and `selectWorkflow()` → `#contact` via "Discuss this workflow" (existing).

- **Header:**
  - `.kicker` "Start with a job you recognize" (existing).
  - Sentence `p.h2` (use 72px max), `max-width: 1240px`. Use `RichTemplate` for both halves: `t("We’re on the {industry} team.")` with `industry` = `<em>{t(key)}</em>`, where key is the lowercase industry (`finance`, `healthcare`, `operations`, `sales`).
  - Then `t("Help us {task}.")` with `task` = `<em>{t(lowerFirst(workflow.title))}</em>`.
  - The `em` gets a 2px teal underline (`border-bottom`). Spanish infinitive phrases are keyed by the lowercase titles.
- **Controls** (ruled band, 20px padding): two rows.
  - `.label` "Team" + industry tabs styled as `.chip` using `aria-selected`.
  - `.label` "Task" + the 3 workflow buttons as `.chip` using `aria-pressed`.
  - **≤ 700:** each row scrolls horizontally (`overflow-x: auto`, `scroll-snap-type: x`).
  - Keep "Something else slowing you down?" (existing) as a `.text-link` after the task chips.
- **Exhibit 2** (`.grid-12`):
  - Left, 3 columns: `.exhibit__label` "Exhibit 2"; Bodoni 34px "{workflow}, step by step"; `.label` `{Industry} · ` "Example only" (existing); `.text-link--accent` "Discuss this workflow".
  - Right, 9 columns: a 2×2 grid, gap 16, of `--surface` cells (28px padding, 2px top rule `--line-strong`; the "What you get" cell uses a teal rule).
  - Cell "Starts when" → `trigger`, 20px.
  - Cell "What we handle" → `stages` as an ordered list with `.roman`.
  - Cell "What you get" → `outcome`.
  - Cell "Who decides" → `approval`.
  - Tools (`tools[]`) sit under the grid as a `.caption`, keeping its existing label "Tools in this example".
- Drop the old document mock (`document`, `reference`, `field`, `value` stay in data but aren't rendered). **≤ 900:** stack; cells in 1 column.

### 4.5 Problem + RoiCalculator (one `--surface` band, Exhibit 3)
Keep **all** calculator behavior: every input (people, hours, hourly value, opportunities declined, average value), the assumptions `<details>` (share automated, working weeks, budget), results, `buildBreakdown` download "Save estimate", and the capacity-before-money order.

- **Problem** (top of band, no bottom padding):
  - `.kicker` "The busywork trap" (existing).
  - `.h2` "Remember the deal you turned down." (existing).
  - Its body copy as `.lead` in a 2-column grid.
  - Remove the "Put a number on it" link, since the calculator is directly below.
- **ROI heading:** `.h2` `RichTemplate` of `t("What could your team do with {hours} more hours a week?")` with `hours` = `<em>{fmtNumber(hoursReclaimedWeek)}</em>`.
- **`.grid-12`:**
  - **Inputs, 4 columns** (right rule `--line-strong`, padding-right 24): label row (label left, mono value right) above the control. Keep native number inputs where they exist today; use range inputs only where the current component does. Assumptions `<details>` summary as `.text-link`.
  - **Results, 8 columns:** a row of three `.numeral` stats, each with a 2px top rule (first teal, others `--line-strong`) and a 15px muted caption: hours back per week · hours back per year · value of redeployed capacity (`fmtCurrency`). Keep the existing result labels.
  - Below the numerals: `.label` "Exhibit 3", then `.h3`-sized 18px "Where the repetitive week goes", then `.caption` "Hours per week across your team".
  - Then `<StackedBar share={automatableShare}>` with:
    - `handledLabel` = "Handled by Brilliant · {hours} hrs"
    - `remainingLabel` = "Still with your team · {hours} hrs"
    - `axisEnd` = "{hours} hrs" (total)
    - `summary` = "{handled} of {total} repetitive hours a week handled by Brilliant"
  - Caption: "Source: your inputs. Assumes {weeks} working weeks a year."
  - **Secondary results** (extra volume %, capacity in full weeks, revenue opportunity when provided, payback when a budget is set) as a ruled 2-column definition list with existing labels, then the "Save estimate" `.text-link`.
- **≤ 900:** inputs above results; the numerals go to 1 column at ≤ 700.

### 4.6 CaseStudy (Exhibit 4, gated; don't change the gate)
- `--bg` section: `.kicker` = sector.
- Headline value as `.statement`, with its label as a caption.
- Metrics as 3 `.numeral` stats.
- Before/after as two `--surface` cells (like Exhibit 2).
- Quote in Bodoni italic 32px with a `.label` attribution.

### 4.7 Services
- `.kicker` = existing eyebrow; `.h2` "Practical AI." `<em>`"Real work, taken care of."`</em>` (existing keys).
- The three tiers become three ruled columns: 2px top rule, mono `.label` "01", "02", "03", `.h3` title, `.body`.
- The existing trigger/process detail becomes a ruled `.rule-list` inside each column. Keep all copy.

### 4.8 HowItWorks
- `.grid-12`: 4-column title block; 7-column step list starting at column 6.
- Title block: `.kicker` "A clear path forward" (existing), `.h2-sm` "Start small." `<em>`"Make room for more."`</em>`, `.body` "You know the process. We handle the build."
- Steps: rows on a `80px 1fr 96px` grid with 28px padding and top rules. Each row has a `.roman--lg` numeral, `.h3` (existing step titles) plus `.body`, and a right-aligned `.label` "20 min", "Pilot" or "Ongoing".
- **≤ 700:** the label moves under the title.

### 4.9 WhyBrilliant: statement band
- Full-bleed top rule 2px `--text`.
- `.kicker` "Human by design", then `.statement` "Better systems." `<em>`"Still your people."`</em>`.
- The existing supporting points go in a 3-column ruled list below. This is the only place that headline appears; the final CTA uses its own.

### 4.10 PastExperience
- The quiet ruled strip used by TrustBar: `.label` "Organizations previously worked with" (existing), names in Bodoni italic 22px `--muted`.
- Keep the existing "past professional experience" disclaimer as a `.caption`. These are not clients.

### 4.11 Faq
- `.grid-12`: 4-column title block (`.kicker` "A little more clarity", `.h2-sm` "Good questions." `<em>`"Straight answers."`</em>`); the list spans 7 columns from column 6, in 2 columns at ≥ 1150px and 1 column below.
- Keep the native `<details>`. The summary is 17/500 `--text` with 22px padding, a top rule, and a teal "+" that rotates 45° when open. Answers are `.body`, max 60ch, with 18px bottom padding.

### 4.12 OnsiteConsulting
- Slim ruled band: `.kicker` "Onsite consulting" (existing) and `.h2-sm` "Work with us, in person." (existing) on the left.
- On the right: the countries list as `.label` items and `.button--outline` `t(ONSITE_CTA)`.

### 4.13 FinalCta (the contact form: keep all logic)
- `.grid-12`, 5 and 7 columns.
- **Left:** `.kicker` "Start with a workflow review", `.h2` "One workflow." `<em>`"A practical way forward."`</em>`, `.lead` (existing), the 3 check rows as a `.rule-list` with teal check icons, and the email fallback link.
- **Right form:** `.field` + `.input` / `.select` / `.textarea` (underline style).
  - The selected-workflow block becomes a `--surface` row with a `.label`, the workflow title, and a clear button (existing aria-label).
  - Submit is a full-width `.button` with its existing label. Keep the privacy note as a `.caption` and the status message.

### 4.14 Footer
- Top: Bodoni italic 20px "Less repetitive work." `<em>`"More human potential."`</em>` (existing).
- Link columns in `.label` headings plus 15px links.
- Bottom rule, then a legal row with `.caption` text, the language links and "Back to top ↑" (all existing).

## 5. Accessibility and QA (acceptance)

- Headings: one `h1`, then one `h2` per section, in order. Exhibits are `<figure>` + `<figcaption>`.
- Every interactive element is at least 44×44px and has the `:focus-visible` teal outline (global). Chips use `aria-selected`/`aria-pressed` as today.
- Contrast: body ≥ 4.5:1 (tokens are pre-checked). Don't put text colors on `--surface` other than those tokens.
- `prefers-reduced-motion` is honored (global). The only motion is hover transitions and the bar width.
- **Spanish (`/es`):** every new literal `t()` string has an entry, and the long Spanish headlines wrap without overflow at 390px.
- **Checks:** `npm run typecheck`, `npm test` (includes "Every literal translation call in active UI has a Spanish dictionary entry" and the CTA/case-study tests), and `npm run build` all pass.
- Visually, at 1440px it matches `reference/b5-desktop-*.png`; at 390px nothing overflows horizontally.
