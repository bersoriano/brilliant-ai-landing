"use client";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { HAAB_VIDEO, captionModes, captionTracks } from "@/lib/software";
import { Exhibit } from "../ui/Exhibit";
import styles from "./SoftwareVideo.module.css";

/**
 * Exhibit 6: a one-minute recorded demo of Haab Calendar, our own booking
 * app, on a demo page with a fictional patient. It never autoplays and loads
 * nothing but the poster until the visitor presses play; captions in the
 * page's language are on by default (see captionTracks) and follow the
 * language switch.
 */
export function SoftwareVideo() {
  const { t, locale } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  // The language the tracks currently show. Loading uses `default`; only a
  // later switch sets the modes, so the first render stays as iOS expects.
  const shownLocale = useRef(locale);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || shownLocale.current === locale) return;
    shownLocale.current = locale;
    const tracks = [...video.querySelectorAll("track")];
    for (const [srcLang, mode] of captionModes(locale)) {
      const track = tracks.find((el) => el.srclang === srcLang)?.track;
      if (track) track.mode = mode;
    }
  }, [locale]);
  return (
    <Exhibit
      label={t("Exhibit {number}", { number: 6 })}
      tag={t("Sample data")}
      title={t("How a client books on Haab Calendar")}
      titleId="software-exhibit-title"
      caption={t(
        "Haab Calendar’s real booking flow on a demo page with a fictional patient. One minute, narrated in English, with captions.",
      )}
    >
      <div className={styles.body}>
        <video
          ref={videoRef}
          className={styles.video}
          controls
          preload="none"
          playsInline
          poster={HAAB_VIDEO.poster}
          width={HAAB_VIDEO.width}
          height={HAAB_VIDEO.height}
          aria-labelledby="software-exhibit-title"
        >
          <source src={HAAB_VIDEO.src} type="video/mp4" />
          {captionTracks(locale).map((track) => (
            <track
              key={track.srcLang}
              kind={track.kind}
              srcLang={track.srcLang}
              label={track.label}
              src={track.src}
              default={track.default}
            />
          ))}
          <a href={HAAB_VIDEO.src}>{t("Download the video (MP4)")}</a>
        </video>
        <p className="control">
          <span className="control__label">{t("Stays with you")}</span>
          <span className="control__text">
            {t(
              "Your hours, services, and booking rules. Clients book only inside them, and you can reschedule or cancel any booking.",
            )}
          </span>
        </p>
      </div>
    </Exhibit>
  );
}
