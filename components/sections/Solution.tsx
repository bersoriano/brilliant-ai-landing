import { SectionWrapper } from "../ui/SectionWrapper";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const pillars = [
  {
    title: "Reclaim your team&rsquo;s time",
    body: "Automate the repetitive so your people spend their days on judgment, relationships, and the creative calls only humans make.",
    icon: "clock",
  },
  {
    title: "Systems that don&rsquo;t sleep",
    body: "Your automations run 24/7 &mdash; no errors from a long day, no bottleneck when one person is out, no dropped steps when it&rsquo;s busy.",
    icon: "bolt",
  },
  {
    title: "Grow without the hiring wall",
    body: "Take on more volume without the same rise in cost. Say yes to the next deal because you finally have the capacity to deliver it.",
    icon: "trend",
  },
  {
    title: "Built for your business",
    body: "Bespoke to your tools and handed over already running. No engineering team required on your side to keep it going.",
    icon: "blocks",
  },
];

export function Solution() {
  return (
    <SectionWrapper id="solution" width="wide" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="justify-center">Here&rsquo;s the better way</Eyebrow>
        <Reveal>
          <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Your team is already brilliant. The work is what&rsquo;s holding them
            back.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-6 text-lg leading-relaxed text-mist-300">
            We don&rsquo;t replace what your people do. We take the work that was
            never worth their time &mdash; so they can do the work only they can
            do.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 80}>
            <article className="h-full rounded-2xl border hairline bg-gradient-to-b from-ink-900/80 to-ink-950 p-7">
              <span
                aria-hidden
                className="mb-5 inline-grid h-11 w-11 place-items-center rounded-xl bg-accent-500/12 text-accent-300 ring-1 ring-accent-400/25"
              >
                <PillarIcon name={p.icon} />
              </span>
              <h3
                className="text-xl font-semibold"
                dangerouslySetInnerHTML={{ __html: p.title }}
              />
              <p
                className="mt-2.5 leading-relaxed text-mist-400"
                dangerouslySetInnerHTML={{ __html: p.body }}
              />
            </article>
          </Reveal>
        ))}
      </div>

      {/* The bridge — stated explicitly, never assumed. */}
      <Reveal delay={100}>
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-accent-400/25 bg-accent-500/[0.06] p-8 text-center">
          <p className="text-balance text-lg leading-relaxed text-mist-100 sm:text-xl">
            The capacity comes from freeing your people, not replacing them. You
            couldn&rsquo;t take that deal because your best people were buried in
            work a system should have handled.{" "}
            <span className="text-accent-300">Free them, and the ceiling lifts.</span>
          </p>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}

function PillarIcon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case "trend":
      return (
        <svg {...common}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M17 7h4v4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
  }
}
