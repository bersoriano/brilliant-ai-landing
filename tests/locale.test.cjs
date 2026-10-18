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
  pageFromPath,
  effectiveLocalePath,
} = require("../lib/locale.ts");
const { pageTitle, pageDescription, translate } = require("../lib/i18n.ts");
const { FAQS } = require("../lib/faq.ts");
const { WORKFLOWS, INDUSTRIES, INDUSTRY_ORDER } = require("../lib/workflows.ts");
const { buildInquiryHref } = require("../lib/inquiry.ts");
const { buildBreakdown, computeRoi, DEFAULT_INPUTS } = require("../lib/roi.ts");
const {
  PRIMARY_CTA,
  NAV_CTA,
  ONSITE_CTA,
  WHATSAPP_CTA,
  CRM_CTA,
} = require("../lib/site.ts");
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
test("Second middleware pass preserves original Spanish URL after rewrite", () => {
  assert.equal(
    effectiveLocalePath?.("/finance-automation", "/es/finance-automation"),
    "/es/finance-automation",
  );
  assert.equal(effectiveLocalePath?.("/", "/es"), "/es");
  assert.equal(
    effectiveLocalePath?.("/finance-automation", "/es/healthcare-automation"),
    "/finance-automation",
  );
});
test("Middleware runs on pages but never on API routes", () => {
  const { config } = require("../middleware.ts");
  const matchers = config.matcher.map((source) => new RegExp(`^${source}$`));
  const runs = (path) => matchers.some((matcher) => matcher.test(path));
  for (const page of ["/", "/es", "/es/blog/example-post", "/about", "/apiary"])
    assert.equal(runs(page), true, `${page} should get locale handling`);
  // A Spanish-preference redirect on /api/inquiry bounced every form POST.
  for (const api of ["/api/inquiry", "/api/anything/else"])
    assert.equal(runs(api), false, `${api} should skip middleware`);
  for (const asset of ["/_next/static/chunk.js", "/robots.txt", "/icon.svg"])
    assert.equal(runs(asset), false, `${asset} should skip middleware`);
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
test("Finance and healthcare landing URLs keep distinct, localized search metadata", () => {
  const cases = [
    {
      path: "/finance-automation",
      page: "finance",
      title: /Finance Workflow Automation/,
      description: /invoices.*month-end/i,
      esTitle: /Automatización.*finanzas/,
      esDescription: /facturas.*cierre mensual/i,
    },
    {
      path: "/healthcare-automation",
      page: "healthcare",
      title: /Healthcare Workflow Automation/,
      description: /referrals.*intake/i,
      esTitle: /Automatización.*salud/,
      esDescription: /referencias.*admisión/i,
    },
  ];
  for (const item of cases) {
    assert.equal(pageFromPath(item.path), item.page);
    assert.equal(pageFromPath(`/es${item.path}`), item.page);
    assert.match(pageTitle("en", item.page), item.title);
    assert.match(pageDescription("en", item.page), item.description);
    assert.match(pageTitle("es", item.page), item.esTitle);
    assert.match(pageDescription("es", item.page), item.esDescription);
    assert.equal(languageAlternatePaths(item.path)["es-MX"], `/es${item.path}`);
  }
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
    "Que finanzas empiece el día\ncon todo en orden.",
  );
  assert.equal(
    translate("Get invoices ready to approve", "es"),
    "Preparar facturas para aprobación",
  );
});
test("Each industry has three examples and translated industry copy", () => {
  assert.deepEqual(INDUSTRY_ORDER, [
    "finance",
    "healthcare",
    "operations",
    "sales",
  ]);
  for (const key of INDUSTRY_ORDER) {
    const meta = INDUSTRIES[key];
    const examples = WORKFLOWS.filter((workflow) => workflow.industry === key);
    assert.equal(examples.length, 3, key);
    for (const field of ["label", "title", "description", "operationsLabel"])
      assert.notEqual(
        translate(meta[field], "es"),
        meta[field],
        `${key}.${field}`,
      );
  }
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
  assert.match(
    body,
    /Punto de partida: Preparar facturas para aprobación/,
  );
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
/** The first argument of every literal `t("…")` call in a TSX file. */
function tLiterals(file) {
  const ast = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const keys = [];
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(ast) === "t" &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    )
      keys.push(node.arguments[0].text.replace(/\s+/g, " ").trim());
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return keys;
}

test("Every literal translation call in active UI has a Spanish dictionary entry", () => {
  const files = fs
    .readdirSync("components/sections")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => `components/sections/${f}`)
    .concat([
      "components/ui/Icon.tsx",
      "components/ui/DocumentScene.tsx",
      "components/ui/CrmBoard.tsx",
      "components/ui/AgentPlays.tsx",
      "app/privacy/PrivacyContent.tsx",
      "app/security/SecurityContent.tsx",
      "app/about/AboutContent.tsx",
      "components/i18n/LanguageProvider.tsx",
      "app/blog/page.tsx",
      "app/blog/[slug]/page.tsx",
      "app/blog/mdx.tsx",
    ]);
  for (const file of files)
    for (const key of tLiterals(file)) assert.ok(dictionary[key], `${file}: ${key}`);
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
  for (const cta of [PRIMARY_CTA, NAV_CTA, ONSITE_CTA, WHATSAPP_CTA, CRM_CTA])
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

// Formal singular forms we must not slip back into ("ustedes" for the
// visitor addressing us — "Ayúdennos", "¿Trabajan…?" — is standard Mexican).
// Phrases, not bare verbs: "empiece"/"envíe" are also third-person subjunctive.
const FORMAL_SPANISH =
  /(^|[^\p{L}])(usted|empiece con|traiga|elija|seleccione|comparta|envíela|envíelo|escriba a|escríbanos|agende|ajuste los|agréguelo|cuéntenos|muéstrenos|evite|designe|envíenos|su equipo|su proceso|su control|tiene en mente)(?=[^\p{L}]|$)/iu;
// Spain-only vocabulary and vosotros forms.
const SPAIN_SPANISH =
  /(^|[^\p{L}])(vosotros|vosotras|os|ordenador|fichero|coger|tenéis|podéis|queréis|habéis)(?=[^\p{L}]|$)/iu;
// The custom ERP is white-label too: these never appear in the public repo.
const ERP_FOUNDATION = /erpnext|frappe|caffyne/i;
const EMPLOYERS = ["Boston Consulting Group", "Bank of America", "Merrill Lynch", "Banorte", "Mellon", "Accenture", "IBM"];

test("Mexican Spanish uses tú with the visitor, not usted or Spain forms", () => {
  const formal = FORMAL_SPANISH;
  const spain = SPAIN_SPANISH;
  for (const [key, value] of Object.entries(dictionary)) {
    assert.doesNotMatch(value, formal, key);
    assert.doesNotMatch(value, spain, key);
  }
  assert.equal(translate(PRIMARY_CTA, "es"), "Agenda una revisión de 20 minutos");
});

test("Every scene string and homepage data string has a Spanish entry", () => {
  const { SCENES, HERO_STEPS, HERO_INBOX, HERO_ROW_STATUS } = require("../lib/scenes.ts");
  const { HOMEPAGE_INDUSTRIES } = require("../lib/workflows.ts");
  assert.deepEqual(HOMEPAGE_INDUSTRIES, ["finance", "healthcare"]);
  const strings = [
    ...HERO_STEPS,
    ...HERO_INBOX.flatMap((row) => [row.subject, row.status]),
    ...HERO_ROW_STATUS.map(([label]) => label),
  ];
  // The run has one inbox status per step.
  assert.equal(HERO_ROW_STATUS.length, HERO_STEPS.length);
  for (const workflow of WORKFLOWS.filter((w) =>
    HOMEPAGE_INDUSTRIES.includes(w.industry),
  )) {
    const scene = SCENES[workflow.id];
    assert.ok(scene, `scene for ${workflow.id}`);
    const { inbound, card } = scene;
    strings.push(inbound.channel, inbound.subject, inbound.title, inbound.flag);
    for (const [label, value] of inbound.lines) strings.push(label, value);
    strings.push(card.channel, card.title, card.attachments, card.status, card.action);
    for (const check of card.checks) strings.push(check.label);
  }
  // Amounts and counts (no letters) are the same in both languages.
  for (const s of strings.filter((x) => /\p{L}/u.test(x)))
    assert.notEqual(translate(s, "es"), s, `missing Spanish: ${s}`);
});

test("Employer names stay off the homepage; they live on /about with the hedge", () => {
  const home = fs
    .readdirSync("components/sections")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => fs.readFileSync(`components/sections/${f}`, "utf8"))
    .join("\n");
  for (const name of EMPLOYERS)
    assert.ok(!home.includes(name), `employer on homepage: ${name}`);
  const about = fs.readFileSync("app/about/AboutContent.tsx", "utf8");
  assert.match(about, /not current Brilliant AI clients or partners/);
});

test("Custom CRM copy is translated and stays white-label", () => {
  const {
    CRM_PIPELINE,
    CRM_ESSENTIALS,
    CRM_ADVANCED,
    CRM_ASSISTANT,
    CRM_PROMPTS,
    CRM_REQUESTS,
    CRM_REASONS,
    CRM_SECURITY,
    CRM_STEPS,
    CRM_CUSTOM_WORK,
    CRM_AGENT_PLAYS,
    crmPrice,
  } = require("../lib/crm.ts");
  const strings = [
    ...CRM_PIPELINE.flatMap((column) => [
      column.stage,
      ...column.deals.map((deal) => deal.deal),
    ]),
    ...[...CRM_ESSENTIALS, ...CRM_ADVANCED].flatMap(([, title, line]) => [
      title,
      line,
    ]),
    ...CRM_ASSISTANT.flat(),
    ...CRM_PROMPTS,
    ...CRM_REQUESTS,
    ...CRM_REASONS.flat(),
    ...CRM_SECURITY.flat(),
    ...CRM_STEPS.flatMap((step) => [step.title, step.body]),
    ...CRM_CUSTOM_WORK,
    ...CRM_AGENT_PLAYS.flatMap((play) => Object.values(play)),
  ];
  for (const s of strings)
    assert.notEqual(translate(s, "es"), s, `missing Spanish: ${s}`);
  // Illustrative deal values exist in both page currencies (no FX conversion).
  for (const column of CRM_PIPELINE)
    for (const deal of column.deals)
      assert.ok(deal.value.USD > 0 && deal.value.MXN > 0, deal.company);
  // The base-plan price follows the language: USD in English, MXN in Spanish.
  assert.equal(crmPrice("en").currency, "USD");
  assert.equal(crmPrice("es").currency, "MXN");
  // "Two months free" is only shown when it is true.
  for (const locale of ["en", "es"]) {
    const { month, year, twoMonthsFree } = crmPrice(locale);
    assert.equal(twoMonthsFree, year === month * 10, locale);
  }
  // The foundation is not named anywhere a visitor can read (the repo is public).
  const sources = [
    fs.readFileSync("CLAUDE.md", "utf8"),
    fs.readFileSync("docs/conversion/NOTES.md", "utf8"),
    fs.readFileSync("lib/crm.ts", "utf8"),
    fs.readFileSync("components/sections/Services.tsx", "utf8"),
    fs.readFileSync("components/sections/CrmLanding.tsx", "utf8"),
    fs.readFileSync("components/ui/CrmBoard.tsx", "utf8"),
    fs.readFileSync("lib/i18n.ts", "utf8"),
    JSON.stringify(dictionary),
  ].join("\n");
  assert.doesNotMatch(sources, /atomic|marmelab/i);
});

test("Services presents the four offers as one translated set, ahead of How it works", () => {
  const { SERVICES, WORKFLOW_EXAMPLES, AGENT_EXAMPLES } = require("../lib/services.ts");
  const { ERP_PLAYS, ERP_FEATURES, erpPrice } = require("../lib/erp.ts");
  const { NAV_LINKS } = require("../lib/site.ts");
  assert.deepEqual(
    SERVICES.map((service) => service.name),
    ["AI Workflow Automations", "AI Agents", "Custom CRM", "Custom ERP"],
  );
  const strings = [
    ...SERVICES.flatMap((service) => [service.name, service.line]),
    ...WORKFLOW_EXAMPLES.flatMap((example) => [example.label, example.steps]),
    ...AGENT_EXAMPLES.flatMap((example) => Object.values(example)),
    ...ERP_PLAYS.flatMap((play) => Object.values(play)),
    ...ERP_FEATURES.flatMap(([, title, line]) => [title, line]),
  ];
  for (const s of strings)
    assert.notEqual(translate(s, "es"), s, `missing Spanish: ${s}`);
  // Workflow examples are drawn as pipelines split on " → " after
  // translation, so both languages must keep the same steps.
  for (const { steps } of WORKFLOW_EXAMPLES) {
    const count = steps.split(" → ").length;
    assert.ok(count >= 3, `${steps}: a pipeline has at least three steps`);
    assert.equal(translate(steps, "es").split(" → ").length, count, steps);
  }
  // The ERP base plan follows the language, like the CRM's (no FX conversion).
  assert.equal(erpPrice("en").currency, "USD");
  assert.equal(erpPrice("es").currency, "MXN");
  for (const locale of ["en", "es"]) assert.ok(erpPrice(locale).month > 0, locale);
  // One Services section, ahead of How it works; the CRM lives inside it.
  const page = fs.readFileSync("app/page.tsx", "utf8");
  assert.ok(page.includes("<Services />"), "homepage renders Services");
  assert.ok(page.indexOf("<Services />") < page.indexOf("<HowItWorks />"), "Services comes before How it works");
  assert.doesNotMatch(page, /<CustomCrm/);
  assert.ok(NAV_LINKS.some((link) => link.href === "#services"), "nav links to #services");
  const services = fs.readFileSync("components/sections/Services.tsx", "utf8");
  assert.match(services, /PRIMARY_CTA/, "Services closes on the primary CTA");
  for (const id of SERVICES.map((service) => service.id))
    assert.ok(/^[a-z-]+$/.test(id), `${id}: a plain anchor id`);
});

test("Services copy speaks to business owners: no build-stack or technical terms", () => {
  const { SERVICES, WORKFLOW_EXAMPLES, AGENT_EXAMPLES } = require("../lib/services.ts");
  const { ERP_PLAYS, ERP_FEATURES } = require("../lib/erp.ts");
  const { CRM_AGENT_PLAYS, CRM_ESSENTIALS, CRM_ADVANCED } = require("../lib/crm.ts");
  const TECHNICAL =
    /\b(atomic|marmelab|erpnext|frappe|caffyne|doctypes?|mcp|python|open[- ]source|self[- ]host(ed|ing)?|código abierto|autoalojad[oa]s?)\b/i;
  const keys = [
    ...tLiterals("components/sections/Services.tsx"),
    ...tLiterals("components/sections/SystemOffer.tsx"),
    ...SERVICES.flatMap((service) => [service.name, service.line]),
    ...WORKFLOW_EXAMPLES.flatMap((example) => [example.label, example.steps]),
    ...AGENT_EXAMPLES.flatMap((example) => Object.values(example)),
    ...ERP_PLAYS.flatMap((play) => Object.values(play)),
    ...ERP_FEATURES.flatMap(([, title, line]) => [title, line]),
    ...CRM_AGENT_PLAYS.flatMap((play) => Object.values(play)),
    ...[...CRM_ESSENTIALS, ...CRM_ADVANCED.slice(0, 3)].flatMap(([, title, line]) => [title, line]),
  ];
  for (const key of keys) {
    assert.doesNotMatch(key, TECHNICAL, key);
    assert.doesNotMatch(translate(key, "es"), TECHNICAL, `Spanish for: ${key}`);
  }
  // The ERP foundation is never named anywhere in the public repo.
  const sources = [
    fs.readFileSync("CLAUDE.md", "utf8"),
    fs.readFileSync("docs/conversion/NOTES.md", "utf8"),
    fs.readFileSync("lib/erp.ts", "utf8"),
    fs.readFileSync("lib/services.ts", "utf8"),
    fs.readFileSync("components/sections/Services.tsx", "utf8"),
    fs.readFileSync("components/sections/SystemOffer.tsx", "utf8"),
    fs.readFileSync("lib/seo.ts", "utf8"),
    JSON.stringify(dictionary),
  ].join("\n");
  assert.doesNotMatch(sources, ERP_FOUNDATION);
});

test("Custom CRM landing has its own localized URL, metadata, and sitemap entry", () => {
  const { CRM_DESCRIPTION } = require("../lib/i18n.ts");
  assert.equal(pageFromPath("/custom-crm"), "crm");
  assert.equal(pageFromPath("/es/custom-crm"), "crm");
  assert.equal(languageAlternatePaths("/custom-crm")["es-MX"], "/es/custom-crm");
  assert.match(pageTitle("en", "crm"), /Custom CRM/);
  assert.match(pageTitle("es", "crm"), /CRM a la medida/);
  assert.ok(dictionary[CRM_DESCRIPTION], "Spanish CRM description");
  assert.equal(pageDescription("es", "crm"), dictionary[CRM_DESCRIPTION]);
  assert.ok(fs.existsSync("app/custom-crm/page.tsx"));
  assert.match(fs.readFileSync("app/sitemap.ts", "utf8"), /"\/custom-crm"/);
});

test("Blog index and posts have localized URLs, metadata, and sitemap entries", () => {
  const { BLOG_DESCRIPTION } = require("../lib/i18n.ts");
  const { isServerLocalizedPage } = require("../lib/locale.ts");
  assert.equal(pageFromPath("/blog"), "blog");
  assert.equal(pageFromPath("/es/blog"), "blog");
  assert.equal(pageFromPath("/blog/some-post"), "post");
  assert.equal(pageFromPath("/es/blog/some-post"), "post");
  assert.equal(languageAlternatePaths("/blog/some-post")["es-MX"], "/es/blog/some-post");
  // Post bodies come from the server per language, so the switch must navigate.
  assert.ok(isServerLocalizedPage("/es/blog/some-post"));
  assert.ok(!isServerLocalizedPage("/security"));
  assert.ok(dictionary[BLOG_DESCRIPTION], "Spanish blog description");
  assert.equal(pageDescription("es", "blog"), dictionary[BLOG_DESCRIPTION]);
  assert.match(fs.readFileSync("app/sitemap.ts", "utf8"), /"\/blog"/);
});

test("Post frontmatter is validated", () => {
  const { parsePost, sortPosts } = require("../lib/posts.ts");
  const post = (front) => `---\n${front}\n---\n\nBody.\n`;
  const ok = parsePost(
    post('title: "A: B"\ndescription: Short.\ndate: 2026-01-02'),
    "a-post",
    "en",
  );
  assert.equal(ok.title, "A: B");
  assert.equal(ok.draft, false);
  assert.equal(ok.body.trim(), "Body.");
  assert.throws(() => parsePost(post("description: x\ndate: 2026-01-02"), "a", "en"), /title/);
  assert.throws(() => parsePost(post("title: x\ndescription: x\ndate: Jan 2"), "a", "en"), /date/);
  assert.throws(() => parsePost(post("title: x\ndescription: x\ndate: 2026-01-02\ndraft: yes"), "a", "en"), /draft/);
  assert.throws(() => parsePost(post("title: x\ndescription: x\ndate: 2026-01-02"), "Bad_Slug", "en"), /slug/);
  assert.throws(() => parsePost("No frontmatter", "a", "en"), /frontmatter/);
  assert.deepEqual(
    sortPosts([
      { slug: "b", date: "2026-01-01" },
      { slug: "a", date: "2026-03-01" },
      { slug: "c", date: "2026-01-01" },
    ]).map((p) => p.slug),
    ["a", "b", "c"],
  );
});

test("Every post ships in English and Mexican Spanish, compiles, and follows the site's rules", async () => {
  const { POSTS_DIR, POST_LOCALES, parsePost } = require("../lib/posts.ts");
  const { compile } = await import("@mdx-js/mdx");
  const { default: remarkGfm } = await import("remark-gfm");
  const slugs = fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  assert.ok(slugs.length > 0, "the example post keeps the format documented");
  for (const slug of slugs) {
    const [en, es] = POST_LOCALES.map((locale) => {
      const file = `${POSTS_DIR}/${slug}/${locale}.mdx`;
      assert.ok(fs.existsSync(file), `missing ${file}`);
      return { file, post: parsePost(fs.readFileSync(file, "utf8"), slug, locale) };
    });
    // Both languages publish together so hreflang alternates never 404.
    assert.equal(en.post.draft, es.post.draft, `${slug}: draft differs between languages`);
    assert.equal(en.post.date, es.post.date, `${slug}: date differs between languages`);
    assert.notEqual(en.post.title, es.post.title, `${slug}: Spanish title is untranslated`);
    for (const { file, post } of [en, es]) {
      await compile(post.body, { remarkPlugins: [remarkGfm] }).catch((error) => {
        assert.fail(`${file} does not compile: ${error.message}`);
      });
      const text = [post.title, post.description, post.body].join("\n");
      // The post closes on the booking button, once, from the shared component.
      assert.equal(
        (post.body.match(/<BookReview \/>/g) || []).length,
        1,
        `${file}: end the "Next step" section with <BookReview />`,
      );
      // No third-party image requests: images live in public/.
      assert.doesNotMatch(text, /!\[[^\]]*\]\(\s*(https?:)?\/\//, `${file}: remote image`);
      assert.doesNotMatch(text, /<img[^>]+src=["'](https?:)?\/\//i, `${file}: remote image`);
      // Honesty rules from CLAUDE.md apply to posts too.
      for (const name of EMPLOYERS)
        assert.ok(!text.includes(name), `${file}: employer names live only on /about (${name})`);
      assert.doesNotMatch(text, /atomic|marmelab/i, `${file}: the CRM foundation stays unnamed`);
      assert.doesNotMatch(text, ERP_FOUNDATION, `${file}: the ERP foundation stays unnamed`);
      assert.doesNotMatch(
        text,
        /\b(SOC ?2|HIPAA|ISO ?27001)[- ](certified|compliant|attested)\b/i,
        `${file}: certification claim`,
      );
    }
    assert.doesNotMatch(es.post.body + es.post.title + es.post.description, FORMAL_SPANISH, `${es.file}: use tú`);
    assert.doesNotMatch(es.post.body + es.post.title + es.post.description, SPAIN_SPANISH, `${es.file}: Mexican Spanish`);
  }
});

test("Blog is reachable from the nav and homepage; the CRM page links to a published post", () => {
  const { NAV_LINKS } = require("../lib/site.ts");
  const { CRM_POST_SLUG } = require("../lib/crm.ts");
  const { POSTS_DIR, POST_LOCALES, parsePost } = require("../lib/posts.ts");
  assert.ok(NAV_LINKS.some((link) => link.href === "/blog"), "nav links to /blog");
  assert.match(fs.readFileSync("app/page.tsx", "utf8"), /<LatestPosts /);
  for (const file of ["CrmLanding.tsx", "Services.tsx"])
    assert.match(fs.readFileSync(`components/sections/${file}`, "utf8"), /CRM_POST_SLUG/, file);
  // The link must never 404: the post exists in both languages and is not a draft.
  for (const locale of POST_LOCALES) {
    const file = `${POSTS_DIR}/${CRM_POST_SLUG}/${locale}.mdx`;
    assert.ok(fs.existsSync(file), `missing ${file}`);
    assert.equal(parsePost(fs.readFileSync(file, "utf8"), CRM_POST_SLUG, locale).draft, false, `${file} is a draft`);
  }
});

test("Homepage notes stay published in both languages, and the approach copy is translated", () => {
  const { INSIGHTS, APPROACH_RULES } = require("../lib/insights.ts");
  const { POSTS_DIR, POST_LOCALES, parsePost } = require("../lib/posts.ts");
  // Linked from the approach block, the calculator and the trust section:
  // a missing or draft note would be a broken link on the homepage.
  for (const slug of Object.values(INSIGHTS))
    for (const locale of POST_LOCALES) {
      const file = `${POSTS_DIR}/${slug}/${locale}.mdx`;
      assert.ok(fs.existsSync(file), `missing ${file}`);
      assert.equal(parsePost(fs.readFileSync(file, "utf8"), slug, locale).draft, false, `${file} is a draft`);
    }
  for (const rule of APPROACH_RULES)
    assert.ok(dictionary[rule.title], `missing Spanish: ${rule.title}`);
  assert.match(fs.readFileSync("app/page.tsx", "utf8"), /<Approach /);
});

test("Link, don't lecture: the authority block is at most three one-line rules, each linking a note", () => {
  const { APPROACH_RULES, INSIGHTS } = require("../lib/insights.ts");
  assert.ok(APPROACH_RULES.length <= 3, `${APPROACH_RULES.length} rules: the homepage keeps three at most`);
  for (const rule of APPROACH_RULES) {
    // The note carries the explanation; the homepage shows only the rule.
    assert.deepEqual(Object.keys(rule).sort(), ["note", "title"], `${rule.title}: a rule is a title and a note`);
    assert.ok(INSIGHTS[rule.note], `${rule.title}: links a registered note`);
    assert.ok(rule.title.length <= 60, `${rule.title}: keep the rule to one line`);
  }
});

test("Homepage blog teaser skips the notes it already links and the CRM post", () => {
  const { FEATURED_INSIGHTS, homepageTeaser } = require("../lib/insights.ts");
  const { CRM_POST_SLUG } = require("../lib/crm.ts");
  // Newest first, as getPosts returns them.
  const posts = [CRM_POST_SLUG, "newest", ...FEATURED_INSIGHTS, "second", "third", "fourth"].map(
    (slug) => ({ slug }),
  );
  assert.deepEqual(
    homepageTeaser(posts).map((post) => post.slug),
    ["newest", "second", "third"],
  );
  // With only linked notes and the CRM post published, the section has nothing to show.
  assert.deepEqual(
    homepageTeaser([CRM_POST_SLUG, ...FEATURED_INSIGHTS].map((slug) => ({ slug }))),
    [],
  );
});

test("Positioning stays operator, not consultancy", () => {
  const { CONSULTANCY_PHRASES } = require("../lib/insights.ts");
  const files = fs
    .readdirSync("components/sections")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => `components/sections/${f}`)
    .concat(["lib/i18n.ts", "lib/faq.ts", "lib/workflows.ts", "lib/site.ts", "lib/crm.ts"]);
  for (const dir of fs.readdirSync("content/posts"))
    for (const locale of ["en", "es"]) files.push(`content/posts/${dir}/${locale}.mdx`);
  for (const file of files)
    assert.doesNotMatch(fs.readFileSync(file, "utf8"), CONSULTANCY_PHRASES, file);
  for (const [key, value] of Object.entries(dictionary)) {
    assert.doesNotMatch(key, CONSULTANCY_PHRASES, key);
    assert.doesNotMatch(value, CONSULTANCY_PHRASES, key);
  }
});
