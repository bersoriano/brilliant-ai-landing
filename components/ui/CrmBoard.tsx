"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { CRM_PIPELINE } from "@/lib/crm";
import { fmtCurrency } from "@/lib/roi";
import styles from "./CrmBoard.module.css";

/** Illustrative deal board, one column per stage. Values follow the page currency. */
export function CrmBoard() {
  const { t, locale } = useLanguage();
  const currency = locale === "es" ? "MXN" : "USD";
  return (
    <ol className={styles.board}>
      {CRM_PIPELINE.map((column, i) => (
        <li
          key={column.stage}
          className={i === CRM_PIPELINE.length - 1 ? styles.won : undefined}
        >
          <p className={styles.stage}>
            <span className="label">{t(column.stage)}</span>
            <span className="label">{column.deals.length}</span>
          </p>
          <ul>
            {column.deals.map((deal) => (
              <li key={deal.company} className={styles.card}>
                <strong>{deal.company}</strong>
                <span>{t(deal.deal)}</span>
                <span className={styles.value}>
                  {fmtCurrency(deal.value[currency], locale, currency)}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
