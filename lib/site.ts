/** Public contact settings. Set these before deploying to your own domain. */
export const SITE_NAME = "Brilliant AI";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@brilliant.dev";
export const DISCOVERY_CALL_HREF =
  "https://haabcalendar.com/professionals/ai-automation";
/**
 * One named offer, repeated verbatim. Every control whose destination is the
 * booking uses PRIMARY_CTA so the ask is
 * recognisable rather than reworded a dozen ways. ONSITE_CTA is the single
 * exception: a different service, deliberately kept on the same noun.
 */
export const PRIMARY_CTA = "Book a 20-minute workflow review";
/** Short form of PRIMARY_CTA for tight spaces (header, sticky mobile bar). */
export const NAV_CTA = "Book review";
export const ONSITE_CTA = "Book an onsite review";
export const WHATSAPP_CTA = "Message us on WhatsApp";
/** Canonical domain, shown next to CONTACT_EMAIL so IT can verify the firm. */
export const SITE_DOMAIN = "brilliant.dev";
export const WHATSAPP_NUMBER = "+1 347 326 1975";
export const WHATSAPP_HREF = "https://wa.me/13473261975";
export const CALCULATOR_ANCHOR = "#roi-calculator";
export const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "How it works", href: "#how-it-works" },
  { label: "ROI", href: CALCULATOR_ANCHOR },
  { label: "Trust", href: "#trust" },
];

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return process.env.NODE_ENV === "production"
    ? `https://${SITE_DOMAIN}`
    : "http://localhost:3000";
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
