"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./HowItWorks.module.css";

/** The product, in three steps. */
const steps = [
  {
    title: "Review",
    duration: "20 min",
    body: "Walk us through one repetitive task, or record yourself doing it once. We look at where the work comes from, which tools it touches, who hands it to whom, and who signs off. Then we tell you whether it needs a workflow, an agent, or both. If it isn’t worth automating yet, we’ll tell you.",
  },
  {
    title: "Pilot",
    duration: "3–6 weeks",
    body: "One workflow or one agent, with a fixed scope. Before we build anything, we put in writing what it checks, what counts as an exception, and who approves. We connect only the tools you’ve approved, test with realistic data that isn’t sensitive, and run it side by side with your current process. If it’s not right, we fix it until you sign off.",
  },
  {
    title: "We run it",
    duration: "Ongoing",
    body: "We watch it, handle the exceptions, and keep it up to date. You can see everything it handled and everything it sent to your team. Once the first one is working, we move on to the next workflow or the next person’s agent. Your team gets the documentation, and we keep running it unless you’d rather take it over.",
  },
];
const reviewCovers = [
  "The task, what it needs, and where it comes in",
  "The tools and handoffs involved",
  "Who approves, and what counts as an exception",
  "A useful first step, and what a pilot would need",
];
/** Pricing shape, not a rate card. */
const costs = [
  ["Workflow review", "Free. 20 minutes."],
  [
    "Pilot",
    "One workflow or one agent with a fixed scope, usually 3 to 6 weeks. Quoted after discovery.",
  ],
  ["Run", "A monthly retainer covering the workflows and agents we run for you."],
];
const NUMERALS = ["i.", "ii.", "iii."];

export function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="section shell">
      <div className="grid-12">
        <div className={styles.intro}>
          <Kicker>{t("How it works")}</Kicker>
          <h2 className="h2-sm">
            {t("Workflows for the routine work,")}{" "}
            <em>{t("agents for the work that changes.")}</em>
          </h2>
          <p className="body">
            {t(
              "You show us the job. We build it into your tools and run it, and you approve anything out of the ordinary.",
            )}
          </p>
        </div>
        <ol className={`rule-list ${styles.steps}`}>
          {steps.map((s, i) => (
            <li
              key={s.title}
              id={i === 0 ? "review" : undefined}
              className={styles.step}
            >
              <span className="roman roman--lg">{NUMERALS[i]}</span>
              <div className={styles.copy}>
                <h3 className="h3">{t(s.title)}</h3>
                <p className="body">{t(s.body)}</p>
                {i === 0 ? (
                  <div className={styles.covers}>
                    <p className="label">
                      {t("What the 20 minutes covers")}
                    </p>
                    <ul>
                      {reviewCovers.map((item) => (
                        <li key={item}>
                          <Icon name="check" size={14} />
                          {t(item)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              <span className={`label ${styles.duration}`}>
                {t(s.duration)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className={`grid-12 ${styles.costs}`}>
        <div className={styles.costsHead}>
          <h3 className="h3">{t("What it costs to start")}</h3>
          <p className="caption">
            {t(
              "Every proposal lists the build, third-party and API costs, and ongoing support separately.",
            )}
          </p>
        </div>
        <dl className={styles.costList}>
          {costs.map(([term, detail]) => (
            <div key={term}>
              <dt className="label">{t(term)}</dt>
              <dd>{t(detail)}</dd>
            </div>
          ))}
        </dl>
      </div>

    </section>
  );
}
