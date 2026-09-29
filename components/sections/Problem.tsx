"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Kicker } from "../ui/Kicker";
import styles from "./Problem.module.css";

const painCards = [
  {
    title: "The report rebuilt every Monday",
    body: "Someone sharp spends the first morning of every week copying numbers into the same deck. Then does it again next Monday.",
  },
  {
    title: "The data moved between tabs",
    body: "Export here, clean it there, paste it in, check it twice. Hours a week moving information a system could move in seconds.",
  },
  {
    title: "The process that breaks when it’s busy",
    body: "It works fine until three arrive at once. Then the process that lives in one person’s head starts dropping things.",
  },
];
const NUMERALS = ["i.", "ii.", "iii."];

/** Top of the shared --surface band; RoiCalculator continues it. */
export function Problem() {
  const { t } = useLanguage();
  return (
    <section id="problem" className={styles.band} aria-labelledby="problem-title">
      <div className="shell">
        <Kicker>{t("The busywork trap")}</Kicker>
        <h2 id="problem-title" className={`h2 ${styles.title}`}>
          {t("Remember the deal you turned down.")}
        </h2>
        <div className={styles.leads}>
          <p className="lead">
            {t(
              "Not because you couldn’t win it. The work was there. The demand was there. You said no because your team was already at the ceiling—and your best people were buried in work a system should have handled.",
            )}
          </p>
          <p className="lead">
            {t(
              "That ceiling isn’t rare. It shows up wherever the same manual steps repeat, week after week:",
            )}
          </p>
        </div>
        <ol className={styles.pains}>
          {painCards.map((card, i) => (
            <li key={card.title}>
              <span className="roman">{NUMERALS[i]}</span>
              <h3 className={styles.painTitle}>{t(card.title)}</h3>
              <p className="body">{t(card.body)}</p>
            </li>
          ))}
        </ol>
        <p className={`body ${styles.closer}`}>
          {t(
            "None of this is a people problem. The work holding your team back is exactly the work a system was built to carry.",
          )}
        </p>
      </div>
    </section>
  );
}
