/**
 * The homepage Services section: five offers read as one set. Workflows and
 * agents take the repetitive work, the CRM holds clients and the pipeline,
 * the ERP holds the rest of the operations, and custom software covers what
 * nothing off the shelf does. Copy stays in business terms: a test rejects
 * build-stack and technical names here.
 */
export const SERVICES = [
  {
    id: "services-workflows",
    name: "AI Workflow Automations",
    line: "Work that arrives the same way every time",
  },
  {
    id: "services-agents",
    name: "AI Agents",
    line: "Work that changes from day to day",
  },
  { id: "crm", name: "Custom CRM", line: "Clients, deals, and your pipeline" },
  {
    id: "erp",
    name: "Custom ERP",
    line: "Sales, stock, purchasing, and accounting",
  },
  {
    id: "software",
    name: "Custom Software",
    line: "When nothing off the shelf fits",
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
