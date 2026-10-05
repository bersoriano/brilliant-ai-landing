"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useState } from "react";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { DocumentScene } from "../ui/DocumentScene";
import { RichTemplate, lowerFirst } from "../ui/RichTemplate";
import {
  HOMEPAGE_INDUSTRIES,
  INDUSTRIES,
  WORKFLOWS,
  type Industry,
} from "@/lib/workflows";
import { SCENES } from "@/lib/scenes";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { localePath } from "@/lib/locale";
import { useInquiry } from "../inquiry/InquiryContext";
import styles from "./Solution.module.css";

const defaultSelectedIds = Object.fromEntries(
  HOMEPAGE_INDUSTRIES.map((key) => [key, INDUSTRIES[key].defaultWorkflowId]),
) as Record<Industry, string>;
const NUMERALS = ["i.", "ii.", "iii.", "iv."];
const CAPTIONS: Partial<Record<Industry, string>> = {
  finance:
    "Illustrative. Exceptions always go to a person before anything is approved.",
  healthcare:
    "Illustrative. Administrative routing only. Clinical decisions stay with your team.",
};

export function Solution() {
  const { t, locale } = useLanguage();
  const [active, setActive] = useState<Industry>("finance");
  const [selectedIds, setSelectedIds] = useState(defaultSelectedIds);
  const { selectWorkflow, hintSector } = useInquiry();
  const industry = INDUSTRIES[active];
  const examples = WORKFLOWS.filter((workflow) => workflow.industry === active);
  const selected =
    examples.find((workflow) => workflow.id === selectedIds[active]) ||
    examples[0];
  const tools =
    locale === "es" && selected.toolsMx ? selected.toolsMx : selected.tools;
  return (
    <section id="solutions" className="band-paper">
      <div className={`section shell ${styles.solution}`}>
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
              {HOMEPAGE_INDUSTRIES.map((key, index) => (
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
                    const count = HOMEPAGE_INDUSTRIES.length;
                    const nextIndex =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? count - 1
                          : event.key === "ArrowRight"
                            ? (index + 1) % count
                            : (index - 1 + count) % count;
                    const next = HOMEPAGE_INDUSTRIES[nextIndex];
                    setActive(next);
                    document.getElementById(`tab-${next}`)?.focus();
                  }}
                >
                  {t(INDUSTRIES[key].label)}
                </button>
              ))}
            </div>
            <a
              href="#contact"
              className={`text-link ${styles.other}`}
              onClick={() => {
                selectWorkflow(null);
                hintSector("other");
              }}
            >
              {t("Operations or sales work? Tell us about it")}{" "}
              <Icon name="arrow" size={15} />
            </a>
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
              <dl className={styles.facts}>
                <div>
                  <dt className="label">{t("Starts when")}</dt>
                  <dd>{t(selected.trigger)}</dd>
                </div>
                <div>
                  <dt className="label">{t("Who decides")}</dt>
                  <dd>{t(selected.approval)}</dd>
                </div>
              </dl>
              <a
                className="text-link text-link--accent"
                href={DISCOVERY_CALL_HREF}
              >
                {t(PRIMARY_CTA)} <Icon name="arrow" size={15} />
              </a>
              <a
                className="text-link"
                href={localePath(locale, `/${active}-automation`)}
              >
                {t(active === "finance" ? "Explore finance automation" : "Explore healthcare automation")}{" "}
                <Icon name="arrow" size={15} />
              </a>
            </div>
            <div className={styles.main}>
              <DocumentScene scene={SCENES[selected.id]} />
              <ol className={styles.stages} aria-label={t("What we handle")}>
                {selected.stages.map((stage, i) => (
                  <li key={stage}>
                    <span className="roman">{NUMERALS[i]}</span>
                    <span>{t(stage)}</span>
                  </li>
                ))}
              </ol>
              <figcaption className={`caption ${styles.caption}`}>
                <span>{t(CAPTIONS[active] ?? CAPTIONS.finance!)}</span>
                <span>
                  {t("Tools in this example")}:{" "}
                  {tools.map((tool) => t(tool)).join(" → ")}
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
      </div>
    </section>
  );
}
