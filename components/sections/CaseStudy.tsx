"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  CASE_STUDY,
  caseStudyCopy,
  shouldRenderCaseStudy,
} from "@/lib/caseStudy";
import { Icon } from "../ui/Icon";

export function CaseStudy() {
  const { t, locale } = useLanguage();
  if (!shouldRenderCaseStudy(process.env.NODE_ENV === "production"))
    return null;
  const copy = caseStudyCopy(locale);
  return (
    <section
      id="case-study"
      className="case-section"
      aria-labelledby="case-title"
    >
      <div className="shell case-inner">
        {!CASE_STUDY.approved && (
          <p className="case-draft" role="status">
            <Icon name="shield" size={16} />
            {t(
              "Draft: these figures are placeholders and are hidden in production. Replace them with substantiated results, then set approved to true.",
            )}
          </p>
        )}
        <div className="case-heading">
          <div>
            <span className="eyebrow">{copy.sector}</span>
            <h2 id="case-title">{t("One workflow, measured.")}</h2>
            <p className="case-client">
              {copy.client} · {copy.workflow}
            </p>
          </div>
          <div className="case-headline">
            <strong>{copy.headline.value}</strong>
            <span>{copy.headline.label}</span>
          </div>
        </div>
        <div className="case-body">
          <div className="case-stage">
            <span className="small-label">{t("Before")}</span>
            <p>{copy.before}</p>
          </div>
          <div className="case-stage case-stage-after">
            <span className="small-label">{t("After")}</span>
            <p>{copy.after}</p>
          </div>
        </div>
        <ul className="case-metrics">
          {copy.metrics.map((metric) => (
            <li key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </li>
          ))}
        </ul>
        {copy.quote && (
          <blockquote className="case-quote">
            <p>{copy.quote.text}</p>
            <footer>{copy.quote.attribution}</footer>
          </blockquote>
        )}
        <a href="#contact" className="text-link case-link">
          {t("Discuss a workflow like this")} <Icon name="arrow" size={16} />
        </a>
      </div>
    </section>
  );
}
