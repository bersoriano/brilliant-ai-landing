"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LANGUAGE_COOKIE,
  htmlLang,
  isServerLocalizedPage,
  localePath,
  ogLocale,
  pageFromPath,
  stripLocalePrefix,
  type Locale,
} from "@/lib/locale";
import { pageDescription, pageTitle, translate } from "@/lib/i18n";
import switchStyles from "./LanguageSwitch.module.css";
const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
} | null>(null);

function syncDocumentSeo(locale: Locale, pathname: string) {
  const page = pageFromPath(pathname);
  const title = pageTitle(locale, page);
  const description = pageDescription(locale, page);
  const canonicalPath = localePath(locale, stripLocalePrefix(pathname));
  // Preserve the configured public domain on previews and alternate hostnames.
  const origin = new URL(
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ||
      window.location.origin,
  ).origin;
  const canonicalUrl = `${origin}${canonicalPath === "/" ? "" : canonicalPath}`;
  const imageUrl = `${origin}${locale === "es" ? "/es/og" : "/og"}`;
  document.documentElement.lang = htmlLang(locale);
  document.title = title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", description);
  for (const selector of [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
  ])
    document.querySelector(selector)?.setAttribute("content", title);
  for (const selector of [
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ])
    document.querySelector(selector)?.setAttribute("content", description);
  document
    .querySelector('meta[property="og:locale"]')
    ?.setAttribute("content", ogLocale(locale));
  document
    .querySelector('meta[property="og:url"]')
    ?.setAttribute("content", canonicalUrl);
  document
    .querySelector('link[rel="canonical"]')
    ?.setAttribute("href", canonicalUrl);
  for (const selector of [
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
  ])
    document.querySelector(selector)?.setAttribute("content", imageUrl);
}

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
    updateLocale(initialLocale);
  }, [initialLocale]);
  useEffect(() => {
    // Server-localized pages already carry their own title and description.
    if (!isServerLocalizedPage(pathname)) syncDocumentSeo(locale, pathname);
  }, [locale, pathname]);
  function setLocale(next: Locale) {
    // Post bodies are rendered on the server per language: load the other one.
    // `?lang=` makes the middleware store the choice and redirect.
    if (isServerLocalizedPage(pathname)) {
      window.location.assign(
        `${stripLocalePrefix(pathname)}?lang=${next}${window.location.hash}`,
      );
      return;
    }
    updateLocale(next);
    try {
      document.cookie = `${LANGUAGE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    } catch {
      /* Keep the choice in memory when cookies are unavailable. */
    }
    const nextPath =
      localePath(next, stripLocalePrefix(pathname)) + window.location.hash;
    window.history.replaceState(window.history.state, "", nextPath);
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
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();
  return (
    <div
      className={`${switchStyles.switch} ${className}`.trim()}
      role="group"
      aria-label={t("Language")}
    >
      <button
        type="button"
        lang="en"
        aria-label="EN: English"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        lang="es-MX"
        aria-label="ES: Español"
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
