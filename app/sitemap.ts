import type { MetadataRoute } from "next";
import { languageAlternatePaths, localePath } from "@/lib/locale";
import { absoluteUrl } from "@/lib/site";

const pages = ["/", "/privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternatePaths(path)).map(([lang, href]) => [
        lang,
        absoluteUrl(href),
      ]),
    );
    const changeFrequency = path === "/" ? "weekly" : "yearly";
    const priority = path === "/" ? 1 : 0.4;
    return (["en", "es"] as const).map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
