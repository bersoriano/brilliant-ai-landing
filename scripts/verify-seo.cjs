// Run against a production build: npm run verify:seo -- http://127.0.0.1:3100
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { parse } = require("yaml");

const origin = (process.argv[2] || "http://127.0.0.1:3100").replace(/\/$/, "");
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

  // Check the initial HTML, before any browser JavaScript runs.
  for (const path of paths) {
    const response = await request(path);
    assert.equal(response.status, 200, `${path}: crawler HTTP status`);
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
    const alternates = tags(head, "link").filter((tag) => tag.rel === "alternate" && tag.hrefLang);
    for (const [language, expected] of [["en", urlFor(cleanPath)], ["es-MX", urlFor(`/es${cleanPath === "/" ? "" : cleanPath}`)], ["x-default", urlFor(cleanPath)]])
      assert.equal(alternates.find((tag) => tag.hrefLang === language)?.href, expected, `${path}: ${language} alternate`);
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
      assert.equal(image, `${canonicalOrigin}${path.startsWith("/es") ? "/es" : ""}/og?post=${slug}`, `${path}: article-specific image`);
    }
    if (cleanPath === "/blog") {
      const list = graph.find((node) => node["@type"] === "ItemList");
      assert.equal(list?.numberOfItems, published.length, `${path}: all published posts listed`);
    }
  }

  // Check navigation and content links, including fragment targets.
  let checkedLinks = 0;
  for (const [path, html] of documents) {
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
  console.log(`SEO checks passed: ${paths.length} pages, ${published.length} posts in both languages, ${checkedLinks} internal links, 14 article images, sitemap, robots, nonexistent /post routes, and 404s.`);
}

verify().catch((error) => { console.error(error); process.exitCode = 1; });
