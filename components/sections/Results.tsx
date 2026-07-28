import { SectionWrapper } from "../ui/SectionWrapper";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

const outcomes = [
  {
    metric: "[PLACEHOLDER: hours reclaimed / week]",
    label: "Time returned to the team",
    note: "Gather from before/after time studies with a launch client.",
  },
  {
    metric: "[PLACEHOLDER: % more volume, no added cost]",
    label: "Operating leverage unlocked",
    note: "Express as volume growth without matching cost growth.",
  },
  {
    metric: "[PLACEHOLDER: weeks to first system live]",
    label: "Speed to value",
    note: "Measure from kickoff to first automation running in production.",
  },
];

export function Results() {
  return (
    <SectionWrapper id="results" width="wide" className="py-24 sm:py-32">
      <div className="max-w-2xl">
        <Eyebrow>Results</Eyebrow>
        <Reveal>
          <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            What lifting the ceiling looks like.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 text-sm text-mist-500">
            This is a pre-launch site. Every figure below is a labelled
            placeholder &mdash; we don&rsquo;t publish numbers we haven&rsquo;t
            earned.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {outcomes.map((o, i) => (
          <Reveal key={i} delay={i * 90}>
            <article className="h-full rounded-2xl border hairline bg-ink-900/50 p-7">
              <p className="text-2xl font-bold leading-snug text-accent-300">
                {o.metric}
              </p>
              <p className="mt-3 font-medium text-mist-100">{o.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-mist-500">
                Proof to gather: {o.note}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <figure className="mt-8 grid items-center gap-8 rounded-3xl border hairline bg-gradient-to-br from-ink-900 to-ink-950 p-8 md:grid-cols-[220px_1fr] md:p-10">
          <ImagePlaceholder
            label="Client portrait"
            aspectRatio="1 / 1"
            description="Founder or ops lead, warm and real — not a stock headshot"
            className="w-full"
          />
          <div>
            <blockquote className="text-balance text-xl font-medium leading-relaxed text-mist-100 sm:text-2xl">
              &ldquo;[PLACEHOLDER: real testimonial &mdash; a leader describing the
              capacity they got back and the work they can now take on. Capture
              it in their words after a launch.]&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm text-mist-400">
              [PLACEHOLDER: name, role, company &mdash; with written permission to
              publish]
            </figcaption>
          </div>
        </figure>
      </Reveal>
    </SectionWrapper>
  );
}
