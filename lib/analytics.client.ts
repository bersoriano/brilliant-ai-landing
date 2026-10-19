import posthog from "posthog-js";
import { initialTrafficProperties, pageProperties, sanitizeEvent } from "./analytics";

let initialized = false;

export function initializeAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const enabled = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_POSTHOG_DEBUG === "true";
  if (initialized || !key || !enabled || typeof window === "undefined") return;
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
    initialized = true;
  } catch { /* Analytics must never prevent navigation or form delivery. */ }
}

type Event = "$pageview" | "section_viewed" | "blog_read_progress" | "blog_link_clicked" | "cta_clicked"
  | "inquiry_submitted" | "inquiry_succeeded" | "inquiry_failed";

export function captureAnalytics(event: Event, properties: Record<string, string | number> = {}) {
  if (!initialized) return;
  try {
    // Anchor navigation can unload the document before the batch flush runs.
    // Send clicks immediately with synchronous compression and beacon delivery.
    const options = event === "cta_clicked" || event === "blog_link_clicked"
      ? { send_instantly: true, transport: "sendBeacon" as const }
      : undefined;
    posthog.capture(event, { ...pageProperties(window.location.href), ...properties }, options);
  } catch { /* Measurement is best effort; visitor actions still work. */ }
}

export function analyticsEnabled() { return initialized; }
