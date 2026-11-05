"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { JsonLd } from "./JsonLd";

/** Initial HTML and in-place language changes use the same build-time graph. */
export function LocalizedJsonLd({ graphs }: { graphs: Record<"en" | "es", unknown> }) {
  const { locale } = useLanguage();
  return <JsonLd data={graphs[locale]} />;
}
