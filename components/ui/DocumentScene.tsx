"use client";
// Exhibit body drawn as the tools it runs in: the inbound window (what
// arrives) and the team's window (what they receive once the workflow has
// done its part). The action on the card is drawn, not a control: it stays
// visibly disabled because a person must act.
//
// `step` (0–3) lets the hero play the run: collect → match → flag → approval.
// Without it the scene renders its final state, which is also what the server
// and reduced-motion visitors get.
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

export type InboxRow = {
  from: string;
  subject: string;
  status: string;
  tone: "new" | "ok" | "flag" | "sent";
};

/** "Teams · Approvals" → ["Teams", "Approvals"]; "Intake queue" → ["Intake queue"]. */
function splitChannel(channel: string): [string, string?] {
  const [app, ...rest] = channel.split(" · ");
  return [app, rest.length ? rest.join(" · ") : undefined];
}

export function DocumentScene({
  scene,
  step = 3,
  inbox,
  times,
  control,
  approver,
  live = false,
}: {
  scene: Scene;
  step?: number;
  /** Highlight where the eye should go at each step (hero run only). */
  live?: boolean;
  /** Optional inbox list above the open message; the first row is this scene. */
  inbox?: InboxRow[];
  /** Clock shown in each window's title bar. */
  times?: [inbound: string, card: string];
  /** What stays with a person, shown under both windows. */
  control?: string;
  /** Who acts on the card, pinned to the foot of the team's window. */
  approver?: string;
}) {
  const { t } = useLanguage();
  const { inbound, card } = scene;
  const [inApp, inPlace] = splitChannel(t(inbound.channel));
  const [cardApp, cardPlace] = splitChannel(t(card.channel));
  const focus = ["collect", "match", "flag", "approve"][step] ?? "approve";
  return (
    <div
      className={styles.scene}
      data-focus={focus}
      data-live={live || undefined}
      data-inbox={inbox ? true : undefined}
      data-match={step >= 1 || undefined}
      data-flag={step >= 2 || undefined}
      data-sent={step >= 3 || undefined}
    >
      <section className={styles.window} aria-label={t("What arrives")}>
        <header className={styles.bar}>
          <span className={styles.app}>{inApp}</span>
          {inPlace ? <span className={styles.place}>{inPlace}</span> : null}
          {times ? <span className={styles.time}>{times[0]}</span> : null}
        </header>
        {inbox ? (
          <ul className={styles.inbox}>
            {inbox.map((row, i) => (
              <li key={row.subject} data-active={i === 0 || undefined}>
                <span className={styles.rowFrom}>{row.from}</span>
                <span className={styles.rowSubject}>{row.subject}</span>
                <span className={styles.rowStatus} data-tone={row.tone}>
                  {row.status}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className={styles.message}>
          <p className={styles.from}>{t(inbound.from)}</p>
          <p className={styles.subject}>{t(inbound.subject)}</p>
          <p className={styles.attachment}>
            <Icon name="document" size={14} />
            {t(inbound.attachment)}
          </p>
          <div className={styles.paper}>
            <p className={styles.paperTitle}>{t(inbound.title)}</p>
            <dl className={styles.lines}>
              {inbound.lines.map(([label, value, flagged]) => (
                <div key={label} data-flagged={flagged || undefined}>
                  <dt>{t(label)}</dt>
                  <dd>
                    {t(value)}
                    <span className={styles.tick} aria-hidden="true">
                      {flagged ? "!" : <Icon name="check" size={12} />}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className={styles.flag}>
              <span aria-hidden="true">!</span>
              {t(inbound.flag)}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.window} aria-label={t("What your team receives")}>
        <header className={styles.bar}>
          <span className={styles.app}>{cardApp}</span>
          {cardPlace ? <span className={styles.place}>{cardPlace}</span> : null}
          {times ? <span className={styles.time}>{times[1]}</span> : null}
        </header>
        <div className={styles.thread}>
          <p className={styles.empty} aria-hidden={step >= 3 || undefined}>
            {t("Nothing needs your team yet.")}
          </p>
          <article className={styles.post} aria-hidden={step < 3 || undefined}>
            <p className={styles.postHead}>
              <span className={styles.avatar} aria-hidden="true">
                B
              </span>
              <span className={styles.author}>{t("Brilliant AI workflow")}</span>
              {times ? <span className={styles.time}>{times[1]}</span> : null}
            </p>
            <div className={styles.card}>
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
              <p className={styles.attachments}>
                <Icon name="document" size={13} />
                {t(card.attachments)}
              </p>
              <div className={styles.cardFoot}>
                <span className={`status status--${card.statusTone}`}>
                  {t(card.status)}
                </span>
                <span className={styles.action} aria-disabled="true">
                  {t(card.action)}
                </span>
              </div>
              <p className={styles.waits}>
                <Icon name="lock" size={13} />
                {t("Waits for a person to act.")}
              </p>
            </div>
          </article>
        </div>
        {approver ? (
          <p className={styles.assignee}>
            <Icon name="people" size={14} />
            <span className="label">{t("Who decides")}</span>
            <span>{approver}</span>
          </p>
        ) : null}
      </section>

      {control ? (
        <p className={`control ${styles.control}`}>
          <span className="control__label">{t("Stays with you")}</span>
          <span className="control__text">{control}</span>
        </p>
      ) : null}
    </div>
  );
}
