import type { Locale } from "./locale";
import { translate } from "./i18n";
export type InquiryDetails = {
  name: string;
  email: string;
  industry: string;
  message: string;
  workflowTitle?: string;
};
/** Prepare a localized email draft; the visitor's email app handles delivery. */
export function buildInquiryHref(
  recipient: string,
  details: InquiryDetails,
  locale: Locale = "en",
) {
  const es = locale === "es";
  const industryLabels: Record<string, string> = {
    finance: "Finance",
    healthcare: "Healthcare",
    other: "Another industry",
  };
  const industry = translate(
    industryLabels[details.industry] || details.industry,
    locale,
  );
  const subject = `${es ? "Revisión de procesos" : "Workflow review"} — ${industry}`;
  const body = [
    es ? "Hola, Brilliant AI:" : "Hi Brilliant AI,",
    "",
    es
      ? `Soy ${details.name.trim()}. Me gustaría hablar sobre automatización para nuestro equipo. Sector: ${industry}.`
      : `I'm ${details.name.trim()}. I'd like to discuss automation for our team. Industry: ${industry}.`,
    "",
    `${es ? "Correo de trabajo" : "Work email"}: ${details.email.trim()}`,
    ...(details.workflowTitle
      ? [
          `${es ? "Punto de partida" : "Starting point"}: ${translate(details.workflowTitle, locale)}`,
        ]
      : []),
    "",
    es ? "Sobre nuestro proceso:" : "About our process:",
    details.message.trim() ||
      (es
        ? "Me gustaría explorar el proceso seleccionado con ustedes."
        : "I'd like to explore the selected workflow with you."),
    "",
    es
      ? "Busquemos un horario para una revisión de procesos de 20 minutos."
      : "Let's find a time for a 20-minute workflow review.",
  ].join("\n");
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
