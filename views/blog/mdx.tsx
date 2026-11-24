import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { translate } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/locale";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { ArchitectureAdvisor } from "@/components/ui/ArchitectureAdvisor";
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
 * `<ReviewLink>` is an inline link to the same booking page, for a calm
 * mid-post invitation in prose; it is never a second button.
 * `<ArchitectureAdvisor />` embeds the homepage's architecture advisor
 * without its review invitation (the post's own `<BookReview />` stays the
 * only booking button) and without the link back to the post it sits in.
 */
export function postComponents(locale: Locale, sectionLinks: Record<string, string>): MDXComponents {
  const t = (source: string) => translate(source, locale);
  const sectionHeading = (Heading: "h2" | "h3" | "h4" | "h5" | "h6") =>
    ({ id, children, ...props }: ComponentProps<"h2">) => (
      <Heading id={id} data-alternate-section={id && sectionLinks[id]} {...props}>
        {children}
        {id?.startsWith("section-") && (
          <a className={styles.sectionLink} href={`#${id}`} aria-label={t("Link to this section")}>#</a>
        )}
      </Heading>
    );
  return {
    h2: sectionHeading("h2"),
    h3: sectionHeading("h3"),
    h4: sectionHeading("h4"),
    h5: sectionHeading("h5"),
    h6: sectionHeading("h6"),
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
    // Inline link to the same booking page, for a mid-post invitation in
    // prose. The button (<BookReview />) still appears once, at the end.
    ReviewLink: ({ children }: { children?: ReactNode }) => (
      <a href={DISCOVERY_CALL_HREF}>{children}</a>
    ),
    ArchitectureAdvisor: () => <ArchitectureAdvisor number={1} cta={false} guide={false} />,
    table: (props: ComponentProps<"table">) => (
      <div className={styles.tableWrap}>
        <table {...props} />
      </div>
    ),
  };
}
