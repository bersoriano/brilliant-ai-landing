"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useState } from "react";
import { Icon } from "../ui/Icon";
import { WORKFLOWS, type Industry } from "@/lib/workflows";
import { PRIMARY_CTA } from "@/lib/site";
import { useInquiry } from "../inquiry/InquiryContext";
const industries = {
  finance: {
    label: "Finance",
    icon: "bank",
    title: "Give finance a cleaner\nstart to the day.",
    description:
      "Less collecting, checking, and chasing. More time to understand what the numbers mean.",
  },
  healthcare: {
    label: "Healthcare",
    icon: "heart",
    title: "Keep the admin moving.\nKeep care personal.",
    description:
      "Help your administrative team keep up with intake, referrals, and follow-ups.",
  },
};
export function Solution() {
  const { t } = useLanguage();
  const [active, setActive] = useState<Industry>("finance");
  const [selectedIds, setSelectedIds] = useState({
    finance: "invoice-approvals",
    healthcare: "referral-routing",
  });
  const { selectWorkflow } = useInquiry();
  const industry = industries[active];
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
            {t("Real workflows.")}
            <br />
            {t("Room to do more.")}
          </h2>
        </div>
        <p>
          {t("Choose a task below to see what we could build.")}
          <br className="desktop-break" />
          {t("Each example connects the trigger, the work,")}
          <br className="desktop-break" />
          {t("and the moment your team takes over.")}
        </p>
      </div>
      <div
        className="industry-tabs"
        role="tablist"
        aria-label={t("Industry solutions")}
      >
        {Object.entries(industries).map(([key, data], index) => (
          <button
            key={key}
            id={`tab-${key}`}
            type="button"
            role="tab"
            aria-selected={key === active}
            tabIndex={key === active ? 0 : -1}
            aria-controls="industry-panel"
            onClick={() => setActive(key as Industry)}
            onKeyDown={(event) => {
              if (
                ["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
              ) {
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? "finance"
                    : event.key === "End"
                      ? "healthcare"
                      : index === 0
                        ? "healthcare"
                        : "finance";
                setActive(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
          >
            <Icon name={data.icon} />
            {t(data.label)}
            <Icon name="diagonal" size={16} />
          </button>
        ))}
      </div>
      <div
        className="industry-panel workflow-explorer"
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        <div className="industry-copy">
          <span className="small-label">
            {t(
              active === "finance"
                ? "Finance operations"
                : "Healthcare operations",
            )}
          </span>
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
              {t("A workflow we can scope")}
            </span>
            <span>{t("Illustrative example")}</span>
          </div>
          <h3 id="workflow-preview-title">{t(selected.title)}</h3>
          <div className="workflow-trigger">
            <Icon name="clock" size={14} />
            <span>{t(selected.trigger)}</span>
          </div>
          <div className="workflow-tools" aria-label={t("Example systems")}>
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
              <span className="review-badge">{t("For review")}</span>
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
            <span>{t("What your team gets")}</span>
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
          "Examples show possible scopes, not ready-to-install products. We confirm system access, data requirements, and approval rules during discovery.",
        )}
      </p>
      <p role="status" className="sr-only">
        {t("Selected example:")} {t(selected.title)}.
      </p>
    </section>
  );
}
