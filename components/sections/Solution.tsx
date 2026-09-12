"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useState } from "react";
import { Icon } from "../ui/Icon";
import {
  INDUSTRIES,
  INDUSTRY_ORDER,
  WORKFLOWS,
  type Industry,
} from "@/lib/workflows";
import { PRIMARY_CTA } from "@/lib/site";
import { useInquiry } from "../inquiry/InquiryContext";

const defaultSelectedIds = Object.fromEntries(
  INDUSTRY_ORDER.map((key) => [key, INDUSTRIES[key].defaultWorkflowId]),
) as Record<Industry, string>;

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
    <section id="solutions" className="section shell industries-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t("Start with a job you recognize")}</span>
          <h2>
            {t("Everyday work.")}
            <br />
            {t("Room to do more.")}
          </h2>
        </div>
        <p>
          {t("Pick a task you already know.")}
          <br className="desktop-break" />
          {t("We’ll show the first step, what gets prepared,")}
          <br className="desktop-break" />
          {t("and where your team steps in.")}
        </p>
      </div>
      <div
        className="industry-tabs"
        role="tablist"
        aria-label={t("Industry solutions")}
      >
        {INDUSTRY_ORDER.map((key, index) => {
          const data = INDUSTRIES[key];
          return (
            <button
              key={key}
              id={`tab-${key}`}
              type="button"
              role="tab"
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
              <Icon name={data.icon} />
              {t(data.label)}
              <Icon name="diagonal" size={16} />
            </button>
          );
        })}
      </div>
      <div
        className="industry-panel workflow-explorer"
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        <div className="industry-copy">
          <span className="small-label">{t(industry.operationsLabel)}</span>
          <h3>{t(industry.title)}</h3>
          <p>{t(industry.description)}</p>
          <div
            className="workflow-options"
            role="group"
            aria-label={t("{industry} workflow examples", {
              industry: t(industry.label),
            })}
          >
            {examples.map((workflow) => (
              <button
                key={workflow.id}
                type="button"
                className="workflow-option"
                aria-pressed={selected.id === workflow.id}
                aria-controls="workflow-preview"
                onClick={() =>
                  setSelectedIds((previous) => ({
                    ...previous,
                    [active]: workflow.id,
                  }))
                }
              >
                <span className="workflow-option-icon">
                  <Icon name={workflow.icon} size={19} />
                </span>
                <span>
                  <strong>{t(workflow.title)}</strong>
                  <small>{t(workflow.shortDescription)}</small>
                </span>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
          <p className="workflow-custom-note">
            {t("Something else slowing you down?")}
            <br />
            <a
              href="#contact"
              className="text-link"
              onClick={() => selectWorkflow(null)}
            >
              {t(PRIMARY_CTA)} <Icon name="arrow" size={15} />
            </a>
          </p>
        </div>
        <div
          className="industry-demo workflow-preview"
          id="workflow-preview"
          role="region"
          aria-labelledby="workflow-preview-title"
        >
          <div className="demo-top">
            <span>
              <span className="status-dot" />
              {t("An example we could set up")}
            </span>
            <span>{t("Example only")}</span>
          </div>
          <h3 id="workflow-preview-title">{t(selected.title)}</h3>
          <div className="workflow-trigger">
            <Icon name="clock" size={14} />
            <span>{t(selected.trigger)}</span>
          </div>
          <div className="workflow-tools" aria-label={t("Tools in this example")}>
            {selected.tools.map((tool, i) => (
              <span key={tool}>
                <span>{t(tool)}</span>
                {i < selected.tools.length - 1 && (
                  <Icon name="arrow" size={12} />
                )}
              </span>
            ))}
          </div>
          <div className="demo-document">
            <div className="document-title">
              <span className="document-symbol">
                <Icon name={selected.icon} size={23} />
              </span>
              <div>
                <strong>{t(selected.document)}</strong>
                <small>{selected.reference}</small>
              </div>
              <span className="review-badge">{t("Ready to review")}</span>
            </div>
            <div className="document-lines">
              <span>{t(selected.field)}</span>
              <strong>{t(selected.value)}</strong>
            </div>
          </div>
          <div className="demo-flow">
            {selected.stages.map((text, i) => (
              <div key={text}>
                <span className={i === 3 ? "flow-review" : "flow-check"}>
                  <Icon name={i === 3 ? "people" : "check"} size={13} />
                </span>
                <span>{t(text)}</span>
              </div>
            ))}
          </div>
          <div className="workflow-outcome">
            <span>{t("What this gives your team")}</span>
            <p>{t(selected.outcome)}</p>
          </div>
          <p className="workflow-approval">
            <Icon name="shield" size={16} />
            {t(selected.approval)}
          </p>
          <a
            className="button workflow-inquiry"
            href="#contact"
            onClick={() => selectWorkflow(selected)}
          >
            {t(PRIMARY_CTA)} <Icon name="diagonal" size={17} />
          </a>
        </div>
      </div>
      <p className="workflow-scope-note">
        {t(
          "These are examples of what we could set up, not products you install. We confirm system access, data needs, and who approves what before any work begins.",
        )}
      </p>
      <p role="status" className="sr-only">
        {t("Selected example:")} {t(selected.title)}.
      </p>
    </section>
  );
}
