import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/PageHeader";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { translate } from "@/lib/i18n";
import { localePath } from "@/lib/locale";
import { getRequestLocale } from "@/lib/locale.server";
import { compilePost, getPost } from "@/lib/posts.server";
import { SITE_NAME } from "@/lib/site";
import { buildPostJsonLd, buildPostMetadata } from "@/lib/seo";
import { postComponents } from "../mdx";
import styles from "../Blog.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  const post = await getPost(slug, locale);
  if (!post) notFound();
  return buildPostMetadata(post);
}

export default async function BlogPost({ params }: Props) {
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  const post = await getPost(slug, locale);
  if (!post) notFound();
  const Content = await compilePost(post);
  const t = (source: string) => translate(source, locale);
  const formatDate = (date: string) => new Intl.DateTimeFormat(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  ).format(new Date(`${date}T00:00:00Z`));
  return (
    <>
      <JsonLd data={buildPostJsonLd(post)} />
      <PageHeader />
      <main id="main" className={`shell ${styles.page}`}>
        <a className="text-link" href={localePath(locale, "/blog")}>
          {t("← All posts")}
        </a>
        <nav aria-label={t("Breadcrumb")} className={styles.breadcrumbs}>
          <a href={localePath(locale, "/")}>{t("Home")}</a>
          <span aria-hidden="true">/</span>
          <a href={localePath(locale, "/blog")}>{t("Blog")}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{post.title}</span>
        </nav>
        <article className={styles.article}>
          <header className={styles.header}>
            {post.draft && <p className="label">{t("Draft")}</p>}
            <h1 className="h2">{post.title}</h1>
            <p className="lead">{post.description}</p>
            <p className={styles.byline}>
              <span>{t("By")} <a rel="author" href={localePath(locale, "/about")}>{SITE_NAME}</a></span>
              <span>{t("Published")} <time dateTime={post.date}>{formatDate(post.date)}</time></span>
              {post.updated && post.updated !== post.date && (
                <span>{t("Updated")} <time dateTime={post.updated}>{formatDate(post.updated)}</time></span>
              )}
            </p>
          </header>
          <div className={styles.prose} data-analytics-article>
            <Content components={postComponents(locale)} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
