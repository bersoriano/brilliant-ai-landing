import { mkdir, writeFile, rm } from "node:fs/promises";
import { staticPaths } from "../lib/routes.server";
import { getPosts } from "../lib/posts.server";
import { renderSocialImage } from "./social-image";

async function main() {
  await mkdir(".cloudflare", { recursive: true });
  await rm("public/social", { force: true, recursive: true });
  const slugs: Record<string, string[]> = {};
  for (const locale of ["en", "es"] as const) {
    const posts = await getPosts(locale);
    slugs[locale] = posts.map(p => p.slug);
    await mkdir(`public/social/${locale}`, { recursive: true });
    for (const post of [null, ...posts]) {
      const response = await renderSocialImage(locale, post);
      await writeFile(`public/social/${locale}/${post?.slug || "home"}.png`, Buffer.from(await response.arrayBuffer()));
    }
  }
  await writeFile(".cloudflare/manifest.json", JSON.stringify({ paths: await staticPaths(), slugs }, null, 2));
  console.log(`Generated ${Object.values(slugs).flat().length + 2} social images.`);

}
main().catch(error => { console.error(error); process.exitCode = 1; });
