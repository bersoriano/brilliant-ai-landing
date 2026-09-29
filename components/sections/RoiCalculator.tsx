"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useMemo, useState, type CSSProperties } from "react";
import {
  buildBreakdown,
  computeRoi,
  DEFAULT_INPUTS,
  fmtCurrency,
  fmtNumber,
  type RoiInputs,
} from "@/lib/roi";
import { Icon } from "../ui/Icon";
import { RichTemplate } from "../ui/RichTemplate";
import { StackedBar } from "../ui/StackedBar";
import styles from "./RoiCalculator.module.css";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
export function RoiCalculator() {
  const { t, locale } = useLanguage();
  // Opportunity figures start empty so nothing is claimed on the visitor's
  // behalf; the engagement budget is seeded so payback is visible immediately.
  const [inputs, setInputs] = useState<RoiInputs>({
    ...DEFAULT_INPUTS,
    opportunitiesDeclined: 0,
    avgOpportunityValue: 0,
  });
  const [downloaded, setDownloaded] = useState(false);
  const result = useMemo(() => computeRoi(inputs), [inputs]);
  const set = (key: keyof RoiInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setDownloaded(false);
  };
  function download() {
    const breakdown = buildBreakdown(inputs, result, locale);
    const text = [
      t("Brilliant AI — Automation capacity estimate"),
      "",
      ...breakdown.lines.map((l) => `${l.label}: ${l.value}`),
      "",
      t("Your inputs"),
      `${t("People doing repetitive work")}: ${inputs.people}`,
      `${t("Hours per person per week")}: ${inputs.hoursPerWeek}`,
      "",
      t("Assumptions"),
      ...breakdown.assumptions.map((a) => `${a.label}: ${a.value}`),
      "",
      t(
        "Illustrative estimate, not a forecast or guaranteed saving. The value of reclaimed capacity is not cash savings. Implementation and ongoing costs are excluded.",
      ),
      "USD",
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download =
      locale === "es"
        ? "brilliant-ai-estimacion-capacidad.txt"
        : "brilliant-ai-capacity-estimate.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  const totalHours = inputs.people * inputs.hoursPerWeek;
  const handledHours = result.hoursReclaimedWeek;
  const hrs = (n: number) => fmtNumber(n, 1, locale);
  return (
    <section
      id="roi-calculator"
      className={styles.band}
      aria-labelledby="roi-title"
    >
      <div className="shell">
        <h2 id="roi-title" className={`h2 ${styles.title}`}>
          <RichTemplate
            template={t("What could your team do with {hours} more hours a week?")}
            values={{ hours: <em>{hrs(result.hoursReclaimedWeek)}</em> }}
          />
        </h2>
        <div className={`grid-12 ${styles.calculator}`}>
          <div className={styles.inputs}>
            <Range
              label={t("People doing repetitive work")}
              name="people"
              min={1}
              max={50}
              value={inputs.people}
              display={t("{count} people", { count: inputs.people })}
              onChange={(v) => set("people", v)}
            />
            <Range
              label={t("Repetitive hours per person / week")}
              name="hours"
              min={1}
              max={40}
              value={inputs.hoursPerWeek}
              display={t("{count} hrs", { count: inputs.hoursPerWeek })}
              onChange={(v) => set("hoursPerWeek", v)}
            />
            <MoneyField
              id="hourly-value"
              label={t("Value of one hour of team time")}
              hint={t("What an hour of productive work is worth.")}
              ariaLabel={t("Value of one hour of team time in US dollars")}
              max={10000}
              step={5}
              value={inputs.hourlyValue}
              onChange={(v) => set("hourlyValue", v)}
            />
            <details className={styles.assumptions}>
              <summary className="text-link">
                {t("Adjust the assumptions")} <span aria-hidden="true">+</span>
              </summary>
              <div className={styles.assumptionFields}>
                <Range
                  name="share"
                  label={t("Share of repetitive work automated")}
                  min={0}
                  max={100}
                  step={5}
                  value={inputs.automatableShare * 100}
                  display={`${Math.round(inputs.automatableShare * 100)}%`}
                  onChange={(v) => set("automatableShare", v / 100)}
                />
                <div className={styles.field}>
                  <div className={styles.fieldHead}>
                    <label htmlFor="working-weeks">
                      {t("Working weeks per year")}
                    </label>
                  </div>
                  <input
                    id="working-weeks"
                    className="input"
                    type="number"
                    min="1"
                    max="52"
                    value={inputs.workingWeeksPerYear}
                    onChange={(e) =>
                      set(
                        "workingWeeksPerYear",
                        Math.max(1, Math.min(52, Number(e.target.value))),
                      )
                    }
                  />
                </div>
                <MoneyField
                  id="engagement-cost"
                  label={t("Budget you have in mind")}
                  hint={t("Your figure, not our price. Drives the payback line.")}
                  ariaLabel={t("Budget you have in mind, in US dollars")}
                  max={1000000}
                  step={1000}
                  value={inputs.engagementCost}
                  onChange={(v) => set("engagementCost", v)}
                />
                <p className="caption">
                  {t("Turned work away this year? Add it (optional).")}
                </p>
                <Range
                  name="declined"
                  label={t("Opportunities you declined")}
                  min={0}
                  max={50}
                  value={inputs.opportunitiesDeclined}
                  display={t("{count} declined", {
                    count: inputs.opportunitiesDeclined,
                  })}
                  onChange={(v) => set("opportunitiesDeclined", v)}
                />
                <MoneyField
                  id="opportunity-value"
                  label={t("Average value of one")}
                  ariaLabel={t("Average value of one opportunity, in US dollars")}
                  max={10000000}
                  step={500}
                  value={inputs.avgOpportunityValue}
                  onChange={(v) => set("avgOpportunityValue", v)}
                />
              </div>
            </details>
            <p className="caption">
              {t(
                "Based on {share}% automation and {weeks} working weeks. All amounts in USD.",
                {
                  share: Math.round(inputs.automatableShare * 100),
                  weeks: inputs.workingWeeksPerYear,
                },
              )}
            </p>
          </div>
          <div className={styles.results}>
            <div aria-live="polite" aria-atomic="true">
              <dl className={styles.numerals}>
                <div className={styles.stat}>
                  <dt className={styles.statLabel}>{t("Hours reclaimed per week")}</dt>
                  <dd className="numeral">{hrs(result.hoursReclaimedWeek)}</dd>
                </div>
                <div className={styles.stat}>
                  <dt className={styles.statLabel}>{t("Hours reclaimed / year")}</dt>
                  <dd className="numeral">
                    {fmtNumber(result.hoursReclaimedYear, 0, locale)}
                  </dd>
                </div>
                <div className={styles.stat}>
                  <dt className={styles.statLabel}>{t("Annual capacity value")}</dt>
                  <dd className="numeral">
                    {/* es-MX joins "USD" to the amount with a no-break space;
                        a normal space lets the large numeral wrap there. */}
                    {fmtCurrency(result.valueRedeployed, locale).replace(/\u00a0/g, " ")}
                  </dd>
                </div>
              </dl>
            </div>
            <figure className={styles.chart} aria-labelledby="exhibit-3-title">
              <span className="exhibit__label">
                {t("Exhibit {number}", { number: 3 })}
              </span>
              <p id="exhibit-3-title" className={styles.chartTitle}>
                {t("Where the repetitive week goes")}
              </p>
              <p className="caption">{t("Hours per week across your team")}</p>
              <div className={styles.bar}>
                <StackedBar
                  share={inputs.automatableShare}
                  handledLabel={t("Handled by Brilliant · {hours} hrs", {
                    hours: hrs(handledHours),
                  })}
                  remainingLabel={t("Still with your team · {hours} hrs", {
                    hours: hrs(totalHours - handledHours),
                  })}
                  axisEnd={t("{hours} hrs", { hours: hrs(totalHours) })}
                  summary={t(
                    "{handled} of {total} repetitive hours a week handled by Brilliant",
                    { handled: hrs(handledHours), total: hrs(totalHours) },
                  )}
                />
              </div>
              <figcaption className="caption">
                {t("Source: your inputs. Assumes {weeks} working weeks a year.", {
                  weeks: inputs.workingWeeksPerYear,
                })}
              </figcaption>
            </figure>
            <dl className={styles.secondary} aria-live="polite">
              <div>
                <dt>{t("More capacity, same team")}</dt>
                <dd>+{fmtNumber(result.extraVolumePct, 0, locale)}%</dd>
              </div>
              <div>
                <dt>
                  {t("Weekly capacity reclaimed ({hours}-hour weeks)", {
                    hours: fmtNumber(inputs.hoursPerFullWeek, 0, locale),
                  })}
                </dt>
                <dd>
                  {t("{count} weeks", {
                    count: fmtNumber(result.capacityNotHiredFor, 1, locale),
                  })}
                </dd>
              </div>
              {result.revenueOpportunity > 0 && (
                <div>
                  <dt>
                    {t("Revenue on the {count} opportunities you declined", {
                      count: fmtNumber(inputs.opportunitiesDeclined, 0, locale),
                    })}
                  </dt>
                  <dd>{fmtCurrency(result.revenueOpportunity, locale)}</dd>
                </div>
              )}
              {result.paybackMonths !== null && (
                <div>
                  <dt>{t("Simple payback on that budget")}</dt>
                  <dd>
                    {t("{count} mo", {
                      count: fmtNumber(result.paybackMonths, 1, locale),
                    })}
                  </dd>
                </div>
              )}
            </dl>
            <p className="caption">
              {t(
                "An illustrative estimate, not a guarantee. Capacity value is not cash savings; implementation and ongoing costs are excluded.",
              )}
            </p>
            <div className={styles.actions}>
              <a href={DISCOVERY_CALL_HREF} className="button">
                {t(PRIMARY_CTA)}
              </a>
              <button
                type="button"
                className={`text-link ${styles.download}`}
                onClick={download}
              >
                <Icon name={downloaded ? "check" : "download"} size={16} />
                <span>{t(downloaded ? "Downloaded" : "Save estimate")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function MoneyField({
  id,
  label,
  hint,
  ariaLabel,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  ariaLabel: string;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldHead}>
        <label htmlFor={id}>{label}</label>
      </div>
      {hint && <p className="caption">{hint}</p>}
      <div className={styles.money}>
        <span aria-hidden="true">$</span>
        <input
          id={id}
          className="input"
          type="number"
          inputMode="decimal"
          min="0"
          max={max}
          step={step}
          value={value}
          onChange={(e) =>
            onChange(Math.min(max, Math.max(0, Number(e.target.value))))
          }
          aria-label={ariaLabel}
        />
      </div>
    </div>
  );
}
function Range({
  label,
  name,
  min,
  max,
  step = 1,
  value,
  display,
  onChange,
}: {
  label: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  display: string;
  onChange: (n: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div className={styles.field}>
      <div className={styles.fieldHead}>
        <label htmlFor={`range-${name}`}>{label}</label>
        <output htmlFor={`range-${name}`} className={styles.value}>
          {display}
        </output>
      </div>
      <input
        id={`range-${name}`}
        className={styles.range}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
    </div>
  );
}
