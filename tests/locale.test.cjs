const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");
// Load the project's pure TypeScript helpers without adding a test dependency.
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const {
  resolveLocale,
  SPANISH_DEFAULT_COUNTRIES,
  isSpanishPath,
  localePath,
  localeFromPathname,
  stripLocalePrefix,
  languageAlternatePaths,
  isSearchBot,
} = require("../lib/locale.ts");
const { pageTitle, pageDescription, translate } = require("../lib/i18n.ts");
const { FAQS } = require("../lib/faq.ts");
const { WORKFLOWS } = require("../lib/workflows.ts");
const { buildInquiryHref } = require("../lib/inquiry.ts");
const { buildBreakdown, computeRoi, DEFAULT_INPUTS } = require("../lib/roi.ts");
const { PRIMARY_CTA, ONSITE_CTA } = require("../lib/site.ts");
const {
  CASE_STUDY,
  caseStudyCopy,
  shouldRenderCaseStudy,
} = require("../lib/caseStudy.ts");
const dictionary = require("../lib/es-MX.json");

test("English fallback; Spanish browser preference with quality handling", () => {
  for (const options of [
    {},
    { country: "US" },
    { country: "DE" },
    { acceptLanguage: "fr-FR" },
    { acceptLanguage: "es;q=0,en;q=1" },
    { acceptLanguage: "es;q=bogus,en" },
    { acceptLanguage: "en-US,es;q=0.8" },
  ])
    assert.equal(resolveLocale(options), "en");
  for (const acceptLanguage of [
    "es-MX,es;q=0.9,en;q=0.8",
    "en;q=0.5,es;q=1",
    "fr-FR,es;q=0.8",
    "ES-mx",
  ])
    assert.equal(resolveLocale({ acceptLanguage }), "es");
});
test("Spanish geo default is Mexico and Spanish-speaking Latin America, not Canada, Brazil, or the US", () => {
  assert(SPANISH_DEFAULT_COUNTRIES.has("MX"));
  assert(!SPANISH_DEFAULT_COUNTRIES.has("US"));
  assert(!SPANISH_DEFAULT_COUNTRIES.has("CA"));
  assert(!SPANISH_DEFAULT_COUNTRIES.has("BR"));
  for (const country of SPANISH_DEFAULT_COUNTRIES)
    assert.equal(
      resolveLocale({ country, acceptLanguage: "en-US" }),
      "es",
      country,
    );
  for (const country of ["US", "CA", "BR", "DE"])
    assert.equal(
      resolveLocale({ country, acceptLanguage: "en-US" }),
      "en",
      country,
    );
  assert.equal(resolveLocale({ country: " mx " }), "es");
});
test("Manual choice wins over browser and country; invalid cookie ignored", () => {
  assert.equal(
    resolveLocale({ saved: "en", country: "MX", acceptLanguage: "es-MX" }),
    "en",
  );
  assert.equal(
    resolveLocale({ saved: "es", country: "US", acceptLanguage: "en-US" }),
    "es",
  );
  assert.equal(resolveLocale({ saved: "invalid", country: "CA" }), "en");
});
test("Locale prefixes map English and Mexican Spanish onto stable URLs", () => {
  assert.equal(localeFromPathname("/"), "en");
  assert.equal(localeFromPathname("/privacy"), "en");
  assert.equal(localeFromPathname("/es"), "es");
  assert.equal(localeFromPathname("/es/privacy"), "es");
  assert.equal(isSpanishPath("/es/privacy"), true);
  assert.equal(stripLocalePrefix("/es/privacy"), "/privacy");
  assert.equal(localePath("es", "/"), "/es");
  assert.equal(localePath("es", "/privacy#main"), "/es/privacy#main");
  assert.equal(localePath("en", "/es/privacy"), "/privacy");
  const home = languageAlternatePaths("/");
  assert.equal(home["en-US"], "/");
  assert.equal(home["en-CA"], "/");
  assert.equal(home["es-MX"], "/es");
  assert.equal(home["x-default"], "/");
});
test("Home metadata names the US, Canada, and Mexico; FAQ copy is translated", () => {
  assert.match(pageTitle("en"), /Finance & Healthcare/);
  assert.match(pageTitle("es"), /finanzas y salud/);
  assert.match(pageDescription("en"), /United States, Canada, and Mexico/);
  assert.match(pageDescription("es"), /México, Estados Unidos y Canadá/);
  const [question, answer] = FAQS[0];
  assert.match(question, /United States, Canada, and Mexico/);
  assert.notEqual(translate(question, "es"), question);
  assert.notEqual(translate(answer, "es"), answer);
});
test("Search-engine user agents are detected so language URLs stay stable for crawlers", () => {
  assert.equal(isSearchBot("Mozilla/5.0 (compatible; Googlebot/2.1)"), true);
  assert.equal(isSearchBot("Mozilla/5.0 (Macintosh) Chrome/120.0.0.0"), false);
});
test("All workflow prose has Spanish translations, while product names and IDs stay stable", () => {
  for (const workflow of WORKFLOWS) {
    for (const field of [
      "title",
      "shortDescription",
      "trigger",
      "document",
      "field",
      "outcome",
      "approval",
    ])
      assert.notEqual(
        translate(workflow[field], "es"),
        workflow[field],
        `${workflow.id}.${field}`,
      );
    for (const tool of workflow.tools) {
      if (!["Outlook", "QuickBooks", "Teams", "CRM"].includes(tool))
        assert.notEqual(translate(tool, "es"), tool);
    }
    for (const stage of workflow.stages)
      assert.notEqual(translate(stage, "es"), stage);
  }
  assert.equal(translate("QuickBooks", "es"), "QuickBooks");
  assert.equal(translate("Bank of America", "es"), "Bank of America");
  assert.equal(
    translate("Give finance a cleaner\nstart to the day.", "es"),
    "Un mejor inicio de día\npara finanzas.",
  );
});
test("Spanish draft translates labels and selected workflow while preserving user input", () => {
  const url = new URL(
    buildInquiryHref(
      "hello@example.com",
      {
        name: "Ana Pérez",
        email: "ana@example.com",
        industry: "finance",
        message: "Mi proceso & <dato>",
        workflowTitle: WORKFLOWS[0].title,
      },
      "es",
    ),
  );
  assert.match(
    url.searchParams.get("subject"),
    /Revisión de procesos — Finanzas/,
  );
  const body = url.searchParams.get("body");
  assert.match(body, /Soy Ana Pérez/);
  assert.match(body, /Punto de partida: Prepara facturas para aprobación/);
  assert.match(body, /Mi proceso & <dato>/);
  assert.doesNotMatch(body, /Starting point|Workflow review|Work email/);
});
test("Spanish breakdown translates every label without converting USD values", () => {
  const result = computeRoi(DEFAULT_INPUTS);
  const en = buildBreakdown(DEFAULT_INPUTS, result, "en");
  const es = buildBreakdown(DEFAULT_INPUTS, result, "es");
  for (let i = 0; i < en.lines.length; i++)
    assert.notEqual(en.lines[i].label, es.lines[i].label);
  for (let i = 0; i < en.assumptions.length; i++)
    assert.notEqual(en.assumptions[i].label, es.assumptions[i].label);
  assert.equal(result.valueRedeployed, 117300);
  assert.match(
    es.lines.find((l) => l.label.startsWith("Valor de la capacidad")).value,
    /117,300/,
  );
});
test("SEO copy and FAQs have Spanish dictionary entries", () => {
  const { HOME_DESCRIPTION, PRIVACY_DESCRIPTION } = require("../lib/i18n.ts");
  for (const key of [HOME_DESCRIPTION, PRIVACY_DESCRIPTION, ...FAQS.flat()]) {
    const normalized = key.replace(/\s+/g, " ").trim();
    assert.ok(dictionary[normalized], normalized);
  }
});
test("Every literal translation call in active UI has a Spanish dictionary entry", () => {
  const files = fs
    .readdirSync("components/sections")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => `components/sections/${f}`)
    .concat([
      "components/ui/Icon.tsx",
      "app/privacy/PrivacyContent.tsx",
      "components/i18n/LanguageProvider.tsx",
    ]);
  for (const file of files) {
    const ast = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    function visit(node) {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(ast) === "t" &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      )
        assert.ok(
          dictionary[node.arguments[0].text.replace(/\s+/g, " ").trim()],
          `${file}: ${node.arguments[0].text}`,
        );
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
});

test("Unapproved case study figures never render in a production build", () => {
  if (!CASE_STUDY.approved) {
    assert.equal(shouldRenderCaseStudy(true), false);
    assert.equal(shouldRenderCaseStudy(false), true);
  } else {
    assert.equal(shouldRenderCaseStudy(true), true);
  }
});
test("Case study ships its own Spanish copy rather than relying on the dictionary", () => {
  const en = caseStudyCopy("en");
  const es = caseStudyCopy("es");
  for (const field of ["sector", "client", "workflow", "before", "after"])
    assert.notEqual(es[field], en[field], field);
  assert.notEqual(es.headline.label, en.headline.label);
  assert.equal(es.metrics.length, en.metrics.length);
  for (let i = 0; i < en.metrics.length; i++)
    assert.notEqual(es.metrics[i].label, en.metrics[i].label, `metric ${i}`);
  if (en.quote) assert.notEqual(es.quote.text, en.quote.text);
});
test("Payback is reported whenever an engagement budget is supplied", () => {
  const withBudget = computeRoi(DEFAULT_INPUTS);
  assert.ok(DEFAULT_INPUTS.engagementCost > 0);
  assert.ok(withBudget.paybackMonths > 0);
  const breakdown = buildBreakdown(DEFAULT_INPUTS, withBudget, "en");
  assert.ok(breakdown.lines.some((l) => l.label.startsWith("Simple payback")));
  const noBudget = computeRoi({ ...DEFAULT_INPUTS, engagementCost: 0 });
  assert.equal(noBudget.paybackMonths, null);
  assert.equal(
    buildBreakdown({ ...DEFAULT_INPUTS, engagementCost: 0 }, noBudget, "en")
      .lines.some((l) => l.label.startsWith("Simple payback")),
    false,
  );
});

test("CTA constants are translated and used in place of ad-hoc labels", () => {
  // Passed to t() as identifiers, so the literal scanner cannot see them.
  for (const cta of [PRIMARY_CTA, ONSITE_CTA])
    assert.ok(dictionary[cta.replace(/\s+/g, " ").trim()], cta);
  // The retired one-off labels must not creep back into the sections.
  const retired = [
    "Get a workflow review",
    "Discuss this workflow",
    "Bring us your process",
    "Ask us something else",
    "Explore what\u2019s possible",
    "Discuss a workflow like this",
    "Discuss an onsite visit",
    "Request a workflow review",
    "Let\u2019s talk",
  ];
  const sections = fs
    .readdirSync("components/sections")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => fs.readFileSync(`components/sections/${f}`, "utf8"))
    .join("\n");
  for (const label of retired)
    assert.ok(!sections.includes(`"${label}"`), `retired CTA still present: ${label}`);
});
