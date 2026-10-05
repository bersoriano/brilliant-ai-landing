"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useEffect, useState } from "react";
import { useInquiry } from "../inquiry/InquiryContext";
import { buildInquiryHref } from "@/lib/inquiry";
import {
  CONTACT_EMAIL,
  DISCOVERY_CALL_HREF,
  PRIMARY_CTA,
  WHATSAPP_CTA,
  WHATSAPP_HREF,
  WHATSAPP_NUMBER,
} from "@/lib/site";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./FinalCta.module.css";
type Status = "idle" | "sending" | "sent" | "error";

const COUNTRIES = [
  ["US", "United States"],
  ["MX", "Mexico"],
  ["CA", "Canada"],
  ["other", "Another country"],
];
/** Homepage buyers are finance and healthcare; everything else is "Other". */
const SECTORS = [
  ["finance", "Finance"],
  ["healthcare", "Healthcare"],
  ["other", "Other"],
];

export function FinalCta() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [fallbackHref, setFallbackHref] = useState("");
  const [industry, setIndustry] = useState("");
  const { selectedWorkflow, selectWorkflow, sectorHint } = useInquiry();
  useEffect(() => {
    if (selectedWorkflow) setIndustry(selectedWorkflow.industry);
    setStatus("idle");
  }, [selectedWorkflow]);
  useEffect(() => {
    if (sectorHint) setIndustry(sectorHint.sector);
  }, [sectorHint]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const details = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      organization: String(data.get("organization") || ""),
      country: String(data.get("country") || ""),
      phone: String(data.get("phone") || ""),
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
    <section id="contact" className="section shell grid-12">
      <div className={styles.copy}>
        <Kicker>{t("Start with a workflow review")}</Kicker>
        <h2 className="h2">
          {t("One workflow.")}
          <br />
          <em>{t("A practical way forward.")}</em>
        </h2>
        <p className="lead">
          {t("Bring the task that keeps coming back.")}{" "}
          {t(
            "We’ll talk through how it works today and where automation could help.",
          )}
        </p>
        <ul className={`rule-list ${styles.promises}`}>
          <li>
            <Icon name="check" size={16} />
            {t("Map the task and the tools involved")}
          </li>
          <li>
            <Icon name="check" size={16} />
            {t("Identify the approvals and exceptions")}
          </li>
          <li>
            <Icon name="check" size={16} />
            {t("Agree on a useful next step")}
          </li>
        </ul>
        <p className="caption">
          {t("A focused 20-minute conversation. No technical brief needed.")}
        </p>
        <div>
          <a className="button" href={DISCOVERY_CALL_HREF}>
            {t(PRIMARY_CTA)}
          </a>
          <p className={`caption ${styles.bookingNote}`}>
            {t("Bookings are managed by Haab Calendar, our client and trusted partner.")}
          </p>
        </div>
        <div className={styles.channels}>
          <p className="label">{t("Prefer another channel?")}</p>
          <a className="text-link" href={WHATSAPP_HREF} rel="noopener">
            {t(WHATSAPP_CTA)} <span className="caption">{WHATSAPP_NUMBER}</span>
          </a>
          <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL} <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
      <form
        className={styles.form}
        onSubmit={submit}
        onChange={() => setStatus((prev) => (prev === "sending" ? prev : "idle"))}
      >
        <h3 className="h3">{t("What task should we look at?")}</h3>
        {selectedWorkflow && (
          <div className={styles.selection} role="status">
            <div>
              <span className="label">{t("Your starting point")}</span>
              <strong>{t(selectedWorkflow.title)}</strong>
            </div>
            <button
              type="button"
              className={styles.clear}
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
        <div className={styles.row}>
          <div className="field">
            <label htmlFor="contact-name">{t("Your name")}</label>
            <input
              id="contact-name"
              className="input"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-email">{t("Work email")}</label>
            <input
              id="contact-email"
              className="input"
              name="email"
              type="email"
              placeholder={t("name@organization.com")}
              autoComplete="email"
              required
              maxLength={254}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className="field">
            <label htmlFor="contact-organization">{t("Organization")}</label>
            <input
              id="contact-organization"
              className="input"
              name="organization"
              autoComplete="organization"
              required
              maxLength={120}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-country">{t("Country")}</label>
            <select
              id="contact-country"
              className="select"
              name="country"
              defaultValue={locale === "es" ? "MX" : ""}
              required
            >
              <option value="" disabled>
                {t("Select a country")}
              </option>
              {COUNTRIES.map(([value, label]) => (
                <option key={value} value={value}>
                  {t(label)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="contact-industry">{t("Sector")}</label>
          <select
            id="contact-industry"
            className="select"
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
              {t("Select a sector")}
            </option>
            {SECTORS.map(([value, label]) => (
              <option key={value} value={value}>
                {t(label)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="contact-workflow">
            {t(
              selectedWorkflow
                ? "Anything to add about your process? (optional)"
                : "What task should we look at?",
            )}
          </label>
          <textarea
            id="contact-workflow"
            className="textarea"
            name="workflow"
            placeholder={t(
              "The process, the bottleneck, or the work that keeps piling up…",
            )}
            rows={3}
            required={!selectedWorkflow}
            maxLength={2000}
          />
        </div>
        <div className="field">
          <label htmlFor="contact-phone">
            {t("Phone or WhatsApp (optional)")}
          </label>
          <input
            id="contact-phone"
            className="input"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
          />
        </div>
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="contact-company">{t("Company")}</label>
          <input
            id="contact-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <button
          className={`button ${styles.submit}`}
          type="submit"
          disabled={status === "sending"}
        >
          {t(status === "sending" ? "Sending…" : "Send workflow inquiry")}
        </button>
        <p className="caption">
          {t(
            "Share enough to have the conversation. Do not send patient records or account numbers.",
          )}
        </p>
        {status === "sent" && (
          <p role="status" className={`${styles.status} ${styles.sent}`}>
            <Icon name="check" size={16} />
            {t(
              "Got it — your request is with us. We’ll be in touch shortly.",
            )}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className={styles.status}>
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
    </section>
  );
}
