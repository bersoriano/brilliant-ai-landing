import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getRequestLocale } from "@/lib/locale.server";
import { pageTitle, translate } from "@/lib/i18n";
import { LanguageProvider, SkipLink } from "@/components/i18n/LanguageProvider";
const manrope = localFont({
  src: [
    {
      path: "../public/fonts/manrope-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = (source: string) => translate(source, locale);
  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle(locale),
    description: t(
      "Done-for-you AI automation for finance and healthcare. Explore invoice approvals, intake, referrals, and reporting workflows. Start with a 20-minute workflow review.",
    ),
    openGraph: {
      title: pageTitle(locale),
      description: t(
        "Practical AI automation for finance and healthcare. Better systems. More human potential.",
      ),
      type: "website",
      locale: locale === "es" ? "es_MX" : "en_US",
      siteName: "Brilliant AI",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle(locale),
      description: t("AI automation for finance and healthcare teams."),
    },
  };
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  return (
    <html lang={locale === "es" ? "es-MX" : "en"}>
      <body className={manrope.variable}>
        <LanguageProvider initialLocale={locale}>
          <SkipLink />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
