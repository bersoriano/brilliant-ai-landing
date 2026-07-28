import { SectionWrapper } from "../ui/SectionWrapper";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

/** `lead` marks the differentiator that carries the section — the one
 *  competitors won't put in writing. It renders full-width and larger. */
const diffs: { title: string; body: string; lead?: boolean }[] = [
  {
    title: "We plan for the people, not just the systems",
    body: "Where a role is mostly automatable, we say so early &mdash; and we build a redeployment plan into the engagement. It&rsquo;s the conversation most firms leave you to have alone.",
    lead: true,
  },
  {
    title: "You own what we build",
    body: "The logic, the setup, the keys. No lock-in, and no dependency on us to keep it running.",
  },
  {
    title: "Tool-agnostic",
    body: "We use what fits your business, not what we resell. The recommendation is yours to trust.",
  },
  {
    title: "Speed to value",
    body: "[PLACEHOLDER: real time-to-first-automation &mdash; state the honest figure, e.g. &ldquo;first system live in X weeks.&rdquo;] We start where the payoff is clearest and build out from there.",
  },
];

export function WhyBrilliant() {
  return (
    <SectionWrapper id="why" width="wide" className="py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div>
          <Eyebrow>Why Brilliant AI</Eyebrow>
          <Reveal>
            <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              The way work gets done is changing.
            </h2>
          </Reveal>
          {/* The honest nod — once, calm, no hedging. */}
          <Reveal delay={80}>
            <p className="mt-5 text-lg leading-relaxed text-mist-300">
              We help you get ahead of it &mdash; building automation that frees
              your team to do their best work, not busywork.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {diffs.map((d, i) => (
              <Reveal
                key={d.title}
                delay={i * 70}
                className={d.lead ? "sm:col-span-2" : undefined}
              >
                <div
                  className={
                    d.lead
                      ? "h-full rounded-2xl border border-accent-400/30 bg-accent-500/[0.06] p-6"
                      : "h-full rounded-2xl border hairline bg-ink-900/50 p-5"
                  }
                >
                  <h3
                    className={`flex items-start gap-2 font-semibold ${
                      d.lead ? "text-lg sm:text-xl" : ""
                    }`}
                  >
                    <span aria-hidden className="mt-1 shrink-0 text-accent-300">
                      <Check />
                    </span>
                    <span
                      dangerouslySetInnerHTML={{ __html: d.title }}
                    />
                  </h3>
                  <p
                    className={`mt-2 leading-relaxed ${
                      d.lead ? "text-base text-mist-300" : "text-sm text-mist-400"
                    }`}
                    dangerouslySetInnerHTML={{ __html: d.body }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <aside className="rounded-3xl border hairline bg-gradient-to-b from-ink-900 to-ink-950 p-8">
            <ImagePlaceholder
              label="Founder portrait"
              aspectRatio="4 / 3"
              description="The founder, approachable — sets a human tone for the note below"
            />
            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-accent-300">
              A note from the founder
            </p>
            <p className="mt-3 leading-relaxed text-mist-300">
              [PLACEHOLDER: founder story &mdash; a few honest sentences on why you
              started Brilliant AI. Speak to having watched good teams get buried
              in work that never deserved them, and wanting to hand that time
              back. Keep it warm and specific.]
            </p>
          </aside>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
