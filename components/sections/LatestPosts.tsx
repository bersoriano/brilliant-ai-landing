import { translate } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/locale";
import { formatPostDate, type PostMeta } from "@/lib/posts";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./LatestPosts.module.css";

/** Homepage teaser for the blog. Server-rendered; hidden until a post is published. */
export function LatestPosts({
  locale,
  posts,
}: {
  locale: Locale;
  posts: PostMeta[];
}) {
  if (!posts.length) return null;
  const t = (source: string) => translate(source, locale);
  return (
    <section
      id="blog"
      className="section shell grid-12"
      aria-labelledby="blog-title"
    >
      <div className={styles.intro}>
        <Kicker>{t("Blog")}</Kicker>
        <h2 id="blog-title" className="h2-sm">
          {t("Notes on AI automation for finance and healthcare")}
        </h2>
        <a href={localePath(locale, "/blog")} className="text-link">
          {t("All posts")} <Icon name="arrow" size={16} />
        </a>
      </div>
      <ol className={styles.list}>
        {posts.map((post) => (
          <li key={post.slug}>
            <p className="label">
              <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
            </p>
            <h3>
              <a href={localePath(locale, `/blog/${post.slug}`)}>{post.title}</a>
            </h3>
            <p className="body">{post.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
