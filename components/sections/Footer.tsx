"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Brand, Icon } from "../ui/Icon";
import { CONTACT_EMAIL } from "@/lib/site";
export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <div>
            <Brand footer />
            <p>
              {t("Less repetitive work.")}
              <br />
              {t("More human potential.")}
            </p>
          </div>
          <div className="footer-links">
            <div>
              <h3>{t("Explore")}</h3>
              <a href="#solutions">{t("Industry solutions")}</a>
              <a href="#services">{t("Our services")}</a>
              <a href="#how-it-works">{t("Our approach")}</a>
            </div>
            <div>
              <h3>{t("Get started")}</h3>
              <a href="#roi-calculator">{t("ROI calculator")}</a>
              <a href="#faq">{t("Common questions")}</a>
              <a href="#contact">
                {t("Let’s talk")} <Icon name="diagonal" size={13} />
              </a>
            </div>
            <div>
              <h3>{t("Say hello")}</h3>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <span>
                {t("Finance. Healthcare.")}
                <br />
                {t("People-first automation.")}
              </span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()}{" "}
            {t("Brilliant AI. All rights reserved.")}
          </span>
          <a href="/privacy">{t("Privacy notice")}</a>
          <a href="#top">{t("Back to top ↑")}</a>
        </div>
      </div>
    </footer>
  );
}
