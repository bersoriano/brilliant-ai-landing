"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ADVISOR_COPY } from "@/lib/advisor";
import { ArchitectureAdvisor } from "../ui/ArchitectureAdvisor";
import { Kicker } from "../ui/Kicker";
import { RichTemplate } from "../ui/RichTemplate";
import styles from "./AiArchitecture.module.css";

/**
 * Homepage Exhibit 3, after the Services cards: four questions about the
 * visitor's software and a starting point for AI that keeps what works. The
 * full explanation of the six patterns is the linked post; the section ends
 * on the review.
 */
export function AiArchitecture() {
  const { t } = useLanguage();
  return (
    <section id="ai-architecture" className={styles.band} aria-labelledby="ai-architecture-title">
      <div className="section shell">
        <header className={styles.intro}>
          <Kicker>{t("Where AI fits")}</Kicker>
          <h2 id="ai-architecture-title" className="h2">
            <RichTemplate
              template={t(ADVISOR_COPY.title)}
              values={{ accent: <em>{t(ADVISOR_COPY.accent)}</em> }}
            />
          </h2>
          <p className="lead">{t(ADVISOR_COPY.lead)}</p>
        </header>
        <ArchitectureAdvisor number={3} labelledBy="ai-architecture-title" />
      </div>
    </section>
  );
}
