import spanish from "./es-MX.json";
import type { Locale } from "./locale";

export const HOME_DESCRIPTION =
  "Done-for-you AI automation for finance and healthcare teams in the United States, Canada, and Mexico. Invoice approvals, intake, referrals, and reporting. Start with a 20-minute workflow review.";
export const PRIVACY_DESCRIPTION =
  "How the Brilliant AI website handles contact details, language preference, and calculator inputs.";
export const HOME_KEYWORDS = [
  "AI automation",
  "finance automation",
  "healthcare automation",
  "invoice approvals",
  "patient intake",
  "United States",
  "Canada",
  "Mexico",
];
export const HOME_KEYWORDS_ES = [
  "automatización con IA",
  "automatización financiera",
  "automatización en salud",
  "aprobación de facturas",
  "admisión de pacientes",
  "Estados Unidos",
  "Canadá",
  "México",
];

export function translate(
  source: string,
  locale: Locale,
  variables: Record<string, string | number> = {},
): string {
  const key = source.replace(/\s+/g, " ").trim();
  const translated =
    locale === "es"
      ? ((spanish as Record<string, string>)[key] ?? source)
      : source;
  return translated.replace(/\{(\w+)\}/g, (match, name) =>
    String(variables[name] ?? match),
  );
}
export function pageTitle(locale: Locale, privacy = false) {
  if (privacy)
    return locale === "es"
      ? "Aviso de privacidad del sitio web | Brilliant AI"
      : "Website privacy notice | Brilliant AI";
  return locale === "es"
    ? "Automatización con IA para finanzas y salud | Brilliant AI"
    : "AI Automation for Finance & Healthcare | Brilliant AI";
}
export function pageDescription(locale: Locale, privacy = false) {
  return translate(privacy ? PRIVACY_DESCRIPTION : HOME_DESCRIPTION, locale);
}
export function pageKeywords(locale: Locale) {
  return locale === "es" ? HOME_KEYWORDS_ES : HOME_KEYWORDS;
}
