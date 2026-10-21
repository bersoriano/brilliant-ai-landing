"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localePath } from "@/lib/locale";
import { AGENT_EXAMPLES, WORKFLOW_EXAMPLES, service } from "@/lib/services";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { Reveal } from "../ui/Reveal";
import styles from "./Automation.module.css";
import landing from "./Landing.module.css";

function Control({ text }: { text: string }) {
  const { t } = useLanguage();
  return (
    <p className={`control ${styles.control}`}>
      <span className="control__label">{t("Stays with you")}</span>
      <span className="control__text">{text}</span>
    </p>
  );
}

/**
 * Three workflow examples drawn as pipelines: what starts it, the work, and
 * the person who decides (sand). Ends on what stays with your team.
 */
export function WorkflowSpecimen() {
  const { t } = useLanguage();
  return (
    <Reveal>
      <div className={styles.specimen}>
        <p className={styles.starts}>
          <Icon name="flow" size={15} />
          {t("Starts with a trigger")}
        </p>
        <ul className={styles.examples}>
          {WORKFLOW_EXAMPLES.map((example) => {
            const steps = t(example.steps).split(" → ");
            return (
              <li key={example.label}>
                <span className="label">{t(example.label)}</span>
                <ol className={styles.chain}>
                  {steps.map((step, n) => (
                    <li
                      key={step}
                      data-node={
                        n === 0 ? "start" : n === steps.length - 1 ? "human" : "work"
                      }
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </li>
            );
          })}
        </ul>
        <Control
          text={t(
            "You approve the exceptions. Nothing posts, pays, or files until a person you name says so.",
          )}
        />
      </div>
    </Reveal>
  );
}

/** Three requests in plain language: what the agent does, and your call. */
export function AgentSpecimen() {
  const { t } = useLanguage();
  return (
    <Reveal>
      <div className={styles.specimen}>
        <p className={styles.starts} data-kind="agent">
          <Icon name="people" size={15} />
          {t("Starts with a request")}
        </p>
        <ul className={styles.examples}>
          {AGENT_EXAMPLES.map((example) => (
            <li key={example.request}>
              <p className={styles.request}>
                <span className={styles.asker} aria-hidden="true">
                  <Icon name="people" size={14} />
                </span>
                <span>{t(example.request)}</span>
              </p>
              <dl className={styles.chain}>
                <div data-node="work">
                  <dt className="label">{t("What it does")}</dt>
                  <dd>{t(example.agent)}</dd>
                </div>
                <div data-node="human">
                  <dt className="label">{t("Your call")}</dt>
                  <dd>{t(example.you)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        <Control
          text={t(
            "If it starts with a request in plain language, an agent handles it. You stay in control of what goes out.",
          )}
        />
      </div>
    </Reveal>
  );
}

/**
 * Workflow or agent: the two automation offers side by side, so a visitor on
 * one page can tell which fits and reach the other. `current` is this page.
 */
export function WorkflowOrAgent({
  current,
}: {
  current: "services-workflows" | "services-agents";
}) {
  const { t, locale } = useLanguage();
  const options = [
    { id: "services-workflows", icon: "flow", starts: "Starts with a trigger" },
    { id: "services-agents", icon: "people", starts: "Starts with a request" },
  ] as const;
  return (
    <section
      className={`shell section section-rule grid-12 ${landing.why}`}
      aria-labelledby="fit-title"
    >
      <div className={landing.head}>
        <Kicker>{t("Workflow or agent?")}</Kicker>
        <h2 id="fit-title" className="h2-sm">
          {t("Agents for your people.")}{" "}
          <em>{t("Workflows for your processes.")}</em>
        </h2>
        <p className="body">
          {t("The review tells you whether a task calls for a workflow, an agent, or both.")}
        </p>
      </div>
      <ul className={landing.reasons}>
        {options.map((option) => {
          const offer = service(option.id);
          return (
            <li key={option.id}>
              <p className={styles.starts}>
                <Icon name={option.icon} size={15} />
                {t(option.starts)}
              </p>
              <h3 className={landing.itemTitle}>{t(offer.name)}</h3>
              <p className="body">{t(offer.line)}</p>
              {option.id === current ? null : (
                <a
                  className="text-link text-link--accent"
                  href={localePath(locale, offer.path)}
                >
                  {t("Learn more")}
                  <span className="sr-only">: {t(offer.name)}</span>{" "}
                  <Icon name="arrow" size={15} />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
