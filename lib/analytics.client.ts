import posthog from "posthog-js";
import { campaignUrl, initialTrafficProperties, isProductionHost, pageProperties, sanitizeEvent } from "./analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let started = false;
let posthogReady = false;
let googleReady = false;
/** Page fields sent with every Google Analytics event, refreshed on each page view. */
let googlePage: Record<string, string> = {};

type Event = "$pageview" | "section_viewed" | "blog_read_progress" | "blog_link_clicked" | "cta_clicked"
  | "inquiry_submitted" | "inquiry_succeeded" | "inquiry_failed";

function doNotTrack() {
  const nav = window.navigator as (Navigator & { msDoNotTrack?: string }) | undefined;
  return [nav?.doNotTrack, (window as Window & { doNotTrack?: string }).doNotTrack, nav?.msDoNotTrack]
    .some((value) => value === "1" || value === "yes");
}

export function initializeAnalytics() {
  if (started || typeof window === "undefined") return;
  started = true;
  // Production builds also run on preview hosts; only the real domain counts.
  const production = process.env.NODE_ENV === "production" && isProductionHost(window.location.href);
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (posthogKey && (production || process.env.NEXT_PUBLIC_POSTHOG_DEBUG === "true")) initializePostHog(posthogKey);
  const googleId = process.env.NEXT_PUBLIC_GA_ID;
  const googleDebug = process.env.NEXT_PUBLIC_GA_DEBUG === "true";
  if (googleId && /^G-[A-Z0-9]+$/.test(googleId) && (production || googleDebug) && !doNotTrack())
    initializeGoogle(googleId, googleDebug);
}

function initializePostHog(key: string) {
  try {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      defaults: "2026-05-30",
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      capture_performance: false,
      capture_exceptions: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_flags: true,
      person_profiles: "never",
      internal_or_test_user_hostname: null,
      persistence: "sessionStorage",
      respect_dnt: true,
      save_campaign_params: false,
      save_referrer: false,
      before_send: (event) => event ? sanitizeEvent(event) : null,
    });
    posthog.register_once(initialTrafficProperties(window.location.href, document.referrer));
    posthogReady = true;
  } catch { /* Analytics must never prevent navigation or form delivery. */ }
}

/**
 * Google Analytics 4 through gtag.js. Page views are sent by PageAnalytics,
 * once per route, so GA and PostHog count the same visits. Addresses keep
 * only campaign tags; Google signals and ad personalization stay off.
 */
function initializeGoogle(id: string, debug: boolean) {
  try {
    const page = { page_location: campaignUrl(window.location.href), page_referrer: document.referrer.split(/[?#]/, 1)[0] };
    window.dataLayer = window.dataLayer || [];
    // gtag.js reads the arguments object itself, so this must not be an array.
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, {
      ...page,
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 60 * 60 * 24 * 395, // about 13 months
      ...(window.location.protocol === "https:" && { cookie_flags: "SameSite=Lax;Secure" }),
      ...(debug && { debug_mode: true }),
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
    googlePage = page;
    googleReady = true;
  } catch { /* Same rule: measurement is optional. */ }
}

function sendToGoogle(event: Event, properties: Record<string, string | number>) {
  if (event === "$pageview") {
    const location = campaignUrl(window.location.href);
    // After a client-side navigation, the referrer is the previous page.
    const referrer = googlePage.page_location && googlePage.page_location !== location
      ? googlePage.page_location.split("?", 1)[0]
      : googlePage.page_referrer ?? "";
    googlePage = { page_location: location, page_referrer: referrer, page_title: document.title };
    const { page_type, locale, blog_slug } = properties;
    window.gtag!("event", "page_view", { ...googlePage, page_type, locale, ...(blog_slug ? { blog_slug } : {}) });
    return;
  }
  const transport = event === "cta_clicked" || event === "blog_link_clicked" ? { transport_type: "beacon" } : {};
  window.gtag!("event", event, { ...googlePage, ...properties, ...transport });
}

export function captureAnalytics(event: Event, properties: Record<string, string | number> = {}) {
  if (!posthogReady && !googleReady) return;
  const all = { ...pageProperties(window.location.href), ...properties };
  if (posthogReady) {
    try {
      // Anchor navigation can unload the document before the batch flush runs.
      // Send clicks immediately with synchronous compression and beacon delivery.
      const options = event === "cta_clicked" || event === "blog_link_clicked"
        ? { send_instantly: true, transport: "sendBeacon" as const }
        : undefined;
      posthog.capture(event, all, options);
    } catch { /* Measurement is best effort; visitor actions still work. */ }
  }
  if (googleReady) {
    try { sendToGoogle(event, all); } catch { /* Best effort, as above. */ }
  }
}

export function analyticsEnabled() { return posthogReady || googleReady; }
