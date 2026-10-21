"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { CRM_AGENT_PLAYS } from "@/lib/crm";
import { localePath } from "@/lib/locale";
import type { NoteLink } from "@/lib/posts";
import { AGENT_CONTROLS } from "@/lib/services";
import { AgentPlays } from "../ui/AgentPlays";
import { Exhibit } from "../ui/Exhibit";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { Reveal } from "../ui/Reveal";
import { AgentSpecimen, WorkflowOrAgent } from "./Automation";
import { Footer } from "./Footer";
import { LandingClose, LandingHero, NotesList } from "./Landing";
import { Navbar } from "./Navbar";
import styles from "./Landing.module.css";

/**
 * /agents: the full agent offer. Requests in plain language, an agent's
 * playbook inside a tool the team already uses (Exhibit 1), and the rules
 * that keep every approval with a person.
 */
export function AgentsLanding({ notes }: { notes: NoteLink[] }) {
  const { t, locale } = useLanguage();
  return (
    <>
      <Navbar />
      <main id="main">
        <LandingHero
          titleId="agents-title"
          kicker={t("AI Agents")}
          title={
            <>
              {t("Agents for the work")} <em>{t("that changes from day to day.")}</em>
            </>
          }
          lead={t(
            "Each person on your team gets agents that find, draft, and follow up inside the tools you already use. They work with the same permissions as the person asking, and every important step waits for approval.",
          )}
          aside={<AgentSpecimen />}
        />

        <section className="band-paper" aria-labelledby="tools-title">
          <div className={`shell section grid-12 ${styles.assistant}`}>
            <div className={styles.assistantCopy}>
              <Kicker>{t("Inside the tools you already use")}</Kicker>
              <h2 id="tools-title" className="h2-sm">
                {t("No new app to learn.")}{" "}
                <em>{t("The agent comes to your tools.")}</em>
              </h2>
              <p className="body">
                {t(
                  "An agent works in your CRM, your ERP, or the inbox where requests arrive. It finds, drafts, and follows up; a person on your team decides what happens next.",
                )}
              </p>
              <a
                className="text-link text-link--accent"
                href={localePath(locale, "/custom-crm")}
              >
                {t("See the custom CRM")} <Icon name="arrow" size={16} />
              </a>
            </div>
            <Reveal className={styles.chatExhibit}>
              <Exhibit
                label={t("Exhibit {number}", { number: 1 })}
                tag={t("Examples")}
                title={t("Where an agent could start in your CRM")}
                titleId="agents-exhibit-title"
                caption={t(
                  "Examples to adapt, not client results. Start with high-volume, low-judgment work, and keep a person on anything that leaves your team.",
                )}
              >
                <AgentPlays
                  plays={CRM_AGENT_PLAYS}
                  id="agent-play"
                  label={t("Where an agent could start in your CRM")}
                />
              </Exhibit>
            </Reveal>
          </div>
        </section>

        <section
          className={`shell section grid-12 ${styles.security}`}
          aria-labelledby="control-title"
        >
          <div className={styles.head}>
            <Kicker>{t("Control stays with your team")}</Kicker>
            <h2 id="control-title" className="h2-sm">
              {t("Agents prepare. Your team decides.")}
            </h2>
            <a
              className="text-link text-link--accent"
              href={localePath(locale, "/security")}
            >
              {t("Read how we handle financial and patient data")}{" "}
              <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className={styles.side}>
            <ul className={styles.reasons}>
              {AGENT_CONTROLS.map(([title, body]) => (
                <li key={title}>
                  <h3 className={styles.itemTitle}>{t(title)}</h3>
                  <p className="body">{t(body)}</p>
                </li>
              ))}
            </ul>
            <NotesList notes={notes} />
          </div>
        </section>

        <WorkflowOrAgent current="services-agents" />

        <LandingClose
          title={
            <>
              {t("Bring one request your team repeats.")}{" "}
              <em>{t("We’ll show you what an agent would do.")}</em>
            </>
          }
          lead={t(
            "In 20 minutes we map the request, the tools it touches, and where a person approves.",
          )}
        />
      </main>
      <Footer />
    </>
  );
}
