import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { getRequestLocale, getRequestPath } from "@/lib/locale.server";
import { htmlLang } from "@/lib/locale";
import { buildJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { LanguageProvider, SkipLink } from "@/components/i18n/LanguageProvider";
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
      <body className={fontVariables}>
        <JsonLd data={buildJsonLd(locale, path)} />
        <LanguageProvider initialLocale={locale}>
          <SkipLink />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
