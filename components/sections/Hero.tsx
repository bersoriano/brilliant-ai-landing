"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { HeroVisual } from "./HeroVisual";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./Hero.module.css";
export function Hero() {
  const { t } = useLanguage();
  return (
    <section id="top" className={`shell grid-12 ${styles.hero}`}>
      <div className={styles.copy}>
        <Kicker>{t("Done-for-you AI automation for finance and healthcare")}</Kicker>
        <h1 className={styles.title}>
          {t(
            "We take the repetitive work off your team\u00a0— invoices, reports, referrals, follow-ups\u00a0— and run it inside the tools you already use.",
          )}
        </h1>
        <p className={styles.line}>
          {t("Busywork in.")} <em>{t("Finished work out.")}</em>
        </p>
        <p className="lead">
          {t(
            "You keep every approval that matters. We build the workflow, monitor it, and handle the exceptions. United States, Canada, and Mexico.",
          )}
        </p>
        <div className={styles.actions}>
          <a href={DISCOVERY_CALL_HREF} className="button">
            {t(PRIMARY_CTA)}
          </a>
          <a href="#solutions" className="text-link">
            {t("See a workflow in motion")} <Icon name="arrow" size={16} />
          </a>
        </div>
        <p className="caption">
          {t("20 minutes. Bring one repetitive task.")}
          <br />
          {t("Bookings are managed by Haab Calendar, our client and trusted partner.")}
        </p>
      </div>
      <HeroVisual />
    </section>
  );
}
