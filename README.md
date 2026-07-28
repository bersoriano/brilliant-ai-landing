# Brilliant AI — Landing Page

Marketing landing page for **Brilliant AI**, an AI automation consultancy. The
page's single job is to convert visitors into leads via an interactive **ROI
calculator**.

Built with **Next.js (App Router) + React + TypeScript + Tailwind CSS v4**. No
component library, no backend, no external effect libraries — all motion is CSS
or a lightweight `IntersectionObserver`.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Requires Node 18.18+ (developed on Node 20+).

---

## Structure

```
app/
  layout.tsx          Root layout, metadata, skip-link
  page.tsx            Assembles every section in order
  globals.css         Design tokens (@theme), motion, reduced-motion rules
components/
  ui/                 Reusable primitives
    Button.tsx          Link/button, one primary style
    SectionWrapper.tsx  Consistent width + horizontal padding
    Reveal.tsx          Scroll-triggered reveal (IntersectionObserver)
    ImagePlaceholder.tsx  Intentional stand-in for real imagery
    EmailCapture.tsx    Working form: validation + states + endpoint TODO
    Eyebrow.tsx         Section kicker
    cn.ts               classnames joiner
  sections/           One component per page section (Navbar → Footer)
    RoiCalculator.tsx   The centerpiece — live, client-side
    HeroVisual.tsx      Abstract CSS/SVG "trapped work → capacity" animation
lib/
  roi.ts              Pure ROI math + formatters (unit-testable, no UI)
  site.ts             CTA labels, nav links, primary-conversion anchor
```

Sections render in the order required by the brief: Navbar → Hero → Trust bar →
Problem → Solution → Services → How it works → Results → Why Brilliant AI → ROI
calculator → FAQ → Final CTA → Footer.

---

## Swapping image placeholders

Content imagery (logos, portraits, screenshots) uses
`components/ui/ImagePlaceholder.tsx` — an intentional, styled block that shows
what art belongs there. **Decorative** visuals (gradients, the hero animation,
diagrams) are pure CSS/SVG and are *not* placeholders.

To ship a real image, replace the placeholder at the call site with
`next/image`:

```tsx
// before
<ImagePlaceholder label="Client logo" aspectRatio="5 / 2" />

// after
import Image from "next/image";
<Image src="/logos/acme.svg" alt="Acme" width={160} height={64} />
```

Drop the asset in `/public` and reference it with a root-relative path. The
placeholder's `aspectRatio` tells you the shape to target.

Search the codebase for `ImagePlaceholder` to find every slot, and for
`[PLACEHOLDER:` to find every copy/metric stand-in (trust lines, testimonials,
results, engagement cost range, founder story, security specifics).

---

## Wiring the email endpoint

Both lead forms use one component: `components/ui/EmailCapture.tsx`. The submit
handler contains a clearly marked `TODO` with a simulated request. Replace it
with a real call:

```tsx
const res = await fetch("/api/subscribe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, source, payload }),
});
if (!res.ok) throw new Error("Request failed");
```

- `source` identifies which form submitted (`"roi-calculator"` or
  `"footer-newsletter"`) — useful for routing and analytics.
- `payload` on the calculator form carries the full `{ inputs, results }` so you
  can send the user their breakdown.
- Success and error states are already handled by the component.

Add the endpoint as a Next.js Route Handler (`app/api/subscribe/route.ts`) or
point it at your ESP / CRM. No backend is included by design.

---

## Design & accessibility notes

- **Dark, futuristic base + one accent** (electric violet) defined as tokens in
  `globals.css`. Change the brand color in one place: `--color-accent-*`.
- **Motion respects `prefers-reduced-motion`** — reveals, drifts, and the hero
  particles are all disabled under it (see `globals.css`).
- **Keyboard + semantics**: semantic landmarks, labelled inputs, visible focus
  ring, skip-to-content link, native `<details>` accordion for the FAQ.
- **Mobile-first**: on phones the hero headline + primary CTA occupy the first
  viewport (the hero column uses `min-h-[calc(100svh-9rem)]`).

---

## The ROI calculator

`lib/roi.ts` holds the math as pure functions (easy to unit-test). The section
computes **live** from user input, shows its assumptions on screen (all
editable, defaulted conservatively), and **reveals results before** asking for
an email. The email capture appears only after the result, to send a shareable
breakdown (built by `buildBreakdown()` so the emailed labels match the page).

**Output framing is load-bearing — do not reorder it.** Capacity and output are
the primary results: hours reclaimed per week/year, additional volume the same
team can carry, and the opportunities that capacity lets you take. The monetary
figure is *secondary*, smaller, and labelled **"value of capacity redeployed"** —
anchored to what an hour of the team's time *returns to the business*, not what
it costs to employ someone.

No per-person cost is ever collected or displayed. There is deliberately no
"loaded hourly cost" input; it is `hourlyValue` — the value of an hour. Any
people-equivalent figure appears only as *"full-time capacity you didn't have to
hire for"*, never as roles removed. These strings must not appear anywhere,
including tooltips, alt text, and the emailed breakdown: labour/labor cost
saved, salary or payroll savings, cost per head, FTEs eliminated, workforce.

The engagement cost used for the payback line is a placeholder
(`[PLACEHOLDER: engagement cost range]`); set your real range in
`RoiCalculator.tsx` and `DEFAULT_INPUTS.engagementCost` in `lib/roi.ts`.

---

## Acceptance checklist

Run before launch, and again after any copy change.

- [ ] Calculator leads with capacity/output figures. No labour-cost,
      salary-savings, per-head, or FTE-removed figure appears anywhere —
      including tooltips, chart axes, alt text, and the emailed breakdown.
- [ ] "We plan for the people, not just the systems" is the lead
      differentiator in the Why Brilliant AI section.
- [ ] **The employee test passes**: no headline or result label on the page
      would embarrass a leader whose entire team read it. Nothing phrases
      outcomes in terms of people rather than work, uses per-person cost
      language, or expresses gains as roles removed.
- [ ] Every `[PLACEHOLDER: …]` is replaced with a real, verifiable figure.
      Do not launch with invented proof.
- [ ] Verification grep returns nothing in user-facing copy:

      grep -rniE "salary|payroll|cost saved|cost savings|per head|headcount|\bFTE|workforce" app components lib
