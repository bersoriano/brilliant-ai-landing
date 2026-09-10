"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon } from "../ui/Icon";
export function HeroVisual() {
  const { t } = useLanguage();
  return (
    <div
      className="hero-visual"
      role="img"
      aria-label={t(
        "Illustrative invoice workflow: a supplier invoice arrives in Outlook, Brilliant AI checks the details, and your finance team reviews the entry before it reaches QuickBooks.",
      )}
    >
      <div className="visual-grid" />
      <div className="orbit orbit-outer" />
      <div className="orbit orbit-middle" />
      <div className="orbit orbit-inner" />
      <div className="visual-caption">
        <span className="status-dot" />
        {t("Example: invoice to approval")}
      </div>
      <svg
        className="workflow-wires"
        viewBox="0 0 560 550"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M123 163v64q0 22 22 22h135v75M416 125v102q0 22-22 22H280M280 299v90q0 24 24 24h120"
          stroke="#575044"
          strokeWidth="1.4"
        />
        <path
          d="M123 163v64q0 22 22 22h135v75"
          stroke="#ff9465"
          strokeWidth="2"
          strokeDasharray="5 210"
        />
        <circle cx="280" cy="249" r="3" fill="#f5976d" />
      </svg>
      <div className="visual-node document-node">
        <span className="node-icon">
          <Icon name="document" size={22} />
        </span>
        <div>
          <strong>{t("Invoice received")}</strong>
          <small>{t("Outlook / shared inbox")}</small>
        </div>
        <span className="node-status" />
      </div>
      <div className="visual-node approval-node">
        <span className="avatar-stack">
          <span>JD</span>
          <span>MK</span>
        </span>
        <div>
          <strong>{t("Finance, in control")}</strong>
          <small>{t("Exceptions stay visible")}</small>
        </div>
      </div>
      <div className="ai-core">
        <div className="core-face">
          <Icon name="spark" size={47} />
        </div>
        <span>brilliant ai</span>
      </div>
      <div className="visual-node completed-node">
        <div className="completed-heading">
          <span className="completion-icon">
            <Icon name="check" size={17} />
          </span>
          <strong>{t("Ready for your review.")}</strong>
          <span className="mini-dots">···</span>
        </div>
        <div className="completed-row">
          <span>{t("Invoice details checked")}</span>
          <Icon name="check" size={14} />
        </div>
        <div className="completed-row">
          <span>{t("Exceptions highlighted")}</span>
          <Icon name="check" size={14} />
        </div>
        <div className="completed-row">
          <span>{t("Approval request prepared")}</span>
          <Icon name="check" size={14} />
        </div>
        <div className="completion-track">
          <span />
        </div>
      </div>
      <div className="time-note">
        <Icon name="spark" size={16} />
        {t("Your team approves the next step")}
      </div>
      <span className="visual-example">{t("Illustrative workflow")}</span>
    </div>
  );
}
