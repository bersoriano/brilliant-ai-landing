import { AgentsLanding } from "@/components/sections/AgentsLanding";
import { INSIGHTS } from "@/lib/insights";
import { getRequestLocale } from "@/lib/locale.server";
import { getNoteLinks } from "@/lib/posts.server";

export default async function Agents() {
  const locale = await getRequestLocale();
  const notes = await getNoteLinks([INSIGHTS.agents, INSIGHTS.approvals], locale);
  return <AgentsLanding notes={notes} />;
}
