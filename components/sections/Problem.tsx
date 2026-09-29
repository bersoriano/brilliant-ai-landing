"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Kicker } from "../ui/Kicker";
import styles from "./Problem.module.css";

const PAINS: { sector: string; items: string[] }[] = [
  {
    sector: "Finance",
    items: [
      "The three-way match that lives in a shared inbox",
      "The month-end pack rebuilt from five exports",
      "The vendor statement that never quite ties to AP aging",
      "The approval with no packet attached",
    ],
  },
  {
    sector: "Healthcare",
    items: [
      "The referral that arrives incomplete and slips the visit",
      "The prior-authorization packet assembled by hand",
      "The billing follow-up only one coordinator understands",
      "The intake checklist that breaks when three arrive at once",
    ],
  },
];
const NUMERALS = ["i.", "ii.", "iii.", "iv."];

/** Top of the shared --surface band; RoiCalculator continues it. */
export function Problem() {
  const { t } = useLanguage();
  return (
    <section id="problem" className={styles.band} aria-labelledby="problem-title">
      <div className="shell">
        <Kicker>{t("The busywork trap")}</Kicker>
        <h2 id="problem-title" className={`h2 ${styles.title}`}>
          {t("The work that fills your best people’s week.")}
        </h2>
        <div className={styles.columns}>
          {PAINS.map((column) => (
            <div key={column.sector}>
              <h3 className="label">{t(column.sector)}</h3>
              <ol className={styles.pains}>
                {column.items.map((item, i) => (
                  <li key={item}>
                    <span className="roman">{NUMERALS[i]}</span>
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className={`body ${styles.closer}`}>
          {t(
            "None of this is a people problem. The work holding your team back is exactly the work a system was built to carry.",
          )}
        </p>
      </div>
    </section>
  );
}
