"use client";
// Exhibit 3 chart: the team's repetitive week, one row per person and one
// square per hour, filled where Brilliant handles the work. Pure CSS, no
// chart library. Screen readers get one sentence via `summary`.
import { useEffect, useState, type CSSProperties } from "react";
import { useFirstView } from "./motion";
import styles from "./CapacityWeek.module.css";

const MAX_ROWS = 6;

export function CapacityWeek({
  people,
  hoursPerPerson,
  share,
  personLabel,
  moreLabel,
  handledLabel,
  remainingLabel,
  scaleLabel,
  summary,
}: {
  people: number;
  hoursPerPerson: number;
  /** 0..1, the automated share */
  share: number;
  /** e.g. n => "Person 3" */
  personLabel: (n: number) => string;
  /** e.g. n => "+ 45 more people with the same week" */
  moreLabel: (n: number) => string;
  handledLabel: string;
  remainingLabel: string;
  /** e.g. "Each square is one hour of one person’s repetitive week" */
  scaleLabel: string;
  summary: string;
}) {
  const [ref, view] = useFirstView<HTMLDivElement>(0.3);
  // Stagger only the first fill; later slider changes respond immediately.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (view !== "in") return;
    const timer = window.setTimeout(() => setSettled(true), 1600);
    return () => window.clearTimeout(timer);
  }, [view]);

  const hours = Math.max(1, Math.round(hoursPerPerson));
  const handled = Math.min(Math.max(share, 0), 1) * hours;
  const rows = people > MAX_ROWS ? MAX_ROWS - 1 : people;
  const more = people - rows;

  return (
    <div
      ref={ref}
      className={styles.week}
      data-view={view}
      data-settled={settled || undefined}
    >
      <p className="sr-only">{summary}</p>
      <div className={styles.legend} aria-hidden="true">
        <span className={styles.key} data-kind="handled">
          {handledLabel}
        </span>
        <span className={styles.key} data-kind="remaining">
          {remainingLabel}
        </span>
      </div>
      <ol className={styles.rows} aria-hidden="true">
        {Array.from({ length: rows }, (_, row) => (
          <li key={row}>
            <span className={styles.who}>{personLabel(row + 1)}</span>
            <span
              className={styles.cells}
              style={{ "--cols": hours } as CSSProperties}
            >
              {Array.from({ length: hours }, (_, cell) => (
                <span key={cell} className={styles.cell}>
                  <span
                    className={styles.fill}
                    style={
                      {
                        "--f": Math.min(Math.max(handled - cell, 0), 1),
                        "--d": row * 90 + cell * 14,
                      } as CSSProperties
                    }
                  />
                </span>
              ))}
            </span>
          </li>
        ))}
        {more > 0 ? (
          <li className={styles.more}>
            <span className={styles.who}>{moreLabel(more)}</span>
          </li>
        ) : null}
      </ol>
      <p className={styles.scale} aria-hidden="true">
        {scaleLabel}
      </p>
    </div>
  );
}
