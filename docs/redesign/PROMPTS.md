# B5 redesign: Claude Code prompts

These are four prompts to paste into Claude Code, run in order from the repo root. They're tuned to **use as few credits as possible**:

- **Run `/clear` before each prompt.** Each one is self-contained and points Claude to only the files it needs, so old context isn't carried (and re-billed) from step to step.
- **Use Sonnet** (`/model sonnet`). The design decisions are already made in the spec, so the work is mostly implementation.
- The heavy lifting is already done in `docs/redesign/kit/` (fonts, tokens, global CSS, UI primitives, Spanish copy). The prompts tell Claude **not** to read `app/legacy.css` (3,400 lines).
- Screenshots are read once per prompt, and only the relevant one.
- Each prompt ends with one verification pass, not repeated loops.

Before prompt 1, create a branch: `git checkout -b feat/b5-redesign`. Commit after each prompt so you can roll back one step.

---

## Prompt 1: Foundation

```
Read docs/redesign/B5-SPEC.md sections 1–3 only. Then set up the B5 foundation:

1. `git mv app/globals.css app/legacy.css`. Do NOT open legacy.css.
2. Copy docs/redesign/kit/globals.css → app/globals.css and docs/redesign/kit/fonts.ts → lib/fonts.ts.
3. Copy docs/redesign/kit/ui/{Kicker,Exhibit,StackedBar,RichTemplate}.tsx → components/ui/.
4. In app/layout.tsx: import "./legacy.css" before "./globals.css"; replace the Manrope localFont with `fontVariables` from lib/fonts.ts on <html>.
5. Merge docs/redesign/kit/es-MX.b5.json into lib/es-MX.json with a short node script: add missing keys only, keep existing values, keep 2-space JSON formatting.
6. Reorder app/page.tsx per spec section 3 (Problem moves after Solution). No other component changes yet.

Run `npm run typecheck && npm test`. Fix only what breaks. Commit: "feat(b5): foundation — tokens, fonts, primitives, copy".
```

## Prompt 2: Chrome and top of page

```
Read docs/redesign/B5-SPEC.md sections 2 and 4.1–4.4, and look at docs/redesign/reference/b5-desktop-1.png (and b5-desktop-2.png for the Solution controls).

Restyle Navbar, Hero (+ HeroVisual as Exhibit 1), TrustBar and Solution (fill-in sentence + Exhibit 2) to B5:
- One co-located CSS module per component (e.g. components/sections/Hero.module.css). Use the global classes from app/globals.css (.shell .section .grid-12 .kicker .display .h2 .lead .button .text-link .chip .label .roman .status) and components/ui primitives (Kicker, Exhibit, RichTemplate, lowerFirst).
- Remove these components' old global classNames as you go. Don't read app/legacy.css.
- Keep ALL existing logic, state, keyboard handling, aria attributes, anchors and InquiryContext wiring. Change markup and styles only, except where the spec explicitly changes content (Exhibit 1 rows from WORKFLOWS stages; Solution sentence + four-cell exhibit).
- Every new literal t() string must already exist in lib/es-MX.json (added in prompt 1). If you need a new one, add the Spanish too.

Run `npm run typecheck && npm test`. Commit: "feat(b5): navbar, hero, trust bar, solution".
```

## Prompt 3: Numbers

```
Read docs/redesign/B5-SPEC.md sections 2 and 4.5–4.6, and look at docs/redesign/reference/b5-desktop-2.png.

Restyle Problem + RoiCalculator as one --surface band (Exhibit 3 with components/ui/StackedBar), and CaseStudy as Exhibit 4:
- Same rules as before: co-located CSS modules, global B5 classes, and don't read app/legacy.css.
- Keep every calculator input, the assumptions <details>, results, "Save estimate" download and lib/roi.ts untouched; this is presentation only. Capacity numbers lead, money follows.
- Don't change shouldRenderCaseStudy or the case-study copy source.

Run `npm run typecheck && npm test`. Commit: "feat(b5): problem, ROI calculator, case study".
```

## Prompt 4: The rest, cleanup and ship checks

```
Read docs/redesign/B5-SPEC.md sections 2, 4.7–4.14 and 5, and look at docs/redesign/reference/b5-desktop-3.png.

1. Restyle Services, HowItWorks, WhyBrilliant, PastExperience, Faq, OnsiteConsulting, FinalCta and Footer. Same rules: co-located CSS modules, B5 globals, keep all logic (contact form, native <details>, ONSITE_CTA, language links).
2. Delete app/legacy.css and its import. Then grep components/ for any className that no longer has a matching style, and fix it.
3. Update app/og/route.tsx to B5:
   - Background #0B1520. Kicker "DONE-FOR-YOU AI AUTOMATION" (Spanish on /es) in GeistMono-Regular.ttf, teal #86C5C0.
   - Headline in public/fonts/og/BodoniModa-500.woff: "Busywork in." then "Finished work out." in BodoniModa-400-Italic.woff, teal. Use the Spanish strings on /es.
   - Footer line in Geist-Regular.ttf, #A9B3BC.
   - Then delete public/fonts/manrope-*.ttf and remove the Manrope reference in README.md.
4. Recolor app/icon.svg to the B5 palette (#0B1520 background, #86C5C0 mark).
5. In README.md "Structure", note: lib/fonts.ts (Bodoni Moda, Geist, Geist Mono, local), co-located *.module.css per section, components/ui primitives.

Final checks, once:
- Run `npm run typecheck && npm test && npm run build`.
- List any spec section 5 item you couldn't verify from code alone, so I can check it in the browser at 1440px and 390px, EN and /es.

Commit: "feat(b5): remaining sections, OG image, cleanup".
```

---

## Afterwards (manual, no credits)

1. `npm run dev`. Compare against `docs/redesign/reference/b5-desktop-*.png` at 1440px, then check at 390px width.
2. Check `/es`: long Spanish headlines should wrap cleanly.
3. Tab through the page: every control should show the teal focus ring, and industry tabs should respond to arrow keys.
4. Open a PR from `feat/b5-redesign`.

If something small looks off, fix it with a targeted prompt, e.g. `In Hero.module.css, the exhibit should align to the top of the headline, not center.` Short, file-specific prompts cost a fraction of a full pass.
