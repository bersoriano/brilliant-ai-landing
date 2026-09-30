"use client";
// Exhibit body: what actually arrives (left) and what the team receives once
// the workflow has done its part (right). The action on the card is drawn,
// not a control — it stays visibly disabled because a person must act.
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { CheckState, Scene } from "@/lib/scenes";
import { Icon } from "./Icon";
import styles from "./DocumentScene.module.css";

const MARK: Record<CheckState, string> = {
  ok: "check",
  flag: "!",
  owner: "people",
  hold: "lock",
};

export function DocumentScene({
  scene,
  steps,
}: {
  scene: Scene;
  /** Optional animated step strip (hero): e.g. Collect → Match → Flag → Approval. */
  steps?: string[];
}) {
  const { t } = useLanguage();
  const { inbound, card } = scene;
  return (
    <div className={styles.scene}>
      <div className={styles.panel}>
        <p className="label">{t("What arrives")}</p>
        <div className={styles.email}>
          <p className={styles.channel}>{t(inbound.channel)}</p>
          <p className={styles.from}>{t(inbound.from)}</p>
          <p className={styles.subject}>{t(inbound.subject)}</p>
          <p className={styles.attachment}>
            <Icon name="document" size={14} />
            {t(inbound.attachment)}
          </p>
        </div>
        <div className={styles.paper}>
          <p className={styles.paperTitle}>{t(inbound.title)}</p>
          <dl className={styles.lines}>
            {inbound.lines.map(([label, value, flagged]) => (
              <div key={label} data-flagged={flagged || undefined}>
                <dt>{t(label)}</dt>
                <dd>{t(value)}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.flag}>
            <span aria-hidden="true">!</span>
            {t(inbound.flag)}
          </p>
        </div>
      </div>

      <div className={styles.panel}>
        <p className="label">{t("What your team receives")}</p>
        <div className={styles.card}>
          <p className={styles.channel}>{t(card.channel)}</p>
          <p className={styles.cardTitle}>{t(card.title)}</p>
          <ul className={styles.checks}>
            {card.checks.map((check) => (
              <li key={check.label} data-state={check.state}>
                <span className={styles.mark} aria-hidden="true">
                  {MARK[check.state] === "!" ? (
                    "!"
                  ) : (
                    <Icon name={MARK[check.state]} size={13} />
                  )}
                </span>
                {t(check.label)}
              </li>
            ))}
          </ul>
          <p className={styles.attachments}>{t(card.attachments)}</p>
          <div className={styles.cardFoot}>
            <span className={`status status--${card.statusTone}`}>
              {t(card.status)}
            </span>
            <span className={styles.action} aria-disabled="true">
              {t(card.action)}
            </span>
          </div>
          <p className={styles.waits}>{t("Waits for a person to act.")}</p>
        </div>
      </div>

      {steps ? (
        <ol className={styles.steps} aria-label={t("Workflow steps")}>
          {steps.map((step, i) => (
            <li key={step} style={{ animationDelay: `${0.6 + i * 1.3}s` }}>
              <span aria-hidden="true">{["i.", "ii.", "iii.", "iv."][i]}</span>
              {t(step)}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
