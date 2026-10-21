/**
 * The five offers, read as one set. Workflows and agents take the repetitive
 * work, the CRM holds clients and the pipeline, the ERP holds the rest of the
 * operations, and custom software covers what nothing off the shelf does.
 * The homepage shows each as a card (the `id` stays its anchor there) and
 * links its own page, where the full offer lives. Copy stays in business
 * terms: a test rejects build-stack and technical names here.
 */
export const SERVICES = [
  {
    id: "services-workflows",
    path: "/workflows",
    name: "AI Workflow Automations",
    line: "Work that arrives the same way every time",
    summary:
      "We build one reliable process around a task your team repeats, so the right information reaches the right person, ready for their approval.",
    example:
      "You approve the exceptions. Nothing posts, pays, or files until a person you name says so.",
  },
  {
    id: "services-agents",
    path: "/agents",
    name: "AI Agents",
    line: "Work that changes from day to day",
    summary:
      "Each person on your team gets agents that find, draft, and follow up inside the tools you already use.",
    example: "“Chase the three clients still missing documents”",
  },
  {
    id: "crm",
    path: "/custom-crm",
    name: "Custom CRM",
    line: "Clients, deals, and your pipeline",
    summary:
      "We set up a CRM and shape it to your pipeline, your team, and the way you already work.",
    example: "Unlimited users, from {price} a month.",
  },
  {
    id: "erp",
    path: "/custom-erp",
    name: "Custom ERP",
    line: "Sales, stock, purchasing, and accounting",
    summary:
      "We set up a full business system that brings your sales, inventory, purchasing, invoicing, and accounting together.",
    example: "Unlimited users, from {price} a month.",
  },
  {
    id: "software",
    path: "/custom-software",
    name: "Custom Software",
    line: "When nothing off the shelf fits",
    summary:
      "When the tool your business needs doesn’t exist, we build it and keep it running.",
    example:
      "Haab Calendar is our own: a booking app for clinics, studios, venues, and events, in English and Spanish.",
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

export function service(id: ServiceId) {
  return SERVICES.find((item) => item.id === id)!;
}

/**
 * Workflow examples, drawn as pipelines: the string is split on " → " after
 * translation, and the last step is the person who decides. Illustrative.
 */
export const WORKFLOW_EXAMPLES: { label: string; steps: string }[] = [
  {
    label: "Invoices",
    steps:
      "Supplier invoice arrives → checked against the purchase order → differences flagged → one approval request sent to your team",
  },
  {
    label: "Referrals",
    steps:
      "Referral or client document arrives incomplete → missing pieces listed → follow-up prepared → your team reviews before anything moves forward",
  },
  {
    label: "Month-end",
    steps:
      "Checklist items collected from different places → gathered into one pack → ready for your team to review and approve",
  },
];

/** Agent examples: a request in plain language, what the agent does, your call. */
export const AGENT_EXAMPLES: { request: string; agent: string; you: string }[] = [
  {
    request: "“Chase the three clients still missing documents”",
    agent: "The agent drafts the follow-ups and creates tasks.",
    you: "You approve before anything is sent.",
  },
  {
    request: "“Which proposals haven’t moved in two weeks?”",
    agent: "The agent summarizes the stalled deals and suggests next steps.",
    you: "You decide what happens next.",
  },
  {
    request: "“Summarize everything we know about this account”",
    agent: "The agent gathers notes, emails, and open items into one view.",
    you: "You use it to prepare for the call.",
  },
];

/** /agents: what keeps every approval with a person. */
export const AGENT_CONTROLS: [title: string, body: string][] = [
  [
    "The same permissions as the person asking.",
    "An agent sees only what the person who asks can see, and acts with their access.",
  ],
  [
    "Access is scoped, logged, and revocable.",
    "We ask for access one workflow at a time. You can see it, and you can revoke it.",
  ],
  [
    "Nothing posts, pays, or files on its own.",
    "Nothing is recorded, paid, or submitted until a person you name approves it.",
  ],
];
