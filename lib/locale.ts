export type Locale = "en" | "es";
export const LANGUAGE_COOKIE = "brilliant-language";
export const AMERICAS_EXCEPT_US = new Set(
  "AG AI AR AW BB BL BM BO BQ BR BS BZ CA CL CO CR CU CW DM DO EC FK GD GF GL GP GT GY HN HT JM KN KY LC MF MQ MS MX NI PA PE PM PR PY SR SV SX TC TT UY VC VE VG VI".split(
    " ",
  ),
);
export function resolveLocale({
  saved,
  acceptLanguage,
  country,
}: {
  saved?: string;
  acceptLanguage?: string | null;
  country?: string | null;
}): Locale {
  if (saved === "en" || saved === "es") return saved;
  if (country && AMERICAS_EXCEPT_US.has(country.trim().toUpperCase()))
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
