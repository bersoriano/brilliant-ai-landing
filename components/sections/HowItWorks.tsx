"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Kicker } from "../ui/Kicker";
import styles from "./HowItWorks.module.css";
const steps = [
  {
    title: "Walk us through the work",
    body: "Bring a routine task to a 20-minute workflow review. We map the handoffs, discuss where AI fits, and identify a useful first step.",
    deliverable: "A practical starting point",
    duration: "20 min",
  },
  {
    title: "We build your first workflow",
    body: "We scope a pilot, connect your approved tools, and test with representative data. You review the results alongside your current process.",
    deliverable: "A working pilot, reviewed by you",
    duration: "Pilot",
  },
  {
    title: "Keep it working, together",
    body: "We monitor the workflow, handle the exceptions, and keep it current as your business changes. Your team gets documentation and training on how to use it—running it stays with us.",
    deliverable: "A managed workflow, not a handover",
    duration: "Ongoing",
  },
];
const NUMERALS = ["i.", "ii.", "iii."];
export function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="section shell grid-12">
      <div className={styles.intro}>
        <Kicker>{t("A clear path forward")}</Kicker>
        <h2 className="h2-sm">
          {t("Start small.")} <em>{t("Make room for more.")}</em>
        </h2>
        <p className="body">
          {t("You know the process. We handle the build.")}{" "}
          {t("Start with one useful workflow, then expand from what you learn.")}
        </p>
      </div>
      <ol className={`rule-list ${styles.steps}`}>
        {steps.map((s, i) => (
          <li key={s.title} className={styles.step}>
            <span className="roman roman--lg">{NUMERALS[i]}</span>
            <div className={styles.copy}>
              <h3 className="h3">{t(s.title)}</h3>
              <p className="body">{t(s.body)}</p>
              <p className="caption">{t(s.deliverable)}</p>
            </div>
            <span className={`label ${styles.duration}`}>{t(s.duration)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
