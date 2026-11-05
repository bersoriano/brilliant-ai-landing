import { localeFromPathname, stripLocalePrefix } from "./locale";
import { getPosts } from "./posts.server";

export const PAGE_PATHS = ["/", "/finance-automation", "/healthcare-automation", "/services", "/workflows", "/agents", "/custom-crm", "/custom-erp", "/custom-software", "/security", "/about", "/privacy", "/blog"];
export type RouteProps = { params: Promise<{ path?: string[] }> };
export function routeInfo(params: { path?: string[] }) {
  const path = `/${(params.path || []).join("/")}`;
  return { path, locale: localeFromPathname(path), clean: stripLocalePrefix(path) };
}
export async function staticPaths() {
  const paths: string[] = [];
  for (const locale of ["en", "es"] as const) {
    const prefix = locale === "es" ? "/es" : "";
    const posts = await getPosts(locale);
    for (const path of [...PAGE_PATHS, ...posts.map(p => `/blog/${p.slug}`)])
      paths.push(`${prefix}${path === "/" ? "" : path}` || "/");
  }
  return paths;
}
