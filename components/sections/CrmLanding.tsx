"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  CRM_ADVANCED,
  CRM_ASSISTANT,
  CRM_CUSTOM_WORK,
  CRM_ESSENTIALS,
  CRM_PIPELINE,
  CRM_PROMPTS,
  CRM_REASONS,
  CRM_REQUESTS,
  CRM_SECURITY,
  CRM_STACK,
  CRM_STEPS,
  crmPrice,
  type CrmFeature,
} from "@/lib/crm";
import { localePath } from "@/lib/locale";
import { fmtCurrency } from "@/lib/roi";
import {
  CONTACT_EMAIL,
  CRM_CTA,
  DISCOVERY_CALL_HREF,
  WHATSAPP_CTA,
  WHATSAPP_HREF,
  WHATSAPP_NUMBER,
} from "@/lib/site";
import { CrmBoard } from "../ui/CrmBoard";
import { Exhibit } from "../ui/Exhibit";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { Footer } from "./Footer";
import { PageHeader } from "./PageHeader";
import styles from "./CrmLanding.module.css";

const NUMERALS = ["i.", "ii.", "iii.", "iv."];

/** The proposal in the conversation exhibit is a deal from the pipeline exhibit. */
const PROPOSAL = CRM_PIPELINE.find((column) => column.stage === "Proposal")!
  .deals[0];

/**
 * /custom-crm: the full CRM offer. White-label (see lib/crm.ts); every claim is
 * a feature of the foundation or a step we take, never a certification.
 */
export function CrmLanding() {
  const { t, locale } = useLanguage();
  const currency = locale === "es" ? "MXN" : "USD";
  const price = crmPrice(locale);
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
      <PageHeader />
      <main id="main">
        <section className={`shell ${styles.hero}`} aria-labelledby="crm-title">
          <a className="text-link" href={localePath(locale, "/")}>
            {t("← Back to home")}
          </a>
          <div className={`grid-12 ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <Kicker>{t("Custom CRM")}</Kicker>
              <h1 id="crm-title" className="h2">
                {t("A CRM that fits your workflows,")}{" "}
                <em>{t("your team, and your data.")}</em>
              </h1>
              <p className="lead">
                {t(
                  "We set up a full-featured CRM on a proven open-source foundation and shape it to how you sell: your stages, your fields, your permissions.",
                )}
              </p>
              <p className={styles.from}>
                {t("Unlimited users, from {price} a month.", {
                  price: fmtPrice(price.month),
                })}
              </p>
              <div className={styles.actions}>
                <a className="button" href={DISCOVERY_CALL_HREF}>
                  {t(CRM_CTA)}
                </a>
                <a className="text-link" href="#essentials">
                  {t("See what’s included")} <Icon name="arrow" size={16} />
                </a>
              </div>
              <p className="caption">
                {t("Bookings are managed by Haab Calendar, our client and trusted partner.")}
              </p>
            </div>
            <Exhibit
              className={styles.heroExhibit}
              label={t("Exhibit {number}", { number: 1 })}
              title={t("A sales pipeline, stage by stage")}
              titleId="crm-pipeline-title"
              caption={t(
                "Illustrative. Invented names and figures. Stages and fields are set to match how you sell.",
              )}
            >
              <CrmBoard />
            </Exhibit>
          </div>
        </section>

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
                {t("A full-featured CRM that covers the basics, set up for your team.")}
              </p>
            </div>
            {featureList(CRM_ESSENTIALS)}
          </section>
          <section
            className={`shell section ${styles.features} ${styles.advanced}`}
            aria-labelledby="advanced-title"
          >
            <div className={styles.head}>
              <Kicker>{t("Built to grow")}</Kicker>
              <h2 id="advanced-title" className="h2-sm">
                {t("Ready for a bigger team and the tools around it.")}
              </h2>
              <p className="body">{t("Included in every CRM we set up.")}</p>
            </div>
            {featureList(CRM_ADVANCED)}
          </section>
        </div>

        <section
          className={`shell section grid-12 ${styles.assistant}`}
          aria-labelledby="assistant-title"
        >
          <div className={styles.assistantCopy}>
            <Kicker>{t("Talk to your CRM")}</Kicker>
            <h2 id="assistant-title" className="h2-sm">
              {t("Ask your CRM anything.")} <em>{t("In plain language.")}</em>
            </h2>
            <p className="body">
              {t(
                "Connect Claude, ChatGPT, or the agents we build for your team. They find contacts, review the pipeline, log notes, and move deals, with the same permissions as the person asking.",
              )}
            </p>
            <dl className={`rule-list ${styles.points}`}>
              {CRM_ASSISTANT.map(([term, detail]) => (
                <div key={term}>
                  <dt className={styles.itemTitle}>{t(term)}</dt>
                  <dd className="body">{t(detail)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Exhibit
            className={styles.chatExhibit}
            label={t("Exhibit {number}", { number: 2 })}
            title={t("A conversation with your CRM")}
            titleId="crm-chat-title"
            caption={t(
              "Illustrative. The assistant works with the same permissions as the person asking.",
            )}
          >
            <ol className={styles.chat}>
              <li>
                <span className="label">{t("You")}</span>
                <p>{t(CRM_PROMPTS[0])}</p>
              </li>
              <li className={styles.reply}>
                <span className="label">{t("Assistant")}</span>
                <p>
                  {t(
                    "{company}: {deal}, {value}. The proposal went out 16 days ago, with no activity since. Should I create a follow-up task?",
                    {
                      company: PROPOSAL.company,
                      deal: t(PROPOSAL.deal),
                      value: fmtCurrency(
                        PROPOSAL.value[currency],
                        locale,
                        currency,
                      ),
                    },
                  )}
                </p>
              </li>
              <li>
                <span className="label">{t("You")}</span>
                <p>{t("“Yes, for Friday.”")}</p>
              </li>
              <li className={styles.reply}>
                <span className="label">{t("Assistant")}</span>
                <p>
                  {t(
                    "Done. “Follow up on the audit proposal” is due Friday, assigned to you.",
                  )}
                </p>
                <span className="status status--ready">{t("Task created")}</span>
              </li>
            </ol>
          </Exhibit>
        </section>

        <section
          className={`shell section grid-12 ${styles.custom}`}
          aria-labelledby="custom-title"
        >
          <div className={styles.customCopy}>
            <Kicker>{t("Customization made easy")}</Kicker>
            <h2 id="custom-title" className="h2-sm">
              {t("Change it yourself.")} <em>{t("Or ask us.")}</em>
            </h2>
            <p className="lead">
              {t(
                "Admins change currency, deal stages, pipeline statuses, and more without a developer. Changes apply to the whole team right away.",
              )}
            </p>
          </div>
          <article className={styles.cell}>
            <p className="label">{t("Need something bigger?")}</p>
            <h3 className="h3">{t("Describe it in a sentence. We build it.")}</h3>
            <p className="body">
              {t("Tell us what you need. We build it, test it, and explain what changed.")}
            </p>
            <ul className={styles.checks}>
              {CRM_REQUESTS.map((request) => (
                <li key={request}>
                  <Icon name="check" size={14} />
                  {t(request)}
                </li>
              ))}
            </ul>
            <p className="caption">{t("Quoted before we start.")}</p>
          </article>
        </section>

        <section className="band-paper" aria-labelledby="why-title">
          <div className={`shell section grid-12 ${styles.why}`}>
            <div className={styles.head}>
              <Kicker>{t("Why this CRM")}</Kicker>
              <h2 id="why-title" className="h2-sm">
                {t("A working CRM on day one.")}{" "}
                <em>{t("Shaped to you after that.")}</em>
              </h2>
            </div>
            <ul className={styles.reasons}>
              {CRM_REASONS.map(([title, body]) => (
                <li key={title}>
                  <h3 className={styles.itemTitle}>{t(title)}</h3>
                  <p className="body">{t(body)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className={`shell section grid-12 ${styles.security}`}
          aria-labelledby="security-title"
        >
          <div className={styles.head}>
            <Kicker>{t("Security and access")}</Kicker>
            <h2 id="security-title" className="h2-sm">
              {t("Access you control.")}
            </h2>
            <a
              className="text-link text-link--accent"
              href={localePath(locale, "/security")}
            >
              {t("Read how we handle financial and patient data")}{" "}
              <Icon name="arrow" size={16} />
            </a>
          </div>
          <ul className={styles.reasons}>
            {CRM_SECURITY.map(([title, body]) => (
              <li key={title}>
                <h3 className={styles.itemTitle}>{t(title)}</h3>
                <p className="body">{t(body)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={`shell section ${styles.process}`}
          aria-labelledby="process-title"
        >
          <div className="grid-12">
            <div className={styles.head}>
              <Kicker>{t("How it works")}</Kicker>
              <h2 id="process-title" className="h2-sm">
                {t("From review to a CRM your team uses.")}
              </h2>
            </div>
            <ol className={`rule-list ${styles.steps}`}>
              {CRM_STEPS.map((step, i) => (
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
          <div className={styles.stack}>
            <p className="label">{t("Built with")}</p>
            <ul>
              {CRM_STACK.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <p className="caption">
              {t("Open-source tools, maintained by large communities.")}
            </p>
          </div>
        </section>

        <section
          id="pricing"
          className="band-paper"
          aria-labelledby="pricing-title"
        >
          <div className={`shell section ${styles.pricing}`}>
            <div className={styles.head}>
              <Kicker>{t("Pricing")}</Kicker>
              <h2 id="pricing-title" className="h2-sm">
                {t("Simple pricing. Unlimited users.")}
              </h2>
            </div>
            <div className={styles.plans}>
              <article className={`${styles.plan} ${styles.planBase}`}>
                <p className="label">{t("Base plan")}</p>
                <p className={styles.price}>
                  <span className="numeral">{fmtPrice(price.month)}</span>
                  <span className={styles.per}>{t("a month")}</span>
                </p>
                <p className="body">
                  {t("or {price} a year.", { price: fmtPrice(price.year) })}
                  {price.twoMonthsFree ? ` ${t("Two months free.")}` : null}
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
                  <li>
                    <Icon name="check" size={14} />
                    {t("Monthly or annual billing")}
                  </li>
                </ul>
                <p className="caption">
                  {t("Prices in {currency}.", { currency: price.currency })}
                </p>
                <a className="button" href={DISCOVERY_CALL_HREF}>
                  {t(CRM_CTA)}
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
                  {CRM_CUSTOM_WORK.map((item) => (
                    <li key={item}>
                      <Icon name="check" size={14} />
                      {t(item)}
                    </li>
                  ))}
                </ul>
                <a
                  className="button button--outline"
                  href={DISCOVERY_CALL_HREF}
                >
                  {t(CRM_CTA)}
                </a>
              </article>
            </div>
          </div>
        </section>

        <section
          className={`shell section grid-12 ${styles.close}`}
          aria-labelledby="close-title"
        >
          <div className={styles.closeCopy}>
            <Kicker>{t("Start with a CRM review")}</Kicker>
            <h2 id="close-title" className="h2">
              {t("Bring your sales process.")}{" "}
              <em>{t("We’ll show you how it fits.")}</em>
            </h2>
            <p className="lead">
              {t(
                "In 20 minutes we map your pipeline, the data you have today, and what your team needs on day one.",
              )}
            </p>
          </div>
          <div className={styles.closeActions}>
            <a className="button" href={DISCOVERY_CALL_HREF}>
              {t(CRM_CTA)}
            </a>
            <p className="caption">
              {t("Bookings are managed by Haab Calendar, our client and trusted partner.")}
            </p>
            <p className="label">{t("Prefer another channel?")}</p>
            <a className="text-link" href={WHATSAPP_HREF} rel="noopener">
              {t(WHATSAPP_CTA)}{" "}
              <span className="caption">{WHATSAPP_NUMBER}</span>
            </a>
            <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL} <Icon name="arrow" size={16} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
