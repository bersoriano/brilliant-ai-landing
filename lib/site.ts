/** Public contact settings. Set these before deploying to your own domain. */
export const SITE_NAME = "Brilliant AI";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@brilliant.ai";
const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
export const DISCOVERY_CALL_HREF =
  bookingUrl && /^https:\/\//.test(bookingUrl) ? bookingUrl : "#contact";
/**
 * One named offer, repeated verbatim. Every control whose destination is the
 * conversion (booking link or the inquiry form) uses PRIMARY_CTA so the ask is
 * recognisable rather than reworded a dozen ways. ONSITE_CTA is the single
 * exception: a different service, deliberately kept on the same noun.
 */
export const PRIMARY_CTA = "Book a workflow review";
export const ONSITE_CTA = "Book an onsite review";
export const CALCULATOR_ANCHOR = "#roi-calculator";
export const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Services", href: "#services" },
  { label: "Our approach", href: "#how-it-works" },
  { label: "ROI calculator", href: CALCULATOR_ANCHOR },
];

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
