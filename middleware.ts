import { NextResponse, type NextRequest } from "next/server";
import {
  LANGUAGE_COOKIE,
  isSearchBot,
  isSpanishPath,
  localeFromPathname,
  localePath,
  resolveLocale,
  stripLocalePrefix,
} from "./lib/locale";

const LOCALE_PATH_HEADER = "x-brilliant-path";
const LOCALE_HEADER = "x-brilliant-lang";

function geoCountry(request: NextRequest) {
  const configured = process.env.GEO_COUNTRY_HEADER?.toLowerCase();
  const allowed = [
    "cf-ipcountry",
    "cloudfront-viewer-country",
    "x-vercel-ip-country",
  ];
  const geoHeader =
    configured && allowed.includes(configured)
      ? configured
      : process.env.VERCEL === "1"
        ? "x-vercel-ip-country"
        : null;
  return geoHeader ? request.headers.get(geoHeader) : null;
}

function withLocaleHeaders(request: NextRequest, pathname: string) {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_PATH_HEADER, pathname);
  headers.set(LOCALE_HEADER, localeFromPathname(pathname));
  return headers;
}

function persistLocaleCookie(
  response: NextResponse,
  locale: "en" | "es",
  request: NextRequest,
) {
  response.cookies.set(LANGUAGE_COOKIE, locale, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
  });
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const explicit = request.nextUrl.searchParams.get("lang");
  if (explicit === "en" || explicit === "es") {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    url.pathname = localePath(explicit, stripLocalePrefix(pathname));
    const redirect = NextResponse.redirect(url);
    persistLocaleCookie(redirect, explicit, request);
    return redirect;
  }

  const cookie = request.cookies.get(LANGUAGE_COOKIE)?.value;
  const bot = isSearchBot(request.headers.get("user-agent"));
  const skipPreferenceRedirect =
    bot ||
    isSpanishPath(pathname) ||
    /(?:^|\/)(og|opengraph-image|twitter-image|apple-icon|icon)$/.test(
      pathname,
    );

  if (!skipPreferenceRedirect) {
    const preferred = resolveLocale({
      saved: cookie,
      acceptLanguage: request.headers.get("accept-language"),
      country: geoCountry(request),
    });
    if (preferred === "es") {
      const url = request.nextUrl.clone();
      url.pathname = localePath("es", pathname);
      const redirect = NextResponse.redirect(url);
      if (cookie !== "es") persistLocaleCookie(redirect, "es", request);
      return redirect;
    }
  }

  const locale = localeFromPathname(pathname);

  const headers = withLocaleHeaders(request, pathname);
  if (locale === "es") {
    const url = request.nextUrl.clone();
    url.pathname = stripLocalePrefix(pathname);
    url.search = search;
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
