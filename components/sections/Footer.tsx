"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import styles from "./Footer.module.css";
import {
  CALCULATOR_ANCHOR,
  CONTACT_EMAIL,
  PRIMARY_CTA,
  SITE_DOMAIN,
  WHATSAPP_HREF,
} from "@/lib/site";
import { localePath } from "@/lib/locale";
export function Footer() {
  const { t, locale } = useLanguage();
  // Section links work from any page: anchors resolve against the home page.
  const home = (hash: string) => `${localePath(locale, "/")}${hash}`;
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.main}>
          <div className={styles.brand}>
            <p className={styles.tagline}>
              {t("Less repetitive work.")} <em>{t("More human potential.")}</em>
            </p>
            <p className={styles.identity}>
              Brilliant AI · {SITE_DOMAIN} ·{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
            <p className="caption">
              {t(
                "AI automation for finance and healthcare teams in the United States, Canada, and Mexico.",
              )}{" "}
              {t("A consulting arm in Malaysia serves clients across Southeast Asia.")}
            </p>
          </div>
          <div className={styles.columns}>
            <div>
              <h3 className="label">{t("Explore")}</h3>
              <a href={home("#solutions")}>{t("Solutions")}</a>
              <a href={home("#how-it-works")}>{t("How it works")}</a>
              <a href={home(CALCULATOR_ANCHOR)}>{t("ROI calculator")}</a>
              <a href={home("#faq")}>{t("Common questions")}</a>
            </div>
            <div>
              <h3 className="label">{t("Trust")}</h3>
              <a href={localePath(locale, "/security")}>{t("Security and data")}</a>
              <a href={localePath(locale, "/about")}>{t("About")}</a>
              <a href={localePath(locale, "/privacy")}>{t("Privacy notice")}</a>
            </div>
            <div>
              <h3 className="label">{t("Get started")}</h3>
              <a href={home("#contact")}>{t(PRIMARY_CTA)}</a>
              <a href={WHATSAPP_HREF} rel="noopener">
                WhatsApp
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
          </div>
        </div>
        <div className={styles.legal}>
          <span className="caption">
            © {new Date().getFullYear()}{" "}
            {t("Brilliant AI. All rights reserved.")}
          </span>
          <nav className={styles.languages} aria-label={t("Language")}>
            <a href="/?lang=en" hrefLang="en" lang="en">
              English
            </a>
            <a href="/?lang=es" hrefLang="es-MX" lang="es-MX">
              Español
            </a>
          </nav>
          <a href="#top">{t("Back to top ↑")}</a>
        </div>
      </div>
    </footer>
  );
}
