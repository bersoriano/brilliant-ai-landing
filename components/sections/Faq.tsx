"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { DISCOVERY_CALL_HREF } from "@/lib/site";
import { Icon } from "../ui/Icon";
const faqs = [
  [
    "What happens in the first workflow review?",
    "Bring one task your team repeats. In a 20-minute conversation, we’ll talk through the inputs, tools, handoffs, and approval points. We’ll identify a useful starting point and discuss what needs deeper discovery before a pilot can be scoped. There’s no need to prepare a technical brief.",
  ],
  [
    "Do we need an AI specialist on our team?",
    "You need someone who knows the process and can review the results. We handle the technical discovery, build, and agreed support. Your team helps define what good looks like, approves access, and learns how to manage the finished workflow.",
  ],
  [
    "How long does an implementation take?",
    "Timing depends on the workflow, integrations, data quality, and review requirements. We agree on a delivery plan after discovery, with a scoped pilot and clear acceptance criteria before expanding. Your team reviews the system before it goes live.",
  ],
  [
    "Can you work with our existing tools?",
    "That is the starting point. We review your existing systems and available APIs, then choose the simplest reliable integration. Access, licensing, and vendor limitations are confirmed during discovery so the scope reflects what your tools actually support.",
  ],
  [
    "How do you approach sensitive financial or patient data?",
    "We begin by defining what data the workflow needs, who can access it, where it is processed, and how long it is retained. Security, vendor agreements, and any applicable regulatory requirements must be reviewed with your team before sensitive data is connected. An automation does not by itself establish compliance.",
  ],
  [
    "What if an AI output is wrong?",
    "AI output is treated as something to validate. We define checks, approval steps, and exception handling around the risk of each task. Important decisions stay with your team, with a clear path to pause or revert to the existing process.",
  ],
  [
    "What does it cost, and what happens after launch?",
    "Pricing follows the scope: the workflow, required integrations, and level of support. Your proposal separates implementation from third-party and ongoing costs. We also agree on documentation, handover, monitoring, and support responsibilities before work begins.",
  ],
];
export function Faq() {
  const { t } = useLanguage();
  return (
    <section id="faq" className="section shell faq-section">
      <div className="faq-intro">
        <span className="eyebrow">{t("A little more clarity")}</span>
        <h2>
          {t("Good questions.")}
          <br />
          {t("Straight answers.")}
        </h2>
        <p>
          {t("Thoughtful automation starts")}
          <br />
          {t("with an honest conversation.")}
        </p>
        <a href={DISCOVERY_CALL_HREF} className="text-link">
          {t("Ask us something else")} <Icon name="arrow" size={17} />
        </a>
      </div>
      <div className="faq-list">
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {t(q)}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{t(a)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
