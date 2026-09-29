"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { PageHeader } from "@/components/sections/PageHeader";
import { Footer } from "@/components/sections/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { localePath } from "@/lib/locale";
import { CONTACT_EMAIL } from "@/lib/site";
import styles from "../about/Page.module.css";

/**
 * How we work by default. Terms vary by client, so the page describes a
 * process the client controls — never a certification we do not hold.
 */
const SECTIONS: [heading: string, body: string][] = [
  [
    "What a workflow may touch",
    "Only the documents and fields a workflow needs, agreed in writing during discovery. By default we do not store full card numbers, Social Security numbers or other national identifiers (such as CURP), or unredacted clinical notes, unless your contract requires it and your team approves the controls.",
  ],
  [
    "Where processing happens",
    "In your own tenant and systems first. When a third-party processor is needed — a model provider, an email service, a hosting platform — we name it, and it is used only with your approval and on the terms you set, including whether your data may be used for training.",
  ],
  [
    "Logging, retention, and subprocessors",
    "Access and actions are logged per workflow. Retention periods and the list of subprocessors are set with your team and written into the scope. You can ask for the current list at any time.",
  ],
  [
    "Healthcare in the United States (HIPAA)",
    "When a workflow touches protected health information, we work under a Business Associate Agreement on the terms your organization requires, agreed before any data is connected.",
  ],
  [
    "Mexico: personal data and residency",
    "For personal data in Mexico, we work under the Federal Law on the Protection of Personal Data Held by Private Parties (LFPDPPP) and your privacy notice. If data must stay in a specific country or region, that requirement is written into the scope.",
  ],
  [
    "Certifications",
    "We do not claim certifications or attestations on this site. If your review requires them, send us your security questionnaire and we will answer it for your specific workflow.",
  ],
  [
    "Human approval gates",
    "Approval points are designed with your team before go-live: who reviews, what they see, and what cannot happen without them. Nothing posts, pays, or files until a person you name approves it.",
  ],
  [
    "What if the model is wrong?",
    "Output is validated against checks we agree with you. When something fails a check or looks unusual, the workflow pauses and routes to a person. You can revert to your current process at any time.",
  ],
];

export default function SecurityContent() {
  const { t, locale } = useLanguage();
  return (
    <>
      <PageHeader />
      <main id="main" className={`shell ${styles.page}`}>
        <a className="text-link" href={localePath(locale, "/")}>
          {t("← Back to home")}
        </a>
        <Kicker>{t("Security and data")}</Kicker>
        <h1 className="h2">
          {t("How we handle financial and patient data")}
        </h1>
        <p className="lead">
          {t(
            "Every engagement runs on your requirements. This is how we work by default; your security and compliance teams set the final terms before any data is connected.",
          )}
        </p>
        <div className={styles.sections}>
          {SECTIONS.map(([heading, body]) => (
            <section key={heading}>
              <h2>{t(heading)}</h2>
              <p>{t(body)}</p>
            </section>
          ))}
          <section>
            <h2>{t("Security questionnaires")}</h2>
            <p>
              {t("Send it to")}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              {t(". We’ll return it with the details of your workflow.")}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
