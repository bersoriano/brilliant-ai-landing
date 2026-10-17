import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/PageHeader";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { translate } from "@/lib/i18n";
import { htmlLang, localePath, ogLocale } from "@/lib/locale";
import { getRequestLocale } from "@/lib/locale.server";
import { compilePost, getPost } from "@/lib/posts.server";
import {
  DISCOVERY_CALL_HREF,
  PRIMARY_CTA,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/site";
import { postComponents } from "../mdx";
import styles from "../Blog.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  const post = await getPost(slug, locale);
  if (!post) return {};
  const url = localePath(locale, `/blog/${slug}`);
  const image = locale === "es" ? "/es/og" : "/og";
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
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

export default async function BlogPost({ params }: Props) {
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  const post = await getPost(slug, locale);
  if (!post) notFound();
  const Content = await compilePost(post);
  const t = (source: string) => translate(source, locale);
  const siteUrl = getSiteUrl();
  const url = absoluteUrl(localePath(locale, `/blog/${slug}`));
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          inLanguage: htmlLang(locale),
          url,
          mainEntityOfPage: url,
          image: absoluteUrl(locale === "es" ? "/es/og" : "/og"),
          author: { "@id": `${siteUrl}/#organization` },
          publisher: { "@id": `${siteUrl}/#organization` },
          isPartOf: { "@id": `${siteUrl}/#website` },
        }}
      />
      <PageHeader />
      <main id="main" className={`shell ${styles.page}`}>
        <a className="text-link" href={localePath(locale, "/blog")}>
          {t("← All posts")}
        </a>
        <article className={styles.article}>
          <header className={styles.header}>
            {post.draft && <p className="label">{t("Draft")}</p>}
            <h1 className="h2">{post.title}</h1>
            <p className="lead">{post.description}</p>
          </header>
          <div className={styles.prose}>
            <Content components={postComponents(locale)} />
          </div>
        </article>
        <aside className={styles.close}>
          <p>{t("Have a workflow like this on your team?")}</p>
          <a href={DISCOVERY_CALL_HREF} className="button">
            {t(PRIMARY_CTA)}
          </a>
        </aside>
      </main>
      <Footer />
    </>
  );
}
