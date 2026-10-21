import { WorkflowsLanding } from "@/components/sections/WorkflowsLanding";
import { INSIGHTS } from "@/lib/insights";
import { getRequestLocale } from "@/lib/locale.server";
import { getNoteLinks } from "@/lib/posts.server";

export default async function Workflows() {
  const locale = await getRequestLocale();
  const notes = await getNoteLinks(
    [INSIGHTS.exceptions, INSIGHTS.approvals, INSIGHTS.measuring],
    locale,
  );
  return <WorkflowsLanding notes={notes} />;
}
