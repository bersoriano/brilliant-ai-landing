import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { translate } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/locale";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import styles from "./Blog.module.css";

/**
 * How post Markdown maps to site markup. Internal links follow the post's
 * language (`/security` becomes `/es/security` in a Spanish post), external
 * links open safely, and images are local files under `public/` (the tests
 * reject remote images: the site makes no third-party image requests).
 * `<Takeaway>` is the boxed summary that opens a post, under the "Who this
 * is for" line. `<BookReview />` closes the "Next step" section with the
 * booking button, right after the line that invites the reader to the review
 * (before any sources or footnotes), so the ask keeps the PRIMARY_CTA label.
 */
export function postComponents(locale: Locale): MDXComponents {
  const t = (source: string) => translate(source, locale);
  return {
    a: ({ href = "", ...props }: ComponentProps<"a">) => {
      if (/^https?:\/\//.test(href))
        return <a href={href} rel="noopener noreferrer" {...props} />;
      const internal = href.startsWith("/") && !href.startsWith("//");
      return <a href={internal ? localePath(locale, href) : href} {...props} />;
    },
    img: ({ alt = "", ...props }: ComponentProps<"img">) => (
      <img alt={alt} loading="lazy" decoding="async" {...props} />
    ),
    Takeaway: ({ children }: { children?: ReactNode }) => (
      <div className={styles.takeaway} role="note">
        <p className="label">{t("Key takeaway")}</p>
        {children}
      </div>
    ),
    BookReview: () => (
      <p className={styles.book}>
        <a href={DISCOVERY_CALL_HREF} className="button">
          {t(PRIMARY_CTA)}
        </a>
      </p>
    ),
    table: (props: ComponentProps<"table">) => (
      <div className={styles.tableWrap}>
        <table {...props} />
      </div>
    ),
  };
}
