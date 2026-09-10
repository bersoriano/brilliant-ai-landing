import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { LANGUAGE_COOKIE, resolveLocale } from "./locale";
export const getRequestLocale = cache(async () => {
  const [requestHeaders, cookieStore] = await Promise.all([
    headers(),
    cookies(),
  ]);
  // Configure only when a trusted ingress overwrites this header on every request.
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
  return resolveLocale({
    saved: cookieStore.get(LANGUAGE_COOKIE)?.value,
    acceptLanguage: requestHeaders.get("accept-language"),
    country: geoHeader ? requestHeaders.get(geoHeader) : null,
  });
});
