"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { DISCOVERY_CALL_HREF } from "@/lib/site";
import { FAQS } from "@/lib/faq";
import { Icon } from "../ui/Icon";
export function Faq() {
  const { t } = useLanguage();
  return (
    <section id="faq" className="section shell faq-section">
      <div className="faq-intro">
        <span className="eyebrow">{t("A little more clarity")}</span>
        <h2>
          {t("Good questions.")}
          <br />
          {t("Straight answers.")}
        </h2>
        <p>
          {t("Thoughtful automation starts")}
          <br />
          {t("with an honest conversation.")}
        </p>
        <a href={DISCOVERY_CALL_HREF} className="text-link">
          {t("Ask us something else")} <Icon name="arrow" size={17} />
        </a>
      </div>
      <div className="faq-list">
        {FAQS.map(([q, a]) => (
          <details key={q}>
            <summary>
              {t(q)}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{t(a)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
