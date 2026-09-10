"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
const organizations = [
  "Boston Consulting Group",
  "Bank of America",
  "Banorte Bank",
  "Bank of New York Mellon",
  "Accenture",
  "IBM",
];

export function PastExperience() {
  const { t } = useLanguage();
  return (
    <section
      id="experience"
      className="experience-section"
      aria-labelledby="experience-title"
    >
      <div className="shell">
        <div className="experience-heading">
          <div>
            <span className="eyebrow">{t("Professional background")}</span>
            <h2 id="experience-title">{t("Past professional experience.")}</h2>
          </div>
          <p>
            {t(
              "Prior professional work includes the organizations below. These are past experience references, not current Brilliant AI clients or partners; no endorsement is implied.",
            )}
          </p>
        </div>
        <ul
          className="experience-organizations"
          aria-label={t("Organizations previously worked with")}
        >
          {organizations.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
