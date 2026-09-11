"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon } from "../ui/Icon";

const countries = [
  { code: "US", name: "USA" },
  { code: "MX", name: "Mexico" },
  { code: "CA", name: "Canada" },
  { code: "MY", name: "Malaysia" },
];

export function OnsiteConsulting() {
  const { t } = useLanguage();
  return (
    <section
      id="onsite-consulting"
      className="onsite-section"
      aria-labelledby="onsite-title"
    >
      <div className="shell onsite-inner">
        <div className="onsite-copy">
          <span className="eyebrow">{t("Onsite consulting")}</span>
          <h2 id="onsite-title">{t("Work with us, in person.")}</h2>
          <p>
            {t(
              "We work with finance and healthcare teams in the United States, Canada, and Mexico, and we provide onsite AI consulting in these countries. Work directly with our team to review your processes and plan your next steps in automation.",
            )}
          </p>
          <a href="#contact" className="text-link">
            {t("Discuss an onsite visit")} <Icon name="arrow" size={17} />
          </a>
        </div>
        <ul
          className="onsite-countries"
          aria-label={t("Countries we serve onsite")}
        >
          {countries.map(({ code, name }) => (
            <li key={code}>
              <span className="onsite-country-code" aria-hidden="true">
                {code}
              </span>
              <span className="onsite-country-name">{t(name)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
