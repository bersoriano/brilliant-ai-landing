"use client";
import { useId, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  ADVISOR_COPY as COPY,
  ADVISOR_QUESTIONS,
  DEFAULT_ANSWERS,
  advise,
  type AdvisorAnswers,
} from "@/lib/advisor";
import { INSIGHTS } from "@/lib/insights";
import { localePath } from "@/lib/locale";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { Icon } from "./Icon";
import styles from "./ArchitectureAdvisor.module.css";

/**
 * The architecture advisor: four questions on the left, the starting point on
 * the right (stacked in narrow containers). The rules and every string live
 * in lib/advisor.ts; this file only lays them out. Answers stay in local
 * state: nothing is sent anywhere. The booking link and the section id give
 * analytics their cta_click and section_view through PageAnalytics.
 *
 * - `number`: the exhibit number on its page (Exhibit 3 on the homepage).
 * - `labelledBy`: the id of the heading that names it; without one, the
 *   exhibit shows its own title (inside a post).
 * - `cta`: the closing review invitation. Off inside a post, which already
 *   ends on its own single booking button.
 * - `guide`: the link to the post that explains the six patterns.
 */
export function ArchitectureAdvisor({
  number,
  labelledBy,
  cta = true,
  guide = true,
}: {
  number: number;
  labelledBy?: string;
  cta?: boolean;
  guide?: boolean;
}) {
  const { t, locale } = useLanguage();
  const id = useId();
  const titleId = `${id}-title`;
  const [answers, setAnswers] = useState<AdvisorAnswers>(DEFAULT_ANSWERS);
  const [wasReset, setWasReset] = useState(false);
  const firstQuestion = useRef<HTMLFieldSetElement>(null);
  const advice = useMemo(() => advise(answers), [answers]);
  const controlled = advice.safeguard === "controlled";

  function choose<K extends keyof AdvisorAnswers>(key: K, value: AdvisorAnswers[K]) {
    setAnswers((previous) => ({ ...previous, [key]: value }));
    setWasReset(false);
  }
  function startOver() {
    setAnswers(DEFAULT_ANSWERS);
    setWasReset(true);
    firstQuestion.current
      ?.querySelector<HTMLInputElement>(`input[value="${DEFAULT_ANSWERS.landscape}"]`)
      ?.focus();
  }

  const announcement = [
    wasReset ? t(COPY.resetDone) : "",
    t(COPY.announce, { name: t(advice.name) }),
    controlled ? `${t(COPY.plus)}: ${t(advice.safeguardCopy.name)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`exhibit ${styles.advisor}`}
      role="group"
      aria-labelledby={labelledBy ?? titleId}
    >
      <div className="exhibit__head">
        <span className="exhibit__label">{t("Exhibit {number}", { number })}</span>
        <span className="status status--live">{t(COPY.status)}</span>
      </div>
      {labelledBy ? null : (
        <p id={titleId} className="exhibit__title">
          {t(COPY.title, { accent: t(COPY.accent) })}
        </p>
      )}
      <div className={styles.grid}>
        <form
          className={styles.questions}
          aria-label={t(COPY.questionsLabel)}
          onSubmit={(event) => event.preventDefault()}
        >
          {ADVISOR_QUESTIONS.map((question, index) => (
            <fieldset
              key={question.id}
              ref={index === 0 ? firstQuestion : undefined}
              className={styles.question}
            >
              <legend className={styles.legend}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{t(question.prompt)}</span>
              </legend>
              <div className={styles.options}>
                {question.options.map((option) => (
                  <label key={option.value} className={styles.option}>
                    <input
                      type="radio"
                      className={styles.radio}
                      name={`${id}-${question.id}`}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => choose(question.id, option.value)}
                    />
                    <span>{t(option.label)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {guide ? (
            <a
              className={`text-link text-link--accent ${styles.guide}`}
              href={localePath(locale, `/blog/${INSIGHTS.architecture}`)}
            >
              {t(COPY.guide)} <Icon name="arrow" size={15} />
            </a>
          ) : null}
        </form>

        <div className={styles.result}>
          <div className={styles.verdict}>
            <p className="label">{t(COPY.startingPoint)}</p>
            <h3 className={styles.name}>{t(advice.name)}</h3>
            {controlled ? (
              <p className={styles.plus}>
                <span className={styles.plusLabel}>{t(COPY.plus)}</span>
                <span>{t(advice.safeguardCopy.name)}</span>
              </p>
            ) : null}
          </div>

          <ol className={styles.flow} aria-label={t(COPY.flowLabel)}>
            <li className={styles.node} data-kind="start">
              <span className={styles.role}>{t(COPY.flowStart)}</span>
              <span className={styles.nodeText}>{t(advice.flow.start)}</span>
            </li>
            <li className={styles.node} data-kind="ai">
              <span className={styles.role}>{t(COPY.flowAi)}</span>
              <span className={styles.nodeText}>{t(advice.flow.ai)}</span>
            </li>
            <li className={styles.node} data-kind="systems">
              <span className={styles.role}>{t(COPY.flowSystems)}</span>
              <ul className={styles.systems}>
                {advice.flow.systems.map((system) => (
                  <li key={system}>{t(system)}</li>
                ))}
              </ul>
            </li>
            <li className={styles.node} data-kind="person">
              <span className={styles.role}>{t(COPY.flowPerson)}</span>
              <span className={styles.nodeText}>{t(advice.flow.person)}</span>
            </li>
          </ol>

          <dl className={styles.facts}>
            <div>
              <dt className="label">{t(COPY.why)}</dt>
              <dd>{t(advice.why)}</dd>
            </div>
            <div>
              <dt className="label">{t(COPY.could)}</dt>
              <dd>
                {t(advice.example)}
                {advice.notes.map((note) => (
                  <span key={note} className={styles.note}>
                    {t(note)}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="label">{t(COPY.verify)}</dt>
              <dd>{t(advice.verify)}</dd>
            </div>
          </dl>

          <div className={styles.safeguards} data-tone={advice.safeguard}>
            <p className="label">
              {t(COPY.safeguards)}: {t(advice.safeguardCopy.title)}
            </p>
            <ul>
              {advice.safeguardCopy.items.map((item) => (
                <li key={item}>
                  <Icon name="check" size={14} />
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="control">
            <span className="control__label">{t("Stays with you")}</span>
            <span className="control__text">{advice.stays.map((line) => t(line)).join(" ")}</span>
          </p>
          <p className="caption">{t(COPY.note)}</p>

          {cta ? (
            <div className={styles.cta}>
              <p className={styles.ctaTitle}>{t(COPY.ctaTitle)}</p>
              <p className="body">{t(COPY.ctaBody)}</p>
              <div className={styles.actions}>
                <a href={DISCOVERY_CALL_HREF} className="button">
                  {t(PRIMARY_CTA)}
                </a>
                <button type="button" className="button button--outline" onClick={startOver}>
                  {t(COPY.reset)}
                </button>
              </div>
              <p className="caption">{t(COPY.ctaFree)}</p>
            </div>
          ) : (
            <div className={styles.actions}>
              <button type="button" className="button button--outline" onClick={startOver}>
                {t(COPY.reset)}
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="sr-only" role="status">
        {announcement}
      </p>
    </div>
  );
}
