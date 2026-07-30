import { SectionWrapper } from "../ui/SectionWrapper";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

/** Where the team did the work before Brilliant AI. Text wordmarks, not logos —
 *  we don't ship third-party marks we don't have permission to use. */
const companies = [
  { name: "Boston Consulting Group", short: "BCG" },
  { name: "IBM", short: "IBM" },
  { name: "Accenture", short: "ACN" },
  { name: "Bank of America", short: "BofA" },
  { name: "Bank of New York Mellon", short: "BNY Mellon" },
  { name: "Merrill Lynch", short: "Merrill" },
];

export function PastExperience() {
  return (
    <SectionWrapper id="experience" width="wide" className="py-24 sm:py-32">
      <div className="max-w-2xl">
        <Eyebrow>Experience</Eyebrow>
        <Reveal>
          <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Our past experience.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 leading-relaxed text-mist-300">
            Real-world experience from previous roles. Proven scope of work in
            complex technical environments.
          </p>
        </Reveal>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {companies.map((c, i) => (
          <Reveal as="li" key={c.name} delay={i * 70}>
            <div className="group flex h-full min-h-28 flex-col justify-center rounded-2xl border hairline bg-ink-900/50 p-6 transition duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:border-accent-400/60 hover:bg-accent-500/[0.10] hover:shadow-[0_0_0_1px_var(--color-accent-500),0_14px_40px_-12px_var(--color-accent-600)]">
              <p className="text-lg font-semibold leading-snug text-mist-100 transition-colors group-hover:text-accent-300">
                {c.short}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-mist-500 transition-colors group-hover:text-mist-300">
                {c.name}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </SectionWrapper>
  );
}
