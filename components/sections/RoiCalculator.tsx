"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useMemo, useState } from "react";
import {
  buildBreakdown,
  computeRoi,
  DEFAULT_INPUTS,
  fmtCurrency,
  fmtNumber,
  type RoiInputs,
} from "@/lib/roi";
import { Icon } from "../ui/Icon";
import { DISCOVERY_CALL_HREF } from "@/lib/site";
export function RoiCalculator() {
  const { t, locale } = useLanguage();
  const [inputs, setInputs] = useState<RoiInputs>({
    ...DEFAULT_INPUTS,
    opportunitiesDeclined: 0,
    avgOpportunityValue: 0,
    engagementCost: 0,
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
  return (
    <section id="roi-calculator" className="section shell calculator-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t("Make the opportunity tangible")}</span>
          <h2>
            {t("What could your team")}
            <br />
            {t("do with more time?")}
          </h2>
        </div>
        <p>
          {t("Put a number on the busywork.")}
          <br />
          {t("Explore your potential. No email required.")}
        </p>
      </div>
      <div className="calculator">
        <div className="calculator-inputs">
          <div className="calculator-title">
            <Icon name="chart" size={19} />
            <h3>{t("Your team, your numbers")}</h3>
            <span>{t("01 / Inputs")}</span>
          </div>
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
          <div className="hourly-field">
            <div>
              <label htmlFor="hourly-value">
                {t("Value of one hour of team time")}
              </label>
              <p>{t("What an hour of productive work is worth.")}</p>
            </div>
            <div>
              <span>$</span>
              <input
                id="hourly-value"
                type="number"
                inputMode="decimal"
                min="0"
                max="10000"
                step="5"
                value={inputs.hourlyValue}
                onChange={(e) =>
                  set(
                    "hourlyValue",
                    Math.min(10000, Math.max(0, Number(e.target.value))),
                  )
                }
                aria-label={t("Value of one hour of team time in US dollars")}
              />
            </div>
          </div>
          <details className="calculator-assumptions">
            <summary>
              {t("Adjust the assumptions")} <span>+</span>
            </summary>
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
            <label className="weeks-field" htmlFor="working-weeks">
              {t("Working weeks per year")}
              <input
                id="working-weeks"
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
            </label>
          </details>
          <p className="assumptions-note">
            {t(
              "Based on {share}% automation and {weeks} working weeks. All amounts in USD.",
              {
                share: Math.round(inputs.automatableShare * 100),
                weeks: inputs.workingWeeksPerYear,
              },
            )}
          </p>
        </div>
        <div className="calculator-results">
          <div className="result-label">
            <span className="status-dot" />
            {t("Your potential, unlocked")}
            <span>{t("02 / Estimate")}</span>
          </div>
          <div aria-live="polite" aria-atomic="true">
            <div className="main-result">
              {fmtNumber(result.hoursReclaimedWeek, 1, locale)}{" "}
              <span>{t("hrs / week")}</span>
            </div>
            <p className="result-description">
              {t("Back in your team’s hands.")}
            </p>
            <div className="result-stats">
              <div>
                <strong>
                  {fmtNumber(result.hoursReclaimedYear, 0, locale)}
                </strong>
                <span>{t("Hours reclaimed / year")}</span>
              </div>
              <div>
                <strong>{fmtCurrency(result.valueRedeployed, locale)}</strong>
                <span>{t("Annual capacity value")}</span>
              </div>
            </div>
          </div>
          <div className="result-visual" aria-hidden="true">
            {Array.from({ length: 38 }, (_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(inputs.automatableShare * 38) ? "active" : ""
                }
                style={{ height: `${26 + Math.sin(i * 0.3) * 12 + i * 1.8}px` }}
              />
            ))}
          </div>
          <p className="estimate-note">
            {t(
              "An illustrative estimate, not a guarantee. Capacity value is not cash savings; implementation and ongoing costs are excluded.",
            )}
          </p>
          <div className="calculator-actions">
            <a href={DISCOVERY_CALL_HREF} className="button">
              {t("Explore what’s possible")} <Icon name="diagonal" size={16} />
            </a>
            <button
              type="button"
              className="download-button"
              onClick={download}
            >
              <Icon name={downloaded ? "check" : "download"} size={16} />
              <span>{t(downloaded ? "Downloaded" : "Save estimate")}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
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
  return (
    <div className="range-field">
      <div>
        <label htmlFor={`range-${name}`}>{label}</label>
        <output htmlFor={`range-${name}`}>{display}</output>
      </div>
      <input
        id={`range-${name}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          backgroundImage: `linear-gradient(to right, var(--orange) ${((value - min) / (max - min)) * 100}%, #353836 ${((value - min) / (max - min)) * 100}%)`,
          backgroundSize: "100% 3px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      <div className="range-limits">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
