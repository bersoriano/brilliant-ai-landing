"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Kicker } from "../ui/Kicker";
import { DISCOVERY_CALL_HREF, ONSITE_CTA } from "@/lib/site";
import styles from "./OnsiteConsulting.module.css";

const countries = ["United States", "Canada", "Mexico"];

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
          <Kicker>{t("Onsite")}</Kicker>
          <h2 id="onsite-title" className="h2-sm">
            {t("Onsite reviews, including Mexico City.")}
          </h2>
          <p className="body">
            {t(
              "We can sit with your team for the review, in the United States, Canada, or Mexico.",
            )}
          </p>
        </div>
        <div className={styles.side}>
          <ul
            className={styles.countries}
            aria-label={t("Countries we serve onsite")}
          >
            {countries.map((name) => (
              <li key={name} className="label">
                {t(name)}
              </li>
            ))}
          </ul>
          <a href={DISCOVERY_CALL_HREF} className="button button--outline">
            {t(ONSITE_CTA)}
          </a>
          <p className="caption">
            {t("Bookings are managed by Haab Calendar, our client and trusted partner.")}
          </p>
        </div>
      </div>
    </section>
  );
}
