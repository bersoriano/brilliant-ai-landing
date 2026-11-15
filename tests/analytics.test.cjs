const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) =>
  module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, filename);

// The PostHog SDK is an external boundary: a stub records what the site sends.
const posthog = { calls: [], init(key, options) { this.calls.push(["init", key, options]); },
  register_once(props) { this.calls.push(["register_once", props]); },
  capture(...args) { this.calls.push(["capture", ...args]); },
  opt_out_capturing() { this.calls.push(["opt_out"]); } };
const posthogPath = require.resolve("posthog-js", { paths: [`${__dirname}/../lib`] });
require.cache[posthogPath] = { id: posthogPath, filename: posthogPath, loaded: true, exports: posthog };

// These tests catch incorrect bilingual grouping, lost acquisition data,
// leaking private URL parameters, and unreachable milestones in tall sections.
const analytics = () => require("../lib/analytics.ts");
const client = () => require("../lib/analytics.client.ts");

const SITE = "https://brilliant.dev";
const ID = "G-TEST1234";

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
    "https://brilliant.dev/?utm_source=linkedin&utm_medium=social&utm_campaign=launch&utm_content=hero&email=private",
    "https://www.google.com/search?q=private",
  ), {
    utm_source: "linkedin", utm_medium: "social", utm_campaign: "launch", utm_content: "hero",
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
    initial_utm_term: "", initial_utm_content: "",
    initial_referring_domain: "$direct", initial_traffic_source: "$direct",
  });
});

test("outbound payload removes URL secrets including SDK person and session fields", () => {
  const result = analytics().sanitizeEvent({ event: "$pageview", properties: {
    $current_url: "https://brilliant.dev/es?email=private#secret",
    $referrer: "https://google.com/search?q=private",
    $set_once: { $initial_current_url: "https://brilliant.dev/?token=private" },
    $session_entry_url: "https://brilliant.dev/?phone=private",
    $session_entry_utm_id: "private@example.com", $session_entry_fbclid: "private",
    $initial_utm_marketing_tactic: "private", gclid: "private", $session_entry_utm_source: "linkedin",
    $pathname: "/es?private=yes", $search: "?email=private", $hash: "#private",
    utm_source: "linkedin", utm_term: "workflow automation", section_id: "contact",
  } });
  assert.equal(result.properties.$current_url, "https://brilliant.dev/es");
  assert.equal(result.properties.$referrer, "https://google.com/search");
  assert.equal(result.properties.$set_once.$initial_current_url, "https://brilliant.dev/");
  assert.equal(result.properties.$session_entry_url, "https://brilliant.dev/");
  assert.equal(result.properties.$pathname, "/es");
  assert.equal(JSON.stringify(result).includes("private"), false);
  assert.equal(result.properties.utm_source, "linkedin");
  assert.equal(result.properties.utm_term, "workflow automation", "all five campaign tags are allowed");
});

test("link classification catches booking, email, WhatsApp and the inquiry form without reading message bodies", () => {
  const base = "https://brilliant.dev/es";
  assert.deepEqual(analytics().linkProperties("https://haabcalendar.com/professionals/ai-automation", base), { cta_type: "booking" });
  assert.deepEqual(analytics().linkProperties("mailto:hello@brilliant.dev?body=private", base), { cta_type: "email" });
  assert.equal(analytics().linkProperties("mailto:?body=private", base), null);
  assert.deepEqual(analytics().linkProperties("https://wa.me/13473261975?text=private", base), { cta_type: "whatsapp" });
  assert.deepEqual(analytics().linkProperties("/es#contact", base), { cta_type: "form" });
  // Blog links are no longer events: the next page_view carries the previous page as referrer.
  assert.equal(analytics().linkProperties("/es/blog/erp-systems-of-action?private=yes", base), null);
  assert.equal(analytics().linkProperties("https://elsewhere.com/blog/private", base), null);
});

test("form errors are classified from the response status", () => {
  const { formErrorType } = analytics();
  assert.equal(formErrorType(undefined), "network");
  assert.equal(formErrorType(400), "validation");
  assert.equal(formErrorType(429), "rate_limited");
  assert.equal(formErrorType(502), "server");
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

// ---------------------------------------------------------------------------
// Client contract (ported from the landing-page-ga skill's assets/analytics.test.ts).
// A fake browser stands in for the only external boundaries: window, document,
// gtag.js and the PostHog SDK.
// ---------------------------------------------------------------------------

function browser({ href = `${SITE}/`, referrer = "", doNotTrack = null, gpc = false } = {}) {
  const scripts = [];
  const win = { location: new URL(href), navigator: { doNotTrack, globalPrivacyControl: gpc } };
  const doc = {
    referrer,
    title: "Home",
    createElement: () => ({ async: false, src: "" }),
    head: { appendChild: (script) => scripts.push(script) },
  };
  Object.assign(globalThis, { window: win, document: doc });
  posthog.calls = [];
  const navigate = (next, title = "Page") => { win.location = new URL(next, win.location); doc.title = title; };
  // gtag.js receives `arguments` objects; read them back as arrays.
  const commands = () => Array.from(win.dataLayer ?? [], (entry) => Array.from(entry));
  const captures = () => posthog.calls.filter(([call]) => call === "capture").map(([, ...args]) => args);
  return { win, scripts, commands, captures, navigate };
}

function start(config = {}) {
  const analytics = client().createAnalytics();
  analytics.init({ gaId: ID, siteUrl: SITE, ...config });
  return analytics;
}

test("addresses keep only campaign tags; referrers from other sites keep only their origin", () => {
  const { campaignUrl, cleanReferrer } = analytics();
  assert.equal(campaignUrl(`${SITE}/p?utm_source=li&utm_term=x&gclid=x&email=a%40b.c#top`), `${SITE}/p?utm_source=li&utm_term=x`);
  assert.equal(cleanReferrer("https://www.google.com/search?q=private", `${SITE}/`), "https://www.google.com");
  assert.equal(cleanReferrer(`${SITE}/blog?ref=x`, `${SITE}/`), `${SITE}/blog`);
  assert.equal(cleanReferrer("", `${SITE}/`), "");
});

test("params respect GA limits", () => {
  const out = analytics().limitParams({ long: "x".repeat(150), skip: undefined, bad: Number.NaN, ["k".repeat(41)]: 1 });
  assert.deepEqual(out, { long: "x".repeat(100) });
});

test("GA stays off on preview hosts, the pages.dev alias, without a valid ID, and under Do Not Track or GPC", () => {
  for (const href of ["https://seo-fixes.brilliant-ai.pages.dev/", "https://brilliant-ai.pages.dev/es", "http://localhost:3000/"]) {
    const { scripts } = browser({ href });
    assert.equal(start().enabled(), false, href);
    assert.equal(scripts.length, 0, href);
  }
  browser();
  assert.equal(start({ gaId: "UA-123" }).enabled(), false, "GA4 IDs only");
  browser({ doNotTrack: "1" });
  assert.equal(start().enabled(), false, "Do Not Track");
  browser({ gpc: true });
  assert.equal(start().enabled(), false, "Global Privacy Control");
});

test("settings are queued with set before js, so the Google tag's own GA tag uses them", () => {
  const { scripts, commands } = browser({ href: `${SITE}/?utm_campaign=x&gclid=secret`, referrer: "https://news.site/a?b=c" });
  start();
  assert.equal(scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${ID}`);
  assert.equal(scripts[0].async, true);
  assert.deepEqual(commands().map(([command]) => command), ["set", "js", "config"]);
  const [[, set], , [, id, config]] = commands();
  assert.equal(id, ID);
  assert.deepEqual(set, config, "set and config carry the same settings");
  for (const settings of [set, config]) {
    assert.equal(settings.send_page_view, false);
    assert.equal(settings.allow_google_signals, false);
    assert.equal(settings.allow_ad_personalization_signals, false);
    assert.equal(settings.page_location, `${SITE}/?utm_campaign=x`);
    assert.equal(settings.page_referrer, "https://news.site");
    assert.equal(settings.debug_mode, undefined);
  }
});

test("debug mode reaches DebugView from localhost but never marks production traffic", () => {
  const local = browser({ href: "http://localhost:3000/" });
  start({ debug: true });
  assert.equal(local.commands()[0][1].debug_mode, true);
  const prod = browser();
  start({ debug: true });
  assert.equal(prod.commands()[0][1].debug_mode, undefined);
});

test("one page_view per route, previous page as referrer, events carry clean page fields", () => {
  const { commands, navigate } = browser({ href: `${SITE}/?utm_source=li&email=a`, referrer: "https://www.google.com/search?q=x" });
  const analytics = start();
  analytics.pageView({ page_type: "landing" });
  navigate("/pricing?coupon=SECRET", "Pricing");
  analytics.pageView({ page_type: "supporting" });
  analytics.track("cta_click", { cta_type: "whatsapp", cta_location: "hero" });
  analytics.track("generate_lead", { form_name: "contact" });

  const events = commands().filter(([command]) => command === "event");
  const views = events.filter(([, name]) => name === "page_view");
  assert.equal(views.length, 2);
  assert.equal(views[0][2].page_location, `${SITE}/?utm_source=li`);
  assert.equal(views[0][2].page_referrer, "https://www.google.com");
  assert.equal(views[1][2].page_location, `${SITE}/pricing`);
  assert.equal(views[1][2].page_referrer, `${SITE}/`);
  assert.equal(views[1][2].page_type, "supporting");
  const [, , click] = events.find(([, name]) => name === "cta_click");
  assert.equal(click.transport_type, "beacon");
  assert.equal(click.page_location, `${SITE}/pricing`);
  const [, , lead] = events.find(([, name]) => name === "generate_lead");
  assert.equal(lead.transport_type, undefined);
  // Automatic hits read globals: each view also updates them.
  assert.deepEqual(commands().filter(([command]) => command === "set").at(-1)?.[1].page_location, `${SITE}/pricing`);
});

test("secret URLs never initialize, and reaching one stops collection until reload", () => {
  const isTrackablePath = (path) => !path.startsWith("/manage/");
  const secret = browser({ href: `${SITE}/manage/tok_123` });
  assert.equal(start({ isTrackablePath }).enabled(), false);
  assert.equal(secret.scripts.length, 0);

  const { win, commands, navigate } = browser();
  const analytics = start({ isTrackablePath });
  analytics.pageView();
  navigate("/manage/tok_123");
  analytics.pageView();
  assert.equal(win[`ga-disable-${ID}`], true);
  navigate("/");
  analytics.pageView();
  analytics.track("cta_click", { cta_type: "booking" });
  assert.equal(commands().filter(([command, name]) => command === "event" && name !== "page_view").length, 0);
  assert.ok(!JSON.stringify(commands()).includes("tok_123"));
});

// ---------------------------------------------------------------------------
// This site: build-time env, PostHog as a second destination.
// ---------------------------------------------------------------------------

function withEnv(env, run) {
  const keys = ["NEXT_PUBLIC_GA_ID", "NEXT_PUBLIC_GA_DEBUG", "NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_POSTHOG_KEY",
    "NEXT_PUBLIC_POSTHOG_HOST", "NEXT_PUBLIC_POSTHOG_DEBUG"];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  Object.assign(process.env, { NEXT_PUBLIC_SITE_URL: SITE, ...env });
  try { return run(); } finally {
    for (const key of keys) if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key];
  }
}

function startFromEnv(env) {
  return withEnv(env, () => { const analytics = client().createAnalytics(); analytics.init(); return analytics; });
}

test("both tools read their build-time variables and stay off on preview hosts and the pages.dev alias", () => {
  const env = { NEXT_PUBLIC_GA_ID: ID, NEXT_PUBLIC_POSTHOG_KEY: "phc_test" };
  for (const href of ["https://seo-fixes.brilliant-ai.pages.dev/", "https://brilliant-ai.pages.dev/es"]) {
    const { scripts } = browser({ href });
    const analytics = startFromEnv(env);
    analytics.pageView();
    assert.equal(analytics.enabled(), false, href);
    assert.equal(scripts.length + posthog.calls.length, 0, href);
  }
  const { scripts } = browser();
  assert.equal(startFromEnv(env).enabled(), true);
  assert.equal(scripts.length, 1, "gtag.js loads on the production host");
  assert.equal(posthog.calls[0][0], "init", "PostHog starts on the production host");
  // The PostHog debug flag allows a deliberate local check against a test project, without GA.
  const local = browser({ href: "http://localhost:3000/" });
  assert.equal(startFromEnv({ ...env, NEXT_PUBLIC_POSTHOG_DEBUG: "true" }).enabled(), true);
  assert.equal(local.scripts.length, 0, "GA needs its own debug flag");
});

test("PostHog keeps its privacy settings and is gated by Do Not Track and GPC like GA", () => {
  browser();
  startFromEnv({ NEXT_PUBLIC_POSTHOG_KEY: "phc_test" });
  const [, key, options] = posthog.calls[0];
  assert.equal(key, "phc_test");
  assert.equal(options.api_host, "https://us.i.posthog.com");
  for (const [name, value] of Object.entries({ autocapture: false, capture_pageview: false, capture_pageleave: false,
    disable_session_recording: true, persistence: "sessionStorage", person_profiles: "never", respect_dnt: true,
    save_campaign_params: false, save_referrer: false }))
    assert.equal(options[name], value, name);
  assert.equal(typeof options.before_send, "function");
  for (const signal of [{ doNotTrack: "1" }, { gpc: true }]) {
    browser(signal);
    assert.equal(startFromEnv({ NEXT_PUBLIC_POSTHOG_KEY: "phc_test", NEXT_PUBLIC_GA_ID: ID }).enabled(), false);
    assert.equal(posthog.calls.length, 0, JSON.stringify(signal));
  }
});

test("navigation clicks bypass PostHog batching and use an unload-safe transport", () => {
  const { captures } = browser({ href: `${SITE}/es` });
  const analytics = startFromEnv({ NEXT_PUBLIC_POSTHOG_KEY: "phc_test" });
  analytics.track("cta_click", { cta_location: "crm", cta_type: "booking" });
  analytics.track("read_progress", { percent: 50, content_type: "article" });
  const [[event, properties, options], [, , progressOptions]] = captures();
  assert.equal(event, "cta_click");
  assert.equal(properties.page_path, "/es");
  assert.equal(properties.cta_location, "crm");
  assert.equal(options?.send_instantly, true, "cta_click must not wait in the batch queue");
  assert.equal(options?.transport, "sendBeacon", "cta_click must survive navigation");
  assert.equal(progressOptions, undefined, "other events batch normally");
});

test("GA and PostHog get the same events; attribution stays in PostHog and GA addresses stay clean", () => {
  const { commands, captures, navigate } = browser({ href: `${SITE}/?utm_source=li&email=a`, referrer: "https://www.google.com/search?q=private" });
  const analytics = startFromEnv({ NEXT_PUBLIC_GA_ID: ID, NEXT_PUBLIC_POSTHOG_KEY: "phc_test" });
  analytics.pageView({ page_type: "landing", locale: "en" });
  navigate("/es/blog/example?email=a", "Example");
  analytics.pageView({ page_type: "blog_post", locale: "es", blog_slug: "example" });
  analytics.track("cta_click", { cta_type: "booking", cta_location: "blog_body", link_domain: "haabcalendar.com" });
  analytics.track("generate_lead", { form_name: "contact" });

  const events = commands().filter(([command]) => command === "event");
  assert.deepEqual(events.map(([, name]) => name), ["page_view", "page_view", "cta_click", "generate_lead"]);
  assert.deepEqual(captures().map(([name]) => name), ["$pageview", "$pageview", "cta_click", "generate_lead"]);
  assert.equal(events[0][2].page_location, `${SITE}/?utm_source=li`);
  assert.equal(events[0][2].page_referrer, "https://www.google.com");
  assert.equal(events[0][2].traffic_source, undefined, "PostHog-only fields stay out of GA");
  assert.equal(events[1][2].page_location, `${SITE}/es/blog/example`);
  assert.equal(events[1][2].page_referrer, `${SITE}/`);
  assert.equal(events[1][2].blog_slug, "example");
  assert.equal(events[2][2].page_location, `${SITE}/es/blog/example`);
  assert.equal(events[2][2].cta_type, "booking");
  assert.equal(events[2][2].transport_type, "beacon", "clicks survive navigation");
  assert.doesNotMatch(JSON.stringify(events), /email=|gclid|private/);

  const [first] = captures();
  assert.equal(first[1].traffic_source, "li");
  assert.equal(first[1].page_path, "/");
  assert.equal(captures()[3][1].form_name, "contact");
});
