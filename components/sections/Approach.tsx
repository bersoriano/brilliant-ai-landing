import { translate } from "@/lib/i18n";
import { APPROACH_RULES, INSIGHTS } from "@/lib/insights";
import { localePath, type Locale } from "@/lib/locale";
import type { PostMeta } from "@/lib/posts";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./Approach.module.css";

/**
 * "What we've learned": four operator rules, each linked to the note that
 * explains it. Server-rendered so the links carry each note's own title.
 * A rule whose note is missing or unpublished simply shows no link.
 */
export function Approach({
  locale,
  notes,
}: {
  locale: Locale;
  notes: Record<string, PostMeta | null>;
}) {
  const t = (source: string) => translate(source, locale);
  return (
    <section
      id="approach"
      className="section shell grid-12"
      aria-labelledby="approach-title"
    >
      <div className={styles.intro}>
        <Kicker>{t("What we’ve learned")}</Kicker>
        <h2 id="approach-title" className="h2-sm">
          {t("Most of the work is in the exceptions.")}{" "}
          <em>{t("So that’s where we start.")}</em>
        </h2>
        <p className="body">
          {t(
            "Four rules we hold to on every workflow, from invoices and month-end to referrals and missing documents.",
          )}
        </p>
        <a className="text-link text-link--accent" href={DISCOVERY_CALL_HREF}>
          {t(PRIMARY_CTA)} <Icon name="arrow" size={16} />
        </a>
      </div>
      <ul className={styles.rules}>
        {APPROACH_RULES.map((rule) => {
          const note = rule.note ? notes[INSIGHTS[rule.note]] : null;
          const href = note
            ? localePath(locale, `/blog/${note.slug}`)
            : rule.href
              ? localePath(locale, rule.href)
              : null;
          const label = note ? note.title : rule.linkLabel ? t(rule.linkLabel) : null;
          // Keep the arrow on the same line as the last word.
          const words = label ? label.split(" ") : [];
          const last = words.pop();
          return (
            <li key={rule.title}>
              <h3 className={styles.title}>{t(rule.title)}</h3>
              <p className="body">{t(rule.body)}</p>
              {href && label ? (
                <a className={styles.link} href={href}>
                  {note ? <span className="label">{t("Note")}</span> : null}
                  <span>
                    {words.join(" ")}{" "}
                    <span className={styles.tail}>
                      {last} <Icon name="arrow" size={14} />
                    </span>
                  </span>
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
