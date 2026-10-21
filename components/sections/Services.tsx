"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { crmPrice } from "@/lib/crm";
import { erpPrice } from "@/lib/erp";
import { localePath } from "@/lib/locale";
import { fmtCurrency } from "@/lib/roi";
import { SERVICES } from "@/lib/services";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./Services.module.css";

/**
 * The five offers as one set: workflows and agents for the repetitive work,
 * the CRM for clients and the pipeline, the ERP for the rest of the
 * operations, and custom software for what nothing off the shelf does. The
 * homepage shows a card for each and links its page, where the full offer
 * lives; the section closes on the review.
 */
export function Services() {
  const { t } = useLanguage();
  return (
    <section id="services" className="band-paper" aria-labelledby="services-title">
      <div className={`section shell ${styles.services}`}>
        <header className={styles.intro}>
          <Kicker>{t("Services")}</Kicker>
          <h2 id="services-title" className="h2">
            {t("We set up and run the systems and agents your team uses every day.")}{" "}
            <em>{t("Shaped to the way you already work.")}</em>
          </h2>
          <p className="lead">
            {t("You keep every approval. We handle the repetitive work.")}
          </p>
        </header>
        <ServiceCards anchors />
        <ServicesClose />
      </div>
    </section>
  );
}

/**
 * One card per offer: what it is, one example or the starting price, and a
 * link to its page. With `anchors`, each card keeps the offer's old homepage
 * anchor (#crm, #erp, …) so existing links still land on it.
 */
export function ServiceCards({ anchors = false }: { anchors?: boolean }) {
  const { t, locale } = useLanguage();
  const prices = { crm: crmPrice(locale), erp: erpPrice(locale) };
  return (
    <ul className={styles.cards}>
      {SERVICES.map((item, i) => {
        const price = item.id === "crm" || item.id === "erp" ? prices[item.id] : null;
        return (
          <li key={item.id} id={anchors ? item.id : undefined} className={styles.card}>
            <span className="roman">{["i.", "ii.", "iii.", "iv.", "v."][i]}</span>
            <h3 className="h3">{t(item.name)}</h3>
            <p className="label">{t(item.line)}</p>
            <p className="body">{t(item.summary)}</p>
            <p
              className={styles.example}
              data-kind={item.id === "services-agents" ? "request" : undefined}
            >
              {t(
                item.example,
                price
                  ? { price: fmtCurrency(price.month, locale, price.currency) }
                  : undefined,
              )}
            </p>
            <a
              className={`text-link text-link--accent ${styles.more}`}
              href={localePath(locale, item.path)}
            >
              {t("Learn more")}
              <span className="sr-only">: {t(item.name)}</span>{" "}
              <Icon name="arrow" size={15} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** One line and the review: for visitors who can't tell which offer fits. */
export function ServicesClose() {
  const { t } = useLanguage();
  return (
    <div className={styles.close}>
      <p className={styles.closeLine}>
        {t("Not sure which one fits? Bring one task to the review. We’ll tell you where to start.")}
      </p>
      <div className={styles.closeActions}>
        <a href={DISCOVERY_CALL_HREF} className="button">
          {t(PRIMARY_CTA)}
        </a>
        <p className="caption">
          {t("Bookings run on Haab Calendar, a booking app we built.")}
        </p>
      </div>
    </div>
  );
}
