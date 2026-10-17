import { PageHeader } from "@/components/sections/PageHeader";
import { Footer } from "@/components/sections/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { BLOG_DESCRIPTION, translate } from "@/lib/i18n";
import { localePath } from "@/lib/locale";
import { getRequestLocale } from "@/lib/locale.server";
import { formatPostDate } from "@/lib/posts";
import { getPosts } from "@/lib/posts.server";
import styles from "./Blog.module.css";

export default async function Blog() {
  const locale = await getRequestLocale();
  const t = (source: string) => translate(source, locale);
  const posts = await getPosts(locale);
  return (
    <>
      <PageHeader />
      <main id="main" className={`shell ${styles.page}`}>
        <a className="text-link" href={localePath(locale, "/")}>
          {t("← Back to home")}
        </a>
        <Kicker>{t("Blog")}</Kicker>
        <h1 className="h2">
          {t("Notes on AI automation for finance and healthcare")}
        </h1>
        <p className="lead">{t(BLOG_DESCRIPTION)}</p>
        {posts.length ? (
          <ol className={styles.list}>
            {posts.map((post) => (
              <li key={post.slug}>
                <p className="label">
                  <time dateTime={post.date}>
                    {formatPostDate(post.date, locale)}
                  </time>
                  {post.draft && ` · ${t("Draft")}`}
                </p>
                <h2>
                  <a href={localePath(locale, `/blog/${post.slug}`)}>
                    {post.title}
                  </a>
                </h2>
                <p>{post.description}</p>
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
