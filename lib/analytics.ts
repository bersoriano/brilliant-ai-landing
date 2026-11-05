import { localeFromPathname, stripLocalePrefix } from "./locale";
import { CONTACT_EMAIL, DISCOVERY_CALL_HREF, WHATSAPP_HREF } from "./site";

const CAMPAIGN_TAGS = ["utm_source", "utm_medium", "utm_campaign"];
const CLICK_IDS = new Set("gad_source mc_cid gclid gclsrc dclid gbraid wbraid fbclid msclkid twclid li_fat_id igshid ttclid rdt_cid epik qclid sccid oppref bfcid irclid _kx".split(" "));

export function pageProperties(href: string) {
  const { pathname } = new URL(href);
  const path = stripLocalePrefix(pathname).replace(/\/$/, "") || "/";
  const blogSlug = path.startsWith("/blog/") ? path.slice(6) : undefined;
  return {
    page_path: pathname,
    page_type: path === "/" ? "landing" : blogSlug ? "blog_post" : path === "/blog" ? "blog_index" : "supporting",
    locale: localeFromPathname(pathname),
    ...(blogSlug ? { blog_slug: blogSlug } : {}),
  };
}

export function trafficProperties(href: string, referrer: string) {
  const url = new URL(href);
  let domain = "$direct";
  try {
    const previous = new URL(referrer);
    domain = previous.host === url.host ? "$internal" : previous.hostname;
  } catch { /* Empty or unavailable referrer is direct traffic. */ }
  const campaign: Record<string, string> = {};
  for (const key of CAMPAIGN_TAGS) {
    const value = url.searchParams.get(key)?.trim().slice(0, 200);
    if (value) campaign[key] = value;
  }
  return { ...campaign, referring_domain: domain, traffic_source: campaign.utm_source || domain };
}

export function initialTrafficProperties(href: string, referrer: string) {
  // register_once works per property. Empty campaign slots prevent later
  // campaigns from being combined with this first acquisition.
  return Object.fromEntries(Object.entries({
    utm_source: "", utm_medium: "", utm_campaign: "",
    ...trafficProperties(href, referrer),
  }).map(([name, value]) => [`initial_${name}`, value]));
}

/** Strip query strings/fragments, including nested SDK attribution properties. */
export function sanitizeEvent<T extends { properties?: Record<string, unknown> }>(event: T): T {
  function clean(properties: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(properties).flatMap(([key, value]) => {
      if (/search|hash/i.test(key)) return [];
      // The SDK derives session-entry campaign fields even when its campaign
      // persistence is disabled. Apply the same allowlist to every alias.
      const campaignKey = key.replace(/^\$?(?:(?:initial|session_entry)_)?/, "");
      if ((campaignKey.startsWith("utm_") && !CAMPAIGN_TAGS.includes(campaignKey)) || CLICK_IDS.has(campaignKey)) return [];
      if (value && typeof value === "object" && !Array.isArray(value))
        return [[key, clean(value as Record<string, unknown>)]];
      if (typeof value === "string" && /url|referrer|pathname/i.test(key))
        return [[key, value.split(/[?#]/, 1)[0]]];
      return [[key, value]];
    }));
  }
  return { ...event, properties: clean(event.properties || {}) };
}

export function linkProperties(href: string, currentHref: string): {
  event: "cta_clicked" | "blog_link_clicked";
  properties: Record<string, string>;
} | null {
  let url: URL;
  try { url = new URL(href, currentHref); } catch { return null; }
  const booking = new URL(DISCOVERY_CALL_HREF);
  if (url.origin === booking.origin && url.pathname === booking.pathname)
    return { event: "cta_clicked" as const, properties: { cta_type: "booking" } };
  const whatsapp = new URL(WHATSAPP_HREF);
  if (url.origin === whatsapp.origin && url.pathname === whatsapp.pathname)
    return { event: "cta_clicked" as const, properties: { cta_type: "whatsapp" } };
  if (url.protocol === "mailto:" && url.pathname.toLowerCase() === CONTACT_EMAIL.toLowerCase())
    return { event: "cta_clicked" as const, properties: { cta_type: "email" } };
  if (url.origin !== new URL(currentHref).origin) return null;
  const path = stripLocalePrefix(url.pathname).replace(/\/$/, "") || "/";
  if (path === "/blog" || path.startsWith("/blog/"))
    return {
      event: "blog_link_clicked" as const,
      properties: { destination_path: url.pathname, ...(path.startsWith("/blog/") ? { destination_slug: path.slice(6) } : {}) },
    };
  if (url.hash === "#contact")
    return { event: "cta_clicked" as const, properties: { cta_type: "inquiry" } };
  return null;
}

export function sectionIsVisible(top: number, height: number, viewport: number) {
  const visible = Math.max(0, Math.min(top + height, viewport) - Math.max(top, 0));
  return height > 0 && visible >= Math.min(height, viewport) * 0.25;
}

export function articleProgress(top: number, height: number, viewport: number) {
  return height > 0 ? Math.max(0, Math.min(100, ((viewport - top) / height) * 100)) : 0;
}
