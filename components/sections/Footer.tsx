import { SectionWrapper } from "../ui/SectionWrapper";
import { EmailCapture } from "../ui/EmailCapture";
import { NAV_LINKS } from "@/lib/site";

const columns = [
  {
    heading: "Company",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Services", href: "#services" },
      { label: "Results", href: "#results" },
      { label: "Why Brilliant AI", href: "#why" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Calculate your ROI", href: "#roi-calculator" },
      { label: "Book a call", href: "#" }, // TODO: scheduling link
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" }, // TODO
      { label: "Terms", href: "#" }, // TODO
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t hairline bg-ink-950">
      <SectionWrapper width="wide" as="div" className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-2 font-bold tracking-tight">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.5l1.7 4.2 4.3 1.6-4.3 1.6L8 14.5 6.3 8.9 2 7.3l4.3-1.6L8 1.5z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="text-[1.05rem]">Brilliant AI</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-400">
              We turn the repetitive work draining your team into systems that
              just run &mdash; so your people do the work only humans can.
            </p>

            {/* Newsletter — the ONLY place it appears, tier-two ask. */}
            <div className="mt-8 max-w-sm">
              <p className="text-sm font-semibold text-mist-100">
                Brilliant Automations
              </p>
              <p className="mt-1 text-sm text-mist-400">
                One automation idea, every week.
              </p>
              <div className="mt-4">
                <EmailCapture
                  source="footer-newsletter"
                  cta="Subscribe"
                  compact
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-mist-500">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-mist-400 transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t hairline pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-mist-500">
            © {new Date().getFullYear()} Brilliant AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-mist-400">
            {/* TODO: real social links */}
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              LinkedIn
            </a>
            <a href="#" aria-label="X" className="hover:text-white">
              X
            </a>
            <a href="mailto:hello@brilliant.ai" className="hover:text-white">
              hello@brilliant.ai
            </a>
          </div>
        </div>
      </SectionWrapper>
    </footer>
  );
}
