"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon } from "../ui/Icon";
const steps = [
  {
    title: "Walk us through the work",
    body: "Bring a routine task to a 20-minute workflow review. We map the handoffs, discuss where AI fits, and identify a useful first step.",
    deliverable: "A practical starting point",
  },
  {
    title: "We build your first workflow",
    body: "We scope a pilot, connect your approved tools, and test with representative data. You review the results alongside your current process.",
    deliverable: "A working pilot, reviewed by you",
  },
  {
    title: "Keep it working, together",
    body: "We agree on monitoring and support, train your team, and hand over the documentation. Ongoing care keeps the workflow useful as your business changes.",
    deliverable: "Your system, ready for everyday work",
  },
];
export function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="section shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t("A clear path forward")}</span>
          <h2>
            {t("Start small.")}
            <br />
            {t("Make room for more.")}
          </h2>
        </div>
        <p>
          {t("You know the process. We handle the build.")}
          <br className="desktop-break" />
          {t(
            "Start with one useful workflow, then expand from what you learn.",
          )}
        </p>
      </div>
      <div className="steps-grid">
        {steps.map((s, i) => (
          <article key={s.title} className="step">
            <div className="step-line">
              <span>0{i + 1}</span>
              <div />
              <Icon name="arrow" size={19} />
            </div>
            <h3>{t(s.title)}</h3>
            <p>{t(s.body)}</p>
            <div className="step-deliverable">
              <Icon name="check" size={15} />
              {t(s.deliverable)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
