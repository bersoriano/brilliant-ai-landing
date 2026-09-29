"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import styles from "./Footer.module.css";
import { CONTACT_EMAIL, PRIMARY_CTA } from "@/lib/site";
import { localePath } from "@/lib/locale";
export function Footer() {
  const { t, locale } = useLanguage();
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.main}>
          <div className={styles.brand}>
            <p className={styles.tagline}>
              {t("Less repetitive work.")} <em>{t("More human potential.")}</em>
            </p>
            <p className="caption">
              {t(
                "AI automation for finance and healthcare teams in the United States, Canada, and Mexico.",
              )}
            </p>
          </div>
          <div className={styles.columns}>
            <div>
              <h3 className="label">{t("Explore")}</h3>
              <a href="#solutions">{t("Industry solutions")}</a>
              <a href="#services">{t("Our services")}</a>
              <a href="#how-it-works">{t("Our approach")}</a>
              <a href="#onsite-consulting">{t("Onsite consulting")}</a>
            </div>
            <div>
              <h3 className="label">{t("Get started")}</h3>
              <a href="#roi-calculator">{t("ROI calculator")}</a>
              <a href="#faq">{t("Common questions")}</a>
              <a href="#contact">{t(PRIMARY_CTA)}</a>
            </div>
            <div>
              <h3 className="label">{t("Say hello")}</h3>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <span className="caption">
                {t("Finance. Healthcare.")} {t("People-first automation.")}
              </span>
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
          <a href={localePath(locale, "/privacy")}>{t("Privacy notice")}</a>
          <a href="#top">{t("Back to top ↑")}</a>
        </div>
      </div>
    </footer>
  );
}
