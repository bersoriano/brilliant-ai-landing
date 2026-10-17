"use client";
import { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { CRM_AGENT_PLAYS } from "@/lib/crm";
import styles from "./AgentPlays.module.css";

/**
 * Agent playbook for the homepage CRM exhibit. Every trigger stays visible as
 * a tab; the selected one shows its chain: what the agent does, what a person
 * approves, and what you measure.
 */
export function AgentPlays() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const play = CRM_AGENT_PLAYS[active];
  const count = CRM_AGENT_PLAYS.length;
  return (
    <div className={styles.plays}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-orientation="vertical"
        aria-label={t("Where an agent could start in your CRM")}
      >
        {CRM_AGENT_PLAYS.map((item, index) => (
          <button
            key={item.when}
            id={`play-tab-${index}`}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={index === active}
            aria-controls="play-panel"
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? count - 1
                    : event.key === "ArrowDown" || event.key === "ArrowRight"
                      ? (index + 1) % count
                      : (index - 1 + count) % count;
              setActive(next);
              document.getElementById(`play-tab-${next}`)?.focus();
            }}
          >
            <span className="label">{t("When")}</span>
            <span className={styles.when}>{t(item.when)}</span>
          </button>
        ))}
      </div>
      <ol
        key={active}
        id="play-panel"
        role="tabpanel"
        aria-labelledby={`play-tab-${active}`}
        className={styles.chain}
      >
        <li data-node="agent">
          <span className="label">{t("What it does")}</span>
          <span>{t(play.agent)}</span>
        </li>
        <li data-node="approve">
          <span className="label">{t("You approve")}</span>
          <span>{t(play.approve)}</span>
        </li>
        <li data-node="measure">
          <span className="label">{t("You measure")}</span>
          <span>{t(play.measure)}</span>
        </li>
      </ol>
    </div>
  );
}
