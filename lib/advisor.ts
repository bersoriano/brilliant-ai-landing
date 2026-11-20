/**
 * The AI architecture advisor (homepage Exhibit 3, and inside the
 * add-ai-to-legacy-business-software post): four answers in, one starting
 * point out. The rules are deterministic and live in `recommend()`; every
 * visible string lives in the data below as an English source string that
 * the component passes through t() (each one has an entry in es-MX.json, and
 * a test checks it). To change the advice, edit the data; to change which
 * pattern wins, edit `recommend()` and the rule matrix in
 * tests/advisor.test.cjs.
 */

export type Landscape = "multi" | "single" | "modern";
export type Access = "interfaces" | "ui_only" | "unknown";
export type Goal = "answers" | "drafts" | "coordinate";
export type Risk = "low" | "high";
export type AdvisorAnswers = {
  landscape: Landscape;
  access: Access;
  goal: Goal;
  risk: Risk;
};
export type PatternId = "integration" | "sidecar" | "orchestration" | "rpa" | "rag";
export type SafeguardId = "controlled" | "baseline";

/** The post this advisor summarizes; the homepage links it. */
export const ADVISOR_POST_SLUG = "add-ai-to-legacy-business-software";

/**
 * Where the advisor starts: a common finance or healthcare setup (one main
 * ERP, access not known yet, preparing work, mistakes that cost money), so
 * the first result already shows discovery, the sidecar and the safeguard.
 */
export const DEFAULT_ANSWERS: AdvisorAnswers = {
  landscape: "single",
  access: "unknown",
  goal: "drafts",
  risk: "high",
};

type Question<K extends keyof AdvisorAnswers> = {
  id: K;
  prompt: string;
  options: { value: AdvisorAnswers[K]; label: string }[];
};

export const ADVISOR_QUESTIONS: [
  Question<"landscape">,
  Question<"access">,
  Question<"goal">,
  Question<"risk">,
] = [
  {
    id: "landscape",
    prompt: "What does your software look like today?",
    options: [
      { value: "multi", label: "Several older systems from different vendors" },
      { value: "single", label: "One main ERP or enterprise platform" },
      { value: "modern", label: "Modern, modular applications" },
    ],
  },
  {
    id: "access",
    prompt: "How can your systems be accessed?",
    options: [
      { value: "interfaces", label: "APIs, events, or approved data interfaces" },
      { value: "ui_only", label: "Mostly through their existing screens" },
      { value: "unknown", label: "Not sure" },
    ],
  },
  {
    id: "goal",
    prompt: "What should AI help with first?",
    options: [
      { value: "answers", label: "Finding information and answering questions" },
      { value: "drafts", label: "Preparing tasks and recommendations" },
      { value: "coordinate", label: "Coordinating steps across applications" },
    ],
  },
  {
    id: "risk",
    prompt: "How serious would a mistake be?",
    options: [
      { value: "low", label: "Usually easy to review or reverse" },
      {
        value: "high",
        label: "Could affect money, sensitive information, compliance, or critical operations",
      },
    ],
  },
];

type Pattern = {
  name: string;
  why: string;
  verify: string;
  stays: string;
  /** The diagram: what starts the work, what the AI does, which systems it touches. */
  flow: { start: string; ai: string; systems: string[] };
};

export const PATTERNS: Record<PatternId, Pattern> = {
  integration: {
    name: "AI integration layer",
    why: "Your data lives in several systems that don’t talk to each other easily. A layer above them gathers what each one knows and coordinates selected tasks, so you don’t rebuild what already works.",
    verify: "Which systems have supported connections, and which records conflict between them.",
    stays: "Each system keeps its own records and transactions. Your team decides what the layer is allowed to do.",
    flow: { start: "Your team asks", ai: "AI integration layer", systems: ["ERP", "CRM", "Warehouse", "Billing"] },
  },
  sidecar: {
    name: "AI sidecar",
    why: "One platform runs most of the business, and changing it is slow and expensive. A separate service next to it reads approved data, explains it and prepares recommendations, without touching the core.",
    verify: "What your ERP vendor allows: supported APIs, licensing for outside access, and a read-only account to start.",
    stays: "The ERP keeps the business rules and executes approved transactions. Your team approves what the sidecar proposes.",
    flow: { start: "Your team asks", ai: "AI sidecar", systems: ["Your ERP"] },
  },
  orchestration: {
    name: "Agent-driven orchestration",
    why: "Your applications already have reliable interfaces. An agent can plan the steps and call approved tools across them, while each service keeps enforcing its own rules.",
    verify: "That each interface returns reliable data, and that every write action can be limited and logged.",
    stays: "Your services keep enforcing the rules, and approvals stay with the people who own them.",
    flow: { start: "A business goal", ai: "AI agent", systems: ["CRM API", "Scheduling API", "Billing API"] },
  },
  rpa: {
    name: "RPA + computer-use AI",
    why: "Without a usable interface, the screens are the only way in. Automation repeats the stable steps, and AI reads the documents and emails that vary. It works, but it breaks more easily than a supported connection.",
    verify: "How stable the screens are, and what the automation does when a pop-up or an expired session gets in the way.",
    stays: "The application stays the system of record. A person reviews anything the automation flags.",
    flow: { start: "A document or email", ai: "AI reads it, RPA enters it", systems: ["Your older application"] },
  },
  rag: {
    name: "AI search (RAG) with trusted data",
    why: "The problem is finding answers, not moving work. An assistant connected to approved documents finds the right material before it answers and links its sources. Exact, live figures still come from the system that owns them.",
    verify: "Which documents are current and approved, and which figures must come live from the system that owns them.",
    stays: "Your systems keep the official figures. Your team decides what to do with each answer.",
    flow: { start: "A question", ai: "AI search", systems: ["Approved documents", "Live figures"] },
  },
};

/** "What AI could do", matched to the answers: by goal, or by landscape for search. */
const EXAMPLES: Record<string, string> = {
  "integration:drafts":
    "Match each supplier invoice to its purchase order in the ERP and its receipt in the warehouse system, then queue the mismatches for accounts payable.",
  "integration:coordinate":
    "When a claim comes back denied, pull the patient’s record, the insurer’s note and the billing history from three systems, and open a follow-up for the right person.",
  "sidecar:drafts":
    "Draft the month-end accrual list from open purchase orders in the ERP, each line linked to its source, for the controller to review.",
  "sidecar:coordinate":
    "Collect what’s missing from an open purchase request, remind the approver, and prepare the purchase order in the ERP for a person to release.",
  "orchestration:drafts":
    "Read an incoming referral, check coverage and open slots through your systems’ APIs, and draft the intake for the front desk to confirm.",
  "orchestration:coordinate":
    "Review this week’s overdue invoices, check each customer’s history, and prepare reminders and payment plans, routed for approval.",
  "rpa:drafts":
    "Read a PDF invoice, extract the supplier, totals and purchase-order number, enter a draft in the desktop accounting app, and flag anything that doesn’t match.",
  "rpa:coordinate":
    "Copy a new patient’s details from the intake form into the old practice system, screen by screen, and stop for a person when a field doesn’t fit.",
  "rag:multi":
    "Answer “Which referrals are still missing documents?” from the files in each system, with a link to every source.",
  "rag:single":
    "Answer “Where is the current invoice-approval policy?” and pull the live balance from the ERP instead of an old report.",
  "rag:modern":
    "Answer a question about a contract or policy with links to the exact clauses, and fetch live figures through your systems’ APIs.",
};

/** Search answers questions; live figures still need a way in, by landscape. */
const LIVE_FIGURES: Record<Landscape, string> = {
  multi: "For live figures, pair it with an AI integration layer across your systems.",
  single: "For live figures, pair it with an AI sidecar that reads the ERP.",
  modern: "Live figures can come straight through your systems’ APIs.",
};

export const DISCOVERY_FIRST =
  "How each system can be reached: APIs, exports, or only its screens. Finding that out is the first step.";
export const COORDINATE_LATER =
  "Coordinating steps across applications can come later, once reliable connections are proven.";
export const HIGH_RISK_STAYS =
  "Posting, payments and clinical decisions stay with authorized people. A named person approves anything consequential.";

export const SAFEGUARDS: Record<SafeguardId, { name: string; title: string; items: string[] }> = {
  controlled: {
    name: "Controlled AI workflow",
    title: "Required for high-stakes work",
    items: [
      "Fixed rules check every result before it moves",
      "Only the permissions the job needs",
      "An audit log of every step",
      "A named person approves consequential actions",
    ],
  },
  baseline: {
    name: "Basic safeguards",
    title: "Even when mistakes are easy to undo",
    items: [
      "Validate what AI produces",
      "Log what it did",
      "Keep permissions narrow",
      "Send anything unclear to a person",
    ],
  },
};

export const PERSON_STEP: Record<Risk, string> = {
  high: "A named person approves",
  low: "A person handles anything unclear",
};

/** Fixed copy around the result, also translated through t(). */
export const ADVISOR_COPY = {
  title: "How to choose the right {accent}",
  accent: "AI architecture",
  lead: "Your software already runs your business. Where should AI fit? Answer four quick questions to explore a sensible starting point, without replacing the tools that work.",
  status: "Updates as you answer",
  questionsLabel: "Your answers",
  startingPoint: "Your likely starting point",
  plus: "Plus",
  why: "Why this fits",
  could: "What AI could do",
  verify: "What to verify first",
  safeguards: "Safeguards",
  flowLabel: "How the pieces connect",
  flowStart: "Starts with",
  flowAi: "AI",
  flowSystems: "Your systems",
  flowPerson: "A person",
  note: "An initial recommendation from four answers, not a technical assessment. These approaches can be combined.",
  announce: "Your likely starting point: {name}.",
  reset: "Start over",
  resetDone: "Answers reset.",
  guide: "Read the six patterns in detail",
  ctaTitle: "Want to know what would actually work in your business?",
  ctaBody: "Bring us one workflow. We’ll help identify the simplest reliable way to improve it.",
  ctaFree: "Free. 20 minutes.",
} as const;

export type Recommendation = {
  primary: PatternId;
  safeguard: SafeguardId;
  /** Access is unknown: finding out how to reach the systems comes first. */
  discoveryFirst: boolean;
  /** Coordination was asked for, but the connections aren't proven yet. */
  coordinateLater: boolean;
};

/**
 * The rules, in order: questions → search; screen-only access → RPA; one ERP
 * → sidecar; several vendors → integration layer; otherwise orchestration.
 * High risk never changes the pattern: it makes the controlled workflow a
 * requirement on top of it.
 */
export function recommend(answers: AdvisorAnswers): Recommendation {
  const { landscape, access, goal, risk } = answers;
  const primary: PatternId =
    goal === "answers"
      ? "rag"
      : access === "ui_only"
        ? "rpa"
        : landscape === "single"
          ? "sidecar"
          : landscape === "multi"
            ? "integration"
            : "orchestration";
  return {
    primary,
    safeguard: risk === "high" ? "controlled" : "baseline",
    discoveryFirst: access === "unknown",
    coordinateLater: goal === "coordinate" && access !== "interfaces",
  };
}

/** Everything the result panel shows, as English source strings for t(). */
export type Advice = Recommendation & {
  name: string;
  why: string;
  example: string;
  verify: string;
  stays: string[];
  notes: string[];
  flow: Pattern["flow"] & { person: string };
  safeguardCopy: (typeof SAFEGUARDS)[SafeguardId];
};

export function advise(answers: AdvisorAnswers): Advice {
  const result = recommend(answers);
  const pattern = PATTERNS[result.primary];
  const example =
    result.primary === "rag"
      ? EXAMPLES[`rag:${answers.landscape}`]
      : // Search is the only pattern for "answers", so the others see drafts or coordinate.
        EXAMPLES[`${result.primary}:${answers.goal}`];
  const notes: string[] = [];
  if (result.primary === "rag") notes.push(LIVE_FIGURES[answers.landscape]);
  if (result.coordinateLater) notes.push(COORDINATE_LATER);
  return {
    ...result,
    name: pattern.name,
    why: pattern.why,
    example,
    verify: result.discoveryFirst ? DISCOVERY_FIRST : pattern.verify,
    stays: answers.risk === "high" ? [pattern.stays, HIGH_RISK_STAYS] : [pattern.stays],
    notes,
    flow: { ...pattern.flow, person: PERSON_STEP[answers.risk] },
    safeguardCopy: SAFEGUARDS[result.safeguard],
  };
}

/** Every answer combination, for tests and for checking copy coverage. */
export function allAnswerCombinations(): AdvisorAnswers[] {
  const [landscape, access, goal, risk] = ADVISOR_QUESTIONS.map((q) => q.options.map((o) => o.value));
  const combos: AdvisorAnswers[] = [];
  for (const l of landscape)
    for (const a of access)
      for (const g of goal)
        for (const r of risk)
          combos.push({ landscape: l, access: a, goal: g, risk: r } as AdvisorAnswers);
  return combos;
}

/** Every string the advisor can show, for the translation test. */
export function advisorStrings(): string[] {
  return [
    ...Object.values(ADVISOR_COPY),
    ...ADVISOR_QUESTIONS.flatMap((q) => [q.prompt, ...q.options.map((o) => o.label)]),
    ...Object.values(PATTERNS).flatMap((p) => [p.name, p.why, p.verify, p.stays, p.flow.start, p.flow.ai, ...p.flow.systems]),
    ...Object.values(EXAMPLES),
    ...Object.values(LIVE_FIGURES),
    DISCOVERY_FIRST,
    COORDINATE_LATER,
    HIGH_RISK_STAYS,
    ...Object.values(SAFEGUARDS).flatMap((s) => [s.name, s.title, ...s.items]),
    ...Object.values(PERSON_STEP),
  ];
}
