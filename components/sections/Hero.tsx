"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { HeroVisual } from "./HeroVisual";
import { DISCOVERY_CALL_HREF } from "@/lib/site";
import { Icon } from "../ui/Icon";
export function Hero() {
  const { t } = useLanguage();
  return (
    <section id="top" className="hero shell">
      <div className="hero-copy">
        <div className="hero-tag">
          <span className="status-dot" />
          {t("Done-for-you AI automation")}
        </div>
        <h1>
          {t("AI that takes")}
          <br />
          {t("busywork off")}
          <br />
          <span className="hero-last">{t("your plate.")}</span>
        </h1>
        <p>
          {t(
            "We build and manage AI workflows for finance and healthcare—processing documents, preparing reports, and keeping follow-ups moving inside your existing systems.",
          )}
        </p>
        <div className="hero-actions">
          <a href={DISCOVERY_CALL_HREF} className="button">
            {t("Get a workflow review")} <Icon name="diagonal" size={18} />
          </a>
          <a href="#solutions" className="text-link">
            {t("See what we can automate")} <Icon name="arrow" size={16} />
          </a>
        </div>
        <div className="hero-footnote">
          <Icon name="clock" size={15} />
          <span>{t("20 minutes. Bring one repetitive task.")}</span>
        </div>
      </div>
      <HeroVisual />
      <div className="hero-bottom">
        <span>{t("Built around your people. Connected to your tools.")}</span>
        <a href="#solutions" aria-label={t("Scroll to explore solutions")}>
          {t("Scroll to explore")} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
