export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { buildRobots } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return buildRobots();
}
