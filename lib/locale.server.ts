import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import {
  LANGUAGE_COOKIE,
  isLocale,
  localeFromPathname,
  resolveLocale,
} from "./locale";

export const LOCALE_PATH_HEADER = "x-brilliant-path";
export const LOCALE_HEADER = "x-brilliant-lang";

export function geoCountryFromHeaders(requestHeaders: Headers) {
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
  return geoHeader ? requestHeaders.get(geoHeader) : null;
}

export const getRequestPath = cache(async () => {
  const requestHeaders = await headers();
  return requestHeaders.get(LOCALE_PATH_HEADER) || "/";
});

export const getRequestLocale = cache(async () => {
  const [requestHeaders, cookieStore] = await Promise.all([
    headers(),
    cookies(),
  ]);
  const fromHeader = requestHeaders.get(LOCALE_HEADER);
  if (isLocale(fromHeader)) return fromHeader;
  const path = requestHeaders.get(LOCALE_PATH_HEADER);
  if (path) return localeFromPathname(path);
  return resolveLocale({
    saved: cookieStore.get(LANGUAGE_COOKIE)?.value,
    acceptLanguage: requestHeaders.get("accept-language"),
    country: geoCountryFromHeaders(requestHeaders),
  });
});
