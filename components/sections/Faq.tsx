"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { FAQS } from "@/lib/faq";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./Faq.module.css";
export function Faq() {
  const { t } = useLanguage();
  return (
    <section id="faq" className="section shell grid-12">
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
      </div>
      <div className={styles.list}>
        {FAQS.map(([q, a]) => (
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
