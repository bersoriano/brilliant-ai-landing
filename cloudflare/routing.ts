import { LANGUAGE_COOKIE, isSpanishPath, isSearchBot, localePath, resolveLocale, stripLocalePrefix, type Locale } from "../lib/locale";

export function personalizedRedirect(url: URL, locale?: Locale) {
  const headers = new Headers({
    Location: url.href,
    "Cache-Control": "private, no-store, max-age=0",
    Vary: "Cookie, Accept-Language, User-Agent",
  });
  if (locale) headers.set("Set-Cookie", `${LANGUAGE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${url.protocol === "https:" ? "; Secure" : ""}`);
  return new Response(null, { status: 307, headers });
}

/** Country is supplied exclusively from request.cf, never visitor headers. */
export function routeLanguage(request: Request, country?: string | null): Response | null {
  const url = new URL(request.url);
  const { pathname } = url;
  if (/^\/(?:api|_next)(?:\/|$)/.test(pathname) || pathname.includes(".")) return null;
  const explicit = url.searchParams.get("lang");
  if (explicit === "en" || explicit === "es") {
    url.searchParams.delete("lang");
    url.pathname = localePath(explicit, stripLocalePrefix(pathname)).replace(/\/$/, "") || "/";
    return personalizedRedirect(url, explicit);
  }
  if (isSpanishPath(pathname) || isSearchBot(request.headers.get("user-agent")) || /(?:^|\/)(og|opengraph-image|twitter-image|apple-icon|icon)\/?$/.test(pathname)) return null;
  const saved = request.headers.get("cookie")?.split(";").map(c => c.trim()).find(c => c.startsWith(`${LANGUAGE_COOKIE}=`))?.slice(LANGUAGE_COOKIE.length + 1);
  if (resolveLocale({ saved, country, acceptLanguage: request.headers.get("accept-language") }) !== "es") return null;
  url.pathname = localePath("es", pathname).replace(/\/$/, "");
  return personalizedRedirect(url, saved === "es" ? undefined : "es");
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

/**
 * HTML caching. Every request still reaches this Function (so language
 * preferences are evaluated each time), but no-store would also disable the
 * browser's back/forward cache. English pages may redirect a visitor to /es,
 * so browsers revalidate them on every request and shared caches never keep
 * them. Spanish pages never redirect: they are the same for everyone.
 */
export function pageCacheHeaders(pathname: string): Record<string, string> {
  return isSpanishPath(pathname)
    ? { "Cache-Control": "public, max-age=0, must-revalidate" }
    : { "Cache-Control": "private, no-cache", Vary: "Cookie, Accept-Language, User-Agent" };
}
