"use client";

import { Analytics } from "@vercel/analytics/next";
import { vercelAnalyticsEvent } from "@/lib/analytics";

/** Same Do Not Track signals PostHog checks with respect_dnt. */
function doNotTrack() {
  const signals = [
    navigator.doNotTrack,
    (window as { doNotTrack?: string }).doNotTrack,
    (navigator as { msDoNotTrack?: string }).msDoNotTrack,
  ];
  return signals.some((value) => value === "1" || value === "yes");
}

export function VercelAnalytics() {
  return <Analytics beforeSend={(event) => vercelAnalyticsEvent(event, doNotTrack())} />;
}
