import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { getRequestLocale, getRequestPath } from "@/lib/locale.server";
import { htmlLang } from "@/lib/locale";
import { buildJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { LanguageProvider, SkipLink } from "@/components/i18n/LanguageProvider";
import { PageAnalytics } from "@/components/analytics/PageAnalytics";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
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
    <html lang={htmlLang(locale)} className={fontVariables}>
      <body>
        <JsonLd data={buildJsonLd(locale, path)} />
        <LanguageProvider initialLocale={locale}>
          <PageAnalytics />
          <SkipLink />
          {children}
        </LanguageProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
