"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { CRM_AGENT_PLAYS } from "@/lib/crm";
import styles from "./AgentPlays.module.css";

/** Agent playbook for the homepage CRM exhibit: trigger, action, human approval, outcome. */
export function AgentPlays() {
  const { t } = useLanguage();
  return (
    <ol className={styles.plays}>
      {CRM_AGENT_PLAYS.map((play, i) => (
        <li key={play.when} className={styles.play}>
          <span className={styles.index} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className={styles.body}>
            <p className={styles.when}>
              <span className="label">{t("When")}</span>
              <strong>{t(play.when)}</strong>
            </p>
            <p className={styles.agent}>{t(play.agent)}</p>
            <dl className={styles.meta}>
              <div>
                <dt className="label">{t("You approve")}</dt>
                <dd>{t(play.approve)}</dd>
              </div>
              <div>
                <dt className="label">{t("You measure")}</dt>
                <dd>{t(play.measure)}</dd>
              </div>
            </dl>
          </div>
        </li>
      ))}
    </ol>
  );
}
