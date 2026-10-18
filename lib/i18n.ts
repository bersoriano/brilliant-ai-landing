import spanish from "./es-MX.json";
import type { Locale } from "./locale";

export const HOME_DESCRIPTION =
  "AI automation for finance and healthcare in the United States, Canada, and Mexico. Invoice approvals, patient intake, referrals, and reporting.";
export const PRIVACY_DESCRIPTION =
  "How the Brilliant AI website handles contact details, language preference, and calculator inputs.";
export const HOME_KEYWORDS = [
  "AI automation",
  "finance automation",
  "healthcare automation",
  "invoice approvals",
  "patient intake",
  "custom CRM",
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
  "CRM a la medida",
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
export const SECURITY_DESCRIPTION =
  "How Brilliant AI handles financial and patient data: scoped access, human approval gates, your agreements, and your data-residency requirements.";
export const ABOUT_DESCRIPTION =
  "Brilliant AI builds and runs AI workflows for finance and healthcare operations teams in the United States, Canada, and Mexico.";
export const FINANCE_DESCRIPTION =
  "Managed AI workflow automation for finance teams: prepare invoices, track month-end close, and surface missing documents for human approval.";
export const HEALTHCARE_DESCRIPTION =
  "Managed AI workflow automation for healthcare administration: route referrals, prepare intake, and follow up on billing issues while clinical decisions stay with your team.";

export const CRM_DESCRIPTION =
  "Custom CRM implementation on a proven open-source foundation: contacts, deals, tasks, and an assistant you can talk to. Unlimited users on the base plan.";

export const BLOG_DESCRIPTION =
  "Practical guides to AI automation, invoice approvals, healthcare workflows, custom CRM, ERP, and measuring ROI. Keep decisions with your team.";

export type PageKey =
  | "home"
  | "privacy"
  | "security"
  | "about"
  | "finance"
  | "healthcare"
  | "crm"
  | "blog"
  | "post";
const TITLES: Record<PageKey, [en: string, es: string]> = {
  home: [
    "AI Automation for Finance & Healthcare | Brilliant AI",
    "Automatización con IA para finanzas y salud | Brilliant AI",
  ],
  privacy: [
    "Website privacy notice | Brilliant AI",
    "Aviso de privacidad del sitio web | Brilliant AI",
  ],
  security: [
    "Security and data handling | Brilliant AI",
    "Seguridad y manejo de datos | Brilliant AI",
  ],
  about: ["About | Brilliant AI", "Quiénes somos | Brilliant AI"],
  finance: [
    "Finance Workflow Automation | Brilliant AI",
    "Automatización de procesos de finanzas | Brilliant AI",
  ],
  healthcare: [
    "Healthcare Workflow Automation | Brilliant AI",
    "Automatización de procesos de salud | Brilliant AI",
  ],
  crm: [
    "Custom CRM Implementation | Brilliant AI",
    "Implementación de CRM a la medida | Brilliant AI",
  ],
  blog: ["AI Automation, CRM & ERP Blog | Brilliant AI", "Blog de automatización con IA, CRM y ERP | Brilliant AI"],
  // Fallback only: each post sets its own title in generateMetadata.
  post: ["Blog | Brilliant AI", "Blog | Brilliant AI"],
};
const DESCRIPTIONS: Record<PageKey, string> = {
  home: HOME_DESCRIPTION,
  privacy: PRIVACY_DESCRIPTION,
  security: SECURITY_DESCRIPTION,
  about: ABOUT_DESCRIPTION,
  finance: FINANCE_DESCRIPTION,
  healthcare: HEALTHCARE_DESCRIPTION,
  crm: CRM_DESCRIPTION,
  blog: BLOG_DESCRIPTION,
  post: BLOG_DESCRIPTION,
};
/** `true` is accepted for the privacy page (the original boolean signature). */
const pageKey = (page: PageKey | boolean) =>
  page === true ? "privacy" : page === false ? "home" : page;
export function pageTitle(locale: Locale, page: PageKey | boolean = "home") {
  return TITLES[pageKey(page)][locale === "es" ? 1 : 0];
}
export function pageDescription(
  locale: Locale,
  page: PageKey | boolean = "home",
) {
  return translate(DESCRIPTIONS[pageKey(page)], locale);
}
export function pageKeywords(locale: Locale) {
  return locale === "es" ? HOME_KEYWORDS_ES : HOME_KEYWORDS;
}
