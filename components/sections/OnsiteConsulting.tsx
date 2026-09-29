"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Kicker } from "../ui/Kicker";
import { ONSITE_CTA } from "@/lib/site";
import styles from "./OnsiteConsulting.module.css";

const countries: { code: string; name: string; note?: string }[] = [
  { code: "US", name: "USA" },
  { code: "MX", name: "Mexico" },
  { code: "CA", name: "Canada" },
  { code: "MY", name: "Malaysia", note: "Consulting arm — Southeast Asia" },
];

export function OnsiteConsulting() {
  const { t } = useLanguage();
  return (
    <section
      id="onsite-consulting"
      className="shell"
      aria-labelledby="onsite-title"
    >
      <div className={styles.band}>
        <div className={styles.copy}>
          <Kicker>{t("Onsite consulting")}</Kicker>
          <h2 id="onsite-title" className="h2-sm">
            {t("Work with us, in person.")}
          </h2>
          <p className="body">
            {t(
              "We work with finance and healthcare teams in the United States, Canada, and Mexico, and we provide onsite AI consulting in these countries. Our consulting arm in Malaysia serves clients across Southeast Asia. Work directly with our team to review your processes and plan your next steps in automation.",
            )}
          </p>
        </div>
        <div className={styles.side}>
          <ul
            className={styles.countries}
            aria-label={t("Countries we serve onsite")}
          >
            {countries.map(({ code, name, note }) => (
              <li key={code}>
                <span className="label">{t(name)}</span>
                {note && <span className="caption">{t(note)}</span>}
              </li>
            ))}
          </ul>
          <a href="#contact" className="button button--outline">
            {t(ONSITE_CTA)}
          </a>
        </div>
      </div>
    </section>
  );
}
