import type { MetadataRoute } from "next";
import { languageAlternatePaths, localePath, type Locale } from "@/lib/locale";
import { getPosts } from "@/lib/posts.server";
import { absoluteUrl } from "@/lib/site";

const pages = [
  "/",
  "/finance-automation",
  "/healthcare-automation",
  "/services",
  "/workflows",
  "/agents",
  "/custom-crm",
  "/custom-erp",
  "/custom-software",
  "/security",
  "/about",
  "/privacy",
  "/blog",
] as const;

function entries(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: Partial<Record<Locale, string>>,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternatePaths(path)).map(([lang, href]) => [
      lang,
      absoluteUrl(href),
    ]),
  );
  return (["en", "es"] as const).map((locale) => ({
    url: absoluteUrl(localePath(locale, path)),
    ...(lastModified?.[locale] && { lastModified: lastModified[locale] }),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Every post ships in both languages (the tests enforce it), so the English
  // list covers both URLs.
  const [english, spanish] = await Promise.all([getPosts("en"), getPosts("es")]);
  const posts = english.filter((post) => !post.draft);
  const translated = new Map(spanish.filter((post) => !post.draft).map((post) => [post.slug, post]));
  const latestUpdate = (items: typeof posts) => items
    .filter((post) => !post.draft)
    .map((post) => post.updated ?? post.date)
    .sort().at(-1);
  const blogUpdated = { en: latestUpdate(posts), es: latestUpdate(spanish) };
  return [
    ...pages.flatMap((path) =>
      entries(
        path,
        path === "/" || path === "/blog" ? "weekly" : "monthly",
        path === "/" ? 1 : path === "/privacy" ? 0.3 : 0.6,
        path === "/blog" ? blogUpdated : undefined,
      ),
    ),
    ...posts.flatMap((post) => {
      const es = translated.get(post.slug);
      return entries(`/blog/${post.slug}`, "monthly", 0.5, {
        en: post.updated ?? post.date,
        es: es ? es.updated ?? es.date : undefined,
      });
    }),
  ];
}
