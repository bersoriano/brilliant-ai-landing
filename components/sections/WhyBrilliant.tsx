"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon } from "../ui/Icon";
export function WhyBrilliant() {
  const { t } = useLanguage();
  return (
    <section id="why" className="principles-section">
      <div className="shell principles-inner">
        <div className="principles-intro">
          <span className="eyebrow">{t("Human by design")}</span>
          <h2>
            {t("Better systems.")}
            <br />
            {t("Still your people.")}
          </h2>
          <p>
            {t(
              "We plan for the people, not just the systems. Your team shapes the workflow and keeps every decision that matters. We build it, run it, and keep it working.",
            )}
          </p>
        </div>
        <div className="principles-list">
          {[
            [
              "people",
              "People stay in control",
              "Define approval gates and exception handling before launch. Keep judgment with the people who know the work.",
            ],
            [
              "lock",
              "Your data deserves a plan",
              "Agree on access, retention, and vendor requirements before connecting sensitive information.",
            ],
            [
              "shield",
              "You own what we build",
              "The workflows, documentation, and IP are yours. We operate and maintain them; ownership and third-party dependencies are agreed in your scope.",
            ],
          ].map(([icon, title, body]) => (
            <div key={title}>
              <span className="principle-icon">
                <Icon name={icon} size={23} />
              </span>
              <div>
                <h3>{t(title)}</h3>
                <p>{t(body)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
