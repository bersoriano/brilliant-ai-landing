import { CRM_POST_SLUG } from "./crm";

/**
 * Notes the site links to: the "What we've learned" block, the calculator,
 * the trust section and the finance and healthcare pages. A test keeps each
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
 * The homepage blog teaser: the latest three posts not already linked from
 * "What we've learned". The CRM post is linked from #crm instead; under the
 * teaser's finance-and-healthcare heading it would read as our view.
 */
export function homepageTeaser<T extends { slug: string }>(posts: T[]): T[] {
  return posts
    .filter(
      (post) => !FEATURED_INSIGHTS.includes(post.slug) && post.slug !== CRM_POST_SLUG,
    )
    .slice(0, 3);
}

/**
 * Positioning guard: Brilliant runs workflows and agents; it does not sell
 * strategy or transformation programs, and it doesn't describe itself as a
 * consultancy. A test rejects these phrases in homepage copy and posts.
 * ("Consulting firms" on /about describes past employers, so it stays.)
 */
export const CONSULTANCY_PHRASES =
  /\b(AI strategy|AI roadmap|digital transformation|transformation program|change management|AI readiness|organizational readiness|maturity model|consultancy|consulting arm|consulting services|estrategia de IA|hoja de ruta de IA|transformación digital|gestión del cambio|madurez digital|brazo de consultoría|servicios de consultoría|consultoría presencial)\b/i;

/**
 * The homepage "What we've learned" block: four operator rules, each tied to
 * a note (or to a page). Short on purpose; the notes carry the detail. The
 * examples pair finance with healthcare so both buyers see their own work.
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
    body: "An invoice that matches its PO, or a referral with every field filled in, barely needs help. The hours go into the price difference, the missing receipt, the referral without insurance details. Each one reaches a person as a clear question, with the evidence attached.",
    note: "exceptions",
  },
  {
    title: "One decision per approval, where your team already works.",
    body: "A card in Teams or Outlook with the invoice, the PO and the difference gets decided. So does a referral in the intake queue that shows exactly which fields are missing. A link to a new dashboard waits.",
    note: "approvals",
  },
  {
    title: "Count hours, not hype.",
    body: "We measure the items handled against the time they used to take, and report capacity as a range. The money is your estimate, not ours.",
    note: "measuring",
  },
  {
    title: "Judgment stays with your team.",
    body: "Every agent works for a named person. It gathers, checks and drafts; that person decides. Recording, paying, triage and care decisions stay with your team, and every action is logged.",
    note: "agents",
  },
];
