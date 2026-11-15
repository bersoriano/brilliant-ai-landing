const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");
const vm = require("node:vm");

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

/**
 * Runs the real lib/analytics.client.ts in a sandbox, replacing only the
 * external boundaries: the PostHog SDK, the page, and gtag.js.
 */
function loadClient({ href = "https://brilliant.dev/es", env = {}, doNotTrack = null, title = "Page" } = {}) {
  process.env.NEXT_PUBLIC_SITE_URL = "https://brilliant.dev";
  const captures = [];
  const scripts = [];
  const sdk = { init() {}, register_once() {}, capture(...args) { captures.push(args); } };
  const location = new URL(href);
  const window = { location, navigator: { doNotTrack } };
  const document = {
    referrer: "https://www.google.com/search?q=private",
    title,
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
  };
  const exported = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync("lib/analytics.client.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, {
    exports: exported, module: { exports: exported },
    require: (id) => id === "posthog-js" ? sdk : analytics(),
    window, document, URL,
    process: { env: { NODE_ENV: "production", NEXT_PUBLIC_POSTHOG_KEY: "phc_test", ...env } },
  });
  exported.initializeAnalytics();
  // gtag.js receives `arguments` objects; read them back as arrays.
  const gtag = () => Array.from(window.dataLayer || [], (entry) => Array.from(entry));
  return { client: exported, captures, scripts, gtag, window };
}

test("navigation clicks bypass batching and use an unload-safe transport", () => {
  const { client, captures } = loadClient();
  client.captureAnalytics("cta_clicked", { source_section: "crm", cta_type: "booking" });
  client.captureAnalytics("blog_link_clicked", { source_section: "blog", destination_path: "/es/blog/example" });
  for (const [event, properties, options] of captures) {
    assert.ok(["cta_clicked", "blog_link_clicked"].includes(event));
    assert.equal(properties.page_path, "/es");
    assert.equal(options?.send_instantly, true, `${event} must not wait in the batch queue`);
    assert.equal(options?.transport, "sendBeacon", `${event} must survive navigation`);
  }
  assert.equal(captures.length, 2);
});

test("analytics stays off on preview hosts and the pages.dev alias", () => {
  for (const href of ["https://seo-fixes.brilliant-ai.pages.dev/", "https://brilliant-ai.pages.dev/es"]) {
    const { client, captures, scripts } = loadClient({ href, env: { NEXT_PUBLIC_GA_ID: "G-TEST123" } });
    client.captureAnalytics("$pageview");
    assert.equal(client.analyticsEnabled(), false, href);
    assert.equal(captures.length + scripts.length, 0, href);
  }
  // The debug flags still allow a deliberate check against a test project.
  assert.equal(loadClient({ href: "http://localhost:3000/", env: { NEXT_PUBLIC_POSTHOG_DEBUG: "true" } }).client.analyticsEnabled(), true);
});

test("Google Analytics loads only with a valid ID, and never under Do Not Track", () => {
  assert.equal(loadClient().scripts.length, 0, "no ID, no script");
  assert.equal(loadClient({ env: { NEXT_PUBLIC_GA_ID: "UA-123" } }).scripts.length, 0, "GA4 IDs only");
  assert.equal(loadClient({ env: { NEXT_PUBLIC_GA_ID: "G-TEST123" }, doNotTrack: "1" }).scripts.length, 0, "Do Not Track");
  const { scripts, gtag } = loadClient({ href: "https://brilliant.dev/?utm_source=li&gclid=private&email=a", env: { NEXT_PUBLIC_GA_ID: "G-TEST123" } });
  assert.equal(scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-TEST123");
  assert.equal(scripts[0].async, true);
  const [, id, config] = gtag().find(([command]) => command === "config");
  assert.equal(id, "G-TEST123");
  assert.equal(config.send_page_view, false, "PageAnalytics sends page views");
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.page_location, "https://brilliant.dev/?utm_source=li", "only campaign tags survive");
  assert.equal(config.page_referrer, "https://www.google.com/search");
});

test("Google Analytics gets the same events, with clean addresses and the previous page as referrer", () => {
  const { client, gtag, window } = loadClient({ href: "https://brilliant.dev/?utm_source=li&email=a", env: { NEXT_PUBLIC_GA_ID: "G-TEST123" } });
  client.captureAnalytics("$pageview", { utm_source: "li", traffic_source: "li" });
  window.location.href = "https://brilliant.dev/es/blog/example?email=a";
  client.captureAnalytics("$pageview");
  client.captureAnalytics("cta_clicked", { cta_type: "booking", source_section: "blog_body" });
  const events = gtag().filter(([command]) => command === "event");
  assert.deepEqual(events.map(([, name]) => name), ["page_view", "page_view", "cta_clicked"]);
  assert.equal(events[0][2].page_location, "https://brilliant.dev/?utm_source=li");
  assert.equal(events[0][2].page_referrer, "https://www.google.com/search");
  assert.equal(events[0][2].traffic_source, undefined, "PostHog-only fields stay out of GA");
  assert.equal(events[1][2].page_location, "https://brilliant.dev/es/blog/example");
  assert.equal(events[1][2].page_referrer, "https://brilliant.dev/");
  assert.equal(events[1][2].blog_slug, "example");
  assert.equal(events[2][2].page_location, "https://brilliant.dev/es/blog/example");
  assert.equal(events[2][2].cta_type, "booking");
  assert.equal(events[2][2].transport_type, "beacon", "clicks survive navigation");
  assert.doesNotMatch(JSON.stringify(events), /email=|gclid/);
});
