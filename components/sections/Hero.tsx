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
        <Kicker>{t("Done-for-you AI automation")}</Kicker>
        <h1 className={`display ${styles.title}`}>
          {t("Busywork in.")}
          <br />
          <em>{t("Finished work out.")}</em>
        </h1>
        <p className="lead">
          {t(
            "We build and manage AI workflows for finance and healthcare teams in the United States, Canada, and Mexico—processing documents, preparing reports, and keeping follow-ups moving inside your existing systems.",
          )}
        </p>
        <div className={styles.actions}>
          <a href={DISCOVERY_CALL_HREF} className="button">
            {t(PRIMARY_CTA)}
          </a>
          <a href="#solutions" className="text-link">
            {t("See what we can automate")} <Icon name="arrow" size={16} />
          </a>
        </div>
        <p className="caption">{t("20 minutes. Bring one repetitive task.")}</p>
      </div>
      <HeroVisual />
    </section>
  );
}
