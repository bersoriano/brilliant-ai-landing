/**
 * PostHog as the second analytics destination. Gating (production host,
 * Do Not Track / GPC) happens in analytics.client.ts before this runs; the
 * SDK settings below are this site's PostHog privacy configuration.
 */
import posthog from "posthog-js";
import { initialTrafficProperties, pageProperties, sanitizeEvent, trafficProperties } from "./analytics";
import type { Destination } from "./analytics.client";

export function createPostHogDestination(key: string, host?: string): Destination {
  posthog.init(key, {
    api_host: host || "https://us.i.posthog.com",
    defaults: "2026-05-30",
    capture_pageview: false, // page views come from PageAnalytics
    capture_pageleave: false,
    autocapture: false, // only taxonomy events
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

  return {
    pageView(_page, params) {
      // `page_path` and `blog_slug` group translations; attribution stays PostHog-only.
      posthog.capture("$pageview", {
        ...pageProperties(window.location.href),
        ...params,
        ...trafficProperties(window.location.href, document.referrer),
      });
    },
    event(name, params, beacon) {
      // Anchor navigation can unload the document before the batch flush runs.
      // Clicks go immediately with synchronous compression and beacon delivery.
      posthog.capture(name, { ...pageProperties(window.location.href), ...params },
        beacon ? { send_instantly: true, transport: "sendBeacon" } : undefined);
    },
    disable() {
      posthog.opt_out_capturing();
    },
  };
}
