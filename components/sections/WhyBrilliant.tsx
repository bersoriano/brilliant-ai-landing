"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Kicker } from "../ui/Kicker";
import styles from "./WhyBrilliant.module.css";
const principles = [
  [
    "People stay in control",
    "Define approval gates and exception handling before launch. Keep judgment with the people who know the work.",
  ],
  [
    "Your data deserves a plan",
    "Agree on access, retention, and vendor requirements before connecting sensitive information.",
  ],
  [
    "You own what we build",
    "The workflows, documentation, and IP are yours. We operate and maintain them; ownership and third-party dependencies are agreed in your scope.",
  ],
];
export function WhyBrilliant() {
  const { t } = useLanguage();
  return (
    <section id="why" className="section shell">
      <div className={styles.band}>
        <Kicker>{t("Human by design")}</Kicker>
        <h2 className={`statement ${styles.title}`}>
          {t("Better systems.")}
          <br />
          <em>{t("Still your people.")}</em>
        </h2>
        <p className="lead">
          {t(
            "We plan for the people, not just the systems. Your team shapes the workflow and keeps every decision that matters. We build it, run it, and keep it working.",
          )}
        </p>
        <ul className={styles.points}>
          {principles.map(([title, body]) => (
            <li key={title}>
              <h3 className="h3">{t(title)}</h3>
              <p className="body">{t(body)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
