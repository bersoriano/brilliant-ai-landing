"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon } from "../ui/Icon";
export function TrustBar() {
  const { t } = useLanguage();
  return (
    <section className="integrations" aria-label={t("Tools we can connect")}>
      <div className="shell integration-inner">
        <p>
          {t("Your tools.")}
          <br />
          <strong>{t("Working better together.")}</strong>
        </p>
        <div className="tool-logos">
          <span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path
                fill="#929897"
                d="M0 0h9v9H0zm11 0h9v9h-9zM0 11h9v9H0zm11 0h9v9h-9z"
              />
            </svg>
            Microsoft
          </span>
          <span className="salesforce-logo">salesforce</span>
          <span>
            <Icon name="spark" size={25} /> OpenAI
          </span>
          <span className="google-logo">
            Google <small>Workspace</small>
          </span>
          <span className="quickbooks-logo">
            <b>qb</b> intuit<span>quickbooks</span>
          </span>
        </div>
      </div>
    </section>
  );
}
