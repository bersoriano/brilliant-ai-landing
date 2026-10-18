import type { Locale } from "./locale";

/**
 * Custom software, the fifth offer in Services. Haab Calendar is Brilliant's
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
 * Exhibit 6: Haab's booking flow on a demo page with a fictional patient,
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
 * Caption tracks for the video. The narration is English, so Spanish
 * subtitles are on by default on /es; English captions are there to turn on.
 * Labels are each language's own name, as browsers list them.
 */
export function captionTracks(locale: Locale) {
  return [
    {
      kind: "captions" as const,
      srcLang: "en",
      label: "English",
      src: HAAB_VIDEO.captions.en,
      default: false,
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
