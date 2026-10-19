const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) =>
  module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, filename);

// These tests catch incorrect bilingual grouping, lost acquisition data,
// leaking private URL parameters, and unreachable milestones in tall sections.
const analytics = () => require("../lib/analytics.ts");

test("page context groups both languages and identifies blog posts", () => {
  assert.deepEqual(analytics().pageProperties("https://brilliant.dev/es/blog/erp-systems-of-action?email=private#next"), {
    page_path: "/es/blog/erp-systems-of-action", page_type: "blog_post",
    locale: "es", blog_slug: "erp-systems-of-action",
  });
  assert.equal(analytics().pageProperties("https://brilliant.dev/es").page_type, "landing");
  assert.equal(analytics().pageProperties("https://brilliant.dev/blog/").page_type, "blog_index");
});

test("traffic attribution keeps campaign tags and external domain only", () => {
  assert.deepEqual(analytics().trafficProperties(
    "https://brilliant.dev/?utm_source=linkedin&utm_medium=social&utm_campaign=launch&email=private",
    "https://www.google.com/search?q=private",
  ), {
    utm_source: "linkedin", utm_medium: "social", utm_campaign: "launch",
    referring_domain: "www.google.com", traffic_source: "linkedin",
  });
  assert.deepEqual(analytics().trafficProperties("https://brilliant.dev/blog", ""), {
    referring_domain: "$direct", traffic_source: "$direct",
  });
  assert.equal(analytics().trafficProperties("https://brilliant.dev/blog", "https://brilliant.dev/es").traffic_source, "$internal");
});

test("initial attribution fills absent campaign fields so later visits cannot mix sources", () => {
  assert.deepEqual(analytics().initialTrafficProperties("https://brilliant.dev/", ""), {
    initial_utm_source: "", initial_utm_medium: "", initial_utm_campaign: "",
    initial_referring_domain: "$direct", initial_traffic_source: "$direct",
  });
});

test("outbound payload removes URL secrets including SDK person and session fields", () => {
  const result = analytics().sanitizeEvent({ event: "$pageview", properties: {
    $current_url: "https://brilliant.dev/es?email=private#secret",
    $referrer: "https://google.com/search?q=private",
    $set_once: { $initial_current_url: "https://brilliant.dev/?token=private" },
    $session_entry_url: "https://brilliant.dev/?phone=private",
    $session_entry_utm_term: "private@example.com", $session_entry_fbclid: "private",
    $initial_utm_content: "private", gclid: "private", $session_entry_utm_source: "linkedin",
    $pathname: "/es?private=yes", $search: "?email=private", $hash: "#private",
    utm_source: "linkedin", section_id: "contact",
  } });
  assert.equal(result.properties.$current_url, "https://brilliant.dev/es");
  assert.equal(result.properties.$referrer, "https://google.com/search");
  assert.equal(result.properties.$set_once.$initial_current_url, "https://brilliant.dev/");
  assert.equal(result.properties.$session_entry_url, "https://brilliant.dev/");
  assert.equal(result.properties.$pathname, "/es");
  assert.equal(JSON.stringify(result).includes("private"), false);
  assert.equal(result.properties.utm_source, "linkedin");
});

test("link classification catches booking, contact and blog clicks without exporting message bodies", () => {
  const base = "https://brilliant.dev/es";
  assert.deepEqual(analytics().linkProperties("https://haabcalendar.com/professionals/ai-automation", base), {
    event: "cta_clicked", properties: { cta_type: "booking" },
  });
  assert.deepEqual(analytics().linkProperties("mailto:hello@brilliant.dev?body=private", base), {
    event: "cta_clicked", properties: { cta_type: "email" },
  });
  assert.equal(analytics().linkProperties("mailto:?body=private", base), null);
  assert.equal(analytics().linkProperties("https://wa.me/13473261975?text=private", base).properties.cta_type, "whatsapp");
  assert.deepEqual(analytics().linkProperties("/es/blog/erp-systems-of-action?private=yes", base), {
    event: "blog_link_clicked", properties: { destination_path: "/es/blog/erp-systems-of-action", destination_slug: "erp-systems-of-action" },
  });
  assert.equal(analytics().linkProperties("https://elsewhere.com/blog/private", base), null);
});

test("visibility works for sections taller than screen and rejects slivers", () => {
  assert.equal(analytics().sectionIsVisible(0, 3000, 800), true);
  assert.equal(analytics().sectionIsVisible(790, 3000, 800), false);
  assert.equal(analytics().sectionIsVisible(-3050, 3000, 800), false);
});

test("article progress uses article bounds, handles short articles and clamps overscroll", () => {
  assert.equal(analytics().articleProgress(800, 2000, 800), 0);
  assert.equal(analytics().articleProgress(-200, 2000, 800), 50);
  assert.equal(analytics().articleProgress(-1500, 2000, 800), 100);
  assert.equal(analytics().articleProgress(300, 200, 800), 100);
});
