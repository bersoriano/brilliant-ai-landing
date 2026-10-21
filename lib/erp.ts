import type { AgentPlay, CrmFeature } from "./crm";
import type { Locale } from "./locale";
import type { Currency } from "./roi";

/**
 * The custom ERP offer. Like the CRM it is white-label: the site never names
 * the system underneath, here or anywhere in this public repo (a test
 * enforces it). Features listed here ship with that system; anything beyond
 * the base plan is scoped and quoted after the review.
 */

/** The note /custom-erp links to; a test keeps it published. */
export const ERP_POST_SLUG = "erp-systems-of-action";

/**
 * Base-plan starting price per currency, set separately (no FX conversion).
 * It starts where the CRM's does; kept apart so the two can change on their
 * own. A currency without an entry falls back to USD.
 */
export const ERP_PRICE: Partial<Record<Currency, { month: number }>> = {
  USD: { month: 29 },
  MXN: { month: 499 },
};

export function erpPrice(locale: Locale) {
  const preferred: Currency = locale === "es" ? "MXN" : "USD";
  const currency: Currency = ERP_PRICE[preferred] ? preferred : "USD";
  return { currency, month: ERP_PRICE[currency]!.month };
}

/**
 * Homepage ERP exhibit: what the system does when routine work arrives, and
 * what a person approves before anything is recorded, paid, or ordered.
 * Examples to adapt, not client results.
 */
export const ERP_PLAYS: AgentPlay[] = [
  {
    when: "A supplier invoice doesn’t match its purchase order",
    agent:
      "The system flags the difference, attaches the supporting documents, and sends one approval request.",
    approve: "The invoice, before anything is recorded",
    measure: "Mismatches caught before posting",
  },
  {
    when: "A key item drops below the stock level you set",
    agent:
      "The system prepares a suggested purchase order and notifies the right person.",
    approve: "The order, before it goes out",
    measure: "Orders placed before stock runs out",
  },
  {
    when: "Month-end approaches",
    agent:
      "The system gathers sales, inventory, and open invoices into a ready-to-review pack.",
    approve: "The entries, once your team has checked them",
    measure: "Days to close",
  },
];

/** Standard in every ERP we set up. */
export const ERP_FEATURES: CrmFeature[] = [
  ["people", "Sales and customers", "Sales orders and customer records in one place."],
  ["chart", "Inventory", "Stock levels and every stock movement."],
  ["document", "Purchasing", "Purchase orders and supplier records."],
  ["check", "Invoice matching", "Invoices matched to orders and receipts."],
  ["lock", "Accounting", "Entries that stay under your approval."],
  ["chart", "Reports", "Sales, stock, and open balances."],
  ["clock", "Tasks and reminders", "Follow-ups that don’t slip."],
  ["download", "Import and export", "Bring your spreadsheets in. Export any time."],
  [
    "spark",
    "Your fields, your language",
    "Your own fields and stages, in English, Spanish, or both.",
  ],
  ["lock", "Single sign-on", "Sign in with the accounts your team already uses."],
];

/** /custom-erp: from the review to a system your team uses. */
export const ERP_STEPS: { title: string; label: string; body: string }[] = [
  {
    title: "Review",
    label: "20 min",
    body: "We map your operations: sales, stock, purchasing, and the spreadsheets and tools your team uses today.",
  },
  {
    title: "Set up",
    label: "Before launch",
    body: "We configure your fields, stages, and approvals, and bring in your records.",
  },
  {
    title: "Launch",
    label: "Day one",
    body: "Your team signs in with the accounts they already use, and we walk them through it.",
  },
  {
    title: "Grow",
    label: "Ongoing",
    body: "Change stages, statuses, and who can approve yourself. New approval steps, reports, or fields are quoted, then built.",
  },
];

/** /custom-erp: asking the system, and asking us for more. */
export const ERP_NOTES: [title: string, body: string, caption?: string][] = [
  [
    "Ask in plain language",
    "Connect the agents we build, or Claude or ChatGPT. They find open invoices, check stock, draft a purchase order, or summarize what’s waiting for approval, always with the same permissions as the person asking. Nothing posts or pays without your team’s approval.",
  ],
  [
    "Need something new? Ask for it.",
    "Tell us what your process needs (a new approval step, a custom report, a field for your industry) and we add it. Everyday changes such as stages, statuses, or who can approve stay with your team.",
    "Quoted before we start.",
  ],
];

/** Beyond the base plan: scoped with you, quoted before we start. */
export const ERP_CUSTOM_WORK = [
  "A new approval step",
  "Custom reports",
  "Fields for your industry",
];
