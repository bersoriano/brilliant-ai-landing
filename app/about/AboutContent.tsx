"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { PageHeader } from "@/components/sections/PageHeader";
import { Footer } from "@/components/sections/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { localePath } from "@/lib/locale";
import { CONTACT_EMAIL, SITE_DOMAIN } from "@/lib/site";
import styles from "./Page.module.css";

/** Prior employers of the team. Background only — never clients or partners. */
const ORGANIZATIONS = [
  "Boston Consulting Group",
  "Bank of America",
  "Merrill Lynch",
  "Banorte",
  "BNY Mellon",
  "Accenture",
  "IBM",
];

export default function AboutContent() {
  const { t, locale } = useLanguage();
  return (
    <>
      <PageHeader />
      <main id="main" className={`shell ${styles.page}`}>
        <a className="text-link" href={localePath(locale, "/")}>
          {t("← Back to home")}
        </a>
        <Kicker>{t("About")}</Kicker>
        <h1 className="h2">{t("About Brilliant AI")}</h1>
        <p className="lead">
          {t(
            "Brilliant AI builds and runs AI workflows for finance and healthcare operations teams in the United States, Canada, and Mexico. We take one repetitive task, pilot it on your tools, and keep it running — with your team on every approval that matters.",
          )}
        </p>
        <div className={styles.sections}>
          <section>
            <h2>{t("Where we work")}</h2>
            <p>
              {t(
                "Onsite reviews in the United States, Canada, and Mexico, including Mexico City. A consulting arm in Malaysia serves clients across Southeast Asia.",
              )}
            </p>
          </section>
          <section aria-labelledby="background-title">
            <h2 id="background-title">{t("Professional background")}</h2>
            <p>
              {t(
                "Prior professional work includes the organizations below. These are past experience references, not current Brilliant AI clients or partners; no endorsement is implied.",
              )}
            </p>
            <ul className={styles.organizations}>
              {ORGANIZATIONS.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>{t("How to verify us")}</h2>
            <p>
              Brilliant AI · {SITE_DOMAIN} ·{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
