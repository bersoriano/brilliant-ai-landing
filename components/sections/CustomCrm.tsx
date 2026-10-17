"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { shouldRenderCaseStudy } from "@/lib/caseStudy";
import { CRM_ADVANCED, CRM_ESSENTIALS, CRM_POST_SLUG, crmPrice } from "@/lib/crm";
import { localePath } from "@/lib/locale";
import { fmtCurrency } from "@/lib/roi";
import { CRM_CTA, DISCOVERY_CALL_HREF } from "@/lib/site";
import { AgentPlays } from "../ui/AgentPlays";
import { Exhibit } from "../ui/Exhibit";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { Reveal } from "../ui/Reveal";
import styles from "./CustomCrm.module.css";

/** Homepage features: the essentials plus the first three advanced ones. */
const features = [...CRM_ESSENTIALS, ...CRM_ADVANCED.slice(0, 3)];

/**
 * A second offer, kept short and quiet so it never competes with the
 * automation work above it: the pitch, the agent playbook, and one ruled row
 * with the price and what's included. The full offer (assistant, custom
 * work, reasons) lives on /custom-crm.
 */
export function CustomCrm() {
  const { t, locale } = useLanguage();
  const price = crmPrice(locale);
  const fmtPrice = (n: number) => fmtCurrency(n, locale, price.currency);
  // Follows the gated case study (Exhibit 4) when it renders.
  const exhibitNumber = shouldRenderCaseStudy(
    process.env.NODE_ENV === "production",
  )
    ? 5
    : 4;
  return (
    <section id="crm" className="section section-rule shell" aria-labelledby="crm-title">
      <div className={`grid-12 ${styles.top}`}>
        <div className={styles.intro}>
          <Kicker>{t("Custom CRM")}</Kicker>
          <h2 id="crm-title" className="h2-sm">
            {t("A CRM built around your business.")}{" "}
            <em>{t("Not the other way around.")}</em>
          </h2>
          <p className="body">
            {t(
              "We set up a CRM on a proven open-source foundation and shape it to your pipeline, your team, and the way you already work.",
            )}{" "}
            {t("Clients, deals, tasks, and notes in one place, ready for your agents.")}
          </p>
          <div className={styles.actions}>
            <a href={DISCOVERY_CALL_HREF} className="button button--outline">
              {t(CRM_CTA)}
            </a>
            <a href="#crm-pricing" className="text-link">
              {t("See pricing")} <Icon name="arrow" size={16} />
            </a>
          </div>
          <p className="caption">
            {t("Bookings are managed by Haab Calendar, our client and trusted partner.")}
          </p>
          <a
            className={`text-link ${styles.post}`}
            href={localePath(locale, `/blog/${CRM_POST_SLUG}`)}
          >
            {t("Read: how AI is turning CRMs into systems of action")}{" "}
            <Icon name="arrow" size={16} />
          </a>
        </div>
        <Reveal className={styles.exhibit}>
          <Exhibit
            label={t("Exhibit {number}", { number: exhibitNumber })}
            tag={t("Examples")}
            title={t("Where an agent could start in your CRM")}
            titleId="crm-exhibit-title"
            caption={t(
              "Examples to adapt, not client results. Start with high-volume, low-judgment work, and keep a person on anything that leaves your team.",
            )}
          >
            <AgentPlays />
          </Exhibit>
        </Reveal>
      </div>

      <div id="crm-pricing" className={`grid-12 ${styles.block}`}>
        <div className={styles.plan}>
          <h3 className="h3">{t("Simple pricing. Unlimited users.")}</h3>
          <p className={styles.price}>
            <span className="label">{t("Base plan")}</span>
            <span className={styles.amount}>{fmtPrice(price.month)}</span>
            <span className={styles.per}>{t("a month")}</span>
          </p>
          <p className="caption">
            {t("or {price} a year.", { price: fmtPrice(price.year) })}
            {price.twoMonthsFree ? ` ${t("Two months free.")}` : null}{" "}
            {t("Prices in {currency}.", { currency: price.currency })}
          </p>
        </div>
        <div className={styles.included}>
          <p className={styles.includedHead}>
            <span className="label">{t("Everything a team needs from day one")}</span>
            <a
              className="text-link text-link--accent"
              href={localePath(locale, "/custom-crm")}
            >
              {t("See everything included")} <Icon name="arrow" size={15} />
            </a>
          </p>
          <ul className={styles.features}>
            {features.map(([, title, line]) => (
              <li key={title}>
                <strong>{t(title)}</strong>
                <span>{t(line)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
