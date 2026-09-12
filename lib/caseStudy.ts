/**
 * ============================ READ THIS FIRST ============================
 * The figures below are PLACEHOLDERS. They are not real client results.
 *
 * While `approved` is false this section renders in development only, so
 * placeholder numbers cannot reach production. To publish:
 *   1. Replace every field with figures you can substantiate.
 *   2. Confirm the client is comfortable with the wording and the level of
 *      identification (`client` is a descriptor, not a company name — keep it
 *      that way unless you have written permission to name them).
 *   3. Replace the Spanish copy with a real translation.
 *   4. Set `approved: true`.
 * ========================================================================
 */
import type { Locale } from "./locale";

export type CaseStudyCopy = {
  /** Sector descriptor shown as an eyebrow, e.g. "Finance operations". */
  sector: string;
  /** Anonymous client descriptor, e.g. "A 40-person accounting practice". */
  client: string;
  /** The workflow that was automated. */
  workflow: string;
  /** The single number that carries the story. */
  headline: { value: string; label: string };
  /** Two or three supporting figures. */
  metrics: { value: string; label: string }[];
  before: string;
  after: string;
  quote: { text: string; attribution: string } | null;
};

export type CaseStudyData = {
  /** Must be true, with substantiated figures, before this reaches production. */
  approved: boolean;
  en: CaseStudyCopy;
  es: CaseStudyCopy;
};

export const CASE_STUDY: CaseStudyData = {
  approved: false,
  en: {
    sector: "Finance operations",
    client: "A 40-person accounting practice",
    workflow: "Preparing supplier invoices for approval",
    headline: {
      value: "6 hrs → 40 min",
      label: "Weekly time spent preparing invoices for approval",
    },
    metrics: [
      { value: "3 weeks", label: "From first review to live workflow" },
      { value: "100%", label: "Invoices still approved by a person" },
      { value: "2 people", label: "Freed for client work" },
    ],
    before:
      "Two team members worked a shared inbox, opened each invoice, matched it to a purchase order by hand, and chased the differences over email. Month-end ran late whenever volume spiked.",
    after:
      "Invoices arrive, get checked against the purchase order, and land in one approval request with the supporting documents and any mismatches already flagged. The approver still signs off on every entry.",
    quote: {
      text: "The work didn’t disappear — it arrives finished. We approve instead of assembling.",
      attribution: "Finance lead",
    },
  },
  es: {
    sector: "Operaciones financieras",
    client: "Un despacho contable de 40 personas",
    workflow: "Preparar facturas de proveedores para aprobación",
    headline: {
      value: "6 h → 40 min",
      label: "Tiempo semanal para preparar facturas para aprobación",
    },
    metrics: [
      { value: "3 semanas", label: "De la primera revisión al proceso en operación" },
      { value: "100%", label: "Facturas que sigue aprobando una persona" },
      { value: "2 personas", label: "Liberadas para atender clientes" },
    ],
    before:
      "Dos personas del equipo trabajaban una bandeja compartida, abrían cada factura, la conciliaban a mano con la orden de compra y perseguían las diferencias por correo. El cierre de mes se retrasaba cuando subía el volumen.",
    after:
      "Las facturas llegan, se verifican contra la orden de compra y aparecen en una sola solicitud de aprobación, con los documentos de soporte y las diferencias ya señaladas. Quien aprueba sigue autorizando cada registro.",
    quote: {
      text: "El trabajo no desapareció: llega terminado. Aprobamos en lugar de armar.",
      attribution: "Responsable de finanzas",
    },
  },
};

export function caseStudyCopy(locale: Locale): CaseStudyCopy {
  return locale === "es" ? CASE_STUDY.es : CASE_STUDY.en;
}

/** Placeholder figures must never reach a production build. */
export function shouldRenderCaseStudy(isProduction: boolean) {
  return CASE_STUDY.approved || !isProduction;
}
