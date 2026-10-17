/**
 * Notes the homepage links to: the "What we've learned" block, the calculator
 * and the trust section. A test keeps each one published in both languages.
 * They are operator notes on how the work runs, not strategy content.
 */
export const INSIGHTS = {
  exceptions: "why-invoice-automation-stalls",
  measuring: "measuring-capacity-reclaimed",
  approvals: "approval-points-without-bottlenecks",
} as const;

export const FEATURED_INSIGHTS: string[] = Object.values(INSIGHTS);

/**
 * Positioning guard: Brilliant runs workflows and agents; it does not sell
 * strategy or transformation programs. A test rejects these phrases in
 * homepage copy and posts.
 */
export const CONSULTANCY_PHRASES =
  /\b(AI strategy|AI roadmap|digital transformation|transformation program|change management|AI readiness|organizational readiness|maturity model|estrategia de IA|hoja de ruta de IA|transformación digital|gestión del cambio|madurez digital)\b/i;

/**
 * The homepage "What we've learned" block: four operator rules, each tied to
 * a note (or to /security). Short on purpose; the notes carry the detail.
 */
export const APPROACH_RULES: {
  title: string;
  body: string;
  note?: keyof typeof INSIGHTS;
  href?: string;
  linkLabel?: string;
}[] = [
  {
    title: "Design for the exception first.",
    body: "An invoice that matches its PO barely needs help. The mismatch, the missing receipt and the unknown vendor are where the hours go, so each one reaches a person as a clear question, with the evidence attached.",
    note: "exceptions",
  },
  {
    title: "One decision per approval, where your team already works.",
    body: "A card in Teams or Outlook that carries the invoice, the PO and the difference gets decided. A link to a new dashboard waits.",
    note: "approvals",
  },
  {
    title: "Count hours, not hype.",
    body: "We measure the items handled against the time they used to take, and report capacity as a range. The money is your estimate, not ours.",
    note: "measuring",
  },
  {
    title: "Judgment stays with your team.",
    body: "Agents gather, check and draft. Recording, paying, triage and care decisions stay with the people you name, and access is logged.",
    href: "/security",
    linkLabel: "Read how we handle financial and patient data",
  },
];
