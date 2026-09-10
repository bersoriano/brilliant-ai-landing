"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useEffect, useState } from "react";
import { useInquiry } from "../inquiry/InquiryContext";
import { buildInquiryHref } from "@/lib/inquiry";
import { CONTACT_EMAIL } from "@/lib/site";
import { Icon } from "../ui/Icon";
export function FinalCta() {
  const { t, locale } = useLanguage();
  const [prepared, setPrepared] = useState(false);
  const [industry, setIndustry] = useState("");
  const { selectedWorkflow, selectWorkflow } = useInquiry();
  useEffect(() => {
    if (selectedWorkflow) setIndustry(selectedWorkflow.industry);
    setPrepared(false);
  }, [selectedWorkflow]);
  function prepareEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.location.href = buildInquiryHref(
      CONTACT_EMAIL,
      {
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        industry,
        message: String(data.get("workflow") || ""),
        workflowTitle: selectedWorkflow?.title,
      },
      locale,
    );
    setPrepared(true);
  }
  return (
    <section id="contact" className="contact-section">
      <div className="shell contact-inner">
        <div className="contact-copy">
          <span className="contact-tag">
            <span />
            {t("Start with a workflow review")}
          </span>
          <h2>
            {t("One workflow.")}
            <br />
            {t("A practical way forward.")}
          </h2>
          <p>
            {t("Bring the task that keeps coming back.")}
            <br />
            {t(
              "We’ll talk through how it works today and where automation could help.",
            )}
          </p>
          <div className="contact-promises">
            <span>
              <Icon name="check" size={16} />
              {t("Map the task and the tools involved")}
            </span>
            <span>
              <Icon name="check" size={16} />
              {t("Identify the approvals and exceptions")}
            </span>
            <span>
              <Icon name="check" size={16} />
              {t("Agree on a useful next step")}
            </span>
          </div>
          <p className="contact-review-note">
            {t("A focused 20-minute conversation. No technical brief needed.")}
          </p>
          <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL} <Icon name="diagonal" size={18} />
          </a>
        </div>
        <form
          className="contact-form"
          onSubmit={prepareEmail}
          onChange={() => setPrepared(false)}
        >
          <h3>{t("What would you like to automate?")}</h3>
          {selectedWorkflow && (
            <div className="inquiry-selection" role="status">
              <Icon name={selectedWorkflow.icon} size={21} />
              <div>
                <span>{t("Your starting point")}</span>
                <strong>{t(selectedWorkflow.title)}</strong>
              </div>
              <button
                type="button"
                aria-label={t("Clear selected workflow")}
                onClick={() => {
                  selectWorkflow(null);
                  document.getElementById("contact-workflow")?.focus();
                }}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}
          {selectedWorkflow && (
            <input
              type="hidden"
              name="workflowExample"
              value={selectedWorkflow.id}
            />
          )}
          <div className="form-row">
            <div>
              <label htmlFor="contact-name">{t("Your name")}</label>
              <input
                id="contact-name"
                name="name"
                placeholder={t("Alex Morgan")}
                autoComplete="name"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="contact-email">{t("Work email")}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder={t("alex@company.com")}
                autoComplete="email"
                required
                maxLength={254}
              />
            </div>
          </div>
          <label htmlFor="contact-industry">{t("Your industry")}</label>
          <select
            id="contact-industry"
            name="industry"
            value={industry}
            onChange={(event) => {
              setIndustry(event.target.value);
              if (
                selectedWorkflow &&
                event.target.value !== selectedWorkflow.industry
              )
                selectWorkflow(null);
            }}
            required
          >
            <option value="" disabled>
              {t("Select your industry")}
            </option>
            <option value="finance">{t("Finance")}</option>
            <option value="healthcare">{t("Healthcare")}</option>
            <option value="other">{t("Another industry")}</option>
          </select>
          <label htmlFor="contact-workflow">
            {t(
              selectedWorkflow
                ? "Anything to add about your process? (optional)"
                : "What would you like to take off your plate?",
            )}
          </label>
          <textarea
            id="contact-workflow"
            name="workflow"
            placeholder={t(
              "The process, the bottleneck, or the work that keeps piling up…",
            )}
            rows={3}
            required={!selectedWorkflow}
            maxLength={2000}
          />
          <button className="button contact-submit" type="submit">
            {t("Request a workflow review")} <Icon name="diagonal" size={17} />
          </button>
          <p className="form-note">
            {t(
              "Opens a draft in your email app for you to send. Please don’t include patient records or sensitive financial data.",
            )}
          </p>
          {prepared && (
            <p role="status" className="form-status">
              {t(
                "Email draft requested. Send it from your email app to reach us. No app opened? Email",
              )}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
              {t("directly.")}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
