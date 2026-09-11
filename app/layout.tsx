import localFont from "next/font/local";
import "./globals.css";
import { getRequestLocale, getRequestPath } from "@/lib/locale.server";
import { htmlLang } from "@/lib/locale";
import { buildJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
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
export async function generateMetadata() {
  const [locale, path] = await Promise.all([
    getRequestLocale(),
    getRequestPath(),
  ]);
  return buildMetadata(locale, path);
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, path] = await Promise.all([
    getRequestLocale(),
    getRequestPath(),
  ]);
  return (
    <html lang={htmlLang(locale)}>
      <body className={manrope.variable}>
        <JsonLd data={buildJsonLd(locale, path)} />
        <LanguageProvider initialLocale={locale}>
          <SkipLink />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
