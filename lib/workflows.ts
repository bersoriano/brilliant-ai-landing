/** Illustrative service scopes, not prebuilt integrations or client results. */
export type Industry = "finance" | "healthcare";
export type Workflow = {
  id: string;
  industry: Industry;
  title: string;
  shortDescription: string;
  icon: string;
  trigger: string;
  tools: [string, string, string];
  document: string;
  reference: string;
  field: string;
  value: string;
  stages: [string, string, string, string];
  outcome: string;
  approval: string;
};
export const WORKFLOWS: Workflow[] = [
  {
    id: "invoice-approvals",
    industry: "finance",
    title: "Prepare invoices for approval",
    shortDescription: "From a crowded inbox to a review-ready invoice.",
    icon: "document",
    trigger: "When a supplier invoice arrives",
    tools: ["Outlook", "QuickBooks", "Teams"],
    document: "Supplier invoice",
    reference: "INV–2026–084",
    field: "Purchase order",
    value: "PO–00482",
    stages: [
      "Collect the invoice",
      "Check fields and match the PO",
      "Flag differences for your team",
      "Request approval before posting",
    ],
    outcome:
      "A checked invoice, supporting documents, and any exceptions in one approval request.",
    approval:
      "Your finance team approves the accounting entry. Payment stays under your control.",
  },
  {
    id: "close-readiness",
    industry: "finance",
    title: "Keep the close moving",
    shortDescription: "Collect the open items before the deadline.",
    icon: "chart",
    trigger: "On your month-end schedule",
    tools: ["Accounting system", "Close checklist", "Teams"],
    document: "Close readiness brief",
    reference: "PERIOD–2026–08",
    field: "Review area",
    value: "Open items",
    stages: [
      "Read the approved close checklist",
      "Gather status and supporting files",
      "Draft an exception summary",
      "Send the brief to the controller",
    ],
    outcome:
      "One list of outstanding items, owners, and source documents for your close meeting.",
    approval:
      "Your controller signs off on reconciliations and decides when the period can close.",
  },
  {
    id: "client-documents",
    industry: "finance",
    title: "Chase missing client documents",
    shortDescription: "Give every incomplete file a clear next step.",
    icon: "people",
    trigger: "When an onboarding file is incomplete",
    tools: ["CRM", "Document portal", "Email"],
    document: "Onboarding checklist",
    reference: "FILE–2026–019",
    field: "File status",
    value: "Awaiting documents",
    stages: [
      "Check the required document list",
      "Identify what is still missing",
      "Draft a targeted follow-up",
      "Route the message for review",
    ],
    outcome:
      "An up-to-date checklist and a specific follow-up, ready for the relationship manager.",
    approval:
      "Your team reviews communications and makes the final onboarding decision.",
  },
  {
    id: "referral-routing",
    industry: "healthcare",
    title: "Move referrals to the right team",
    shortDescription: "Turn incoming referrals into organized next steps.",
    icon: "heart",
    trigger: "When a referral reaches your intake team",
    tools: ["Referral inbox", "Intake queue", "Scheduling"],
    document: "Referral checklist",
    reference: "REF–2026–042",
    field: "Assigned team",
    value: "Patient services",
    stages: [
      "Receive the referral securely",
      "Check required administrative fields",
      "Flag missing information",
      "Route to the intake coordinator",
    ],
    outcome:
      "A referral queue with complete information, visible gaps, and a clear administrative owner.",
    approval:
      "Clinical triage and care decisions stay with qualified clinicians.",
  },
  {
    id: "intake-readiness",
    industry: "healthcare",
    title: "Get intake ready before the visit",
    shortDescription: "Surface missing forms before they slow the day.",
    icon: "document",
    trigger: "Ahead of a scheduled appointment",
    tools: ["Scheduling", "Patient portal", "Staff queue"],
    document: "Intake readiness list",
    reference: "INTAKE–2026–028",
    field: "Review area",
    value: "Administrative forms",
    stages: [
      "Check the upcoming visit list",
      "Review form completion status",
      "Prepare an approved reminder",
      "Flag unresolved items for staff",
    ],
    outcome:
      "A readiness list for the front desk, with missing forms and follow-up needs easy to find.",
    approval:
      "Use approved communication rules. Staff review exceptions; clinical records are not changed automatically.",
  },
  {
    id: "billing-follow-up",
    industry: "healthcare",
    title: "Organize billing follow-ups",
    shortDescription: "Give billing staff a focused queue to work from.",
    icon: "flow",
    trigger: "On your billing team's review schedule",
    tools: ["Billing system", "Work queue", "Team summary"],
    document: "Billing follow-up queue",
    reference: "QUEUE–2026–016",
    field: "Review area",
    value: "Unresolved items",
    stages: [
      "Collect permitted status updates",
      "Group items by next action",
      "Attach available source references",
      "Assign to a billing specialist",
    ],
    outcome:
      "An organized work queue with the context your billing team needs to investigate each item.",
    approval:
      "Billing specialists review coding, adjustments, submissions, and patient communications.",
  },
];
