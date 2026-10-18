import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { translate } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/locale";
import styles from "./Blog.module.css";

/**
 * How post Markdown maps to site markup. Internal links follow the post's
 * language (`/security` becomes `/es/security` in a Spanish post), external
 * links open safely, and images are local files under `public/` (the tests
 * reject remote images: the site makes no third-party image requests).
 * `<Takeaway>` is the boxed summary that opens a post, under the "Who this
 * is for" line.
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
    table: (props: ComponentProps<"table">) => (
      <div className={styles.tableWrap}>
        <table {...props} />
      </div>
    ),
  };
}
