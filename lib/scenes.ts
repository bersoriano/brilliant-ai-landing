/**
 * Document scenes for the workflow exhibits: what actually arrives (left) and
 * what the team receives once the workflow has done its part (right).
 *
 * Every value is illustrative. Names, numbers and people are invented and
 * labelled as such on the page. Strings are English source keys; Spanish
 * (with Mexican nouns: CFDI, OC, RFC, preautorización) lives in es-MX.json.
 */

export type CheckState = "ok" | "flag" | "owner" | "hold";

export type Scene = {
  inbound: {
    channel: string;
    from: string;
    subject: string;
    attachment: string;
    title: string;
    lines: [label: string, value: string, flagged?: boolean][];
    flag: string;
  };
  card: {
    channel: string;
    title: string;
    checks: { label: string; state: CheckState }[];
    attachments: string;
    status: string;
    statusTone: "review" | "ready";
    action: string;
  };
};

export const SCENES: Record<string, Scene> = {
  "invoice-approvals": {
    inbound: {
      channel: "Outlook · AP inbox",
      from: "billing@ridgeline-supply.com",
      subject: "Invoice 4471 — PO 1842",
      attachment: "INV-4471.pdf",
      title: "Invoice 4471",
      lines: [
        ["Purchase order", "PO 1842"],
        ["PO total", "$4,180.00"],
        ["Invoice total", "$4,380.00", true],
      ],
      flag: "Amount ≠ PO 1842",
    },
    card: {
      channel: "Teams · Approvals",
      title: "Invoice 4471 · Ridgeline Supply",
      checks: [
        { label: "Vendor matches the vendor master", state: "ok" },
        { label: "PO 1842 found and open", state: "ok" },
        { label: "Goods receipt attached", state: "ok" },
        { label: "Total is $200.00 over the PO", state: "flag" },
      ],
      attachments: "3 supporting documents attached",
      status: "Needs review",
      statusTone: "review",
      action: "Approve to record",
    },
  },
  "close-readiness": {
    inbound: {
      channel: "Shared drive · Close folder",
      from: "ERP, bank, and payroll exports",
      subject: "Five exports for the August close",
      attachment: "GL.xlsx · bank.csv · AP-aging.xlsx +2",
      title: "Close checklist — August",
      lines: [
        ["Bank reconciliation", "Drafted"],
        ["Intercompany", "Tied out"],
        ["Accruals", "No support", true],
      ],
      flag: "Accruals missing support",
    },
    card: {
      channel: "Outlook · Controller",
      title: "Month-end brief — August",
      checks: [
        { label: "11 of 14 items closed", state: "ok" },
        { label: "Source files linked to each item", state: "ok" },
        { label: "Owners named for 3 open items", state: "owner" },
        { label: "Accruals: support missing", state: "flag" },
      ],
      attachments: "14 source files linked",
      status: "Needs review",
      statusTone: "review",
      action: "Sign off the period",
    },
  },
  "client-documents": {
    inbound: {
      channel: "Document portal",
      from: "Client onboarding file",
      subject: "File 019 — 2 of 5 documents received",
      attachment: "ID.pdf · proof-of-address.pdf",
      title: "Onboarding file 019",
      lines: [
        ["Signed engagement letter", "Received"],
        ["Tax ID", "Missing", true],
        ["Bank statement", "Missing", true],
      ],
      flag: "3 documents outstanding",
    },
    card: {
      channel: "Outlook · Relationship manager",
      title: "Follow-up draft · File 019",
      checks: [
        { label: "Missing items listed by name", state: "ok" },
        { label: "Deadline taken from the engagement letter", state: "ok" },
        { label: "Wording follows your template", state: "ok" },
        { label: "Not sent until you review it", state: "hold" },
      ],
      attachments: "Checklist attached",
      status: "Ready for review",
      statusTone: "ready",
      action: "Send follow-up",
    },
  },
  "referral-routing": {
    inbound: {
      channel: "Referral inbox · e-fax",
      from: "Lakeside Family Practice",
      subject: "Referral — orthopedic consult",
      attachment: "referral-0913.pdf",
      title: "Referral 0913",
      lines: [
        ["Reason", "Knee pain, consult"],
        ["Insurance", "Missing", true],
        ["Referring physician", "Missing", true],
      ],
      flag: "2 required fields missing",
    },
    card: {
      channel: "Intake queue",
      title: "Referral 0913 · Orthopedics",
      checks: [
        { label: "Patient details complete", state: "ok" },
        { label: "Insurance and prior authorization", state: "flag" },
        { label: "Referring physician", state: "flag" },
        { label: "Owner: intake coordinator", state: "owner" },
      ],
      attachments: "Follow-up to the practice drafted",
      status: "Gap — needs follow-up",
      statusTone: "review",
      action: "Mark ready to schedule",
    },
  },
  "intake-readiness": {
    inbound: {
      channel: "Scheduling · Tomorrow",
      from: "18 visits scheduled",
      subject: "Pre-visit forms status",
      attachment: "visit-list-0914.csv",
      title: "Visit list — Sept 14",
      lines: [
        ["Intake questionnaire", "Complete"],
        ["Consent form", "4 missing", true],
        ["Insurance card", "2 missing", true],
      ],
      flag: "6 visits not ready",
    },
    card: {
      channel: "Front-desk queue",
      title: "Tomorrow’s readiness list",
      checks: [
        { label: "12 visits ready", state: "ok" },
        { label: "Reminders use your approved wording", state: "ok" },
        { label: "6 visits need a call", state: "flag" },
        { label: "Owner: front desk", state: "owner" },
      ],
      attachments: "Reminder drafts attached",
      status: "Needs review",
      statusTone: "review",
      action: "Send reminders",
    },
  },
  "billing-follow-up": {
    inbound: {
      channel: "Billing system · Payer updates",
      from: "Payer status exports",
      subject: "37 claims without a next step",
      attachment: "status-export-0914.csv",
      title: "Open claims",
      lines: [
        ["Missing documentation", "14"],
        ["Awaiting payer response", "15"],
        ["Needs coding review", "8", true],
      ],
      flag: "8 need a coder",
    },
    card: {
      channel: "Work queue · Billing",
      title: "Today’s billing work list",
      checks: [
        { label: "Grouped by next action", state: "ok" },
        { label: "Source references attached", state: "ok" },
        { label: "Assigned to 3 specialists", state: "owner" },
        { label: "Coding changes stay with your team", state: "hold" },
      ],
      attachments: "37 items, each with its source",
      status: "Ready for review",
      statusTone: "ready",
      action: "Start the work list",
    },
  },
};

/** The hero exhibit animates these steps over the invoice scene. */
export const HERO_STEPS = ["Collect", "Match", "Flag", "Your approval"];
