"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  CASE_STUDY,
  caseStudyCopy,
  shouldRenderCaseStudy,
} from "@/lib/caseStudy";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { PRIMARY_CTA } from "@/lib/site";
import styles from "./CaseStudy.module.css";

export function CaseStudy() {
  const { t, locale } = useLanguage();
  if (!shouldRenderCaseStudy(process.env.NODE_ENV === "production"))
    return null;
  const copy = caseStudyCopy(locale);
  return (
    <section
      id="case-study"
      className="section shell"
      aria-labelledby="case-title"
    >
      {!CASE_STUDY.approved && (
        <p className={`caption ${styles.draft}`} role="status">
          <Icon name="shield" size={16} />
          {t(
            "Draft: these figures are placeholders and are hidden in production. Replace them with substantiated results, then set approved to true.",
          )}
        </p>
      )}
      <Kicker>{copy.sector}</Kicker>
      <h2 id="case-title" className={`h2-sm ${styles.title}`}>
        {t("One workflow, measured.")}
      </h2>
      <figure className={styles.exhibit} aria-labelledby="case-title">
        <div className="exhibit__head">
          <span className="exhibit__label">
            {t("Exhibit {number}", { number: 4 })}
          </span>
        </div>
        <div className={styles.headline}>
          <p className="statement">{copy.headline.value}</p>
          <p className="caption">{copy.headline.label}</p>
        </div>
        <ul className={styles.metrics}>
          {copy.metrics.map((metric) => (
            <li key={metric.label}>
              <span className="numeral">{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
        <div className={styles.cells}>
          <div className={styles.cell}>
            <p className="label">{t("Before")}</p>
            <p className={styles.text}>{copy.before}</p>
          </div>
          <div className={`${styles.cell} ${styles.cellAccent}`}>
            <p className="label">{t("After")}</p>
            <p className={styles.text}>{copy.after}</p>
          </div>
        </div>
        <figcaption className="exhibit__caption">
          {copy.client} · {copy.workflow}
        </figcaption>
      </figure>
      {copy.quote && (
        <blockquote className={styles.quote}>
          <p>{copy.quote.text}</p>
          <footer className="label">{copy.quote.attribution}</footer>
        </blockquote>
      )}
      <a href="#contact" className="text-link text-link--accent">
        {t(PRIMARY_CTA)} <Icon name="arrow" size={16} />
      </a>
    </section>
  );
}
