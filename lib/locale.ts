export type Locale = "en" | "es";
export const LANGUAGE_COOKIE = "brilliant-language";
export const ES_PREFIX = "/es";

/** Spanish-speaking markets we default to Mexican Spanish. Canada and Brazil are not included. */
export const SPANISH_DEFAULT_COUNTRIES = new Set(
  "AR BO CL CO CR CU DO EC GT HN MX NI PA PE PR PY SV UY VE".split(" "),
);

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "es";
}

export function isSpanishPath(pathname: string) {
  return pathname === ES_PREFIX || pathname.startsWith(`${ES_PREFIX}/`);
}

export function localeFromPathname(pathname: string): Locale {
  return isSpanishPath(pathname) ? "es" : "en";
}

export function stripLocalePrefix(pathname: string) {
  if (pathname === ES_PREFIX || pathname === `${ES_PREFIX}/`) return "/";
  if (pathname.startsWith(`${ES_PREFIX}/`)) return pathname.slice(ES_PREFIX.length) || "/";
  return pathname || "/";
}

export function splitHash(path: string) {
  const hashIndex = path.indexOf("#");
  if (hashIndex === -1) return { pathname: path || "/", hash: "" };
  return { pathname: path.slice(0, hashIndex) || "/", hash: path.slice(hashIndex) };
}

export function localePath(locale: Locale, path: string) {
  const { pathname, hash } = splitHash(path);
  const clean = stripLocalePrefix(pathname);
  const localized =
    locale === "es" ? (clean === "/" ? ES_PREFIX : `${ES_PREFIX}${clean}`) : clean;
  return `${localized}${hash}`;
}

export function languageAlternatePaths(unlocalizedPath: string) {
  const path = stripLocalePrefix(splitHash(unlocalizedPath).pathname);
  const en = localePath("en", path);
  const es = localePath("es", path);
  return {
    en,
    "en-US": en,
    "en-CA": en,
    es,
    "es-MX": es,
    "x-default": en,
  };
}

export function htmlLang(locale: Locale) {
  return locale === "es" ? "es-MX" : "en";
}

export function ogLocale(locale: Locale) {
  return locale === "es" ? "es_MX" : "en_US";
}

export function isSearchBot(userAgent: string | null | undefined) {
  return /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|linkedinbot|slackbot|applebot|semrush|ahrefsbot|duckduckbot|bytespider|gptbot|claudebot|ccbot/i.test(
    userAgent || "",
  );
}

export function resolveLocale({
  saved,
  acceptLanguage,
  country,
}: {
  saved?: string;
  acceptLanguage?: string | null;
  country?: string | null;
}): Locale {
  if (isLocale(saved)) return saved;
  if (country && SPANISH_DEFAULT_COUNTRIES.has(country.trim().toUpperCase()))
    return "es";
  const languages = (acceptLanguage || "")
    .split(",")
    .map((entry) => {
      const [tag, ...params] = entry.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        language: tag.split("-")[0],
        quality: q ? Number(q.trim().slice(2)) : 1,
      };
    })
    .filter((l) => l.quality > 0 && l.quality <= 1)
    .sort((a, b) => b.quality - a.quality);
  return languages.find((l) => l.language === "en" || l.language === "es")
    ?.language === "es"
    ? "es"
    : "en";
}
