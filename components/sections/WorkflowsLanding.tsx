"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { InquiryProvider } from "@/components/inquiry/InquiryContext";
import { localePath } from "@/lib/locale";
import type { NoteLink } from "@/lib/posts";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { WorkflowOrAgent, WorkflowSpecimen } from "./Automation";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { LandingHero, NotesList } from "./Landing";
import { Navbar } from "./Navbar";
import { Solution } from "./Solution";
import { StickyCta } from "./StickyCta";
import styles from "./Landing.module.css";

/**
 * /workflows: the full workflow offer. Three examples drawn as pipelines, the
 * job picker (Exhibit 1) for finance and healthcare, the notes behind the
 * rules, and the contact form the picker fills in.
 */
export function WorkflowsLanding({ notes }: { notes: NoteLink[] }) {
  const { t, locale } = useLanguage();
  return (
    <>
      <Navbar />
      <InquiryProvider>
        <main id="main">
          <LandingHero
            titleId="workflows-title"
            kicker={t("AI Workflow Automations")}
            title={
              <>
                {t("Workflows that handle the work")}{" "}
                <em>{t("that arrives the same way every time.")}</em>
              </>
            }
            lead={t(
              "We build one reliable process around a task your team repeats — invoices, referrals, month-end packs, follow-ups — so the right information reaches the right person, ready for their approval.",
            )}
            secondary={
              <a className="text-link" href="#solutions">
                {t("See a workflow in motion")} <Icon name="arrow" size={16} />
              </a>
            }
            aside={<WorkflowSpecimen />}
          />

          <Solution />

          <section
            className={`shell section grid-12 ${styles.why}`}
            aria-labelledby="rules-title"
          >
            <div className={styles.head}>
              <Kicker>{t("Control stays with your team")}</Kicker>
              <h2 id="rules-title" className="h2-sm">
                {t("Most of the work is in the exceptions.")}{" "}
                <em>{t("So that’s where we start.")}</em>
              </h2>
              <p className="body">
                {t(
                  "Before we build, we agree in writing what the workflow checks, what counts as an exception, and who approves.",
                )}
              </p>
              <a
                className="text-link text-link--accent"
                href={localePath(locale, "/security")}
              >
                {t("Read how we handle financial and patient data")}{" "}
                <Icon name="arrow" size={16} />
              </a>
            </div>
            <div className={styles.side}>
              <NotesList notes={notes} />
            </div>
          </section>

          <WorkflowOrAgent current="services-workflows" />

          <FinalCta />
        </main>
      </InquiryProvider>
      <Footer />
      <StickyCta />
    </>
  );
}
