/** Illustrative service scopes, not prebuilt integrations or client results. */
export type Industry = "finance" | "healthcare" | "operations" | "sales";
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
export type IndustryMeta = {
  label: string;
  icon: string;
  title: string;
  description: string;
  operationsLabel: string;
  defaultWorkflowId: string;
};

export const INDUSTRY_ORDER: Industry[] = [
  "finance",
  "healthcare",
  "operations",
  "sales",
];

export const INDUSTRIES: Record<Industry, IndustryMeta> = {
  finance: {
    label: "Finance",
    icon: "bank",
    title: "Give finance a cleaner\nstart to the day.",
    description:
      "Invoices, month-end, and missing files — gathered and checked so your team can decide, not hunt.",
    operationsLabel: "Finance operations",
    defaultWorkflowId: "invoice-approvals",
  },
  healthcare: {
    label: "Healthcare",
    icon: "heart",
    title: "Keep the admin moving.\nKeep care personal.",
    description:
      "Help the front desk and admin team keep up with paperwork, referrals, and follow-ups.",
    operationsLabel: "Healthcare operations",
    defaultWorkflowId: "referral-routing",
  },
  operations: {
    label: "Operations",
    icon: "briefcase",
    title: "Keep the office moving\nwithout the chase.",
    description:
      "Reports, vendor files, and quiet requests — gathered so your team isn’t hunting for updates.",
    operationsLabel: "Office operations",
    defaultWorkflowId: "weekly-status",
  },
  sales: {
    label: "Sales",
    icon: "chart",
    title: "Keep deals moving\nwithout extra hours.",
    description:
      "Follow-ups, missing details, and handoffs — prepared so your team can stay with the customer.",
    operationsLabel: "Sales operations",
    defaultWorkflowId: "quote-follow-up",
  },
};

export const WORKFLOWS: Workflow[] = [
  {
    id: "invoice-approvals",
    industry: "finance",
    title: "Get invoices ready to approve",
    shortDescription: "From a crowded inbox to an invoice ready for review.",
    icon: "document",
    trigger: "When a supplier invoice arrives",
    tools: ["Outlook", "QuickBooks", "Teams"],
    document: "Supplier invoice",
    reference: "INV–2026–084",
    field: "Purchase order",
    value: "PO–00482",
    stages: [
      "Collect the invoice",
      "Check the details against the purchase order",
      "Mark differences for your team",
      "Ask for approval before it is recorded",
    ],
    outcome:
      "A checked invoice, supporting documents, and any differences — together in one approval request.",
    approval:
      "Your finance team approves the accounting entry. Payment stays under your control.",
  },
  {
    id: "close-readiness",
    industry: "finance",
    title: "Get month-end ready on time",
    shortDescription: "Get the open items in one place before the deadline.",
    icon: "chart",
    trigger: "On your month-end schedule",
    tools: ["Accounting system", "Close checklist", "Teams"],
    document: "Month-end brief",
    reference: "PERIOD–2026–08",
    field: "Review area",
    value: "Open items",
    stages: [
      "Read the agreed close checklist",
      "Gather status and supporting files",
      "Draft a summary of what is still open",
      "Send the brief to the controller",
    ],
    outcome:
      "One list of outstanding items, owners, and source documents for your close meeting.",
    approval:
      "Your controller signs off on the reconciliations and decides when the period can close.",
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
    shortDescription: "Turn incoming referrals into clear next steps.",
    icon: "heart",
    trigger: "When a referral reaches your intake team",
    tools: ["Referral inbox", "Intake queue", "Scheduling"],
    document: "Referral checklist",
    reference: "REF–2026–042",
    field: "Assigned team",
    value: "Patient services",
    stages: [
      "Receive the referral securely",
      "Check the required administrative fields",
      "Flag missing information",
      "Send it to the intake coordinator",
    ],
    outcome:
      "A referral list with complete information, visible gaps, and a clear administrative owner.",
    approval:
      "Clinical triage and care decisions stay with qualified clinicians.",
  },
  {
    id: "intake-readiness",
    industry: "healthcare",
    title: "Get paperwork ready before the visit",
    shortDescription: "Spot missing forms before they slow the day.",
    icon: "document",
    trigger: "Ahead of a scheduled appointment",
    tools: ["Scheduling", "Patient portal", "Staff queue"],
    document: "Visit readiness list",
    reference: "INTAKE–2026–028",
    field: "Review area",
    value: "Administrative forms",
    stages: [
      "Check the upcoming visit list",
      "See which forms are still incomplete",
      "Prepare an approved reminder",
      "Flag unresolved items for staff",
    ],
    outcome:
      "A readiness list for the front desk, with missing forms and follow-up needs easy to find.",
    approval:
      "Approved communication rules are used. Staff review exceptions; clinical records are not changed automatically.",
  },
  {
    id: "billing-follow-up",
    industry: "healthcare",
    title: "Organize billing follow-ups",
    shortDescription: "Give billing staff a clear list of what to work next.",
    icon: "flow",
    trigger: "On your billing team's review schedule",
    tools: ["Billing system", "Work queue", "Team summary"],
    document: "Billing follow-up list",
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
      "An organized work list with the context your billing team needs to look into each item.",
    approval:
      "Billing specialists review coding, adjustments, submissions, and patient communications.",
  },
  {
    id: "weekly-status",
    industry: "operations",
    title: "Put the weekly update together",
    shortDescription: "From scattered notes to one page your team can send.",
    icon: "chart",
    trigger: "At the start of each week",
    tools: ["Spreadsheets", "Shared folder", "Email"],
    document: "Weekly status update",
    reference: "WEEK–2026–36",
    field: "Missing inputs",
    value: "3 teams pending",
    stages: [
      "Collect last week’s numbers",
      "Draft the update in your format",
      "Flag what is still missing",
      "Send it to the manager for review",
    ],
    outcome:
      "One page with the numbers, gaps, and owners — ready for your Monday meeting.",
    approval: "Your manager reviews the update and decides what gets shared.",
  },
  {
    id: "vendor-packet",
    industry: "operations",
    title: "Get a new vendor ready to work with",
    shortDescription: "Collect the packet so purchasing isn’t chasing forms.",
    icon: "document",
    trigger: "When a new vendor is approved",
    tools: ["Email", "Shared folder", "Purchasing"],
    document: "Vendor setup packet",
    reference: "VND–2026–117",
    field: "Packet status",
    value: "Waiting on tax documents",
    stages: [
      "Collect the required forms",
      "Check what is still missing",
      "Prepare the setup packet",
      "Send it to purchasing for sign-off",
    ],
    outcome:
      "A complete vendor packet, with gaps marked, ready for purchasing to approve.",
    approval:
      "Purchasing confirms the vendor and decides when they can be paid.",
  },
  {
    id: "status-follow-up",
    industry: "operations",
    title: "Follow up without the chase",
    shortDescription:
      "A polite reminder, ready to send, for work that went quiet.",
    icon: "clock",
    trigger: "When a request has gone quiet",
    tools: ["Email", "Task list", "Teams"],
    document: "Follow-up draft",
    reference: "REQ–2026–204",
    field: "Last update",
    value: "8 days ago",
    stages: [
      "Find requests with no recent update",
      "Check the last known status",
      "Draft a short follow-up",
      "Send it to the owner for review",
    ],
    outcome:
      "A short, specific follow-up your team can send — or skip — in one pass.",
    approval: "Your team decides who to remind and when to raise the issue.",
  },
  {
    id: "quote-follow-up",
    industry: "sales",
    title: "Follow up on open quotes",
    shortDescription:
      "A timely reminder for quotes that haven’t been answered.",
    icon: "mail",
    trigger: "When a quote has had no reply",
    tools: ["CRM", "Email", "Shared folder"],
    document: "Quote follow-up",
    reference: "QT–2026–088",
    field: "Quote age",
    value: "5 days waiting",
    stages: [
      "Find quotes still waiting on a reply",
      "Pull the quote and last conversation",
      "Draft a short follow-up",
      "Send it to the sales lead for review",
    ],
    outcome:
      "A specific follow-up, with the quote attached, ready for the salesperson to send.",
    approval:
      "Your sales team decides the message, the timing, and the next conversation.",
  },
  {
    id: "deal-handoff",
    industry: "sales",
    title: "Hand a closed deal to the next team",
    shortDescription:
      "From “we won it” to a clean packet the next team can start.",
    icon: "flow",
    trigger: "When a deal is marked as won",
    tools: ["CRM", "Email", "Shared folder"],
    document: "Kickoff packet",
    reference: "DEAL–2026–041",
    field: "Missing items",
    value: "Signed order, contacts",
    stages: [
      "Collect the won-deal details",
      "Check the kickoff checklist",
      "Flag anything still missing",
      "Send the packet to operations",
    ],
    outcome:
      "One kickoff packet with contacts, documents, and gaps — ready for the next team.",
    approval: "Sales confirms the packet before operations starts the work.",
  },
  {
    id: "pipeline-gaps",
    industry: "sales",
    title: "Keep the sales list complete",
    shortDescription: "Spot missing details before the forecast meeting.",
    icon: "search",
    trigger: "Ahead of your sales review",
    tools: ["CRM", "Spreadsheets", "Email"],
    document: "Missing-details list",
    reference: "PIPE–2026–12",
    field: "Incomplete records",
    value: "14 opportunities",
    stages: [
      "Read the current sales list",
      "Find records missing key details",
      "Draft a short request to the owner",
      "Send the list to the sales manager",
    ],
    outcome:
      "A list of incomplete records and a short ask for each owner, ready for the review meeting.",
    approval:
      "Your sales manager decides what to fix now and what can wait.",
  },
];
