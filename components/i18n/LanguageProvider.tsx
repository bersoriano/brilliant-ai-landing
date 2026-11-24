"use client";
import { createContext, useContext, useEffect, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import {
  LANGUAGE_COOKIE,
  htmlLang,
  isServerLocalizedPage,
  localePath,
  ogLocale,
  pageFromPath,
  preferredLocale,
  socialImagePath,
  stripLocalePrefix,
  type Locale,
} from "@/lib/locale";
import { pageDescription, pageKeywords, pageTitle, translate } from "@/lib/i18n";
import switchStyles from "./LanguageSwitch.module.css";
const LanguageContext = createContext<{
  locale: Locale;
  preferred?: Locale;
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
  const imageUrl = `${origin}${socialImagePath(locale, pathname)}`;
  document.documentElement.lang = htmlLang(locale);
  document.title = title;
  if (page === "home") document.querySelector('meta[name="keywords"]')
    ?.setAttribute("content", pageKeywords(locale).join(","));
  document.querySelector('meta[property="og:image:alt"]')?.setAttribute("content", title);
  const alternateLocales = locale === "es" ? ["en_US", "en_CA"] : ["en_CA", "es_MX"];
  document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((tag, index) => {
    tag.setAttribute("content", alternateLocales[index]);
  });
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
  const [preferred, setPreferred] = useState<Locale>();
  const pathname = usePathname();
  useEffect(() => {
    const saved = document.cookie.split(";").map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${LANGUAGE_COOKIE}=`))?.slice(LANGUAGE_COOKIE.length + 1);
    setPreferred(preferredLocale(navigator.languages, saved));
  }, []);
  useEffect(() => {
    updateLocale(initialLocale);
  }, [initialLocale]);
  useEffect(() => {
    // Server-localized pages already carry their own title and description.
    if (!isServerLocalizedPage(pathname)) syncDocumentSeo(locale, pathname);
  }, [locale, pathname]);
  function setLocale(next: Locale) {
    setPreferred(next);
    try {
      document.cookie = `${LANGUAGE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    } catch {
      /* Keep the choice in memory when cookies are unavailable. */
    }
    if (next === locale) return;
    const nextPath = localePath(next, pathname) + window.location.search;
    const { hash } = window.location;
    // Blog bodies are localized on the server and need a full navigation.
    if (isServerLocalizedPage(pathname)) {
      const section = hash.startsWith("#section-") ? document.getElementById(hash.slice(1)) : null;
      const alternateSection = section?.dataset.alternateSection;
      window.location.assign(nextPath + (section ? (alternateSection ? `#${alternateSection}` : "") : hash));
      return;
    }
    updateLocale(next);
    // All non-article content has build-time bilingual data. Native history
    // integrates with usePathname and keeps React instances/form state alive.
    window.history.replaceState(null, "", nextPath + hash);
  }
  return (
    <LanguageContext.Provider value={{ locale, preferred, setLocale }}>
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
export function LanguageSwitch({ className = "", fullLabels = false }: { className?: string; fullLabels?: boolean }) {
  const { locale, preferred, setLocale, t } = useLanguage();
  const pathname = usePathname();
  const select = (event: MouseEvent<HTMLAnchorElement>, next: Locale) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setLocale(next);
  };
  return (
    <div
      className={`${switchStyles.switch} ${className}`.trim()}
      role="group"
      aria-label={t("Language")}
    >
      {([
        { next: "en", label: "English", suggestion: "Prefer English?" },
        { next: "es", label: "Español", suggestion: "¿Prefieres español?" },
      ] as const).map(({ next, label, suggestion }) => {
        const suggested = preferred === next && locale !== next;
        return (
          <a key={next} href={localePath(next, pathname)} lang={htmlLang(next)} hrefLang={htmlLang(next)}
            aria-label={fullLabels ? undefined : `${next.toUpperCase()}: ${label}`} aria-current={locale === next ? "page" : undefined}
            data-suggested={suggested || undefined} title={suggested ? suggestion : undefined}
            onClick={(event) => select(event, next)}>
            {fullLabels ? label : next.toUpperCase()}
          </a>
        );
      })}
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
