import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { routeInfo, type RouteProps } from "@/lib/routes.server";
import { htmlLang } from "@/lib/locale";
import { buildJsonLd } from "@/lib/seo";
import { LocalizedJsonLd } from "@/components/seo/LocalizedJsonLd";
import { LanguageProvider, SkipLink } from "@/components/i18n/LanguageProvider";
import { PageAnalytics } from "@/components/analytics/PageAnalytics";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
export default async function RootLayout({ children, params }: RouteProps & { children: React.ReactNode }) {
  const { locale, path } = routeInfo(await params);
  return (
    <html lang={htmlLang(locale)} className={fontVariables}>
      <body>
        <LanguageProvider initialLocale={locale}>
          <LocalizedJsonLd graphs={{ en: buildJsonLd("en", path), es: buildJsonLd("es", path) }} />
          <PageAnalytics />
          <SkipLink />
          {children}
        </LanguageProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
