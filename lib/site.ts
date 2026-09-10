/** Public contact settings. Set these before deploying to your own domain. */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@brilliant.ai";
const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
export const DISCOVERY_CALL_HREF =
  bookingUrl && /^https:\/\//.test(bookingUrl) ? bookingUrl : "#contact";
export const PRIMARY_CTA = "Let’s talk";
export const CALCULATOR_ANCHOR = "#roi-calculator";
export const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Services", href: "#services" },
  { label: "Our approach", href: "#how-it-works" },
  { label: "ROI calculator", href: CALCULATOR_ANCHOR },
];
