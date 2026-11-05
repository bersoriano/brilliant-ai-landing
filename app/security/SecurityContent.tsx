"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { PageHeader } from "@/components/sections/PageHeader";
import { Footer } from "@/components/sections/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { localePath } from "@/lib/locale";
import { CONTACT_EMAIL } from "@/lib/site";
import styles from "../about/Page.module.css";

/**
 * What we provide and the regulations we work under. Terms are set per client,
 * so SOC 2 and ISO 27001 appear only as requirements we scope to, never as
 * certifications we hold.
 */
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
        <h1 className="h2">{t("How we protect financial and patient data")}</h1>
        <p className="lead">
          {t(
            "We apply the highest technical security standards and follow the specific regulations that govern patient data in the United States and Mexico. Every engagement is built around your requirements. Your security and compliance teams set the final terms before any data is connected.",
          )}
        </p>
        <div className={styles.sections}>
          <section>
            <h2>{t("Technical security standards")}</h2>
            <p>{t("We design workflows with industry-standard security protocols from the start:")}</p>
            <ul className={styles.list}>
              <li>{t("Encryption in transit (TLS 1.2 or higher, preferably TLS 1.3) and at rest (AES-256 or equivalent)")}</li>
              <li>{t("Encryption on every connection between systems, parties, or external services")}</li>
              <li>{t("Role-based access control, authentication, and least-privilege principles")}</li>
              <li>{t("Comprehensive logging and audit trails for access and actions on every workflow")}</li>
              <li>{t("Data minimization by design — only the documents and fields a workflow needs, agreed in writing during discovery")}</li>
              <li>{t("Human approval gates designed with your team: nothing posts, pays, or files until a person you name approves it")}</li>
            </ul>
            <p>
              {t(
                "Output is validated against checks we agree with you. When something fails a check or looks unusual, the workflow pauses and routes to a person. You can always revert to your current process.",
              )}
            </p>
          </section>
          <section>
            <h2>{t("You choose which steps use AI")}</h2>
            <p>
              {t(
                "You choose which parts of a workflow use AI. Any step you want to keep for security or privacy reasons stays under your team’s control. We agree that split with you and write it into the scope.",
              )}
            </p>
          </section>
          <section>
            <h2>{t("United States — HIPAA")}</h2>
            <p>
              {t(
                "When a workflow touches protected health information, we work under a Business Associate Agreement on the terms your organization requires, agreed before any data is connected.",
              )}{" "}
              {t(
                "We implement technical, administrative, and physical safeguards aligned with the HIPAA Security Rule, including encryption practices that support the Breach Notification Rule’s safe harbor for properly encrypted data.",
              )}
            </p>
          </section>
          <section>
            <h2>{t("Mexico — patient data and personal data")}</h2>
            <p>
              {t(
                "For personal data in Mexico we work under the Federal Law on the Protection of Personal Data Held by Private Parties (LFPDPPP, updated 2025) and your privacy notice. Health data is treated as sensitive personal data, which requires express written consent and stronger security measures.",
              )}
            </p>
            <p>{t("We also align with the relevant Official Mexican Standards for clinical information:")}</p>
            <ul className={styles.list}>
              <li>{t("NOM-004-SSA3-2012 (clinical file) — confidentiality, integrity, and retention requirements (minimum five years from the last medical act)")}</li>
              <li>{t("NOM-024-SSA3-2012 (electronic health record systems) — security criteria including access control, authentication, auditing, encryption, and support for interoperability standards")}</li>
            </ul>
            <p>
              {t(
                "If data must stay in a specific country or region, that requirement is written into the scope. We support privacy notices, ARCO rights processes, and the administrative, technical, and physical security measures required under the LFPDPPP.",
              )}
            </p>
          </section>
          <section>
            <h2>{t("Where processing happens")}</h2>
            <p>
              {t(
                "Processing starts in your own tenant and systems whenever possible. When a third-party processor is needed — a model provider, an email service, a hosting platform — we name it, and it is used only with your approval and on the terms you set, including whether your data may be used for training.",
              )}
            </p>
            <p>
              {t(
                "Access and actions are logged per workflow. Retention periods and the list of subprocessors are set with your team and written into the scope. You can request the current list at any time.",
              )}
            </p>
          </section>
          <section>
            <h2>{t("Client-specific requirements and certifications")}</h2>
            <p>
              {t(
                "We scope security to the exact needs of each engagement. If your review, security questionnaire, or compliance program requires specific certifications (such as SOC 2 or ISO 27001), additional controls, specialized architecture, or particular attestations, we design the controls, bring in the right expertise, and produce the evidence your auditor needs as part of the work. The goal is the controls and evidence your team needs, not a fixed off-the-shelf set of claims.",
              )}
            </p>
            <p>
              {t("Send your security questionnaire to")}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              {t(". We’ll return it with the details of your specific workflow.")}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
