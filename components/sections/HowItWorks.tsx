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
    body: "Walk us through one repetitive task, or record yourself doing it once. We map the inputs, tools, handoffs, and approval points, then tell you whether it calls for a workflow, an agent, or both.",
  },
  {
    title: "Pilot",
    duration: "3–6 weeks",
    body: "One workflow or one agent, fixed scope. We connect approved tools, test on representative, non-sensitive data, and put the output next to your current process. You accept it, or we revise.",
  },
  {
    title: "We run it",
    duration: "Ongoing",
    body: "We monitor it, handle exceptions, and keep it current. When the first one is working, we add the next workflow or the next person’s agent. Your team gets documentation. Running it stays with us unless you want a handover.",
  },
];
/** The two offers, compared row by row. Examples are illustrative. */
const offers = [
  {
    title: "Workflows",
    rows: [
      ["For", "Work that arrives the same way every time"],
      ["How it starts", "Something arrives: an invoice, a referral, month-end"],
      [
        "What it does",
        "Collects, checks, and prepares the work, then sends exceptions to a person",
      ],
      [
        "Example",
        "Invoice arrives → matched to its PO → approval packet in Teams",
      ],
      ["Who decides", "The approver you name"],
    ],
  },
  {
    title: "Agents",
    rows: [
      ["For", "Work that changes from day to day"],
      ["How it starts", "Someone asks, in plain language"],
      [
        "What it does",
        "Finds, drafts, and follows up for the person it’s assigned to",
      ],
      ["Example", "“Chase the three clients still missing documents”"],
      ["Who decides", "The person who asked"],
    ],
  },
];
const reviewCovers = [
  "The task, its inputs, and where it arrives",
  "The tools and handoffs involved",
  "Where approvals and exceptions sit",
  "A useful first step, and what a pilot would need",
];
/** Pricing shape, not a rate card. */
const costs = [
  ["Workflow review", "Free. 20 minutes."],
  [
    "Pilot",
    "One workflow or one agent, fixed scope, typically 3–6 weeks. Priced after discovery.",
  ],
  ["Run", "A monthly retainer covering the workflows and agents we run for you."],
];
/** Secondary: what the work includes (formerly the capability grid). */
const inTheWork = [
  ["Connected workflows", "One reliable process from request to handoff."],
  ["Custom AI agents", "Assigned to a person, guided by your rules."],
  ["Automation discovery", "Find the bottleneck worth fixing first."],
  ["Integration and ongoing care", "Monitoring, exceptions, and updates."],
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
            {t("Agents for your people.")}{" "}
            <em>{t("Workflows for your processes.")}</em>
          </h2>
          <p className="body">
            {t(
              "You show us the job. We build it on your stack. We run it. You approve the exceptions.",
            )}
          </p>
        </div>
        <div className={styles.offerBlock}>
          <div className={styles.offers}>
            {offers.map((offer) => (
              <article key={offer.title} className={styles.offer}>
                <h3 className="h3">{t(offer.title)}</h3>
                <dl>
                  {offer.rows.map(([term, detail]) => (
                    <div key={term}>
                      <dt className="label">{t(term)}</dt>
                      <dd>{t(detail)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <p className={styles.rule}>
            {t(
              "If it starts with a trigger, it’s a workflow. If it starts with a request, it’s an agent. Many jobs need both.",
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
              "Every proposal separates implementation, third-party and API costs, and ongoing care.",
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

      <div className={styles.work}>
        <p className="label">{t("What’s in the work")}</p>
        <ul>
          {inTheWork.map(([title, line]) => (
            <li key={title}>
              <strong>{t(title)}</strong>
              <span>{t(line)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
