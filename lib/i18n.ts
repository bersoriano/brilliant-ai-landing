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

export const WORKFLOWS_DESCRIPTION =
  "AI workflow automation for invoices, referrals, and month-end: one reliable process per task, checked against your rules, with every exception sent to a person you name.";
export const AGENTS_DESCRIPTION =
  "AI agents that find, draft, and follow up inside the tools your team already uses, with the same permissions as the person asking. Your team approves what goes out.";
export const ERP_DESCRIPTION =
  "Custom ERP implementation: sales, inventory, purchasing, invoice matching, and accounting in one system, shaped to your operations. Unlimited users on the base plan.";
export const SOFTWARE_DESCRIPTION =
  "Custom software for the job nothing off the shelf does: built around your process, priced by project, and kept running by us. See Haab Calendar, our own booking app.";
export const SERVICES_DESCRIPTION =
  "Brilliant AI services: workflow automations, AI agents, a custom CRM, a custom ERP, and custom software for finance and healthcare teams. Your team keeps every approval.";

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
  | "erp"
  | "workflows"
  | "agents"
  | "software"
  | "services"
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
  erp: [
    "Custom ERP Implementation | Brilliant AI",
    "Implementación de ERP a la medida | Brilliant AI",
  ],
  workflows: [
    "AI Workflow Automation | Brilliant AI",
    "Automatización de procesos con IA | Brilliant AI",
  ],
  agents: [
    "AI Agents for Your Team | Brilliant AI",
    "Agentes de IA para tu equipo | Brilliant AI",
  ],
  software: [
    "Custom Software Development | Brilliant AI",
    "Desarrollo de software a la medida | Brilliant AI",
  ],
  services: [
    "Services: Workflows, Agents, CRM, ERP & Software | Brilliant AI",
    "Servicios: procesos, agentes, CRM, ERP y software | Brilliant AI",
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
  erp: ERP_DESCRIPTION,
  workflows: WORKFLOWS_DESCRIPTION,
  agents: AGENTS_DESCRIPTION,
  software: SOFTWARE_DESCRIPTION,
  services: SERVICES_DESCRIPTION,
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
