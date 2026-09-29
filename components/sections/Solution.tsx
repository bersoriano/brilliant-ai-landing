"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useState } from "react";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { RichTemplate, lowerFirst } from "../ui/RichTemplate";
import {
  INDUSTRIES,
  INDUSTRY_ORDER,
  WORKFLOWS,
  type Industry,
} from "@/lib/workflows";
import { PRIMARY_CTA } from "@/lib/site";
import { useInquiry } from "../inquiry/InquiryContext";
import styles from "./Solution.module.css";

const defaultSelectedIds = Object.fromEntries(
  INDUSTRY_ORDER.map((key) => [key, INDUSTRIES[key].defaultWorkflowId]),
) as Record<Industry, string>;
const NUMERALS = ["i.", "ii.", "iii.", "iv."];

export function Solution() {
  const { t } = useLanguage();
  const [active, setActive] = useState<Industry>("finance");
  const [selectedIds, setSelectedIds] = useState(defaultSelectedIds);
  const { selectWorkflow } = useInquiry();
  const industry = INDUSTRIES[active];
  const examples = WORKFLOWS.filter((workflow) => workflow.industry === active);
  const selected =
    examples.find((workflow) => workflow.id === selectedIds[active]) ||
    examples[0];
  return (
    <section id="solutions" className={`section shell ${styles.solution}`}>
      <Kicker>{t("Start with a job you recognize")}</Kicker>
      <h2 className={`h2 ${styles.sentence}`}>
        <RichTemplate
          template={t("We’re on the {industry} team.")}
          values={{ industry: <em>{t(active)}</em> }}
        />{" "}
        <RichTemplate
          template={t("Help us {task}.")}
          values={{ task: <em>{t(lowerFirst(selected.title))}</em> }}
        />
      </h2>
      <div className={styles.controls}>
        <div className={styles.controlRow}>
          <span className="label" aria-hidden="true">
            {t("Team")}
          </span>
          <div
            className={styles.chips}
            role="tablist"
            aria-label={t("Industry solutions")}
          >
            {INDUSTRY_ORDER.map((key, index) => (
              <button
                key={key}
                id={`tab-${key}`}
                type="button"
                role="tab"
                className="chip"
                aria-selected={key === active}
                tabIndex={key === active ? 0 : -1}
                aria-controls="industry-panel"
                onClick={() => setActive(key)}
                onKeyDown={(event) => {
                  if (
                    !["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                      event.key,
                    )
                  )
                    return;
                  event.preventDefault();
                  const last = INDUSTRY_ORDER.length - 1;
                  const nextIndex =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? last
                        : event.key === "ArrowRight"
                          ? (index + 1) % INDUSTRY_ORDER.length
                          : (index - 1 + INDUSTRY_ORDER.length) %
                            INDUSTRY_ORDER.length;
                  const next = INDUSTRY_ORDER[nextIndex];
                  setActive(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }}
              >
                {t(INDUSTRIES[key].label)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        className={styles.panel}
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        <div className={`${styles.controlRow} ${styles.taskRow}`}>
          <span className="label" aria-hidden="true">
            {t("Task")}
          </span>
          <div
            className={styles.chips}
            role="group"
            aria-label={t("{industry} workflow examples", {
              industry: t(industry.label),
            })}
          >
            {examples.map((workflow) => (
              <button
                key={workflow.id}
                type="button"
                className="chip"
                aria-pressed={selected.id === workflow.id}
                aria-controls="workflow-preview"
                onClick={() =>
                  setSelectedIds((previous) => ({
                    ...previous,
                    [active]: workflow.id,
                  }))
                }
              >
                {t(workflow.title)}
              </button>
            ))}
          </div>
          <p className={styles.custom}>
            <span className="caption">
              {t("Something else slowing you down?")}
            </span>
            <a
              href="#contact"
              className="text-link"
              onClick={() => selectWorkflow(null)}
            >
              {t(PRIMARY_CTA)} <Icon name="arrow" size={15} />
            </a>
          </p>
        </div>
        <figure
          className={`grid-12 ${styles.exhibit}`}
          id="workflow-preview"
          aria-labelledby="workflow-preview-title"
        >
          <div className={styles.aside}>
            <span className="exhibit__label">
              {t("Exhibit {number}", { number: 2 })}
            </span>
            <h3 id="workflow-preview-title" className={styles.title}>
              {t("{workflow}, step by step", { workflow: t(selected.title) })}
            </h3>
            <p className="label">
              {t(industry.label)} · {t("Example only")}
            </p>
            <a
              className="text-link text-link--accent"
              href="#contact"
              onClick={() => selectWorkflow(selected)}
            >
              {t(PRIMARY_CTA)} <Icon name="arrow" size={15} />
            </a>
          </div>
          <div className={styles.main}>
            <div className={styles.cells}>
              <div className={styles.cell}>
                <p className="label">{t("Starts when")}</p>
                <p className={styles.trigger}>{t(selected.trigger)}</p>
              </div>
              <div className={styles.cell}>
                <p className="label">{t("What we handle")}</p>
                <ol className={styles.stages}>
                  {selected.stages.map((stage, i) => (
                    <li key={stage}>
                      <span className="roman">{NUMERALS[i]}</span>
                      <span>{t(stage)}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className={`${styles.cell} ${styles.cellAccent}`}>
                <p className="label">{t("What you get")}</p>
                <p className={styles.text}>{t(selected.outcome)}</p>
              </div>
              <div className={styles.cell}>
                <p className="label">{t("Who decides")}</p>
                <p className={styles.text}>{t(selected.approval)}</p>
              </div>
            </div>
            <figcaption className={`caption ${styles.caption}`}>
              <span>
                {t("Tools in this example")}:{" "}
                {selected.tools.map((tool) => t(tool)).join(" → ")}
              </span>
              <span>
                {t(
                  "These are examples of what we could set up, not products you install. We confirm system access, data needs, and who approves what before any work begins.",
                )}
              </span>
            </figcaption>
          </div>
        </figure>
      </div>
      <p role="status" className="sr-only">
        {t("Selected example:")} {t(selected.title)}.
      </p>
    </section>
  );
}
