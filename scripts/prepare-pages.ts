import { mkdir, writeFile, rm } from "node:fs/promises";
import { PAGE_PATHS, staticPaths } from "../lib/routes.server";
import { getPosts } from "../lib/posts.server";
import { pageTitle, translate } from "../lib/i18n";
import { localePath, pageFromPath, socialImagePath } from "../lib/locale";
import { SITE_DOMAIN, SITE_NAME } from "../lib/site";
import { renderCard, renderSocialImage } from "./social-image";

async function main() {
  await mkdir(".cloudflare", { recursive: true });
  await rm("public/social", { force: true, recursive: true });
  const slugs: Record<string, string[]> = {};
  let images = 0;
  for (const locale of ["en", "es"] as const) {
    const posts = await getPosts(locale);
    slugs[locale] = posts.map(p => p.slug);
    await mkdir(`public/social/${locale}`, { recursive: true });
    for (const post of [null, ...posts]) {
      const response = await renderSocialImage(locale, post);
      await writeFile(`public/social/${locale}/${post?.slug || "home"}.png`, Buffer.from(await response.arrayBuffer()));
    }
    // Every other page shares with its own title instead of the homepage card.
    for (const path of PAGE_PATHS.filter((path) => path !== "/")) {
      const page = pageFromPath(path);
      const response = await renderCard({
        kicker: page === "blog" ? translate("Blog", locale) : translate("AI automation for finance and healthcare", locale),
        title: pageTitle(locale, page).replace(` | ${SITE_NAME}`, ""),
        footer: `${SITE_DOMAIN}${localePath(locale, path)}`,
      });
      await writeFile(`public${socialImagePath(locale, path)}`, Buffer.from(await response.arrayBuffer()));
      images++;
    }
  }
  await writeFile(".cloudflare/manifest.json", JSON.stringify({ paths: await staticPaths(), slugs }, null, 2));
  console.log(`Generated ${Object.values(slugs).flat().length + 2 + images} social images.`);

}
main().catch(error => { console.error(error); process.exitCode = 1; });
