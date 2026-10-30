import type { Metadata, MetadataRoute } from "next";
import { FAQS, HOMEPAGE_FAQS } from "./faq";
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
  pageFromPath,
  stripLocalePrefix,
  type Locale,
} from "./locale";
import { CRM_PRICE, crmPrice } from "./crm";
import { ERP_PRICE, erpPrice } from "./erp";
import type { PostMeta } from "./posts";
import { SERVICES } from "./services";
import {
  absoluteUrl,
  CONTACT_EMAIL,
  getSiteUrl,
  SITE_NAME,
  WHATSAPP_NUMBER,
} from "./site";

export function buildMetadata(locale: Locale, path: string): Metadata {
  const page = pageFromPath(path);
  const canonicalPath = localePath(locale, stripLocalePrefix(path));
  const title = pageTitle(locale, page);
  const description = pageDescription(locale, page);
  const imagePath = locale === "es" ? "/es/og" : "/og";

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    keywords: page === "home" ? pageKeywords(locale) : undefined,
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
  const page = pageFromPath(path);
  const inLanguage = htmlLang(locale);
  const organizationId = `${siteUrl}/#organization`;
  const catalogId = `${canonical}#services`;

  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: SITE_NAME,
    url: siteUrl,
    email: CONTACT_EMAIL,
    image: absoluteUrl("/og"),
    logo: absoluteUrl("/brand/brilliant-icon-512.png"),
    description: t(HOME_DESCRIPTION),
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Mexico" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL,
      contactType: "customer service",
      availableLanguage: ["English", "Spanish"],
    },
    knowsAbout: [
      "AI automation",
      "Finance operations",
      "Healthcare operations",
      "Invoice processing",
      "Patient intake",
      "AI agents",
      "Finance workflow automation",
      "Healthcare workflow automation",
      "Custom CRM",
      "Custom ERP",
    ],
    ...(page === "home" && { hasOfferCatalog: { "@id": catalogId } }),
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
    "@type":
      page === "about"
        ? "AboutPage"
        : page === "blog"
          ? "CollectionPage"
          : "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: pageTitle(locale, page),
    description: pageDescription(locale, page),
    inLanguage,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": organizationId },
    ...(page === "blog" && { mainEntity: { "@id": `${canonical}#posts` } }),
  };

  // A post describes itself (BlogPosting) from its own page; see app/blog/[slug].
  const graph: Record<string, unknown>[] =
    page === "post" ? [organization, website] : [organization, website, webPage];

  // Each page's FAQ schema lists the questions it shows.
  const faqs = page === "home" ? HOMEPAGE_FAQS : page === "services" ? FAQS : null;
  if (faqs) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      isPartOf: { "@id": `${canonical}#webpage` },
      inLanguage,
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: t(question),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(answer),
        },
      })),
    });
  }

  if (page === "home") {
    // The five offers as the homepage cards list them; each Service shares its
    // @id with the node on its own page, so the two describe one entity.
    graph.push({
      "@type": "OfferCatalog",
      "@id": catalogId,
      name: t("Services"),
      itemListElement: SERVICES.map((service) => {
        const url = absoluteUrl(localePath(locale, service.path));
        return {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${url}#service`,
            name: t(service.name),
            description: t(service.summary),
            url,
            provider: { "@id": organizationId },
            areaServed: organization.areaServed,
          },
        };
      }),
    });
  }

  if (page === "crm") {
    // The page's own price: USD in English, MXN in Spanish.
    const { currency, month, year } = crmPrice(locale);
    // UN/CEFACT unit codes: MON = month, ANN = year.
    const offer = (price: number, unitCode: string) => ({
      "@type": "Offer",
      price,
      priceCurrency: currency,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: currency,
        unitCode,
      },
    });
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: t("Custom CRM"),
      serviceType: "Custom CRM implementation",
      description: pageDescription(locale, page),
      provider: { "@id": organizationId },
      areaServed: organization.areaServed,
      offers: [offer(month, "MON"), offer(year, "ANN")],
    });
  }

  if (page === "erp") {
    // Starting price only: the ERP has no annual plan listed.
    const { currency, month } = erpPrice(locale);
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: t("Custom ERP"),
      serviceType: "Custom ERP implementation",
      description: pageDescription(locale, page),
      provider: { "@id": organizationId },
      areaServed: organization.areaServed,
      offers: {
        "@type": "Offer",
        priceCurrency: currency,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          minPrice: month,
          priceCurrency: currency,
          unitCode: "MON",
        },
      },
    });
  }

  const SERVICE_TYPES: Partial<Record<typeof page, [name: string, type: string]>> = {
    workflows: ["AI Workflow Automations", "AI workflow automation"],
    agents: ["AI Agents", "AI agent implementation"],
    software: ["Custom Software", "Custom software development"],
  };
  const serviceType = SERVICE_TYPES[page];
  if (serviceType) {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: t(serviceType[0]),
      serviceType: serviceType[1],
      description: pageDescription(locale, page),
      url: canonical,
      provider: { "@id": organizationId },
      areaServed: organization.areaServed,
      mainEntityOfPage: { "@id": `${canonical}#webpage` },
    });
  }

  if (page === "finance" || page === "healthcare") {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: t(page === "finance" ? "Finance workflow automation" : "Healthcare workflow automation"),
      serviceType: page === "finance" ? "Finance workflow automation" : "Healthcare workflow automation",
      description: pageDescription(locale, page),
      url: canonical,
      provider: { "@id": organizationId },
      areaServed: organization.areaServed,
      mainEntityOfPage: { "@id": `${canonical}#webpage` },
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/** The rules every crawler gets; AI search bots are named so the welcome is explicit. */
export const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Claude-SearchBot",
  "Claude-User",
  "Googlebot",
  "Bingbot",
] as const;

export function buildRobots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  // A crawler that matches a named group ignores "*", so each group repeats
  // the API rule.
  const rule = { allow: "/", disallow: "/api/" };
  return {
    rules: [
      { userAgent: "*", ...rule },
      ...AI_SEARCH_BOTS.map((userAgent) => ({ userAgent, ...rule })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

/**
 * /llms.txt (llmstxt.org): a plain summary for AI assistants, in English.
 * Same honesty rules as the site: business terms only, no build stack, prices
 * from their constants.
 */
export function buildLlmsTxt() {
  const url = (path: string) => absoluteUrl(path);
  const crm = CRM_PRICE.USD!;
  const erp = ERP_PRICE.USD!;
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} builds and runs AI agents and workflows that prepare invoices, referrals, intake paperwork, and follow-ups for finance and healthcare operations teams in the United States, Canada, and Mexico. Approvals stay with a named person. Bookings run on Haab Calendar, a booking app we built.`,
    "",
    "Every page is also available in Mexican Spanish under /es (prices in MXN there).",
    "",
    "## Services",
    `- [Services overview](${url("/services")}): All five offers, with frequently asked questions.`,
    `- [AI Workflow Automations](${url("/workflows")}): One reliable process per repetitive task (invoices, referrals, month-end), checked against your rules, with every exception sent to a person you name.`,
    `- [AI Agents](${url("/agents")}): Agents that find, draft, chase documents, and follow up inside the tools your team already uses, such as Outlook and Teams. Your team approves what goes out.`,
    `- [Custom CRM](${url("/custom-crm")}): A CRM shaped to your pipeline: contacts, deals, tasks. Unlimited users, from $${crm.month}/month.`,
    `- [Custom ERP](${url("/custom-erp")}): One business system for sales, inventory, purchasing, invoice matching, and accounting. Unlimited users, from $${erp.month}/month.`,
    `- [Custom Software](${url("/custom-software")}): Software for the job nothing off the shelf does, priced by project and kept running by us.`,
    `- [Finance automation](${url("/finance-automation")}): Invoice matching, month-end close, missing documents, approvals.`,
    `- [Healthcare automation](${url("/healthcare-automation")}): Referrals, intake paperwork, billing follow-ups. Clinical decisions stay with your team.`,
    `- [Security & data handling](${url("/security")}): How financial and patient data is scoped, logged, and approved, under your agreements and data-residency requirements.`,
    "",
    "## About",
    `- [About](${url("/about")}): Onsite reviews in the United States, Canada, and Mexico, including Mexico City. Clients across Southeast Asia are served from Malaysia.`,
    `- [Blog](${url("/blog")}): Notes on agents in regulated work, approval design, and measuring capacity.`,
    "",
    "## Contact",
    `${CONTACT_EMAIL} · WhatsApp ${WHATSAPP_NUMBER}`,
  ];
  return `${lines.join("\n")}\n`;
}

export function postImagePath(post: Pick<PostMeta, "slug" | "locale">) {
  return `${localePath(post.locale, "/og")}?post=${encodeURIComponent(post.slug)}`;
}

/** Keep article overrides together with the canonical and hreflang they describe. */
export function buildPostMetadata(post: PostMeta): Metadata {
  const path = `/blog/${post.slug}`;
  const image = postImagePath(post);
  return {
    ...buildMetadata(post.locale, path),
    title: `${post.seoTitle ?? post.title} | ${SITE_NAME}`,
    description: post.description,
    authors: [{ name: SITE_NAME, url: absoluteUrl(localePath(post.locale, "/about")) }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: localePath(post.locale, path),
      siteName: SITE_NAME,
      locale: ogLocale(post.locale),
      alternateLocale: [ogLocale(post.locale === "en" ? "es" : "en")],
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [SITE_NAME],
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
    ...(post.draft && { robots: { index: false, follow: false } }),
  };
}

function blogBreadcrumbs(locale: Locale, post?: PostMeta) {
  const blogUrl = absoluteUrl(localePath(locale, "/blog"));
  const items = [
    { name: translate("Home", locale), item: absoluteUrl(localePath(locale, "/")) },
    { name: translate("Blog", locale), item: blogUrl },
    ...(post ? [{ name: post.title, item: absoluteUrl(localePath(locale, `/blog/${post.slug}`)) }] : []),
  ];
  return {
    "@type": "BreadcrumbList",
    "@id": `${post ? items[2].item : blogUrl}#breadcrumbs`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, ...item,
    })),
  };
}

export function buildPostJsonLd(post: PostMeta) {
  const url = absoluteUrl(localePath(post.locale, `/blog/${post.slug}`));
  const siteUrl = getSiteUrl();
  const breadcrumbs = blogBreadcrumbs(post.locale, post);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: post.title,
        description: post.description,
        inLanguage: htmlLang(post.locale),
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": `${url}#article` },
        breadcrumb: { "@id": breadcrumbs["@id"] },
      },
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: htmlLang(post.locale),
        url,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        image: { "@type": "ImageObject", url: absoluteUrl(postImagePath(post)), width: 1200, height: 630 },
        author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: SITE_NAME, url: siteUrl },
        publisher: { "@id": `${siteUrl}/#organization` },
        isPartOf: { "@id": `${absoluteUrl(localePath(post.locale, "/blog"))}#blog` },
      },
      breadcrumbs,
    ],
  };
}

export function buildBlogJsonLd(locale: Locale, posts: PostMeta[]) {
  const url = absoluteUrl(localePath(locale, "/blog"));
  const published = posts.filter((post) => !post.draft);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url}#blog`,
        url,
        name: pageTitle(locale, "blog"),
        description: pageDescription(locale, "blog"),
        inLanguage: htmlLang(locale),
        publisher: { "@id": `${getSiteUrl()}/#organization` },
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
        mainEntityOfPage: { "@id": `${url}#webpage` },
        blogPost: published.map((post) => ({ "@id": `${absoluteUrl(localePath(locale, `/blog/${post.slug}`))}#article` })),
      },
      {
        "@type": "ItemList",
        "@id": `${url}#posts`,
        numberOfItems: published.length,
        itemListElement: published.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: post.title,
          url: absoluteUrl(localePath(locale, `/blog/${post.slug}`)),
        })),
      },
      blogBreadcrumbs(locale),
    ],
  };
}
