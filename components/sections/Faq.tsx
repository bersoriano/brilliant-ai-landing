import { SectionWrapper } from "../ui/SectionWrapper";
import { Eyebrow } from "../ui/Eyebrow";

const faqs = [
  {
    q: "What does an engagement cost?",
    a: "It depends on the scope, but we scope so the reclaimed capacity pays it back fast — the calculator above lets you model that against your own numbers. We&rsquo;ll give you a fixed range before any commitment. [PLACEHOLDER: replace with your real engagement cost range.]",
  },
  {
    q: "How long until we see something working?",
    a: "We start with the highest-payoff work first, so most teams see a first system running in weeks, not months. You&rsquo;ll see the design before we build, and the working system before it touches your day-to-day.",
  },
  {
    q: "Do we need technical staff to run this?",
    a: "No. We hand systems over already running and built into the tools you use. Where something needs a human decision, it&rsquo;s clearly yours to make — no engineering team required on your side.",
  },
  {
    q: "What tools do you work with?",
    a: "We&rsquo;re tool-agnostic. We build around the stack you already have rather than pushing you onto something we resell, and we pick the best fit for your business.",
  },
  {
    q: "What industries do you work in?",
    a: "Any team with repetitive, rules-based work draining its best people — services, operations, finance, sales support, and more. If the work repeats, it can usually be freed. [PLACEHOLDER: name the industries you focus on once decided.]",
  },
  {
    q: "What if we don&rsquo;t know what to automate?",
    a: "That&rsquo;s what the audit is for. We watch how your week actually runs and point to the work worth automating first. You don&rsquo;t need a plan before you talk to us — you need a clear one after.",
  },
  {
    q: "How is our data handled and secured?",
    a: "Your data stays in your systems and under your control. We work within your existing access and security policies, use least-privilege access, and can sign an NDA and a data processing agreement before we start. [PLACEHOLDER: state your specific security practices, certifications, and sub-processors.]",
  },
  {
    q: "What happens if an automation fails?",
    a: "Systems are built with monitoring, sensible fallbacks, and alerts so a failure surfaces immediately rather than silently. Critical steps can pause for human review instead of proceeding on bad data. If something breaks, it fails safe and we&rsquo;re notified.",
  },
  {
    q: "What&rsquo;s the implementation risk, and how do you de-risk it?",
    a: "We de-risk by starting small and reversible: a scoped first system, designed with you before it&rsquo;s built, run alongside your current process until you trust it. You approve each step. Nothing goes live before you&rsquo;ve seen it work.",
  },
  {
    q: "What happens to the people whose work gets automated?",
    a: "Most roles change rather than disappear — the parts of a job a system should have handled go away, and the person gets time back for the work they were actually hired for. Where a role is mostly automatable, we tell you early and build a redeployment plan into the engagement. What you do with it is your decision, but we&rsquo;ll always raise it.",
  },
  {
    q: "Who owns the systems you build — and what if we part ways?",
    a: "You do. The logic, the configuration, and the credentials are yours. There&rsquo;s no lock-in: if we part ways, your systems keep running and you keep full access. We&rsquo;ll document everything so your team can carry it forward.",
  },
];

export function Faq() {
  return (
    <SectionWrapper id="faq" width="default" className="py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow className="justify-center">Questions</Eyebrow>
        <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          The things a careful leader asks first.
        </h2>
      </div>

      <div className="mx-auto mt-12 max-w-3xl divide-y hairline overflow-hidden rounded-2xl border hairline bg-ink-900/40">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6 py-1 marker:content-none">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium text-mist-100">
              <span dangerouslySetInnerHTML={{ __html: f.q }} />
              <span
                aria-hidden
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border hairline text-accent-300 transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p
              className="pb-5 pr-11 text-sm leading-relaxed text-mist-400"
              dangerouslySetInnerHTML={{ __html: f.a }}
            />
          </details>
        ))}
      </div>
    </SectionWrapper>
  );
}
