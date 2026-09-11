import type { Metadata } from "next";
import { FAQS } from "./faq";
import {
  HOME_DESCRIPTION,
  pageDescription,
  pageKeywords,
  pageTitle,
  translate,
} from "./i18n";
import {
  htmlLang,
  languageAlternatePaths,
  localePath,
  ogLocale,
  stripLocalePrefix,
  type Locale,
} from "./locale";
import { absoluteUrl, CONTACT_EMAIL, getSiteUrl, SITE_NAME } from "./site";

export function buildMetadata(locale: Locale, path: string): Metadata {
  const privacy = stripLocalePrefix(path) === "/privacy";
  const canonicalPath = localePath(locale, stripLocalePrefix(path));
  const title = pageTitle(locale, privacy);
  const description = pageDescription(locale, privacy);
  const imagePath = locale === "es" ? "/es/og" : "/og";

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    keywords: privacy ? undefined : pageKeywords(locale),
    authors: [{ name: SITE_NAME, url: getSiteUrl() }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "business",
    applicationName: SITE_NAME,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternatePaths(path),
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: ogLocale(locale),
      alternateLocale:
        locale === "es" ? ["en_US", "en_CA"] : ["en_CA", "es_MX"],
      siteName: SITE_NAME,
      url: canonicalPath,
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imagePath],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function buildJsonLd(locale: Locale, path: string) {
  const t = (source: string) => translate(source, locale);
  const siteUrl = getSiteUrl();
  const canonical = absoluteUrl(localePath(locale, stripLocalePrefix(path)));
  const privacy = stripLocalePrefix(path) === "/privacy";
  const inLanguage = htmlLang(locale);
  const organizationId = `${siteUrl}/#organization`;

  const organization = {
    "@type": "ProfessionalService",
    "@id": organizationId,
    name: SITE_NAME,
    url: siteUrl,
    email: CONTACT_EMAIL,
    image: absoluteUrl("/og"),
    logo: absoluteUrl("/icon.svg"),
    description: t(HOME_DESCRIPTION),
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Mexico" },
    ],
    availableLanguage: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Spanish", alternateName: "es-MX" },
    ],
    serviceType: [
      "AI automation",
      "Finance workflow automation",
      "Healthcare workflow automation",
    ],
    knowsAbout: [
      "AI automation",
      "Finance operations",
      "Healthcare operations",
      "Invoice processing",
      "Patient intake",
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_NAME,
    inLanguage: ["en", "es-MX"],
    publisher: { "@id": organizationId },
  };

  const webPage = {
    "@type": privacy ? "PrivacyPolicy" : "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: pageTitle(locale, privacy),
    description: pageDescription(locale, privacy),
    inLanguage,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": organizationId },
  };

  const graph: Record<string, unknown>[] = [organization, website, webPage];

  if (!privacy) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      isPartOf: { "@id": `${canonical}#webpage` },
      inLanguage,
      mainEntity: FAQS.map(([question, answer]) => ({
        "@type": "Question",
        name: t(question),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(answer),
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
