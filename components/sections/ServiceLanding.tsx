"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localePath } from "@/lib/locale";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import { WORKFLOWS, type Industry } from "@/lib/workflows";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { PageHeader } from "./PageHeader";
import { Footer } from "./Footer";
import styles from "./ServiceLanding.module.css";

type ServiceIndustry = Extract<Industry, "finance" | "healthcare">;

const content = {
  finance: {
    kicker: "Finance workflow automation",
    title: "Give finance more time to review, less to chase.",
    intro:
      "Supplier invoices, close checklists, and missing documents arrive from different places. We build one managed workflow around a task your team repeats, so the right information reaches the right reviewer.",
    examples: "Finance tasks we can help organize",
    control:
      "Your team keeps control of accounting entries, payments, and exceptions. We agree on source systems, checks, and approval rules before connecting data; a pilot runs alongside your current process first.",
    related: "Explore healthcare automation",
    relatedPath: "/healthcare-automation",
  },
  healthcare: {
    kicker: "Healthcare workflow automation",
    title: "Keep administrative work moving around patient care.",
    intro:
      "Referrals, intake details, and billing follow-ups often cross inboxes and systems. We build one managed administrative workflow around your existing tools, with staff reviewing exceptions and clinical decisions.",
    examples: "Healthcare tasks we can help organize",
    control:
      "Your team decides what may be shared, who can access it, and which approvals remain with staff. We agree on any BAA and data-handling requirements before sensitive information is connected. Clinical records are not changed automatically.",
    related: "Explore finance automation",
    relatedPath: "/finance-automation",
  },
} as const;

export function ServiceLanding({ industry }: { industry: ServiceIndustry }) {
  const { t, locale } = useLanguage();
  const copy = content[industry];
  const workflows = WORKFLOWS.filter((workflow) => workflow.industry === industry);
  return (
    <>
      <PageHeader />
      <main id="main">
        <section className={`shell ${styles.hero}`}>
          <a className="text-link" href={localePath(locale, "/")}>
            {t("← Back to home")}
          </a>
          <Kicker>{t(copy.kicker)}</Kicker>
          <h1 className="h2">{t(copy.title)}</h1>
          <p className="lead">{t(copy.intro)}</p>
          <a className="button" href={DISCOVERY_CALL_HREF}>
            {t(PRIMARY_CTA)}
          </a>
          <p className="caption">
            {t("Bookings are managed by Haab Calendar, our client and trusted partner.")}
          </p>
        </section>

        <section className="band-paper">
          <div className={`shell section ${styles.workflows}`}>
            <Kicker>{t("Example workflows")}</Kicker>
            <h2 className="h2-sm">{t(copy.examples)}</h2>
            <p className="body">
              {t("These are possible starting points, not prebuilt integrations or client results. We confirm access and scope during discovery.")}
            </p>
            <div className={styles.cards}>
              {workflows.map((workflow, index) => (
                <article className={styles.card} key={workflow.id}>
                  <span className="label">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="h3">{t(workflow.title)}</h3>
                  <p className="body">{t(workflow.shortDescription)}</p>
                  <dl>
                    <div>
                      <dt className="label">{t("Starts when")}</dt>
                      <dd>{t(workflow.trigger)}</dd>
                    </div>
                    <div>
                      <dt className="label">{t("What your team receives")}</dt>
                      <dd>{t(workflow.outcome)}</dd>
                    </div>
                    <div>
                      <dt className="label">{t("Who decides")}</dt>
                      <dd>{t(workflow.approval)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`shell section ${styles.control}`}>
          <div>
            <Kicker>{t("Control stays with your team")}</Kicker>
            <h2 className="h2-sm">{t("Built around your approval rules.")}</h2>
          </div>
          <div>
            <p className="lead">{t(copy.control)}</p>
            <a className="text-link text-link--accent" href={localePath(locale, "/security")}>
              {t("Read how we handle financial and patient data")}{" "}
              <Icon name="arrow" size={16} />
            </a>
            <a className="text-link" href={localePath(locale, copy.relatedPath)}>
              {t(copy.related)} <Icon name="arrow" size={16} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
