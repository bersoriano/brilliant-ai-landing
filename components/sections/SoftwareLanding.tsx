"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localePath } from "@/lib/locale";
import { SERVICES } from "@/lib/services";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import {
  HAAB_EXAMPLE_PATH,
  HAAB_FEATURES,
  SOFTWARE_NOTES,
  haabHref,
} from "@/lib/software";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import { Footer } from "./Footer";
import { LandingClose, LandingHero } from "./Landing";
import { Navbar } from "./Navbar";
import { Proof } from "./Proof";
import { SoftwareVideo } from "./SoftwareVideo";
import styles from "./Landing.module.css";

/** The other four offers, checked before we build anything. */
const ALTERNATIVES = SERVICES.filter((item) => item.id !== "software");

/**
 * /custom-software: shown through Haab Calendar, our own booking app (never a
 * client or partner), and Rhino's system. It lists only what Haab ships, and
 * says when one of the other four offers is the better fit.
 */
export function SoftwareLanding() {
  const { t, locale } = useLanguage();
  return (
    <>
      <Navbar />
      <main id="main">
        <LandingHero
          titleId="software-title"
          kicker={t("Custom Software")}
          title={
            <>
              {t("Software built for one job.")}{" "}
              <em>{t("When nothing off the shelf fits.")}</em>
            </>
          }
          lead={t(
            "When the tool your business needs doesn’t exist, we build it and keep it running.",
          )}
          secondary={
            <a className="text-link" href="#fit">
              {t("Is it the right fit?")} <Icon name="arrow" size={16} />
            </a>
          }
          aside={<SoftwareVideo />}
        >
          <p className={styles.from}>{t("Priced by project.")}</p>
        </LandingHero>

        <div className="band-paper">
          <section
            className={`shell section grid-12 ${styles.why}`}
            aria-labelledby="haab-title"
          >
            <div className={styles.head}>
              <Kicker>{t("Our own product")}</Kicker>
              <h2 id="haab-title" className="h2-sm">
                {t("What Haab Calendar does today")}
              </h2>
              <p className="body">
                {t(
                  "Haab Calendar is our own: a booking app for clinics, studios, venues, and events, in English and Spanish.",
                )}
              </p>
              <a
                className="text-link text-link--accent"
                href={haabHref(locale)}
                rel="noopener noreferrer"
              >
                {t("See Haab Calendar")} <Icon name="arrow" size={16} />
              </a>
              <a
                className="text-link"
                href={haabHref(locale, HAAB_EXAMPLE_PATH)}
                rel="noopener noreferrer"
              >
                {t("Try a live booking page")} <Icon name="arrow" size={16} />
              </a>
            </div>
            <ul className={styles.reasons}>
              {HAAB_FEATURES.map(([title, line]) => (
                <li key={title}>
                  <h3 className={styles.itemTitle}>{t(title)}</h3>
                  <p className="body">{t(line)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          className={`shell section grid-12 ${styles.custom}`}
          aria-labelledby="process-title"
        >
          <div className={styles.customCopy}>
            <Kicker>{t("How we build it")}</Kicker>
            <h2 id="process-title" className="h2-sm">
              {t("Built around your process.")} <em>{t("Kept running by us.")}</em>
            </h2>
            {SOFTWARE_NOTES.map(([title, body]) => (
              <div key={title} className={styles.noteBlock}>
                <h3 className={styles.itemTitle}>{t(title)}</h3>
                <p className="body">{t(body)}</p>
              </div>
            ))}
          </div>
          <article className={styles.cell}>
            <p className="label">{t("Pricing")}</p>
            <h3 className="h3">{t("Priced by project.")}</h3>
            <p className="body">
              {t("You approve the scope and the quote before we build anything.")}
            </p>
            <p className="caption">{t("Quoted before we start.")}</p>
            <a className="button" href={DISCOVERY_CALL_HREF}>
              {t(PRIMARY_CTA)}
            </a>
          </article>
        </section>

        <section
          id="fit"
          className="band-paper"
          aria-labelledby="fit-title"
        >
          <div className={`shell section grid-12 ${styles.security}`}>
            <div className={styles.head}>
              <Kicker>{t("When it’s the right fit")}</Kicker>
              <h2 id="fit-title" className="h2-sm">
                {t("Start with what already exists.")}
              </h2>
              <p className="body">
                {t(
                  "If a workflow, an agent, the CRM, or the ERP covers the job, we’ll recommend it. We build software when none of them fits the work your team and your clients do.",
                )}
              </p>
            </div>
            <ul className={styles.reasons}>
              {ALTERNATIVES.map((item) => (
                <li key={item.id}>
                  <h3 className={styles.itemTitle}>{t(item.line)}</h3>
                  <p className="body">
                    <a
                      className="text-link text-link--accent"
                      href={localePath(locale, item.path)}
                    >
                      {t(item.name)} <Icon name="arrow" size={15} />
                    </a>
                  </p>
                </li>
              ))}
              <li>
                <h3 className={styles.itemTitle}>
                  {t("When nothing off the shelf fits")}
                </h3>
                <p className="body">{t("Custom Software")}</p>
              </li>
            </ul>
          </div>
        </section>

        <Proof variant="full" />

        <LandingClose
          title={
            <>
              {t("Bring the job nothing fits.")}{" "}
              <em>{t("We’ll tell you what it takes.")}</em>
            </>
          }
          lead={t(
            "In 20 minutes we map the work, the tools you use today, and whether something that already exists covers it.",
          )}
        />
      </main>
      <Footer />
    </>
  );
}
