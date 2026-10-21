import type { Locale } from "./locale";

/**
 * Custom software, the fifth offer in Services (/custom-software). Haab Calendar is Brilliant's
 * own booking app, shown as the example of what we build and keep running.
 * The exhibit is a one-minute recorded demo, served from our own domain. Copy
 * stays in business terms like the rest of Services: a test rejects
 * build-stack names.
 */
export const HAAB_URL = "https://haabcalendar.com";
/** A published example page on Haab: a fictional family doctor. */
export const HAAB_EXAMPLE_PATH = "/doctors/dr-maya-rivera";

/** Haab pages take the visitor's language as `?lang=`; English is its default. */
export function haabHref(locale: Locale, path = "/") {
  const url = `${HAAB_URL}${path}`;
  return locale === "es" ? `${url}?lang=es` : url;
}

/**
 * The /custom-software exhibit: Haab's booking flow on a demo page with a fictional patient,
 * narrated in English. 720p is enough for the exhibit column, even on retina
 * screens. Nothing downloads until the visitor presses play.
 */
export const HAAB_VIDEO = {
  src: "/video/haab-calendar-demo.mp4",
  poster: "/video/haab-calendar-demo.jpg",
  width: 1280,
  height: 720,
  captions: {
    en: "/video/haab-calendar-demo.en.vtt",
    es: "/video/haab-calendar-demo.es.vtt",
  },
};

/**
 * Caption tracks for the video. The page's language is on by default: Spanish
 * subtitles on /es, English captions on /. Keep one track on: iOS (Safari and
 * Chrome) stalls on play when every track is off.
 * Labels are each language's own name, as browsers list them.
 */
export function captionTracks(locale: Locale) {
  return [
    {
      kind: "captions" as const,
      srcLang: "en",
      label: "English",
      src: HAAB_VIDEO.captions.en,
      default: locale === "en",
    },
    {
      kind: "subtitles" as const,
      srcLang: "es",
      label: "Español",
      src: HAAB_VIDEO.captions.es,
      default: locale === "es",
    },
  ];
}

/**
 * Track modes after a language switch, which doesn't reload the page (and
 * browsers read `default` only once). The page's language comes first, so a
 * track is on before the others turn off and they're never all off at once.
 */
export function captionModes(locale: Locale): [srcLang: string, mode: TextTrackMode][] {
  return captionTracks(locale)
    .sort((a, b) => Number(b.default) - Number(a.default))
    .map((track) => [track.srcLang, track.default ? "showing" : "disabled"]);
}

/** What Haab Calendar does today. List only what it ships. */
export const HAAB_FEATURES: [title: string, line: string][] = [
  ["Live availability", "Clients only see times that are still open."],
  ["A 10-minute hold", "The time is kept for the client while they finish booking."],
  ["No client accounts", "Clients book without creating an account or a password."],
  ["Reschedule or cancel by link", "Every booking comes with a private link to change it."],
  [
    "Appointments, full days, and capacity",
    "Visits, whole-day rentals, and tickets or tables for each time slot.",
  ],
  ["English and Spanish", "Every label and confirmation, in both languages."],
];

/** How we build and run it: scope first, then we keep it running. */
export const SOFTWARE_NOTES: [title: string, body: string][] = [
  [
    "Built around your process",
    "We start from the work your team and your clients already do, and build only what that work needs. You approve the scope before we start.",
  ],
  [
    "We keep it running",
    "After launch, updates, fixes, and new features stay with us. Your team decides what changes and when.",
  ],
];
