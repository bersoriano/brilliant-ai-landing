"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LANGUAGE_COOKIE, type Locale } from "@/lib/locale";
import { pageTitle, translate } from "@/lib/i18n";
const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
} | null>(null);
export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, updateLocale] = useState(initialLocale);
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es-MX" : "en";
    document.title = pageTitle(locale, pathname === "/privacy");
    const description = translate(
      pathname === "/privacy"
        ? "How the Brilliant AI website handles contact details and calculator inputs."
        : "Done-for-you AI automation for finance and healthcare. Explore invoice approvals, intake, referrals, and reporting workflows. Start with a 20-minute workflow review.",
      locale,
    );
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ])
      document
        .querySelector(selector)
        ?.setAttribute("content", pageTitle(locale, pathname === "/privacy"));
    for (const selector of [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ])
      document.querySelector(selector)?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute("content", locale === "es" ? "es_MX" : "en_US");
  }, [locale, pathname]);
  function setLocale(next: Locale) {
    updateLocale(next);
    try {
      document.cookie = `${LANGUAGE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    } catch {
      /* Keep the choice in memory when cookies are unavailable. */
    }
  }
  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage requires LanguageProvider");
  return {
    ...context,
    t: (source: string, variables?: Record<string, string | number>) =>
      translate(source, context.locale, variables),
  };
}
export function LanguageSwitch() {
  const { locale, setLocale, t } = useLanguage();
  return (
    <div className="language-switch" role="group" aria-label={t("Language")}>
      <button
        type="button"
        lang="en"
        aria-label="English (EN)"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        lang="es-MX"
        aria-label="Español (ES)"
        aria-pressed={locale === "es"}
        onClick={() => setLocale("es")}
      >
        ES
      </button>
    </div>
  );
}
export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a href="#main" className="skip-link">
      {t("Skip to content")}
    </a>
  );
}
