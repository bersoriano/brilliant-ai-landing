const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText,
    filename,
  );

const seo = require("../lib/seo.ts");
const { parsePost } = require("../lib/posts.ts");
const { getSiteUrl } = require("../lib/site.ts");
const base = getSiteUrl();
const fixture = {
  slug: "invoice-exceptions",
  locale: "es",
  title: "Cómo resolver las excepciones en la automatización de facturas",
  seoTitle: "Automatización de facturas: excepciones",
  description: "Prepara facturas para aprobación con evidencia y una persona responsable.",
  date: "2026-10-15",
  updated: "2026-10-17",
  draft: false,
};

test("Post metadata keeps its own localized canonical, language alternates, and article image", () => {
  const meta = seo.buildPostMetadata(fixture);
  assert.equal(meta.title, "Automatización de facturas: excepciones | Brilliant AI");
  assert.equal(meta.alternates.canonical, "/es/blog/invoice-exceptions");
  assert.equal(meta.alternates.languages.en, "/blog/invoice-exceptions");
  assert.equal(meta.alternates.languages["es-MX"], "/es/blog/invoice-exceptions");
  assert.equal(meta.openGraph.type, "article");
  assert.equal(meta.openGraph.locale, "es_MX");
  assert.equal(meta.openGraph.images[0].url, "/es/og?post=invoice-exceptions");
  assert.equal(meta.twitter.images[0], "/es/og?post=invoice-exceptions");
  assert.equal(meta.openGraph.modifiedTime, "2026-10-17");
  assert.equal(meta.robots.index, true);
  assert.equal(seo.buildPostMetadata({ ...fixture, draft: true }).robots.index, false);
  const english = seo.buildPostMetadata({ ...fixture, locale: "en", seoTitle: undefined });
  assert.equal(english.alternates.canonical, "/blog/invoice-exceptions");
  assert.equal(english.openGraph.images[0].url, "/og?post=invoice-exceptions");
  assert.equal(english.title, `${fixture.title} | Brilliant AI`);
});

test("Article schema connects author, visible dates, page, blog, and localized breadcrumbs", () => {
  const graph = seo.buildPostJsonLd(fixture)["@graph"];
  const article = graph.find((node) => node["@type"] === "BlogPosting");
  const page = graph.find((node) => node["@type"] === "WebPage");
  const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList");
  assert.equal(article.headline, fixture.title);
  assert.equal(article.url, `${base}/es/blog/invoice-exceptions`);
  assert.equal(article.author["@type"], "Organization");
  assert.equal(article.author.name, "Brilliant AI");
  assert.equal(article.author.url, base);
  assert.equal(article.inLanguage, "es-MX");
  assert.equal(article.datePublished, "2026-10-15");
  assert.equal(article.dateModified, "2026-10-17");
  assert.equal(article.image.url, `${base}/es/og?post=invoice-exceptions`);
  assert.equal(article.isPartOf["@id"], `${base}/es/blog#blog`);
  assert.equal(article.mainEntityOfPage["@id"], page["@id"]);
  assert.deepEqual(crumbs.itemListElement.map((item) => item.item), [
    `${base}/es`, `${base}/es/blog`, `${base}/es/blog/invoice-exceptions`,
  ]);
  assert.equal(crumbs.itemListElement[0].name, "Inicio");
});

test("Archive structured data lists published posts only, in the displayed language", () => {
  const graph = seo.buildBlogJsonLd("es", [fixture, { ...fixture, slug: "draft", draft: true }])["@graph"];
  const list = graph.find((node) => node["@type"] === "ItemList");
  const blog = graph.find((node) => node["@type"] === "Blog");
  assert.equal(list.numberOfItems, 1);
  assert.deepEqual(list.itemListElement, [{
    "@type": "ListItem", position: 1, name: fixture.title,
    url: `${base}/es/blog/invoice-exceptions`,
  }]);
  assert.equal(blog.inLanguage, "es-MX");
  assert.equal(blog.blogPost.length, 1);
});

test("Site schema describes an organization without inventing a local business address", () => {
  const graph = seo.buildJsonLd("en", "/")["@graph"];
  const org = graph.find((node) => node["@id"] === `${base}/#organization`);
  assert.equal(org["@type"], "Organization");
  assert.equal(org.contactPoint["@type"], "ContactPoint");
  assert.equal(org.address, undefined);
  const privacy = seo.buildJsonLd("en", "/privacy")["@graph"];
  assert.ok(privacy.some((node) => node["@type"] === "WebPage"));
  for (const path of ["/finance-automation", "/healthcare-automation", "/custom-crm", "/custom-erp", "/workflows", "/agents", "/custom-software"])
    assert.ok(seo.buildJsonLd("en", path)["@graph"].some((node) => node["@type"] === "Service"), path);
});

test("Homepage schema lists every service, sharing @ids with the service pages", () => {
  const { SERVICES } = require("../lib/services.ts");
  for (const locale of ["en", "es"]) {
    const prefix = locale === "es" ? "/es" : "";
    const graph = seo.buildJsonLd(locale, prefix || "/")["@graph"];
    const catalog = graph.find((node) => node["@type"] === "OfferCatalog");
    const org = graph.find((node) => node["@type"] === "Organization");
    assert.equal(org.hasOfferCatalog["@id"], catalog["@id"]);
    const offered = catalog.itemListElement.map((offer) => offer.itemOffered);
    assert.deepEqual(offered.map((service) => service.url), SERVICES.map((service) => `${base}${prefix}${service.path}`));
    for (const service of SERVICES) {
      const page = seo.buildJsonLd(locale, `${prefix}${service.path}`)["@graph"].find((node) => node["@type"] === "Service");
      assert.ok(offered.some((node) => node["@id"] === page["@id"]), service.path);
    }
    if (locale === "es") assert.equal(offered[0].name, require("../lib/i18n.ts").translate(SERVICES[0].name, "es"));
  }
  assert.equal(seo.buildJsonLd("en", "/about")["@graph"].find((node) => node["@type"] === "Organization").hasOfferCatalog, undefined);
});

test("robots.txt welcomes AI search crawlers and keeps the API closed to every group", () => {
  const robots = seo.buildRobots();
  const agents = robots.rules.map((rule) => rule.userAgent);
  for (const bot of ["*", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Claude-User", "Googlebot", "Bingbot"])
    assert.ok(agents.includes(bot), bot);
  for (const rule of robots.rules) {
    assert.equal(rule.allow, "/", rule.userAgent);
    assert.equal(rule.disallow, "/api/", rule.userAgent);
  }
  assert.equal(robots.sitemap, `${base}/sitemap.xml`);
});

test("llms.txt links real pages, uses the price constants, and follows the copy rules", () => {
  const { SERVICES } = require("../lib/services.ts");
  const { CRM_PRICE } = require("../lib/crm.ts");
  const { ERP_PRICE } = require("../lib/erp.ts");
  const { CONSULTANCY_PHRASES } = require("../lib/insights.ts");
  const text = seo.buildLlmsTxt();
  assert.match(text, /^# Brilliant AI\n\n> /);
  const sitemapPages = fs.readFileSync("app/sitemap.ts", "utf8");
  const links = [...text.matchAll(/\]\(([^)]+)\)/g)].map(([, href]) => href);
  for (const href of links) {
    assert.ok(href.startsWith(base), href);
    assert.ok(sitemapPages.includes(`"${href.slice(base.length) || "/"}"`), `${href} is a sitemap page`);
  }
  for (const service of SERVICES) assert.ok(links.includes(`${base}${service.path}`), service.path);
  assert.ok(text.includes(`Unlimited users, from $${CRM_PRICE.USD.month}/month`));
  assert.ok(text.includes(`Unlimited users, from $${ERP_PRICE.USD.month}/month`));
  assert.doesNotMatch(text, CONSULTANCY_PHRASES);
  assert.doesNotMatch(text, /\b(open[- ]source|self[- ]host(ed|ing)?|python|next\.?js|react|supabase|vercel|postgres(ql)?|SOC 2|HIPAA|CFDI)\b/i);
  assert.doesNotMatch(text, /Haab Calendar[^.]*\b(client|partner)\b/i);
  assert.ok(text.endsWith("\n"));
});

test("Post frontmatter rejects impossible dates, backwards updates, and empty search titles", () => {
  const raw = (extra) => `---\ntitle: Title\ndescription: Description\ndate: 2026-10-17\n${extra}\n---\nBody.`;
  assert.equal(parsePost(raw('seoTitle: "Short search title"'), "sample", "en").seoTitle, "Short search title");
  assert.throws(() => parsePost(raw('seoTitle: " "'), "sample", "en"), /seoTitle/);
  assert.throws(() => parsePost(raw("updated: 2026-10-16"), "sample", "en"), /updated/);
  assert.throws(() => parsePost(raw("").replace("2026-10-17", "2026-02-30"), "sample", "en"), /date/);
});
