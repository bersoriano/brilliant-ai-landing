"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import styles from "./ConsultantExperience.module.css";

export function ConsultantExperience() {
  const { t } = useLanguage();

  return (
    <section className={styles.section} aria-labelledby="consultant-experience-title">
      <div className="shell">
        <h2 id="consultant-experience-title" className={styles.intro}>
          {t("Our consultants have worked previously with")}
        </h2>
        <p className={styles.brands}>
          <span>Bank of America</span>, <span>Banorte Bank</span>,{" "}
          <span>Bank of New York Mellon</span>, <span>BCG</span>,{" "}
          <span>Accenture</span> {t("and more.")}
        </p>
      </div>
    </section>
  );
}
