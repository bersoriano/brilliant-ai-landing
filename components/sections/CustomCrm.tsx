"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { shouldRenderCaseStudy } from "@/lib/caseStudy";
import {
  CRM_ADVANCED,
  CRM_ESSENTIALS,
  CRM_POST_SLUG,
  CRM_PROMPTS,
  CRM_REASONS,
  CRM_REQUESTS,
  crmPrice,
} from "@/lib/crm";
import { localePath } from "@/lib/locale";
import { fmtCurrency } from "@/lib/roi";
import { CRM_CTA, DISCOVERY_CALL_HREF } from "@/lib/site";
import { AgentPlays } from "../ui/AgentPlays";
import { Exhibit } from "../ui/Exhibit";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./CustomCrm.module.css";

/** Homepage features: the essentials plus the first three advanced ones. */
const features = [...CRM_ESSENTIALS, ...CRM_ADVANCED.slice(0, 3)];

/** A second offer: a CRM on an open-source foundation, shaped to the client. */
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
    <section id="crm" className="section shell" aria-labelledby="crm-title">
      <div className={`grid-12 ${styles.top}`}>
        <div className={styles.intro}>
          <Kicker>{t("Custom CRM")}</Kicker>
          <h2 id="crm-title" className="h2">
            {t("A CRM built around your business.")}{" "}
            <em>{t("Not the other way around.")}</em>
          </h2>
          <p className="lead">
            {t(
              "We set up a CRM on a proven open-source foundation and shape it to your pipeline, your team, and the way you already work.",
            )}{" "}
            {t("Clients, deals, tasks, and notes in one place, ready for your agents.")}
          </p>
          <a
            className="text-link text-link--accent"
            href={localePath(locale, `/blog/${CRM_POST_SLUG}`)}
          >
            {t("Read: how AI is turning CRMs into systems of action")}{" "}
            <Icon name="arrow" size={16} />
          </a>
          <div className={styles.actions}>
            <a href={DISCOVERY_CALL_HREF} className="button">
              {t(CRM_CTA)}
            </a>
            <a href="#crm-pricing" className="text-link">
              {t("See pricing")} <Icon name="arrow" size={16} />
            </a>
          </div>
          <p className="caption">
            {t("Bookings are managed by Haab Calendar, our client and trusted partner.")}
          </p>
        </div>
        <Exhibit
          className={styles.exhibit}
          label={t("Exhibit {number}", { number: exhibitNumber })}
          title={t("Where an agent could start in your CRM")}
          titleId="crm-exhibit-title"
          caption={t(
            "Examples to adapt, not client results. Start with high-volume, low-judgment work, and keep a person on anything that leaves your team.",
          )}
        >
          <AgentPlays />
        </Exhibit>
      </div>

      <div className={`grid-12 ${styles.block}`}>
        <div className={styles.blockHead}>
          <h3 className="h3">{t("Everything a team needs from day one")}</h3>
          <p className="caption">{t("Included in every CRM we set up.")}</p>
          <a
            className="text-link text-link--accent"
            href={localePath(locale, "/custom-crm")}
          >
            {t("See everything included")} <Icon name="arrow" size={16} />
          </a>
        </div>
        <ul className={styles.features}>
          {features.map(([, title, line]) => (
            <li key={title}>
              <strong>{t(title)}</strong>
              <span>{t(line)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.cells}>
        <article className={styles.cell}>
          <p className="label">{t("Talk to your CRM")}</p>
          <h3 className="h3">{t("Ask in plain language.")}</h3>
          <p className="body">
            {t(
              "Connect Claude, ChatGPT, or the agents we build for your team. They find contacts, review the pipeline, log notes, and move deals, with the same permissions as the person asking.",
            )}
          </p>
          <ul className={styles.prompts}>
            {CRM_PROMPTS.map((prompt) => (
              <li key={prompt}>{t(prompt)}</li>
            ))}
          </ul>
        </article>
        <article className={styles.cell}>
          <p className="label">{t("Shaped to you")}</p>
          <h3 className="h3">{t("Need something new? Ask for it.")}</h3>
          <p className="body">
            {t(
              "Tell us what your team needs and we build it into your CRM. Admins can change deal stages, statuses, and currency without a developer.",
            )}
          </p>
          <ul className={styles.requests}>
            {CRM_REQUESTS.map((request) => (
              <li key={request}>
                <Icon name="check" size={14} />
                {t(request)}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div id="crm-pricing" className={`grid-12 ${styles.block}`}>
        <div className={styles.blockHead}>
          <h3 className="h3">{t("Simple pricing. Unlimited users.")}</h3>
          <p className={`label ${styles.planLabel}`}>{t("Base plan")}</p>
          <p className={styles.price}>
            <span className="numeral">{fmtPrice(price.month)}</span>
            <span className={styles.per}>{t("a month")}</span>
          </p>
          <p className="body">
            {t("or {price} a year.", { price: fmtPrice(price.year) })}
            {price.twoMonthsFree ? ` ${t("Two months free.")}` : null}
          </p>
          <p className="caption">
            {t("Prices in {currency}.", { currency: price.currency })}
          </p>
          <a href={DISCOVERY_CALL_HREF} className="button button--outline">
            {t(CRM_CTA)}
          </a>
        </div>
        <div className={styles.reasonsBlock}>
          <dl className={styles.reasons}>
            {CRM_REASONS.map(([term, detail]) => (
              <div key={term}>
                <dt className="label">{t(term)}</dt>
                <dd>{t(detail)}</dd>
              </div>
            ))}
          </dl>
          <a
            className="text-link text-link--accent"
            href={localePath(locale, "/security")}
          >
            {t("Read how we handle financial and patient data")}{" "}
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
