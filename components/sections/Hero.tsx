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
    <>
      <section id="top" className={styles.hero}>
        <video
          className={styles.video}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/horizon_video_mobile.mp4" type="video/mp4" media="(max-width: 900px)" />
          <source src="/horizon_video.mp4" type="video/mp4" />
        </video>
        <div className={`shell grid-12 ${styles.inner}`}>
          <div className={styles.copy}>
            <Kicker>{t("AI automation for finance and healthcare")}</Kicker>
            <h1 className={styles.title}>
              {t("The capacity of a bigger team.")} <em>{t("Without the hiring.")}</em>
            </h1>
            <p className={styles.lead}>
              {t(
                "Done-for-you AI agents for finance and healthcare teams. Each person gets agents that handle their invoices, referrals, and follow-ups inside the tools you already use, and every approval stays with them.",
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
            <p className="caption">{t("20 minutes. Bring one repetitive task.")}</p>
          </div>
        </div>
      </section>
      <section className={styles.exhibitSection} aria-labelledby="exhibit-1-title">
        <div className="shell">
          <HeroVisual />
        </div>
      </section>
    </>
  );
}
