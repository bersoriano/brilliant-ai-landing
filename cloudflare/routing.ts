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
