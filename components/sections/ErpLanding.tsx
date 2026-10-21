"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { CrmFeature } from "@/lib/crm";
import {
  ERP_CUSTOM_WORK,
  ERP_FEATURES,
  ERP_NOTES,
  ERP_PLAYS,
  ERP_STEPS,
  erpPrice,
} from "@/lib/erp";
import { localePath } from "@/lib/locale";
import type { NoteLink } from "@/lib/posts";
import { fmtCurrency } from "@/lib/roi";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { AgentPlays } from "../ui/AgentPlays";
import { Exhibit } from "../ui/Exhibit";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { Footer } from "./Footer";
import { LandingClose, LandingHero, NotesList } from "./Landing";
import { Navbar } from "./Navbar";
import styles from "./Landing.module.css";

const NUMERALS = ["i.", "ii.", "iii.", "iv."];

/**
 * /custom-erp: the full ERP offer, laid out like /custom-crm. White-label
 * (see lib/erp.ts): every feature listed ships with the system underneath,
 * which this page never names.
 */
export function ErpLanding({ notes }: { notes: NoteLink[] }) {
  const { t, locale } = useLanguage();
  const price = erpPrice(locale);
  const fmtPrice = (n: number) => fmtCurrency(n, locale, price.currency);
  const featureList = (items: CrmFeature[]) => (
    <ul className={styles.featureGrid}>
      {items.map(([icon, title, line]) => (
        <li key={title}>
          <Icon name={icon} size={22} />
          <h3 className={styles.itemTitle}>{t(title)}</h3>
          <p className="body">{t(line)}</p>
        </li>
      ))}
    </ul>
  );
  return (
    <>
      <Navbar />
      <main id="main">
        <LandingHero
          titleId="erp-title"
          kicker={t("Custom ERP")}
          title={
            <>
              {t("A complete system for your operations.")}{" "}
              <em>{t("Not a collection of spreadsheets and tools.")}</em>
            </>
          }
          lead={
            <>
              {t(
                "We set up a full business system that brings your sales, inventory, purchasing, invoicing, and accounting together.",
              )}{" "}
              {t(
                "It’s shaped to the way your team already works, so invoices, stock, orders, and reports live in one place, ready for the agents we build for you.",
              )}
            </>
          }
          secondary={
            <a className="text-link" href="#essentials">
              {t("See what’s included")} <Icon name="arrow" size={16} />
            </a>
          }
          aside={
            <Exhibit
              label={t("Exhibit {number}", { number: 1 })}
              tag={t("Examples")}
              title={t("Where your ERP takes work off your team")}
              titleId="erp-exhibit-title"
              caption={t(
                "Examples to adapt, not client results. A person on your team approves anything that is recorded, paid, or ordered.",
              )}
            >
              <AgentPlays
                plays={ERP_PLAYS}
                id="erp-play"
                label={t("Where your ERP takes work off your team")}
              />
            </Exhibit>
          }
        >
          <p className={styles.from}>
            {t("Unlimited users, from {price} a month.", {
              price: fmtPrice(price.month),
            })}
          </p>
        </LandingHero>

        <div className="band-paper">
          <section
            id="essentials"
            className={`shell section ${styles.features}`}
            aria-labelledby="essentials-title"
          >
            <div className={styles.head}>
              <Kicker>{t("The essentials")}</Kicker>
              <h2 id="essentials-title" className="h2-sm">
                {t("Everything a team needs from day one")}
              </h2>
              <p className="body">
                {t("Included in every ERP we set up, shaped to your operations.")}
              </p>
            </div>
            {featureList(ERP_FEATURES)}
          </section>
        </div>

        <section
          className={`shell section grid-12 ${styles.why}`}
          aria-labelledby="ask-title"
        >
          <div className={styles.head}>
            <Kicker>{t("Talk to your ERP")}</Kicker>
            <h2 id="ask-title" className="h2-sm">
              {t("Ask in plain language.")}{" "}
              <em>{t("Your team still approves.")}</em>
            </h2>
            <a
              className="text-link text-link--accent"
              href={localePath(locale, "/security")}
            >
              {t("Read how we handle financial and patient data")}{" "}
              <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className={styles.side}>
            <ul className={styles.reasons}>
              {ERP_NOTES.map(([title, body, caption]) => (
                <li key={title}>
                  <h3 className={styles.itemTitle}>{t(title)}</h3>
                  <p className="body">{t(body)}</p>
                  {caption ? <p className="caption">{t(caption)}</p> : null}
                </li>
              ))}
            </ul>
            <NotesList notes={notes} />
          </div>
        </section>

        <section
          className={`shell section ${styles.process}`}
          aria-labelledby="process-title"
        >
          <div className="grid-12">
            <div className={styles.head}>
              <Kicker>{t("How it works")}</Kicker>
              <h2 id="process-title" className="h2-sm">
                {t("From review to an ERP your team uses.")}
              </h2>
            </div>
            <ol className={`rule-list ${styles.steps}`}>
              {ERP_STEPS.map((step, i) => (
                <li key={step.title} className={styles.step}>
                  <span className="roman roman--lg">{NUMERALS[i]}</span>
                  <div>
                    <h3 className="h3">{t(step.title)}</h3>
                    <p className="body">{t(step.body)}</p>
                  </div>
                  <span className={`label ${styles.stepLabel}`}>
                    {t(step.label)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" className="band-paper" aria-labelledby="pricing-title">
          <div className={`shell section ${styles.pricing}`}>
            <div className={styles.head}>
              <Kicker>{t("Pricing")}</Kicker>
              <h2 id="pricing-title" className="h2-sm">
                {t("Simple pricing. Unlimited users.")}
              </h2>
              <p className="body">
                {t(
                  "Your budget goes into shaping the system around your operations, not into rebuilding the basics.",
                )}
              </p>
            </div>
            <div className={styles.plans}>
              <article className={`${styles.plan} ${styles.planBase}`}>
                <p className="label">{t("Base plan, from")}</p>
                <p className={styles.price}>
                  <span className="numeral">{fmtPrice(price.month)}</span>
                  <span className={styles.per}>{t("a month")}</span>
                </p>
                <ul className={styles.checks}>
                  <li>
                    <Icon name="check" size={14} />
                    {t("Unlimited users")}
                  </li>
                  <li>
                    <Icon name="check" size={14} />
                    {t("No per-seat pricing")}
                  </li>
                </ul>
                <p className="caption">
                  {t("Prices in {currency}.", { currency: price.currency })}
                </p>
                <a className="button" href={DISCOVERY_CALL_HREF}>
                  {t(PRIMARY_CTA)}
                </a>
              </article>
              <article className={styles.plan}>
                <p className="label">{t("Custom work")}</p>
                <p className={styles.planTitle}>{t("Quoted after the review")}</p>
                <p className="body">
                  {t(
                    "When you need more than the base plan, we scope it with you and quote it before we start.",
                  )}
                </p>
                <ul className={styles.checks}>
                  {ERP_CUSTOM_WORK.map((item) => (
                    <li key={item}>
                      <Icon name="check" size={14} />
                      {t(item)}
                    </li>
                  ))}
                </ul>
                <a className="button button--outline" href="#contact">
                  {t("Or contact us for a scoped pilot")}
                </a>
              </article>
            </div>
          </div>
        </section>

        <LandingClose
          title={
            <>
              {t("Bring your operations.")}{" "}
              <em>{t("We’ll show you how it fits.")}</em>
            </>
          }
          lead={t(
            "In 20 minutes we map your operations, the data you have today, and what your team needs on day one.",
          )}
        />
      </main>
      <Footer />
    </>
  );
}
