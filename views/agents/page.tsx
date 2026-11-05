import { AgentsLanding } from "@/components/sections/AgentsLanding";
import { INSIGHTS } from "@/lib/insights";
import type { Locale } from "@/lib/locale";
import { getNoteLinks } from "@/lib/posts.server";

export default async function Agents() {
  const links = (locale: Locale) => getNoteLinks([INSIGHTS.agents, INSIGHTS.approvals], locale);
  const notes = { en: await links("en"), es: await links("es") };
  return <AgentsLanding notes={notes} />;
}
