/**
 * Notes the site links to: the "What we've learned" block, the calculator,
 * the service pages and the finance and healthcare pages. A test keeps each
 * one published in both languages. They are operator notes on how the work
 * runs, not strategy content.
 */
export const INSIGHTS = {
  exceptions: "why-invoice-automation-stalls",
  measuring: "measuring-capacity-reclaimed",
  approvals: "approval-points-without-bottlenecks",
  agents: "agents-in-regulated-work",
} as const;

export const FEATURED_INSIGHTS: string[] = Object.values(INSIGHTS);

/**
 * Positioning guard: Brilliant runs workflows and agents; it does not sell
 * strategy or transformation programs, and it doesn't describe itself as a
 * consultancy. A test rejects these phrases in homepage copy and posts.
 * ("Consulting firms" on /about describes past employers, so it stays.)
 */
export const CONSULTANCY_PHRASES =
  /\b(AI strategy|AI roadmap|digital transformation|transformation program|change management|AI readiness|organizational readiness|maturity model|consultancy|consulting arm|consulting services|estrategia de IA|hoja de ruta de IA|transformación digital|gestión del cambio|madurez digital|brazo de consultoría|servicios de consultoría|consultoría presencial)\b/i;

/**
 * The homepage "What we've learned" block. Link, don't lecture: each rule is
 * one line and links the note that explains it, so the homepage stays short
 * and the depth is one click away. The measuring note is linked from the
 * calculator instead, where that question comes up.
 */
export const APPROACH_RULES: {
  title: string;
  note: keyof typeof INSIGHTS;
}[] = [
  { title: "Design for the exception first.", note: "exceptions" },
  { title: "One decision per approval, where your team already works.", note: "approvals" },
  { title: "Agents prepare. Your team decides.", note: "agents" },
];
