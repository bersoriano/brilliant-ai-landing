/**
 * Pure analytics helpers: no DOM, no SDK, safe to unit test and to import on
 * the server. The first half is the shared landing-page baseline (copied from
 * the landing-page-ga skill's assets/analytics.ts); the second half is
 * specific to this site (PostHog payloads, link classification, read progress).
 *
 * Event taxonomy: docs/operations/google-analytics.md.
 */
import { localeFromPathname, stripLocalePrefix } from "./locale";
import { CONTACT_EMAIL, DISCOVERY_CALL_HREF, WHATSAPP_HREF } from "./site";

// ---------------------------------------------------------------------------
// Shared baseline
// ---------------------------------------------------------------------------

export const ANALYTICS_EVENTS = [
  "page_view",
  "cta_click",
  "form_start",
  "form_submit",
  "generate_lead",
  "form_error",
  "sign_up",
  "section_view",
  "read_progress",
  "select_content",
  "language_change",
] as const;
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export type CtaType =
  | "booking" | "whatsapp" | "phone" | "email" | "form" | "signup" | "login" | "demo" | "directions" | "pricing";

export type FormErrorType = "validation" | "network" | "server" | "rate_limited";

/** form_error reason from the response status; no status means the request never completed. */
export function formErrorType(status?: number): FormErrorType {
  if (status === undefined) return "network";
  if (status === 429) return "rate_limited";
  return status < 500 ? "validation" : "server";
}

/** Parameter values: short strings or finite numbers. Never PII, never form contents. */
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/** Only campaign tags survive in addresses sent to analytics. */
export const CAMPAIGN_TAGS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export const GA_ID_PATTERN = /^G-[A-Z0-9]{6,12}$/;

/** A page address with every query parameter removed except campaign tags; never a fragment. */
export function campaignUrl(href: string): string {
  try {
    const url = new URL(href);
    const kept = new URLSearchParams();
    for (const key of CAMPAIGN_TAGS) {
      const value = url.searchParams.get(key)?.trim().slice(0, 100);
      if (value) kept.set(key, value);
    }
    const query = kept.toString();
    return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
  } catch {
    return "";
  }
}

/**
 * Referrer safe to send: same-site referrers keep their path (no query),
 * other sites only their origin. Empty or invalid means direct traffic.
 */
export function cleanReferrer(referrer: string, currentHref: string): string {
  try {
    const source = new URL(referrer);
    if (source.protocol !== "http:" && source.protocol !== "https:") return "";
    return source.origin === new URL(currentHref).origin ? `${source.origin}${source.pathname}` : source.origin;
  } catch {
    return "";
  }
}

/**
 * Collect only on the canonical host. Gating on NODE_ENV is not enough:
 * production builds also answer on *.pages.dev and per-deployment URLs.
 */
export function isProductionHost(href: string, siteUrl: string | undefined): boolean {
  if (!siteUrl) return false;
  try {
    return new URL(href).hostname === new URL(siteUrl).hostname;
  } catch {
    return false;
  }
}

/** Do Not Track or Global Privacy Control turned on. */
export function privacySignal(nav: { doNotTrack?: string | null; globalPrivacyControl?: boolean } | undefined): boolean {
  return nav?.doNotTrack === "1" || nav?.doNotTrack === "yes" || nav?.globalPrivacyControl === true;
}

/** GA limits: event/param names <= 40 chars, string values <= 100 chars, <= 25 params. */
export function limitParams(params: AnalyticsParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (Object.keys(out).length >= 25) break;
    if (value === undefined || key.length > 40) continue;
    if (typeof value === "number" && !Number.isFinite(value)) continue;
    out[key] = typeof value === "string" ? value.slice(0, 100) : value;
  }
  return out;
}

// ---------------------------------------------------------------------------
// This site
// ---------------------------------------------------------------------------

const CLICK_IDS = new Set("gad_source mc_cid gclid gclsrc dclid gbraid wbraid fbclid msclkid twclid li_fat_id igshid ttclid rdt_cid epik qclid sccid oppref bfcid irclid _kx".split(" "));
const ALLOWED_TAGS: readonly string[] = CAMPAIGN_TAGS;

/** Page grouping for both languages; translations of a post share `blog_slug`. */
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

/** PostHog page-view attribution: campaign tags and the referring domain only. */
export function trafficProperties(href: string, referrer: string) {
  const url = new URL(href);
  let domain = "$direct";
  try {
    const previous = new URL(referrer);
    domain = previous.host === url.host ? "$internal" : previous.hostname;
  } catch { /* Empty or unavailable referrer is direct traffic. */ }
  const campaign: Record<string, string> = {};
  for (const key of CAMPAIGN_TAGS) {
    const value = url.searchParams.get(key)?.trim().slice(0, 100);
    if (value) campaign[key] = value;
  }
  return { ...campaign, referring_domain: domain, traffic_source: campaign.utm_source || domain };
}

export function initialTrafficProperties(href: string, referrer: string) {
  // register_once works per property. Empty campaign slots prevent later
  // campaigns from being combined with this first acquisition.
  const empty = Object.fromEntries(CAMPAIGN_TAGS.map((key) => [key, ""]));
  return Object.fromEntries(Object.entries({ ...empty, ...trafficProperties(href, referrer) })
    .map(([name, value]) => [`initial_${name}`, value]));
}

/** Strip query strings/fragments, including nested SDK attribution properties. */
export function sanitizeEvent<T extends { properties?: Record<string, unknown> }>(event: T): T {
  function clean(properties: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(properties).flatMap(([key, value]) => {
      if (/search|hash/i.test(key)) return [];
      // The SDK derives session-entry campaign fields even when its campaign
      // persistence is disabled. Apply the same allowlist to every alias.
      const campaignKey = key.replace(/^\$?(?:(?:initial|session_entry)_)?/, "");
      if ((campaignKey.startsWith("utm_") && !ALLOWED_TAGS.includes(campaignKey)) || CLICK_IDS.has(campaignKey)) return [];
      if (value && typeof value === "object" && !Array.isArray(value))
        return [[key, clean(value as Record<string, unknown>)]];
      if (typeof value === "string" && /url|referrer|pathname/i.test(key))
        return [[key, value.split(/[?#]/, 1)[0]]];
      return [[key, value]];
    }));
  }
  return { ...event, properties: clean(event.properties || {}) };
}

/**
 * Which conversion a link is, from its address alone, so no button needs a
 * handler. Message bodies (mailto/WhatsApp text) are never read.
 */
export function linkProperties(href: string, currentHref: string): { cta_type: CtaType } | null {
  let url: URL;
  try { url = new URL(href, currentHref); } catch { return null; }
  const booking = new URL(DISCOVERY_CALL_HREF);
  if (url.origin === booking.origin && url.pathname === booking.pathname) return { cta_type: "booking" };
  const whatsapp = new URL(WHATSAPP_HREF);
  if (url.origin === whatsapp.origin && url.pathname === whatsapp.pathname) return { cta_type: "whatsapp" };
  if (url.protocol === "mailto:" && url.pathname.toLowerCase() === CONTACT_EMAIL.toLowerCase()) return { cta_type: "email" };
  if (url.origin !== new URL(currentHref).origin) return null;
  if (url.hash === "#contact") return { cta_type: "form" };
  return null;
}

export function sectionIsVisible(top: number, height: number, viewport: number) {
  const visible = Math.max(0, Math.min(top + height, viewport) - Math.max(top, 0));
  return height > 0 && visible >= Math.min(height, viewport) * 0.25;
}

export function articleProgress(top: number, height: number, viewport: number) {
  return height > 0 ? Math.max(0, Math.min(100, ((viewport - top) / height) * 100)) : 0;
}
