import type { Locale } from "./locale";

/**
 * Software Ready to Use, the fifth offer in Services (/custom-software, the URL
 * kept from the old "Custom Software" offer). It sells two products Brilliant
 * built and runs itself, never a client's or a partner's: Haab Calendar
 * (bookings) and Plaza Volcanes (a marketplace). The exhibit is Haab's
 * one-minute recorded demo, served from our own domain. Copy stays in business
 * terms like the rest of Services: a test rejects build-stack names.
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

/**
 * Plaza Volcanes, our own marketplace for independent shops in Mexico, shown so
 * visitors see they can launch a marketplace with us. The site is in Spanish
 * only (MXN), so its links take no language parameter.
 */
export const PLAZA_URL = "https://plazavolcanes.com";
/** The public catalog: search, categories, and the state filter. */
export const PLAZA_EXPLORE_PATH = "/explorar";

/**
 * What Plaza Volcanes does today. List only what it ships: it has no cart,
 * card payments, or shipment tracking (buyer and seller agree payment and
 * shipping inside the order).
 */
export const PLAZA_FEATURES: [title: string, line: string][] = [
  ["A storefront for every shop", "Each seller gets its own page, with a link ready to share on WhatsApp."],
  [
    "Search, categories, and location",
    "Buyers browse without an account and filter by category and by state.",
  ],
  [
    "Orders with the conversation attached",
    "Buyers send an order request, and payment and shipping are agreed in messages inside that order.",
  ],
  ["A catalog panel for sellers", "Sellers add products, keep drafts, and choose what is published."],
  [
    "Reviews and seller levels",
    "Buyers review each delivery, and every shop earns a level from its response time, on-time shipping, and reviews.",
  ],
  [
    "Shops reviewed, disputes recorded",
    "New shops are reviewed before they go live, and an administrator records how each dispute ends.",
  ],
];

/** How we launch and run it: scope first, then we keep it running. */
export const SOFTWARE_NOTES: [title: string, body: string][] = [
  [
    "Start from software that already runs",
    "Bookings and marketplaces are already built and in use. We set yours up around the way your business works, and you approve the scope before we start.",
  ],
  [
    "We keep it running",
    "After launch, updates, fixes, and new features stay with us. Your team decides what changes and when.",
  ],
];
