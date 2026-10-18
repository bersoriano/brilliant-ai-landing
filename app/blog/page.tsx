import { PageHeader } from "@/components/sections/PageHeader";
import { Footer } from "@/components/sections/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { BLOG_DESCRIPTION, translate } from "@/lib/i18n";
import { localePath } from "@/lib/locale";
import { getRequestLocale } from "@/lib/locale.server";
import { getPosts } from "@/lib/posts.server";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBlogJsonLd } from "@/lib/seo";
import styles from "./Blog.module.css";

export default async function Blog() {
  const locale = await getRequestLocale();
  const t = (source: string) => translate(source, locale);
  const posts = await getPosts(locale);
  return (
    <>
      <JsonLd data={buildBlogJsonLd(locale, posts)} />
      <PageHeader />
      <main id="main" className={`shell ${styles.page}`}>
        <nav aria-label={t("Breadcrumb")} className={styles.breadcrumbs}>
          <a href={localePath(locale, "/")}>{t("Home")}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{t("Blog")}</span>
        </nav>
        <Kicker>{t("Blog")}</Kicker>
        <h1 className="h2">
          {t("AI automation, CRM, and ERP: practical guides")}
        </h1>
        <p className="lead">{t(BLOG_DESCRIPTION)}</p>
        {posts.length ? (
          <ol className={styles.list}>
            {posts.map((post) => (
              <li key={post.slug}>
                {post.draft && <p className="label">{t("Draft")}</p>}
                <h2>
                  <a href={localePath(locale, `/blog/${post.slug}`)}>
                    {post.title}
                  </a>
                </h2>
                <p>{post.description}</p>
                <time className={styles.date} dateTime={post.date}>
                  {new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
                    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
                  }).format(new Date(`${post.date}T00:00:00Z`))}
                </time>
              </li>
            ))}
          </ol>
        ) : (
          <p className="body">{t("No posts yet.")}</p>
        )}
      </main>
      <Footer />
    </>
  );
}
