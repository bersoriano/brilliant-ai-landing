"use client";
import type { ReactNode } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  CRM_ADVANCED,
  CRM_AGENT_PLAYS,
  CRM_ESSENTIALS,
  CRM_POST_SLUG,
  crmPrice,
  type CrmFeature,
} from "@/lib/crm";
import { ERP_FEATURES, ERP_PLAYS, erpPrice } from "@/lib/erp";
import { localePath } from "@/lib/locale";
import { fmtCurrency } from "@/lib/roi";
import {
  AGENT_EXAMPLES,
  SERVICES,
  WORKFLOW_EXAMPLES,
  service,
  type ServiceId,
} from "@/lib/services";
import { CRM_CTA, DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { HAAB_EXAMPLE_PATH, HAAB_FEATURES, haabHref } from "@/lib/software";
import { AgentPlays } from "../ui/AgentPlays";
import { Exhibit } from "../ui/Exhibit";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { Reveal } from "../ui/Reveal";
import { SoftwareVideo } from "./SoftwareVideo";
import { SystemOffer } from "./SystemOffer";
import styles from "./Services.module.css";

const NUMERALS = ["i.", "ii.", "iii.", "iv.", "v."];
/** Homepage CRM features: the essentials plus the first three advanced ones. */
const CRM_FEATURES = [...CRM_ESSENTIALS, ...CRM_ADVANCED.slice(0, 3)];

/**
 * Five offers as one set: workflows and agents for the repetitive work, the
 * CRM for clients and the pipeline, the ERP for the rest of the operations,
 * and custom software, shown through Haab Calendar, our own booking app.
 * Every block keeps approvals with a named person, and the section closes on
 * the review. The full CRM offer lives on /custom-crm.
 */
export function Services() {
  const { t, locale } = useLanguage();
  const crm = crmPrice(locale);
  const erp = erpPrice(locale);
  const name = (id: ServiceId) => t(service(id).name);
  const features = (list: CrmFeature[]): [string, string][] =>
    list.map(([, title, line]) => [t(title), t(line)]);
  const control = (text: string) => (
    <p className={`control ${styles.control}`}>
      <span className="control__label">{t("Stays with you")}</span>
      <span className="control__text">{text}</span>
    </p>
  );
  return (
    <section id="services" className="band-paper" aria-labelledby="services-title">
      <div className={`section shell ${styles.services}`}>
        <header className={`grid-12 ${styles.head}`}>
          <div className={styles.intro}>
            <Kicker>{t("Services")}</Kicker>
            <h2 id="services-title" className="h2">
              {t("We set up and run the systems and agents your team uses every day.")}{" "}
              <em>{t("Shaped to the way you already work.")}</em>
            </h2>
            <p className="lead">
              {t("You keep every approval. We handle the repetitive work.")}
            </p>
          </div>
          <nav className={styles.index} aria-label={t("Services")}>
            <ol>
              {SERVICES.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>
                    <span className="roman">{NUMERALS[i]}</span>
                    <span className={styles.indexName}>{t(item.name)}</span>
                    <span className={styles.indexLine}>{t(item.line)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <AutomationOffer
          id="services-workflows"
          kicker={name("services-workflows")}
          title={
            <>
              {t("Workflows that handle the work")}{" "}
              <em>{t("that arrives the same way every time.")}</em>
            </>
          }
          intro={t(
            "We build one reliable process around a task your team repeats — invoices, referrals, month-end packs, follow-ups — so the right information reaches the right person, ready for their approval.",
          )}
          starts={
            <p className={styles.starts}>
              <Icon name="flow" size={15} />
              {t("Starts with a trigger")}
            </p>
          }
          control={control(
            t(
              "You approve the exceptions. Nothing posts, pays, or files until a person you name says so.",
            ),
          )}
        >
          {WORKFLOW_EXAMPLES.map((example) => {
            const steps = t(example.steps).split(" → ");
            return (
              <li key={example.label}>
                <span className="label">{t(example.label)}</span>
                <ol className={styles.chain}>
                  {steps.map((step, n) => (
                    <li
                      key={step}
                      data-node={
                        n === 0 ? "start" : n === steps.length - 1 ? "human" : "work"
                      }
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </li>
            );
          })}
        </AutomationOffer>

        <AutomationOffer
          id="services-agents"
          kicker={name("services-agents")}
          title={
            <>
              {t("Agents for the work")} <em>{t("that changes from day to day.")}</em>
            </>
          }
          intro={t(
            "Each person on your team gets agents that find, draft, and follow up inside the tools you already use. They work with the same permissions as the person asking, and every important step waits for approval.",
          )}
          starts={
            <p className={styles.starts} data-kind="agent">
              <Icon name="people" size={15} />
              {t("Starts with a request")}
            </p>
          }
          control={control(
            t(
              "If it starts with a request in plain language, an agent handles it. You stay in control of what goes out.",
            ),
          )}
        >
          {AGENT_EXAMPLES.map((example) => (
            <li key={example.request}>
              <p className={styles.request}>
                <span className={styles.asker} aria-hidden="true">
                  <Icon name="people" size={14} />
                </span>
                <span>{t(example.request)}</span>
              </p>
              <dl className={styles.chain}>
                <div data-node="work">
                  <dt className="label">{t("What it does")}</dt>
                  <dd>{t(example.agent)}</dd>
                </div>
                <div data-node="human">
                  <dt className="label">{t("Your call")}</dt>
                  <dd>{t(example.you)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </AutomationOffer>

        <SystemOffer
          id="crm"
          kicker={name("crm")}
          title={
            <>
              {t("A CRM built around your business.")}{" "}
              <em>{t("Not the other way around.")}</em>
            </>
          }
          intro={
            <>
              {t(
                "We set up a CRM and shape it to your pipeline, your team, and the way you already work.",
              )}{" "}
              {t("Clients, deals, tasks, and notes in one place, ready for your agents.")}
            </>
          }
          actions={
            <div className={styles.actions}>
              <a href={DISCOVERY_CALL_HREF} className="button button--outline">
                {t(CRM_CTA)}
              </a>
              <a
                className={`text-link ${styles.post}`}
                href={localePath(locale, `/blog/${CRM_POST_SLUG}`)}
              >
                {t("Read: how AI is turning CRMs into systems of action")}{" "}
                <Icon name="arrow" size={16} />
              </a>
            </div>
          }
          exhibit={
            <Exhibit
              label={t("Exhibit {number}", { number: 4 })}
              tag={t("Examples")}
              title={t("Where an agent could start in your CRM")}
              titleId="crm-exhibit-title"
              caption={t(
                "Examples to adapt, not client results. Start with high-volume, low-judgment work, and keep a person on anything that leaves your team.",
              )}
            >
              <AgentPlays
                plays={CRM_AGENT_PLAYS}
                id="crm-play"
                label={t("Where an agent could start in your CRM")}
              />
            </Exhibit>
          }
          notes={[
            [
              t("Ask in plain language"),
              t(
                "Connect Claude, ChatGPT, or the agents we build for your team. They find contacts, review the pipeline, log notes, and move deals, with the same permissions as the person asking.",
              ),
            ],
            [
              t("Need something new? Ask for it."),
              t(
                "Tell us what your team needs (a contracts page, renewal dates, a dashboard by region) and we add it. Everyday changes such as deal stages and pipeline statuses stay with your team.",
              ),
              t("Quoted before we start."),
            ],
          ]}
          plan={
            <>
              <h4 className="h3">{t("Simple pricing. Unlimited users.")}</h4>
              <p className={styles.price}>
                <span className="label">{t("Base plan")}</span>
                <span className={styles.amount}>
                  {fmtCurrency(crm.month, locale, crm.currency)}
                </span>
                <span className={styles.per}>{t("a month")}</span>
              </p>
              <p className="caption">
                {t("or {price} a year.", {
                  price: fmtCurrency(crm.year, locale, crm.currency),
                })}
                {crm.twoMonthsFree ? ` ${t("Two months free.")}` : null}{" "}
                {t("Prices in {currency}.", { currency: crm.currency })}
              </p>
            </>
          }
          included={{
            label: t("Everything a team needs from day one"),
            link: (
              <a
                className="text-link text-link--accent"
                href={localePath(locale, "/custom-crm")}
              >
                {t("See everything included")} <Icon name="arrow" size={15} />
              </a>
            ),
            features: features(CRM_FEATURES),
          }}
        />

        <SystemOffer
          id="erp"
          kicker={name("erp")}
          title={
            <>
              {t("A complete system for your operations.")}{" "}
              <em>{t("Not a collection of spreadsheets and tools.")}</em>
            </>
          }
          intro={
            <>
              {t(
                "We set up a full business system that brings your sales, inventory, purchasing, invoicing, and accounting together.",
              )}{" "}
              {t(
                "It’s shaped to the way your team already works, so invoices, stock, orders, and reports live in one place, ready for the agents we build for you.",
              )}
            </>
          }
          exhibit={
            <Exhibit
              label={t("Exhibit {number}", { number: 5 })}
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
          notes={[
            [
              t("Ask in plain language"),
              t(
                "Connect the agents we build, or Claude or ChatGPT. They find open invoices, check stock, draft a purchase order, or summarize what’s waiting for approval, always with the same permissions as the person asking. Nothing posts or pays without your team’s approval.",
              ),
            ],
            [
              t("Need something new? Ask for it."),
              t(
                "Tell us what your process needs (a new approval step, a custom report, a field for your industry) and we add it. Everyday changes such as stages, statuses, or who can approve stay with your team.",
              ),
              t("Quoted before we start."),
            ],
          ]}
          plan={
            <>
              <h4 className="h3">{t("Simple pricing. Unlimited users.")}</h4>
              <p className={styles.price}>
                <span className="label">{t("Base plan, from")}</span>
                <span className={styles.amount}>
                  {fmtCurrency(erp.month, locale, erp.currency)}
                </span>
                <span className={styles.per}>{t("a month")}</span>
              </p>
              <p className="caption">
                {t("No per-seat fees.")}{" "}
                {t("Prices in {currency}.", { currency: erp.currency })}
              </p>
              <p className={styles.planNote}>
                {t(
                  "Your budget goes into shaping the system around your operations, not into rebuilding the basics.",
                )}
              </p>
              <a href="#contact" className="text-link text-link--accent">
                {t("Or contact us for a scoped pilot")} <Icon name="arrow" size={15} />
              </a>
            </>
          }
          included={{
            label: t("Everything a team needs from day one"),
            features: features(ERP_FEATURES),
          }}
        />

        <SystemOffer
          id="software"
          kicker={name("software")}
          title={
            <>
              {t("Software built for one job.")}{" "}
              <em>{t("When nothing off the shelf fits.")}</em>
            </>
          }
          intro={
            <>
              {t(
                "When the tool your business needs doesn’t exist, we build it and keep it running.",
              )}{" "}
              {t(
                "Haab Calendar is our own: a booking app for clinics, studios, venues, and events, in English and Spanish.",
              )}
            </>
          }
          actions={
            <div className={styles.actions}>
              <a
                className="text-link text-link--accent"
                href={haabHref(locale)}
                rel="noopener noreferrer"
              >
                {t("See Haab Calendar")} <Icon name="arrow" size={16} />
              </a>
              <a
                className={`text-link ${styles.post}`}
                href={haabHref(locale, HAAB_EXAMPLE_PATH)}
                rel="noopener noreferrer"
              >
                {t("Try a live booking page")} <Icon name="arrow" size={16} />
              </a>
            </div>
          }
          exhibit={<SoftwareVideo />}
          notes={[
            [
              t("Built around your process"),
              t(
                "We start from the work your team and your clients already do, and build only what that work needs. You approve the scope before we start.",
              ),
            ],
            [
              t("We keep it running"),
              t(
                "After launch, updates, fixes, and new features stay with us. Your team decides what changes and when.",
              ),
              t("Quoted before we start."),
            ],
          ]}
          plan={
            <>
              <h4 className="h3">{t("Priced by project.")}</h4>
              <p className={styles.planNote}>
                {t("You approve the scope and the quote before we build anything.")}
              </p>
              <a href="#contact" className="text-link text-link--accent">
                {t("Or contact us for a scoped pilot")} <Icon name="arrow" size={15} />
              </a>
            </>
          }
          included={{
            label: t("What Haab Calendar does today"),
            features: HAAB_FEATURES.map(([title, line]) => [t(title), t(line)]),
          }}
        />

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
      </div>
    </section>
  );
}

/**
 * Workflows and agents: the pitch, then what starts it and three examples,
 * ending on what stays with your team. Strings arrive translated.
 */
function AutomationOffer({
  id,
  kicker,
  title,
  intro,
  starts,
  control,
  children,
}: {
  id: string;
  kicker: string;
  title: ReactNode;
  intro: string;
  starts: ReactNode;
  control: ReactNode;
  children: ReactNode;
}) {
  return (
    <article id={id} className={`grid-12 ${styles.offer}`} aria-labelledby={`${id}-title`}>
      <div className={styles.copy}>
        <Kicker>{kicker}</Kicker>
        <h3 id={`${id}-title`} className="h2-sm">
          {title}
        </h3>
        <p className="body">{intro}</p>
      </div>
      <Reveal className={styles.side}>
        <div className={styles.specimen}>
          {starts}
          <ul className={styles.examples}>{children}</ul>
          {control}
        </div>
      </Reveal>
    </article>
  );
}
