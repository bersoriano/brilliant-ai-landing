// Run against a production build: npm run verify:seo -- http://127.0.0.1:3100
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { parse } = require("yaml");

const origin = (process.argv[2] || "http://127.0.0.1:3100").replace(/\/$/, "");
const isPreview = new URL(origin).hostname.endsWith(".brilliant-ai.pages.dev");
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attributes = (tag) => Object.fromEntries(
  [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)]),
);
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map(([tag]) => attributes(tag));
const documentHead = (html) => html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || "";
const canonical = (html) => tags(documentHead(html), "link").find((tag) => tag.rel === "canonical")?.href;
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap(([, raw]) => { const data = JSON.parse(raw); return data["@graph"] || [data]; });
const published = fs.readdirSync("content/posts", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const raw = fs.readFileSync(`content/posts/${entry.name}/en.mdx`, "utf8");
    return { slug: entry.name, ...parse(raw.match(/^---\n([\s\S]*?)\n---/)[1]) };
  }).filter((post) => !post.draft);
const staticPaths = ["", "/finance-automation", "/healthcare-automation", "/services", "/workflows", "/agents", "/custom-crm", "/custom-erp", "/custom-software", "/security", "/about", "/privacy", "/blog"];
const paths = ["", "/es"].flatMap((prefix) => [
  ...staticPaths.map((path) => `${prefix}${path}` || "/"),
  ...published.map((post) => `${prefix}/blog/${post.slug}`),
]);
const botHeaders = { "user-agent": "Googlebot", "accept-language": "es-MX,es;q=0.9", cookie: "brilliant-language=es" };

async function request(path, options = {}) {
  return fetch(`${origin}${path}`, { headers: botHeaders, redirect: "manual", ...options, signal: AbortSignal.timeout(30000) });
}

async function verify() {
  const homepage = await request("/");
  assert.equal(homepage.status, 200, "English homepage must stay accessible to crawlers with Spanish preferences");
  const canonicalOrigin = new URL(canonical(await homepage.text())).origin;
  const urlFor = (path) => `${canonicalOrigin}${path === "/" ? "" : path}`;
  const documents = new Map();
  const titles = new Set();
  const descriptions = new Set();
  const shareImages = new Map();

  // Check the initial HTML, before any browser JavaScript runs.
  for (const path of paths) {
    const response = await request(path);
    assert.equal(response.status, 200, `${path}: crawler HTTP status`);
    if (!isPreview) assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /\bnoindex\b/i, `${path}: indexable response`);
    const html = await response.text();
    documents.set(path, html);
    const head = documentHead(html);
    const title = decode(head.match(/<title>(.*?)<\/title>/)?.[1] || "");
    const meta = tags(head, "meta");
    const description = meta.find((tag) => tag.name === "description")?.content;
    assert.ok(title && description, `${path}: title and description in initial head`);
    // The English and Spanish archive names must be distinct too.
    assert.ok(!titles.has(title), `${path}: duplicate title ${title}`);
    assert.ok(!descriptions.has(description), `${path}: duplicate description`);
    titles.add(title);
    descriptions.add(description);
    assert.equal(canonical(html), urlFor(path), `${path}: canonical`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one h1`);
    assert.ok(!meta.some((tag) => /robots|googlebot/.test(tag.name) && /noindex/.test(tag.content)), `${path}: indexable`);
    assert.match(html, path.startsWith("/es") ? /<html[^>]+lang="es-MX"/ : /<html[^>]+lang="en"/, `${path}: document language`);
    const cleanPath = path.replace(/^\/es(?=\/|$)/, "") || "/";
    if (cleanPath === "/" || cleanPath === "/blog" || cleanPath === `/blog/${published[0]?.slug}`) {
      const visitor = await request(path, { headers: { ...botHeaders, "user-agent": "Mozilla/5.0", "accept-language": path.startsWith("/es") ? "en-US" : "es-MX", cookie: `brilliant-language=${path.startsWith("/es") ? "en" : "es"}` } });
      assert.equal(visitor.status, 200, `${path}: URL language holds for visitors with a different preference`);
      await visitor.body?.cancel();
    }
    if (cleanPath === "/") {
      assert.match(html, path === "/" ? /<h1\b[^>]*>AI automation for finance and healthcare<\/h1>/i : /<h1\b[^>]*>Automatización con IA para finanzas y salud<\/h1>/i, `${path}: descriptive homepage heading`);
      assert.ok(tags(html, "img").some(({ fetchPriority, fetchpriority, src }) => (fetchpriority ?? fetchPriority) === "high" && src === "/hero-threshold.jpg"), `${path}: hero still prioritized in HTML`);
      assert.equal(tags(html, "video").length, 0, `${path}: no startup hero video`);
    }
    const languageLinks = tags(html, "a");
    assert.ok(languageLinks.some((tag) => (tag.hreflang ?? tag.hrefLang) === "en" && tag.href === cleanPath), `${path}: English language link in initial HTML`);
    assert.ok(languageLinks.some((tag) => (tag.hreflang ?? tag.hrefLang) === "es-MX" && tag.href === (cleanPath === "/" ? "/es" : `/es${cleanPath}`)), `${path}: Spanish language link in initial HTML`);
    const alternates = tags(head, "link").filter((tag) => tag.rel === "alternate" && tag.hrefLang);
    for (const [language, expected] of [["en", urlFor(cleanPath)], ["es-MX", urlFor(`/es${cleanPath === "/" ? "" : cleanPath}`)], ["x-default", urlFor(cleanPath)]])
      assert.equal(alternates.find((tag) => tag.hrefLang === language)?.href, expected, `${path}: ${language} alternate`);
    // Every page shares its own prebuilt image, in its own language.
    const ogImage = meta.find((tag) => tag.property === "og:image")?.content;
    assert.ok(ogImage?.startsWith(`${canonicalOrigin}/social/${path.startsWith("/es") ? "es" : "en"}/`), `${path}: localized share image`);
    assert.ok(![...shareImages.values()].includes(ogImage), `${path}: share image reused from another page`);
    shareImages.set(path, ogImage);
    const graph = jsonLd(html);
    assert.ok(graph.some((node) => node["@type"] === "Organization"), `${path}: organization schema`);
    const slug = cleanPath.match(/^\/blog\/([^/]+)$/)?.[1];
    if (slug) {
      const article = graph.find((node) => node["@type"] === "BlogPosting");
      assert.equal(article?.url, urlFor(path), `${path}: article schema`);
      assert.ok(article.author.name && article.author.url, `${path}: identified author`);
      assert.ok(tags(html, "time").some((tag) => tag.dateTime === article.datePublished), `${path}: visible publication date`);
      assert.ok(graph.some((node) => node["@type"] === "BreadcrumbList"), `${path}: breadcrumbs`);
      const image = meta.find((tag) => tag.property === "og:image")?.content;
      assert.equal(image, `${canonicalOrigin}/social/${path.startsWith("/es") ? "es" : "en"}/${slug}.png`, `${path}: article-specific image`);
      const prose = html.match(/<div\b[^>]*data-analytics-article[^>]*>[\s\S]*?<\/article>/)?.[0] || "";
      const sections = tags(prose, "h[23]").filter((tag) => tag.id?.startsWith("section-"));
      assert.ok(sections.length > 0 && sections.every(({ id }) => tags(prose, "a").some(({ href }) => href === `#${id}`)), `${path}: shareable article sections`);
      if (slug === "from-open-banking-to-agentic-banking") {
        assert.ok(tags(prose, "table").length > 0, `${path}: Amex comparison is a table`);
        assert.ok(tags(prose, "a").some(({ href }) => href === "https://www.americanexpress.com/us/legal-disclosures/website-rules-and-regulations.html"), `${path}: Amex terms citation`);
      }
    }
    if (cleanPath === "/blog") {
      const list = graph.find((node) => node["@type"] === "ItemList");
      assert.equal(list?.numberOfItems, published.length, `${path}: all published posts listed`);
    }
  }

  for (const path of paths) {
    const payload = await request(path === "/" ? "/index.txt" : `${path}.txt`, { method: "HEAD" });
    assert.equal(payload.status, 200, `${path}: Next.js payload remains available`);
    assert.match(payload.headers.get("x-robots-tag") || "", /\bnoindex\b/i, `${path}: Next.js payload must be noindex`);
  }
  for (const path of ["/robots.txt", "/llms.txt"]) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    if (!isPreview) {
      assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /\bnoindex\b/i, `${path}: public crawler resource`);
    }
  }

  for (const [path, image] of shareImages) {
    const response = await request(new URL(image).pathname, { method: "HEAD" });
    assert.equal(response.status, 200, `${path}: share image ${image}`);
    assert.match(response.headers.get("content-type") || "", /^image\/png/, `${path}: share image type`);
  }

  // Check navigation and content links, including fragment targets.
  let checkedLinks = 0;
  for (const [path, html] of documents) {
    const sectionsWithAlternates = tags(html, "h[2-6]").filter((tag) => tag["data-alternate-section"]);
    if (sectionsWithAlternates.length) {
      const alternatePath = path.startsWith("/es/") ? path.slice(3) : `/es${path}`;
      const alternateHeadings = tags(documents.get(alternatePath), "h[2-6]");
      for (const section of sectionsWithAlternates) {
        assert.ok(alternateHeadings.some((tag) => tag.id === section["data-alternate-section"] && tag["data-alternate-section"] === section.id), `${path}: section ${section.id} has a reciprocal translated target`);
      }
    }
    for (const { href } of tags(html, "a")) {
      if (!href || !href.startsWith("/") && !href.startsWith("#")) continue;
      const url = new URL(href, `${origin}${path}`);
      if (url.origin !== origin || url.search) continue;
      // Files such as the demo video's download fallback are assets, not pages.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) continue;
      const target = url.pathname.replace(/\/$/, "") || "/";
      assert.ok(documents.has(target), `${path}: unknown internal target ${href}`);
      if (url.hash) {
        const ids = new Set(tags(documents.get(target), "[a-z][a-z0-9]*").map((tag) => tag.id).filter(Boolean));
        assert.ok(ids.has(decodeURIComponent(url.hash.slice(1))), `${path}: missing fragment ${href}`);
      }
      checkedLinks++;
    }
  }

  const sitemap = await (await request("/sitemap.xml")).text();
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, value]) => decode(value));
  assert.deepEqual(new Set(locations), new Set(paths.map(urlFor)), "sitemap contains every canonical page and no drafts or aliases");
  assert.doesNotMatch(sitemap, /example-post|\/post(?:[</]|$)/, "drafts and nonexistent post paths stay out of sitemap");
  const robots = await (await request("/robots.txt")).text();
  assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), "robots advertises canonical sitemap");
  assert.ok(robots.includes("Disallow: /api/"), "API is excluded from crawling");

  for (const prefix of ["", "/es"]) {
    for (const suffix of ["", ...published.map((post) => `/${post.slug}`)]) {
      const path = `${prefix}/post${suffix}?utm_source=seo-check`;
      const response = await request(path);
      assert.equal(response.status, 404, `${path}: nonexistent route`);
      assert.equal(response.headers.get("location"), null, `${path}: no redirect`);
    }
    for (const post of published) {
      const response = await request(`${prefix}/og?post=${post.slug}`);
      assert.equal(response.status, 200, `${post.slug}: image status`);
      assert.match(response.headers.get("content-type"), /image\/png/, `${post.slug}: PNG`);
      const png = Buffer.from(await response.arrayBuffer());
      assert.equal(png.readUInt32BE(16), 1200, `${post.slug}: image width`);
      assert.equal(png.readUInt32BE(20), 630, `${post.slug}: image height`);
    }
    for (const slug of ["example-post", "missing-seo-check"]) {
      const response = await request(`${prefix}/blog/${slug}`);
      assert.equal(response.status, 404, `${prefix}/${slug}: drafts and missing posts return 404`);
      assert.match(await response.text(), /name="robots" content="noindex"/, `${slug}: noindex on 404`);
      assert.equal((await request(`${prefix}/og?post=${slug}`)).status, 404, `${slug}: image does not expose unpublished content`);
    }
  }
  console.log(`SEO checks passed: ${paths.length} pages and noindex payloads, ${published.length} posts in both languages, ${checkedLinks} internal links, ${published.length * 2} article image URLs, ${shareImages.size} share images, sitemap, robots, nonexistent /post routes, and 404s.`);
}

verify().catch((error) => { console.error(error); process.exitCode = 1; });
