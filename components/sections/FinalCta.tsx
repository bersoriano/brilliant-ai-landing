"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useEffect, useState } from "react";
import { useInquiry } from "../inquiry/InquiryContext";
import { buildInquiryHref } from "@/lib/inquiry";
import { CONTACT_EMAIL, PRIMARY_CTA } from "@/lib/site";
import { Icon } from "../ui/Icon";
type Status = "idle" | "sending" | "sent" | "error";

export function FinalCta() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [fallbackHref, setFallbackHref] = useState("");
  const [industry, setIndustry] = useState("");
  const { selectedWorkflow, selectWorkflow } = useInquiry();
  useEffect(() => {
    if (selectedWorkflow) setIndustry(selectedWorkflow.industry);
    setStatus("idle");
  }, [selectedWorkflow]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const details = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      industry,
      message: String(data.get("workflow") || ""),
      workflowTitle: selectedWorkflow?.title,
    };
    // Prepared up front so the fallback is ready the moment delivery fails.
    setFallbackHref(buildInquiryHref(CONTACT_EMAIL, details, locale));
    setStatus("sending");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...details,
          company: String(data.get("company") || ""),
          locale,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      form.reset();
      selectWorkflow(null);
      setIndustry("");
    } catch {
      setStatus("error");
    }
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
          onSubmit={submit}
          onChange={() => setStatus((prev) => (prev === "sending" ? prev : "idle"))}
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
            <option value="operations">{t("Operations")}</option>
            <option value="sales">{t("Sales")}</option>
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
          <div className="form-honeypot" aria-hidden="true">
            <label htmlFor="contact-company">{t("Company")}</label>
            <input
              id="contact-company"
              name="company"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <button
            className="button contact-submit"
            type="submit"
            disabled={status === "sending"}
          >
            {t(status === "sending" ? "Sending…" : PRIMARY_CTA)}{" "}
            <Icon name="diagonal" size={17} />
          </button>
          <p className="form-note">
            {t(
              "Sent straight to us — no email app needed. Share enough to have the conversation; please leave out patient records and account numbers.",
            )}
          </p>
          {status === "sent" && (
            <p role="status" className="form-status form-status-sent">
              <Icon name="check" size={16} />
              {t(
                "Got it — your request is with us. We’ll be in touch shortly.",
              )}
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="form-status form-status-error">
              {t("That didn’t go through.")}{" "}
              {fallbackHref && (
                <>
                  <a href={fallbackHref}>{t("Send it as an email instead")}</a>
                  {", "}
                  {t("or write to")}{" "}
                </>
              )}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              {t(" directly.")}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
