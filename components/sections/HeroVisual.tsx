"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { WORKFLOWS } from "@/lib/workflows";
import { Exhibit, type ExhibitStatus } from "../ui/Exhibit";
import styles from "./Hero.module.css";

const invoice = WORKFLOWS.find((workflow) => workflow.id === "invoice-approvals")!;
const NUMERALS = ["i.", "ii.", "iii.", "iv."];
const STATUSES: { text: string; tone: NonNullable<ExhibitStatus["tone"]> }[] = [
  { text: "Done", tone: "done" },
  { text: "Done", tone: "done" },
  { text: "Needs review", tone: "review" },
  { text: "Your approval", tone: "ready" },
];

/** Exhibit 1: the invoice-approvals example, stage by stage. */
export function HeroVisual() {
  const { t } = useLanguage();
  return (
    <Exhibit
      className={styles.exhibit}
      label={t("Exhibit {number}", { number: 1 })}
      status={{ text: t("Running"), tone: "live" }}
      title={t("How an invoice moves through an automated approval")}
      titleId="exhibit-1-title"
      caption={t(
        "Illustrative. Exceptions always go to a person before anything is approved.",
      )}
    >
      <ol className={`rule-list ${styles.rows}`}>
        {invoice.stages.map((stage, i) => (
          <li key={stage} className={styles.row} data-tone={STATUSES[i].tone}>
            <span className={`roman ${styles.numeral}`}>{NUMERALS[i]}</span>
            <span className={styles.stage}>{t(stage)}</span>
            <span className={`status status--${STATUSES[i].tone}`}>
              {t(STATUSES[i].text)}
            </span>
          </li>
        ))}
      </ol>
    </Exhibit>
  );
}
