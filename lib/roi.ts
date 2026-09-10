import type { Locale } from "./locale";
import { translate } from "./i18n";
/**
 * Pure ROI math. No promises are asserted here — every number is derived
 * directly from the user's own inputs and their visible, editable assumptions.
 *
 * Framing rule: this models capacity gained, not cost removed. The monetary
 * figure is anchored to what an hour of the team's time is *worth to the
 * business*, not what it costs to employ someone. Nothing here computes or
 * exposes a per-person cost.
 */

export type RoiInputs = {
  people: number; // people doing repetitive work
  hoursPerWeek: number; // hours each spends on it, weekly
  hourlyValue: number; // what an hour of that team's time returns
  opportunitiesDeclined: number; // optional (0 = unused)
  avgOpportunityValue: number; // optional (0 = unused)
  // --- visible, adjustable assumptions ---
  automatableShare: number; // 0..1, default 0.6 (conservative)
  workingWeeksPerYear: number; // default 46
  hoursPerFullWeek: number; // default 40, defines one "full week" of capacity
  engagementCost: number; // for payback framing — replace with real range
};

export type RoiResults = {
  // --- primary: capacity and output ---
  hoursReclaimedWeek: number;
  hoursReclaimedYear: number;
  extraVolumePct: number; // operating leverage, as % more output
  capacityNotHiredFor: number; // full weeks of capacity gained without hiring
  revenueOpportunity: number; // from declined work (0 if not provided)
  // --- secondary: money ---
  valueRedeployed: number; // annual value of the capacity redeployed
  paybackMonths: number | null; // null if engagementCost not set
};

export const DEFAULT_INPUTS: RoiInputs = {
  people: 5,
  hoursPerWeek: 10,
  hourlyValue: 85,
  opportunitiesDeclined: 6,
  avgOpportunityValue: 12000,
  automatableShare: 0.6,
  workingWeeksPerYear: 46,
  hoursPerFullWeek: 40,
  engagementCost: 30000,
};

const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function computeRoi(raw: RoiInputs): RoiResults {
  const people = clampNonNeg(raw.people);
  const hoursPerWeek = clampNonNeg(raw.hoursPerWeek);
  const hourlyValue = clampNonNeg(raw.hourlyValue);
  const share = Math.min(Math.max(raw.automatableShare, 0), 1);
  const weeks = clampNonNeg(raw.workingWeeksPerYear) || 46;
  const fullWeek = clampNonNeg(raw.hoursPerFullWeek) || 40;

  const totalRepetitiveWeek = people * hoursPerWeek;
  const hoursReclaimedWeek = totalRepetitiveWeek * share;
  const hoursReclaimedYear = hoursReclaimedWeek * weeks;

  // Capacity gained expressed in full weeks of work — capacity the business
  // gets without hiring for it. Never a count of people no longer needed.
  const capacityNotHiredFor = hoursReclaimedWeek / fullWeek;

  // Operating leverage: reclaimed hours as a share of the team's total
  // working hours — i.e. how much more the same team can now take on.
  const teamWeeklyHours = people * fullWeek;
  const extraVolumePct =
    teamWeeklyHours > 0 ? (hoursReclaimedWeek / teamWeeklyHours) * 100 : 0;

  const revenueOpportunity =
    clampNonNeg(raw.opportunitiesDeclined) *
    clampNonNeg(raw.avgOpportunityValue);

  const valueRedeployed = hoursReclaimedYear * hourlyValue;

  const engagement = clampNonNeg(raw.engagementCost);
  const monthlyValue = valueRedeployed / 12;
  const paybackMonths =
    engagement > 0 && monthlyValue > 0 ? engagement / monthlyValue : null;

  return {
    hoursReclaimedWeek,
    hoursReclaimedYear,
    extraVolumePct,
    capacityNotHiredFor,
    revenueOpportunity,
    valueRedeployed,
    paybackMonths,
  };
}

export const fmtCurrency = (n: number, locale: Locale = "en") =>
  new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

export const fmtNumber = (n: number, digits = 0, locale: Locale = "en") =>
  new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
    maximumFractionDigits: digits,
  }).format(n);

/**
 * The breakdown that gets emailed. Built explicitly rather than serialising
 * the raw result object, so the labels a recipient reads are the same
 * capacity-first labels shown on the page — capacity leads, money follows.
 */
export function buildBreakdown(
  inputs: RoiInputs,
  r: RoiResults,
  locale: Locale = "en",
) {
  const t = (source: string, variables?: Record<string, string | number>) =>
    translate(source, locale, variables);
  const number = (n: number, digits = 0) => fmtNumber(n, digits, locale);
  const currency = (n: number) => fmtCurrency(n, locale);
  const lines: { label: string; value: string }[] = [
    {
      label: t("Hours reclaimed per week"),
      value: t("{count} hrs", { count: number(r.hoursReclaimedWeek) }),
    },
    {
      label: t("Hours reclaimed per year"),
      value: t("{count} hrs", { count: number(r.hoursReclaimedYear) }),
    },
    {
      label: t("Share of weekly team capacity reclaimed"),
      value: `+${number(r.extraVolumePct)}%`,
    },
    {
      label: t("Weekly capacity reclaimed ({hours}-hour weeks)", {
        hours: number(inputs.hoursPerFullWeek),
      }),
      value: t("{count} weeks", { count: number(r.capacityNotHiredFor, 1) }),
    },
  ];

  if (r.revenueOpportunity > 0) {
    lines.push({
      label: t("Revenue on the {count} opportunities you declined", {
        count: number(inputs.opportunitiesDeclined),
      }),
      value: currency(r.revenueOpportunity),
    });
  }

  lines.push({
    label: t("Value of capacity redeployed (per year)"),
    value: currency(r.valueRedeployed),
  });

  if (r.paybackMonths !== null) {
    lines.push({
      label: t("Simple payback on a {cost} engagement", {
        cost: currency(inputs.engagementCost),
      }),
      value: t("{count} months", { count: number(r.paybackMonths, 1) }),
    });
  }

  return {
    lines,
    assumptions: [
      {
        label: t("Share of that work assumed automatable"),
        value: `${Math.round(inputs.automatableShare * 100)}%`,
      },
      {
        label: t("Working weeks per year"),
        value: number(inputs.workingWeeksPerYear),
      },
      {
        label: t("Hours in one full week"),
        value: number(inputs.hoursPerFullWeek),
      },
      {
        label: t("Value of one hour of team time"),
        value: currency(inputs.hourlyValue),
      },
    ],
    note: t("These are your numbers, not our promises."),
  };
}
