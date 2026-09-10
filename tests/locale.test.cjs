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
const { resolveLocale, AMERICAS_EXCEPT_US } = require("../lib/locale.ts");
const { translate } = require("../lib/i18n.ts");
const { WORKFLOWS } = require("../lib/workflows.ts");
const { buildInquiryHref } = require("../lib/inquiry.ts");
const { buildBreakdown, computeRoi, DEFAULT_INPUTS } = require("../lib/roi.ts");
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
test("Every included Americas country selects Spanish, including Canada and Brazil", () => {
  assert(!AMERICAS_EXCEPT_US.has("US"));
  for (const country of AMERICAS_EXCEPT_US)
    assert.equal(
      resolveLocale({ country, acceptLanguage: "en-US" }),
      "es",
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
  assert.equal(resolveLocale({ saved: "invalid", country: "CA" }), "es");
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
test("Every literal translation call in active UI has a Spanish dictionary entry", () => {
  const files = fs
    .readdirSync("components/sections")
    .filter((f) => f.endsWith(".tsx") && f !== "Problem.tsx")
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
