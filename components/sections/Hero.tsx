"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { HeroVisual } from "./HeroVisual";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { Reveal } from "../ui/Reveal";
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
              {t("Do the work of a bigger team,")} <em>{t("without hiring one.")}</em>
            </h1>
            <p className={styles.lead}>
              {t(
                "We build and run AI agents that prepare invoices, referrals, and follow-ups in the tools you already use. Your team still signs off on every one.",
              )}
            </p>
            <div className={styles.actions}>
              <a href={DISCOVERY_CALL_HREF} className="button">
                {t(PRIMARY_CTA)}
              </a>
              <a href="#exhibit-1" className="text-link">
                {t("Watch a workflow run")} <Icon name="arrow" size={16} />
              </a>
            </div>
            <p className="caption">
              {t("It’s free. Bring one task your team repeats, and we’ll tell you what we’d do with it.")}
            </p>
          </div>
        </div>
      </section>
      {/* "Watch a workflow run" lands here: the run plays on first view */}
      <section
        id="exhibit-1"
        className={styles.exhibitSection}
        aria-labelledby="exhibit-1-title"
      >
        <Reveal className="shell">
          <HeroVisual />
        </Reveal>
      </section>
    </>
  );
}
