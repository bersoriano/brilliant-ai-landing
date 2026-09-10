import spanish from "./es-MX.json";
import type { Locale } from "./locale";
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
    ? "Brilliant AI | Automatización con IA para finanzas y el sector salud"
    : "Brilliant AI | AI Automation for Finance & Healthcare";
}
