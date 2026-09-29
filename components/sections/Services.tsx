"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Kicker } from "../ui/Kicker";
import styles from "./Services.module.css";
const services = [
  {
    title: "Automation discovery",
    text: "Find the bottlenecks worth fixing. Leave with a prioritized roadmap, a clear scope, and a business case.",
    tag: "Start with the right problem",
  },
  {
    title: "Custom AI agents",
    text: "Purpose-built assistants that extract, classify, and draft. Grounded in your information, guided by your rules.",
    tag: "Intelligence with boundaries",
  },
  {
    title: "Connected workflows",
    text: "Turn disconnected steps into one reliable process. From the first request to the final handoff.",
    tag: "Make the whole process work",
  },
  {
    title: "Integration & ongoing care",
    text: "Connect to your existing stack. Monitor performance, handle exceptions, and improve as your needs change.",
    tag: "Built to keep working",
  },
];
export function Services() {
  const { t } = useLanguage();
  return (
    <section id="services" className="section shell">
      <div className={styles.head}>
        <div>
          <Kicker>{t("From possibility to production")}</Kicker>
          <h2 className={`h2 ${styles.title}`}>
            {t("Practical AI.")} <em>{t("Real work, taken care of.")}</em>
          </h2>
        </div>
        <p className="body">
          {t("Strategy, implementation, and ongoing support.")}{" "}
          {t("One partner to get it working—and keep it that way.")}
        </p>
      </div>
      <ol className={styles.columns}>
        {services.map((s, i) => (
          <li key={s.title} className={styles.column}>
            <span className="label">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="h3">{t(s.title)}</h3>
            <p className="body">{t(s.text)}</p>
            <p className={styles.tag}>{t(s.tag)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
