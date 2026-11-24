import { LANGUAGE_COOKIE, isLocale, localePath, stripLocalePrefix, type Locale } from "../lib/locale";

function languageRedirect(url: URL, locale: Locale) {
  const headers = new Headers({
    Location: url.href,
    "Cache-Control": "private, no-store, max-age=0",
    "Set-Cookie": `${LANGUAGE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${url.protocol === "https:" ? "; Secure" : ""}`,
  });
  return new Response(null, { status: 307, headers });
}

/** Honor explicit legacy language links. Canonical URLs serve their own language. */
export function routeLanguage(request: Request): Response | null {
  const url = new URL(request.url);
  const { pathname } = url;
  if (/^\/(?:api|_next)(?:\/|$)/.test(pathname) || pathname.includes(".")) return null;
  const explicit = url.searchParams.get("lang");
  if (!isLocale(explicit)) return null;
  url.searchParams.delete("lang");
  url.pathname = localePath(explicit, stripLocalePrefix(pathname)).replace(/\/$/, "") || "/";
  return languageRedirect(url, explicit);
}

/** The Pages project's own hostname. Previews live on subdomains of it. */
export const PAGES_HOST = "brilliant-ai.pages.dev";

/**
 * The production pages.dev alias duplicates the custom domain, so it moves
 * there permanently. Preview deployments (<branch|hash>.brilliant-ai.pages.dev)
 * stay reachable for QA but tell crawlers to stay out.
 */
export function hostPolicy(url: URL, canonicalOrigin: string): Response | "noindex" | null {
  if (url.hostname === PAGES_HOST) {
    const target = new URL(url.pathname + url.search, canonicalOrigin);
    // 308 keeps the method, so a stray POST is not turned into a GET.
    return new Response(null, { status: 308, headers: { Location: target.href, "Cache-Control": "public, max-age=3600" } });
  }
  return url.hostname.endsWith(`.${PAGES_HOST}`) ? "noindex" : null;
}

/** Both languages serve the same HTML to every visitor and revalidate on visit. */
export function pageCacheHeaders(): Record<string, string> {
  return { "Cache-Control": "public, max-age=0, must-revalidate" };
}
