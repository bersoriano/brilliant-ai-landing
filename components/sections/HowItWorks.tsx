import { SectionWrapper } from "../ui/SectionWrapper";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Discover",
    time: "Week 1",
    body: "A short working session. We watch how your team actually spends its week and pick the repetitive work worth automating first.",
  },
  {
    n: "02",
    title: "Design",
    time: "Days, not months",
    body: "We map the system before we build it, so you see exactly what will run and where it fits &mdash; no surprises, no black boxes.",
  },
  {
    n: "03",
    title: "Deploy",
    time: "In your tools",
    body: "We build it into the tools you already use and hand it over running. Your team keeps working the way they always have.",
  },
  {
    n: "04",
    title: "Optimize",
    time: "Ongoing",
    body: "We watch it in the real world, tune it as you grow, and find the next piece of work worth freeing your people from.",
  },
];

export function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works" width="wide" className="py-24 sm:py-32">
      <div className="max-w-2xl">
        <Eyebrow>How it works</Eyebrow>
        <Reveal>
          <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Starting with AI is simpler than you think.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-5 text-lg leading-relaxed text-mist-300">
            Four steps. You stay in control at every one, and you see it working
            before it ever touches your day-to-day.
          </p>
        </Reveal>
      </div>

      <ol className="mt-14 grid gap-6 md:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} as="li" delay={i * 90}>
            <div className="relative h-full rounded-2xl border hairline bg-ink-900/50 p-6">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-accent-400/80">{s.n}</span>
                <span className="rounded-full bg-ink-800 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-mist-400">
                  {s.time}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p
                className="mt-2 text-sm leading-relaxed text-mist-400"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </div>
          </Reveal>
        ))}
      </ol>
    </SectionWrapper>
  );
}
