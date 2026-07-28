import { SectionWrapper } from "../ui/SectionWrapper";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const painCards = [
  {
    title: "The report rebuilt every Monday",
    body: "Someone sharp spends the first morning of every week copying numbers into the same deck. Then does it again next Monday. Forever.",
  },
  {
    title: "The data moved between tabs",
    body: "Export here, clean it there, paste it in, check it twice. Hours a week of moving information a system could move in seconds.",
  },
  {
    title: "The onboarding that breaks when it&rsquo;s busy",
    body: "It works fine&hellip; until three clients arrive at once. Then the process that lives in one person&rsquo;s head starts dropping things.",
  },
];

export function Problem() {
  return (
    <SectionWrapper id="problem" width="wide" className="py-24 sm:py-32">
      <div className="max-w-3xl">
        <Eyebrow>The busywork trap</Eyebrow>
        <Reveal>
          <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Remember the deal you turned down.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-6 text-lg leading-relaxed text-mist-300">
            Not because you couldn&rsquo;t win it. The work was there. The demand
            was there. You said no because your team was already at the ceiling
            &mdash; and the best people you have were buried in work a system
            should have handled.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-4 text-lg leading-relaxed text-mist-300">
            That ceiling isn&rsquo;t rare. It shows up everywhere the same manual
            steps repeat, week after week:
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {painCards.map((card, i) => (
          <Reveal key={card.title} delay={i * 100}>
            <article className="h-full rounded-2xl border hairline bg-ink-900/60 p-6">
              <span
                aria-hidden
                className="mb-4 inline-grid h-10 w-10 place-items-center rounded-xl bg-ink-800 text-accent-300"
              >
                <LoopIcon />
              </span>
              <h3
                className="text-lg font-semibold"
                dangerouslySetInnerHTML={{ __html: card.title }}
              />
              <p
                className="mt-2 text-sm leading-relaxed text-mist-400"
                dangerouslySetInnerHTML={{ __html: card.body }}
              />
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mx-auto mt-14 max-w-3xl text-balance text-center text-xl font-medium leading-relaxed text-mist-100 sm:text-2xl">
          None of this is a people problem. Your best people deserve better than
          this &mdash; and the work that&rsquo;s holding them back is exactly the
          work a system was made to carry.
        </p>
      </Reveal>
    </SectionWrapper>
  );
}

function LoopIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
