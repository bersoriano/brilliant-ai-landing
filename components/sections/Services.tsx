import { SectionWrapper } from "../ui/SectionWrapper";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const services = [
  {
    title: "AI Automation Audit",
    line: "We map your week and find the repetitive work worth handing to a system first.",
    icon: "search",
  },
  {
    title: "Custom AI Agents",
    line: "Assistants built for your process &mdash; drafting, sorting, answering, deciding within your rules.",
    icon: "spark",
  },
  {
    title: "Workflow Automation",
    line: "The manual hand-offs between your tools, wired to run on their own.",
    icon: "flow",
  },
  {
    title: "AI Integration",
    line: "AI dropped into the tools you already use, so nothing changes about how your team works.",
    icon: "plug",
  },
  {
    title: "Ongoing Optimization",
    line: "We keep your systems sharp as your business grows and your needs shift.",
    icon: "gauge",
  },
];

export function Services() {
  return (
    <SectionWrapper id="services" width="wide" className="py-24 sm:py-32">
      <div className="max-w-2xl">
        <Eyebrow>What we do</Eyebrow>
        <Reveal>
          <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Five ways we take the work off your team.
          </h2>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 70}>
            <article className="group h-full rounded-2xl border hairline bg-ink-900/50 p-6 transition-colors hover:border-accent-400/40">
              <span
                aria-hidden
                className="mb-4 inline-grid h-10 w-10 place-items-center rounded-xl bg-ink-800 text-accent-300"
              >
                <ServiceIcon name={s.icon} />
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p
                className="mt-2 text-sm leading-relaxed text-mist-400"
                dangerouslySetInnerHTML={{ __html: s.line }}
              />
            </article>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const c = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "search":
      return (
        <svg {...c}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </svg>
      );
    case "spark":
      return (
        <svg {...c}>
          <path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15l-1.8-4.2L5.5 9l4.7-1.3L12 3z" />
        </svg>
      );
    case "flow":
      return (
        <svg {...c}>
          <rect x="3" y="4" width="6" height="4" rx="1" />
          <rect x="15" y="16" width="6" height="4" rx="1" />
          <path d="M6 8v5a3 3 0 0 0 3 3h6" />
        </svg>
      );
    case "plug":
      return (
        <svg {...c}>
          <path d="M9 2v6M15 2v6" />
          <path d="M6 8h12v3a6 6 0 0 1-12 0V8z" />
          <path d="M12 20v2" />
        </svg>
      );
    default:
      return (
        <svg {...c}>
          <path d="M12 14a4 4 0 1 0-3.5-6" />
          <path d="M12 14l4-4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
      );
  }
}
