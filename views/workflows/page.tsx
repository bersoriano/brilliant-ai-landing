import { WorkflowsLanding } from "@/components/sections/WorkflowsLanding";
import { INSIGHTS } from "@/lib/insights";
import type { Locale } from "@/lib/locale";
import { getNoteLinks } from "@/lib/posts.server";

export default async function Workflows() {
  const links = (locale: Locale) => getNoteLinks(
    [INSIGHTS.exceptions, INSIGHTS.approvals, INSIGHTS.measuring],
    locale,
  );
  const notes = { en: await links("en"), es: await links("es") };
  return <WorkflowsLanding notes={notes} />;
}
