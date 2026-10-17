"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { HERO_INBOX, HERO_ROW_STATUS, HERO_STEPS, SCENES } from "@/lib/scenes";
import { DocumentScene, type InboxRow } from "../ui/DocumentScene";
import { Exhibit } from "../ui/Exhibit";
import { Icon } from "../ui/Icon";
import { useFirstView } from "../ui/motion";
import styles from "./Hero.module.css";

const STEP_MS = 1600;
const NUMERALS = ["i.", "ii.", "iii.", "iv."];
/** Clock for each step of the sample run; the last one waits for a person. */
const STEP_TIMES = ["09:14:02", "09:14:04", "09:14:05"];

/**
 * Exhibit 1: one invoice run, start to finish. It plays once when it first
 * scrolls into view, stops on the step that needs a person, and every step
 * can be revisited. Reduced motion shows the finished run.
 */
export function HeroVisual() {
  const { t } = useLanguage();
  const scene = SCENES["invoice-approvals"];
  const [ref, view] = useFirstView<HTMLDivElement>(0.35);
  const [step, setStep] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    if (view === "static") {
      setPlaying(false);
      setStep(HERO_STEPS.length - 1);
    }
    if (view === "below") setStep(0);
    if (view === "in") {
      setStep(0);
      setPlaying(true);
    }
  }, [view]);

  useEffect(() => {
    if (!playing) return;
    if (step >= HERO_STEPS.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  const choose = (index: number) => {
    setPlaying(false);
    setStep(index);
    setAnnounce(
      t("Step {number} of {total}: {step}", {
        number: index + 1,
        total: HERO_STEPS.length,
        step: t(HERO_STEPS[index]),
      }),
    );
  };
  const replay = () => {
    setAnnounce("");
    setStep(0);
    setPlaying(true);
  };

  const [status, tone] = HERO_ROW_STATUS[step];
  const inbox: InboxRow[] = [
    {
      from: "Ridgeline Supply",
      subject: t(scene.inbound.subject),
      status: t(status),
      tone,
    },
    ...HERO_INBOX.map((row) => ({
      from: row.from,
      subject: t(row.subject),
      status: t(row.status),
      tone: "ok" as const,
    })),
  ];

  return (
    <Exhibit
      className={styles.exhibit}
      label={t("Exhibit {number}", { number: 1 })}
      tag={t("Sample data")}
      status={{ text: t("Running"), tone: "live" }}
      title={t("An invoice that doesn’t match its PO, and what your team receives")}
      titleId="exhibit-1-title"
      caption={t(
        "A common accounts-payable pattern. Outlook and Teams stand in for the tools you already use.",
      )}
    >
      <div ref={ref} className={styles.run} data-playing={playing || undefined}>
        <div className={styles.rail} role="group" aria-label={t("Workflow steps")}>
          {HERO_STEPS.map((name, i) => (
            <button
              key={name}
              type="button"
              className={styles.railStep}
              aria-pressed={step === i}
              data-done={i < step || undefined}
              data-human={i === HERO_STEPS.length - 1 || undefined}
              onClick={() => choose(i)}
            >
              <span className={styles.railNum} aria-hidden="true">
                {NUMERALS[i]}
              </span>
              <span className={styles.railName}>{t(name)}</span>
              <span className={styles.railTime}>
                {STEP_TIMES[i] ?? t("Waiting")}
              </span>
            </button>
          ))}
          <button type="button" className={styles.replay} onClick={replay}>
            <Icon name="replay" size={14} />
            {t("Replay")}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
        <DocumentScene
          scene={scene}
          step={step}
          live
          inbox={inbox}
          times={["09:14", "09:14"]}
          approver={t("The approver you name")}
          control={t(
            "Exceptions always go to a person before anything is approved. Payment stays under your control.",
          )}
        />
      </div>
    </Exhibit>
  );
}
