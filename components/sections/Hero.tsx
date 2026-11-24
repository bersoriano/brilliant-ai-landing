"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { HeroVisual } from "./HeroVisual";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import styles from "./Hero.module.css";

const VIDEO_MEDIA = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";

export function Hero() {
  const { t } = useLanguage();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const desktopMotion = window.matchMedia(VIDEO_MEDIA);
    const start = () => {
      if (desktopMotion.matches && window.scrollY < window.innerHeight) setShowVideo(true);
    };
    const stop = () => {
      if (!desktopMotion.matches) setShowVideo(false);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    desktopMotion.addEventListener("change", stop);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      desktopMotion.removeEventListener("change", stop);
    };
  }, []);

  return (
    <>
      <section id="top" className={styles.hero}>
        <picture aria-hidden="true">
          <source media="(max-width: 900px)" type="image/webp" srcSet="/hero-threshold-mobile.webp" />
          <source media="(max-width: 900px)" srcSet="/hero-threshold-mobile.jpg" />
          <source type="image/webp" srcSet="/hero-threshold.webp" />
          <img className={styles.poster} src="/hero-threshold.jpg" alt="" fetchPriority="high" />
        </picture>
        {showVideo && (
          <video className={styles.video} src="/horizon_video.mp4" autoPlay loop muted playsInline
            aria-hidden="true" onPlaying={(event) => { event.currentTarget.dataset.playing = "true"; }} />
        )}
        <div className={`shell grid-12 ${styles.inner}`}>
          <div className={styles.copy}>
            <h1 className={styles.title}>{t("AI automation for finance and healthcare")}</h1>
            <p className={styles.promise}>{t("Do the work of a bigger team,")} {t("without hiring one.")}</p>
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
