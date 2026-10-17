import type { MetadataRoute } from "next";
import { languageAlternatePaths, localePath } from "@/lib/locale";
import { getPosts } from "@/lib/posts.server";
import { absoluteUrl } from "@/lib/site";

const pages = [
  "/",
  "/finance-automation",
  "/healthcare-automation",
  "/custom-crm",
  "/security",
  "/about",
  "/privacy",
  "/blog",
] as const;

function entries(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: string,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternatePaths(path)).map(([lang, href]) => [
      lang,
      absoluteUrl(href),
    ]),
  );
  return (["en", "es"] as const).map((locale) => ({
    url: absoluteUrl(localePath(locale, path)),
    ...(lastModified && { lastModified }),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Every post ships in both languages (the tests enforce it), so the English
  // list covers both URLs.
  const posts = await getPosts("en");
  return [
    ...pages.flatMap((path) =>
      entries(
        path,
        path === "/" || path === "/blog" ? "weekly" : "monthly",
        path === "/" ? 1 : path === "/privacy" ? 0.3 : 0.6,
      ),
    ),
    ...posts.flatMap((post) =>
      entries(`/blog/${post.slug}`, "yearly", 0.5, post.updated ?? post.date),
    ),
  ];
}
