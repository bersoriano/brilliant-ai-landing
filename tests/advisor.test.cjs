const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");
// Load the project's pure TypeScript helpers without adding a test dependency.
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText,
    filename,
  );
const {
  ADVISOR_POST_SLUG,
  ADVISOR_QUESTIONS,
  DEFAULT_ANSWERS,
  DISCOVERY_FIRST,
  COORDINATE_LATER,
  HIGH_RISK_STAYS,
  advise,
  advisorStrings,
  allAnswerCombinations,
  recommend,
} = require("../lib/advisor.ts");
const { translate } = require("../lib/i18n.ts");
const dictionary = require("../lib/es-MX.json");

/** The rules from the brief, written independently of recommend(). */
function expectedPrimary({ landscape, access, goal }) {
  if (goal === "answers") return "rag";
  if (access === "ui_only") return "rpa";
  if (landscape === "single") return "sidecar";
  if (landscape === "multi") return "integration";
  return "orchestration";
}

test("Advisor covers every answer combination with the documented rules", () => {
  const combos = allAnswerCombinations();
  assert.equal(combos.length, 3 * 3 * 3 * 2);
  for (const answers of combos) {
    const label = JSON.stringify(answers);
    const result = recommend(answers);
    assert.equal(result.primary, expectedPrimary(answers), label);
    // High risk is a requirement on top of any pattern, never a pattern of its own.
    assert.equal(result.safeguard, answers.risk === "high" ? "controlled" : "baseline", label);
    assert.equal(result.discoveryFirst, answers.access === "unknown", label);
    assert.equal(result.coordinateLater, answers.goal === "coordinate" && answers.access !== "interfaces", label);
  }
});

test("Advisor spot checks match the brief", () => {
  const base = { landscape: "multi", access: "interfaces", goal: "drafts", risk: "low" };
  assert.equal(recommend(base).primary, "integration");
  assert.equal(recommend({ ...base, landscape: "single" }).primary, "sidecar");
  assert.equal(recommend({ ...base, landscape: "modern" }).primary, "orchestration");
  // Screen-only access wins over the landscape, questions win over everything.
  assert.equal(recommend({ ...base, landscape: "modern", access: "ui_only" }).primary, "rpa");
  assert.equal(recommend({ ...base, access: "ui_only", goal: "answers" }).primary, "rag");
  // The default answers show discovery, the sidecar and the controlled workflow.
  const start = advise(DEFAULT_ANSWERS);
  assert.equal(start.primary, "sidecar");
  assert.equal(start.verify, DISCOVERY_FIRST);
  assert.equal(start.safeguard, "controlled");
});

test("Every advice is complete: a reason, an example, a check, a person, and safeguards", () => {
  for (const answers of allAnswerCombinations()) {
    const label = JSON.stringify(answers);
    const advice = advise(answers);
    for (const key of ["name", "why", "example", "verify"])
      assert.ok(typeof advice[key] === "string" && advice[key].length > 0, `${label}: ${key}`);
    // "Why this fits" stays two or three sentences.
    const sentences = advice.why.split(/(?<=[.?!])\s+/).length;
    assert.ok(sentences >= 2 && sentences <= 3, `${label}: why has ${sentences} sentences`);
    assert.ok(advice.stays.length >= 1, `${label}: stays`);
    assert.equal(advice.stays.includes(HIGH_RISK_STAYS), answers.risk === "high", `${label}: high-risk control`);
    assert.equal(advice.notes.includes(COORDINATE_LATER), advice.coordinateLater, `${label}: coordinate note`);
    assert.ok(advice.flow.systems.length >= 1 && advice.flow.person, `${label}: diagram`);
    assert.equal(advice.safeguardCopy.items.length, 4, `${label}: safeguards`);
    // Search answers questions; exact live figures come from the system that owns them.
    if (advice.primary === "rag") assert.match(advice.why + advice.verify, /live figures|figures must come live/i, label);
  }
});

test("Advisor copy is translated, uses tú, and keeps acronyms as they are", () => {
  const strings = advisorStrings();
  assert.ok(strings.length > 60);
  for (const s of strings) {
    // ERP and CRM read the same in Spanish.
    if (/^[A-Z]{2,4}$/.test(s)) continue;
    assert.ok(dictionary[s], `missing Spanish: ${s}`);
    assert.notEqual(translate(s, "es"), s, `untranslated: ${s}`);
  }
  // Every question keeps its options in a stable order of values.
  assert.deepEqual(
    ADVISOR_QUESTIONS.map((q) => [q.id, q.options.map((o) => o.value)]),
    [
      ["landscape", ["multi", "single", "modern"]],
      ["access", ["interfaces", "ui_only", "unknown"]],
      ["goal", ["answers", "drafts", "coordinate"]],
      ["risk", ["low", "high"]],
    ],
  );
});

test("The advisor sits after Services on the homepage, closes on the review, and links its post", () => {
  const { INSIGHTS } = require("../lib/insights.ts");
  const page = fs.readFileSync("views/page.tsx", "utf8");
  assert.ok(page.indexOf("<Services />") < page.indexOf("<AiArchitecture />"), "after Services");
  assert.ok(page.indexOf("<AiArchitecture />") < page.indexOf("<HowItWorks />"), "before How it works");
  // The homepage links the note that explains the patterns (registered, so a test keeps it published).
  assert.equal(INSIGHTS.architecture, ADVISOR_POST_SLUG);
  const advisor = fs.readFileSync("components/ui/ArchitectureAdvisor.tsx", "utf8");
  // The booking button keeps the shared label and address; no ad-hoc CTA text.
  assert.match(advisor, /t\(PRIMARY_CTA\)/);
  assert.match(advisor, /href=\{DISCOVERY_CALL_HREF\}/);
  assert.doesNotMatch(advisor, /haabcalendar|Book a free/);
  assert.match(advisor, /INSIGHTS\.architecture/);
  // Results are announced politely, and the exhibit ends on what stays with a person.
  assert.match(advisor, /role="status"/);
  assert.match(advisor, /className="control"/);
  // The post embeds the advisor without a second booking button.
  assert.match(fs.readFileSync("views/blog/mdx.tsx", "utf8"), /ArchitectureAdvisor: \(\) => <ArchitectureAdvisor [^>]*cta=\{false\}/);
  for (const locale of ["en", "es"]) {
    const body = fs.readFileSync(`content/posts/${ADVISOR_POST_SLUG}/${locale}.mdx`, "utf8");
    assert.equal((body.match(/<ArchitectureAdvisor \/>/g) || []).length, 1, `${locale}: one advisor`);
  }
});
