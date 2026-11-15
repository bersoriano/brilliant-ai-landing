"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localePath } from "@/lib/locale";
import { SERVICES } from "@/lib/services";
import { DISCOVERY_CALL_HREF, PRIMARY_CTA } from "@/lib/site";
import {
  HAAB_EXAMPLE_PATH,
  HAAB_FEATURES,
  PLAZA_EXPLORE_PATH,
  PLAZA_FEATURES,
  PLAZA_URL,
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

/** The other four offers, checked before we launch anything. */
const ALTERNATIVES = SERVICES.filter((item) => item.id !== "software");

/**
 * /custom-software, the Software Ready to Use offer: shown through our own
 * products (never a client's or a partner's), Haab Calendar for bookings and
 * Plaza Volcanes for a marketplace, and Rhino's system. It lists only what
 * each one ships, and says when one of the other four offers is the better fit.
 */
export function SoftwareLanding() {
  const { t, locale } = useLanguage();
  return (
    <>
      <Navbar />
      <main id="main">
        <LandingHero
          titleId="software-title"
          kicker={t("Software Ready to Use")}
          title={
            <>
              {t("Software that already runs.")}{" "}
              <em>{t("Ready to launch for your business.")}</em>
            </>
          }
          lead={t(
            "We built a booking app and a marketplace, and we run both ourselves. We set one up for your business and keep it running.",
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
          className={`shell section grid-12 ${styles.why}`}
          aria-labelledby="plaza-title"
        >
          <div className={styles.head}>
            <Kicker>{t("Our own marketplace")}</Kicker>
            <h2 id="plaza-title" className="h2-sm">
              {t("What Plaza Volcanes does today")}
            </h2>
            <p className="body">
              {t(
                "Plaza Volcanes is our own: a marketplace in Spanish where independent shops in Mexico open a storefront and sell. We can launch one like it for your sellers.",
              )}
            </p>
            <a
              className="text-link text-link--accent"
              href={PLAZA_URL}
              rel="noopener noreferrer"
            >
              {t("See Plaza Volcanes")} <Icon name="arrow" size={16} />
            </a>
            <a
              className="text-link"
              href={`${PLAZA_URL}${PLAZA_EXPLORE_PATH}`}
              rel="noopener noreferrer"
            >
              {t("Browse the live marketplace")} <Icon name="arrow" size={16} />
            </a>
          </div>
          <ul className={styles.reasons}>
            {PLAZA_FEATURES.map(([title, line]) => (
              <li key={title}>
                <h3 className={styles.itemTitle}>{t(title)}</h3>
                <p className="body">{t(line)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={`shell section grid-12 ${styles.custom}`}
          aria-labelledby="process-title"
        >
          <div className={styles.customCopy}>
            <Kicker>{t("How we launch it")}</Kicker>
            <h2 id="process-title" className="h2-sm">
              {t("Ready to use.")} <em>{t("Kept running by us.")}</em>
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
              {t("You approve the scope and the quote before we launch anything.")}
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
                  "If a workflow, an agent, the CRM, or the ERP covers the job, we’ll recommend it. Software Ready to Use is for bookings and marketplaces: work your clients or your sellers do on their own.",
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
                  {t("Bookings and marketplaces, ready to launch")}
                </h3>
                <p className="body">{t("Software Ready to Use")}</p>
              </li>
            </ul>
          </div>
        </section>

        <Proof variant="full" />

        <LandingClose
          title={
            <>
              {t("Bring the booking or marketplace you have in mind.")}{" "}
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
