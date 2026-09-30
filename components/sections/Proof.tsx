"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { shouldRenderCaseStudy } from "@/lib/caseStudy";
import { localePath } from "@/lib/locale";
import { CaseStudy } from "./CaseStudy";
import { Icon } from "../ui/Icon";
import styles from "./Proof.module.css";

/**
 * One proof block. The case study renders only when approved (or in dev as a
 * draft). Until then: an honest line about the builders' background — no
 * employer logos on the homepage; those live on /about with their hedge.
 */
export function Proof() {
  const { t, locale } = useLanguage();
  if (shouldRenderCaseStudy(process.env.NODE_ENV === "production"))
    return <CaseStudy />;
  return (
    <section id="proof" className="shell" aria-labelledby="proof-title">
      <div className={styles.strip}>
        <h2 id="proof-title" className="label">
          {t("Who builds it")}
        </h2>
        <p className={styles.line}>
          {t(
            "Built by operators who have worked on finance and technology systems at global banks and consulting firms.",
          )}
        </p>
        <a className="text-link" href={localePath(locale, "/about")}>
          {t("See background")} <Icon name="arrow" size={16} />
        </a>
      </div>
    </section>
  );
}
