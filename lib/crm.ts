import type { Locale } from "./locale";
import type { Currency } from "./roi";

/**
 * The custom CRM offer. It is white-label: copy says "open-source foundation"
 * and never names the project underneath (a test enforces this). Features
 * listed here ship with that foundation; anything beyond the base plan is
 * scoped and quoted after the review.
 */

/**
 * Base-plan price per currency, set separately (no FX conversion). A currency
 * without an entry falls back to the USD price, labelled as USD.
 */
export const CRM_PRICE: Partial<
  Record<Currency, { month: number; year: number }>
> = {
  USD: { month: 29, year: 290 },
  MXN: { month: 499, year: 4990 },
};

export function crmPrice(locale: Locale) {
  const preferred: Currency = locale === "es" ? "MXN" : "USD";
  const currency: Currency = CRM_PRICE[preferred] ? preferred : "USD";
  const { month, year } = CRM_PRICE[currency]!;
  return { currency, month, year, twoMonthsFree: year === month * 10 };
}

export type CrmDeal = {
  company: string;
  deal: string;
  value: Record<Currency, number>;
};

/**
 * Exhibit: one accounting firm's pipeline. Invented names and figures,
 * captioned as illustrative. Values follow the page currency.
 */
export const CRM_PIPELINE: { stage: string; deals: CrmDeal[] }[] = [
  {
    stage: "Lead",
    deals: [
      {
        company: "Orsa Logistics",
        deal: "Monthly bookkeeping",
        value: { USD: 18000, MXN: 320000 },
      },
      {
        company: "Clínica Valle Norte",
        deal: "Payroll service",
        value: { USD: 24000, MXN: 410000 },
      },
    ],
  },
  {
    stage: "Proposal",
    deals: [
      {
        company: "Halden Foods",
        deal: "Annual audit",
        value: { USD: 36000, MXN: 650000 },
      },
    ],
  },
  {
    stage: "Negotiation",
    deals: [
      {
        company: "Brightwater Dental",
        deal: "Tax planning",
        value: { USD: 12000, MXN: 210000 },
      },
    ],
  },
  {
    stage: "Won",
    deals: [
      {
        company: "Meridian Family Practice",
        deal: "Year-end close support",
        value: { USD: 42000, MXN: 760000 },
      },
    ],
  },
];

export type CrmFeature = [icon: string, title: string, line: string];

/** Standard in every CRM we set up. */
export const CRM_ESSENTIALS: CrmFeature[] = [
  [
    "people",
    "Contacts and companies",
    "Every client, contact, and company in one place.",
  ],
  [
    "chart",
    "Deal pipeline",
    "A drag-and-drop board with the stages you choose.",
  ],
  [
    "clock",
    "Tasks and reminders",
    "Follow-ups with due dates, so nothing slips.",
  ],
  [
    "document",
    "Notes",
    "Record the details of every call and meeting, so nothing gets lost.",
  ],
  [
    "flow",
    "Activity history",
    "Emails, notes, tasks, and deals in one timeline.",
  ],
  [
    "download",
    "Import and export",
    "Bring your spreadsheets in. Take your contacts out any time.",
  ],
];

/** Also standard. The homepage shows the first three after the essentials. */
export const CRM_ADVANCED: CrmFeature[] = [
  ["lock", "Single sign-on", "Sign in with Google, Azure, Keycloak, or Auth0."],
  ["plug", "API access", "Connect it to the other systems you use."],
  [
    "spark",
    "Your fields, your language",
    "Custom fields, your brand, and an interface in English, Spanish, or both.",
  ],
  ["mail", "Email to note", "Copy the CRM on an email and it’s saved as a note."],
];

/** What an assistant connected to the CRM can do. */
export const CRM_ASSISTANT: [title: string, body: string][] = [
  [
    "Ask anything",
    "Find contacts, review the pipeline, and summarize an account’s history.",
  ],
  [
    "Update by conversation",
    "Log notes, create tasks, and move deals by asking.",
  ],
  [
    "Same permissions",
    "Assistants follow the same access rules as the person asking.",
  ],
];

/** Plain-language requests an assistant can run against the CRM. */
export const CRM_PROMPTS = [
  "“Which proposals haven’t moved in two weeks?”",
  "“Summarize everything we know about Halden Foods.”",
  "“Log a note: we sent the revised quote. Remind me Friday.”",
];

/** Examples of changes a team asks for once the CRM is running. */
export const CRM_REQUESTS = [
  "A contracts page",
  "Renewal dates on every company",
  "A dashboard of deals by region",
  "Only managers can delete contacts",
  "Your brand colors and logo",
];

export const CRM_REASONS: [title: string, body: string][] = [
  [
    "No per-seat pricing",
    "Add the whole team. The price doesn’t change with headcount.",
  ],
  [
    "A proven foundation",
    "Built on an open-source CRM, so your budget goes into your process, not into rebuilding the basics.",
  ],
  [
    "Your data comes with you",
    "Import your spreadsheets on day one. Export your contacts whenever you want.",
  ],
  [
    "Custom work, quoted first",
    "New pages, fields, and integrations beyond the base plan are scoped and quoted after the review.",
  ],
];

/** Process, not certifications: see /security and CLAUDE.md. */
export const CRM_SECURITY: [title: string, body: string][] = [
  [
    "Your company sign-in",
    "Your team signs in with Google, Azure, Keycloak, or Auth0 accounts, so access follows your company accounts.",
  ],
  [
    "Access by role",
    "Admins manage users and settings. Stricter rules, like manager-only deletion, are set to match your policies.",
  ],
  [
    "Sensitive data, settled first",
    "Patient or client financial data? Where it lives and which agreements apply are settled before anything is imported.",
  ],
];

/** From review to a CRM your team uses. No durations: timing is scoped. */
export const CRM_STEPS: { title: string; label: string; body: string }[] = [
  {
    title: "Review",
    label: "20 min",
    body: "We map your sales process, your pipeline stages, and the data you have today.",
  },
  {
    title: "Set up",
    label: "Before launch",
    body: "We configure stages, fields, and permissions, and import your contacts.",
  },
  {
    title: "Launch",
    label: "Day one",
    body: "Your team signs in with the accounts they already use, and we walk them through it.",
  },
  {
    title: "Grow",
    label: "Ongoing",
    body: "Change stages and settings yourself. New pages, fields, or integrations are quoted, then built.",
  },
];

/** Open-source tools underneath. Proper nouns: never translated. */
export const CRM_STACK = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "TanStack Query",
  "Supabase",
  "PostgreSQL",
];

/** Examples of work quoted beyond the base plan. */
export const CRM_CUSTOM_WORK = [
  "New pages and fields",
  "Integrations with your other systems",
  "Importing data from your current tools",
  "Training for your team",
];

/** The blog post the /custom-crm page links to (a test keeps it published). */
export const CRM_POST_SLUG = "crm-systems-of-action";
