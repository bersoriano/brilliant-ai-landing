"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { localePath } from "@/lib/locale";
import { FAQS } from "@/lib/faq";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./Faq.module.css";
/**
 * Questions and answers in native <details>. The homepage passes its short
 * list and links the rest on /services (`more`); /services shows them all.
 */
export function Faq({
  items = FAQS,
  more = false,
}: {
  items?: [question: string, answer: string][];
  more?: boolean;
}) {
  const { t, locale } = useLanguage();
  return (
    <section id="faq" className="section section-rule shell grid-12">
      <div className={styles.intro}>
        <Kicker>{t("A little more clarity")}</Kicker>
        <h2 className="h2-sm">
          {t("Good questions.")}
          <br />
          <em>{t("Straight answers.")}</em>
        </h2>
        <a href={DISCOVERY_CALL_HREF} className="text-link">
          {t(PRIMARY_CTA)} <Icon name="arrow" size={16} />
        </a>
        {more ? (
          <a href={localePath(locale, "/services#faq")} className="text-link text-link--accent">
            {t("More questions")} <Icon name="arrow" size={16} />
          </a>
        ) : null}
      </div>
      <div className={styles.list}>
        {items.map(([q, a]) => (
          <details key={q} className={styles.item}>
            <summary>
              {t(q)}
              <span aria-hidden="true">+</span>
            </summary>
            <p className="body">{t(a)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
