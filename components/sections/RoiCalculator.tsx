"use client";

import { useMemo, useState } from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Eyebrow } from "../ui/Eyebrow";
import { EmailCapture } from "../ui/EmailCapture";
import {
  buildBreakdown,
  computeRoi,
  DEFAULT_INPUTS,
  fmtCurrency,
  fmtNumber,
  type RoiInputs,
} from "@/lib/roi";

export function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULT_INPUTS);
  const results = useMemo(() => computeRoi(inputs), [inputs]);
  const breakdown = useMemo(() => buildBreakdown(inputs, results), [inputs, results]);

  const set = <K extends keyof RoiInputs>(key: K, value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const hasOpportunityInputs =
    inputs.opportunitiesDeclined > 0 && inputs.avgOpportunityValue > 0;

  return (
    <SectionWrapper id="roi-calculator" width="wide" className="scroll-mt-20 py-24 sm:py-32">
      {/* elevated, distinct — the centerpiece */}
      <div className="relative overflow-hidden rounded-[2rem] border border-accent-400/25 bg-gradient-to-b from-ink-850 to-ink-950 p-6 shadow-[0_40px_120px_-40px_var(--color-accent-600)] sm:p-10">
        <div
          aria-hidden
          className="glow-orb"
          style={{
            width: 420,
            height: 420,
            top: -160,
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle,var(--color-accent-500),transparent 70%)",
            opacity: 0.28,
          }}
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">The two-minute question</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            How much capacity is trapped in your week?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-mist-300">
            Put in your numbers. Watch the capacity you&rsquo;d get back appear
            as you go. No email needed to see your result.
          </p>
        </div>

        <div className="relative mt-12 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
          {/* -------- Inputs -------- */}
          <div className="rounded-2xl border hairline bg-ink-900/60 p-6 sm:p-7">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-400">
              Your numbers
            </h3>
            <div className="mt-5 space-y-6">
              <Slider
                label="People doing repetitive work"
                value={inputs.people}
                min={1}
                max={100}
                step={1}
                onChange={(v) => set("people", v)}
                display={fmtNumber(inputs.people)}
              />
              <Slider
                label="Hours per week each spends on it"
                value={inputs.hoursPerWeek}
                min={1}
                max={40}
                step={1}
                onChange={(v) => set("hoursPerWeek", v)}
                display={`${fmtNumber(inputs.hoursPerWeek)} hrs`}
              />
              <NumberField
                label="What one hour of that team&rsquo;s time is worth"
                prefix="$"
                value={inputs.hourlyValue}
                min={0}
                step={5}
                onChange={(v) => set("hourlyValue", v)}
                hint="What the business gets back from an hour of their time — the rate you&rsquo;d bill it at, or the return on the work it enables."
              />

              <div className="border-t hairline pt-6">
                <p className="text-xs font-medium uppercase tracking-wider text-mist-500">
                  Optional — the deals you turned down
                </p>
                <div className="mt-4 space-y-6">
                  <NumberField
                    label="Opportunities declined last year for lack of capacity"
                    value={inputs.opportunitiesDeclined}
                    min={0}
                    step={1}
                    onChange={(v) => set("opportunitiesDeclined", v)}
                  />
                  <NumberField
                    label="Average value of one such opportunity"
                    prefix="$"
                    value={inputs.avgOpportunityValue}
                    min={0}
                    step={1000}
                    onChange={(v) => set("avgOpportunityValue", v)}
                  />
                </div>
              </div>
            </div>

            {/* -------- Assumptions (a trust feature) -------- */}
            <div className="mt-7 rounded-xl border border-accent-400/20 bg-accent-500/[0.05] p-5">
              <p className="text-sm font-semibold text-accent-200">
                Assumptions &mdash; deliberately conservative, and yours to edit
              </p>
              <p className="mt-1 text-xs leading-relaxed text-mist-400">
                These drive the math. We default them low on purpose. Change any
                of them and the results update live.
              </p>
              <div className="mt-5 space-y-6">
                <Slider
                  label="Share of that work that&rsquo;s automatable"
                  value={Math.round(inputs.automatableShare * 100)}
                  min={10}
                  max={95}
                  step={5}
                  onChange={(v) => set("automatableShare", v / 100)}
                  display={`${Math.round(inputs.automatableShare * 100)}%`}
                />
                <div className="grid grid-cols-2 gap-4">
                  <NumberField
                    label="Working weeks / year"
                    value={inputs.workingWeeksPerYear}
                    min={1}
                    max={52}
                    step={1}
                    onChange={(v) => set("workingWeeksPerYear", v)}
                    small
                  />
                  <NumberField
                    label="Hours in one full week"
                    value={inputs.hoursPerFullWeek}
                    min={1}
                    max={80}
                    step={1}
                    onChange={(v) => set("hoursPerFullWeek", v)}
                    small
                  />
                </div>
              </div>
            </div>
          </div>

          {/* -------- Results --------
              Order is deliberate: capacity and output lead, money follows.
              What the team gains is the result; what it's worth is a footnote. */}
          <div className="flex flex-col gap-5">
            {/* PRIMARY — capacity reclaimed */}
            <div className="rounded-2xl border border-accent-400/30 bg-ink-900/80 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-400">
                  Capacity you get back
                </h3>
                <span className="rounded-full bg-glow-amber/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-glow-amber">
                  Live
                </span>
              </div>

              <p className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {fmtNumber(results.hoursReclaimedWeek)} hrs
                <span className="ml-2 align-middle text-base font-medium text-mist-400">
                  / week
                </span>
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-accent-300 sm:text-3xl">
                {fmtNumber(results.hoursReclaimedYear)} hrs
                <span className="ml-2 align-middle text-sm font-medium text-mist-400">
                  / year
                </span>
              </p>
              <p className="mt-3 text-sm text-mist-400">
                Time your team gets back &mdash; redirected to the work only they
                can do.
              </p>
            </div>

            {/* PRIMARY — what that capacity can carry */}
            <div className="rounded-2xl border border-accent-400/30 bg-ink-900/80 p-6 sm:p-7">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-400">
                What that capacity can carry
              </h3>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                +{fmtNumber(results.extraVolumePct)}%
                <span className="ml-2 align-middle text-base font-medium text-mist-400">
                  more volume
                </span>
              </p>
              <p className="mt-2 text-sm text-mist-400">
                How much more the same team can take on, without adding a single
                hour to anyone&rsquo;s week.
              </p>
              <div className="mt-5">
                <Stat
                  value={`${fmtNumber(results.capacityNotHiredFor, 1)}×`}
                  label="Full-time capacity you didn't have to hire for"
                />
              </div>
            </div>

            {/* PRIMARY — the work you could say yes to */}
            {hasOpportunityInputs ? (
              <div className="rounded-2xl border border-accent-400/30 bg-ink-900/80 p-6 sm:p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-mist-400">
                  The work you could say yes to
                </h3>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {fmtCurrency(results.revenueOpportunity)}
                </p>
                <p className="mt-2 text-sm text-mist-400">
                  Revenue on the {fmtNumber(inputs.opportunitiesDeclined)}{" "}
                  opportunities you declined last year for lack of capacity
                  &mdash; the ceiling this lifts.
                </p>
              </div>
            ) : null}

            {/* SECONDARY — what the redeployed capacity is worth, and payback */}
            <div className="rounded-2xl border hairline bg-ink-900/50 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-mist-500">
                Value of capacity redeployed
              </h3>
              <p className="mt-2 text-xl font-bold text-mist-100">
                {fmtCurrency(results.valueRedeployed)}
                <span className="ml-2 align-middle text-xs font-medium text-mist-500">
                  / year
                </span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-mist-500">
                Those hours priced at what an hour of your team&rsquo;s time
                returns to the business.
              </p>

              <div className="mt-4 border-t hairline pt-4">
                <p className="text-xs leading-relaxed text-mist-400">
                  Against a typical engagement of{" "}
                  <span className="font-semibold text-mist-200">
                    [PLACEHOLDER: engagement cost range]
                  </span>
                  {results.paybackMonths !== null ? (
                    <>
                      {" "}
                      (modeled here at {fmtCurrency(inputs.engagementCost)}), the
                      redeployed capacity pays it back in about{" "}
                      <span className="font-semibold text-accent-300">
                        {fmtNumber(results.paybackMonths, 1)} months
                      </span>
                      .
                    </>
                  ) : (
                    " enter your numbers above to see payback."
                  )}
                </p>
                <label className="mt-3 block text-xs text-mist-500">
                  Adjust modeled engagement cost
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={inputs.engagementCost}
                    onChange={(e) => set("engagementCost", Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border hairline bg-ink-950 px-3 py-2 text-sm text-mist-100 focus:border-accent-400 focus:outline-none"
                  />
                </label>
              </div>
            </div>

            <p className="rounded-xl bg-ink-800/60 px-4 py-3 text-center text-sm font-medium text-mist-200">
              These are your numbers, not our promises.
            </p>
          </div>
        </div>

        {/* -------- Email capture: only AFTER results are visible -------- */}
        <div className="relative mx-auto mt-10 max-w-xl rounded-2xl border hairline bg-ink-900/70 p-6 text-center sm:p-8">
          <h3 className="text-lg font-semibold">
            Send me the full breakdown
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-mist-400">
            Get these numbers as a shareable breakdown you can take to your team
            &mdash; the case for lifting your ceiling, in writing.
          </p>
          <div className="mt-5">
            <EmailCapture
              source="roi-calculator"
              cta="Send the breakdown"
              payload={{ inputs, results, breakdown }}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

/* ---------------------------------------------------------------- pieces */

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          className="text-sm text-mist-200"
          dangerouslySetInnerHTML={{ __html: label }}
        />
        <span className="text-sm font-semibold text-accent-300">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label.replace(/&[a-z]+;/g, "")}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-ink-700 accent-[var(--color-accent-500)]"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix,
  hint,
  small,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  prefix?: string;
  hint?: string;
  small?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-mist-200">
        {label}
        <div className="mt-2 flex items-center rounded-lg border hairline bg-ink-950 focus-within:border-accent-400">
          {prefix ? (
            <span className="pl-3 text-sm text-mist-500">{prefix}</span>
          ) : null}
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-full bg-transparent px-3 text-mist-100 focus:outline-none ${
              small ? "py-1.5 text-sm" : "py-2.5"
            }`}
          />
        </div>
      </label>
      {hint ? <p className="mt-1.5 text-xs text-mist-500">{hint}</p> : null}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-ink-950/70 p-4">
      <p className="text-xl font-bold text-mist-100">{value}</p>
      <p className="mt-1 text-xs leading-snug text-mist-400">{label}</p>
    </div>
  );
}
