import type { AgentPlay, CrmFeature } from "./crm";
import type { Locale } from "./locale";
import type { Currency } from "./roi";

/**
 * The custom ERP offer. Like the CRM it is white-label: the site never names
 * the system underneath, here or anywhere in this public repo (a test
 * enforces it). Features listed here ship with that system; anything beyond
 * the base plan is scoped and quoted after the review.
 */

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
