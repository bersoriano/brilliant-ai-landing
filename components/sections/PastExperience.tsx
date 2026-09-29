"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import styles from "./PastExperience.module.css";
const organizations = [
  "Boston Consulting Group",
  "Bank of America",
  "Banorte Bank",
  "Bank of New York Mellon",
  "Accenture",
  "IBM",
];

/** Past professional experience of the team. These are not clients. */
export function PastExperience() {
  const { t } = useLanguage();
  return (
    <section
      id="experience"
      className="shell"
      aria-labelledby="experience-title"
    >
      <div className={styles.strip}>
        <div className={styles.intro}>
          <h2 id="experience-title" className="label">
            {t("Organizations previously worked with")}
          </h2>
          <p className="caption">
            {t(
              "Prior professional work includes the organizations below. These are past experience references, not current Brilliant AI clients or partners; no endorsement is implied.",
            )}
          </p>
        </div>
        <ul className={styles.names}>
          {organizations.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
