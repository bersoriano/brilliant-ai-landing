"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { shouldRenderCaseStudy } from "@/lib/caseStudy";
import { localePath } from "@/lib/locale";
import { CaseStudy } from "./CaseStudy";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import styles from "./Proof.module.css";

/** The three areas Rhino ran in separate software, now modules of one system. */
const AREAS = ["Raw materials", "Finished-product stock", "Sales"];

/**
 * Named client story has no invented metrics; measured case study stays gated.
 * The homepage shows the teaser (three sentences and a link); the before and
 * after diagram lives on /custom-software, where Rhino's system is the example.
 */
export function Proof({ variant = "teaser" }: { variant?: "teaser" | "full" }) {
  const { t, locale } = useLanguage();
  if (variant === "teaser")
    return (
      <>
        <section
          id="proof"
          className={`shell ${styles.proof}`}
          aria-labelledby="proof-title"
        >
          <div className={styles.heading}>
            <div>
              <p className="label">{t("Client work")}</p>
              <h2 id="proof-title" className="h2-sm">
                Rhino Automotive Glass
              </h2>
            </div>
            <a
              className="text-link"
              href="https://rhinoautoglass.mx/"
              rel="noopener noreferrer"
            >
              {t("Visit Rhino")} <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className={styles.teaser}>
            <p className={styles.summary}>
              {t("One connected CRM for industrial glass operations.")}
            </p>
            <div className={styles.story}>
              <p className="body">
                {t(
                  "Raw materials, finished goods, and sales each lived in a separate program.",
                )}{" "}
                {t(
                  "We built them a custom CRM from scratch, one module per area, all connected through shared APIs.",
                )}{" "}
                {t(
                  "Rhino runs on one system and can automate work across inventory and sales.",
                )}
              </p>
              <a
                className="text-link text-link--accent"
                href={localePath(locale, "/custom-software#proof")}
              >
                {t("See what we built")} <Icon name="arrow" size={16} />
              </a>
            </div>
          </div>
        </section>
        {shouldRenderCaseStudy(process.env.NODE_ENV === "production") && (
          <CaseStudy />
        )}
      </>
    );
  return (
    <>
      <section id="proof" className={`shell ${styles.proof}`} aria-labelledby="proof-title">
        <div className={styles.heading}>
          <div>
            <p className="label">{t("Client work")}</p>
            <h2 id="proof-title" className="h2-sm">
              Rhino Automotive Glass
            </h2>
          </div>
          <a
            className="text-link"
            href="https://rhinoautoglass.mx/"
            rel="noopener noreferrer"
          >
            {t("Visit Rhino")} <Icon name="arrow" size={16} />
          </a>
        </div>
        <p className={styles.summary}>
          {t("One connected CRM for industrial glass operations.")}
        </p>
        <Reveal
          as="figure"
          className={styles.diagram}
          aria-label={t("Rhino’s systems, before and after")}
        >
          <div className={styles.before}>
            <h3 className="label">{t("Before")}</h3>
            <ul className={styles.silos}>
              {AREAS.map((area) => (
                <li key={area}>{t(area)}</li>
              ))}
            </ul>
            <p className={styles.note}>
              {t(
                "Raw materials, finished goods, and sales each lived in a separate program.",
              )}
            </p>
          </div>
          <span className={styles.to} aria-hidden="true">
            <Icon name="arrow" size={22} />
          </span>
          <div className={styles.after}>
            <h3 className="label">{t("What we built")}</h3>
            <div className={styles.system}>
              <p className={styles.systemName}>{t("One integrated system")}</p>
              <ul className={styles.modules}>
                {AREAS.map((area) => (
                  <li key={area}>
                    <span className={styles.moduleTag}>{t("Module")}</span>
                    {t(area)}
                  </li>
                ))}
              </ul>
              <p className={styles.bus}>{t("Shared APIs")}</p>
            </div>
            <p className={styles.note}>
              {t(
                "We built them a custom CRM from scratch, one module per area, all connected through shared APIs.",
              )}
            </p>
            <div className={styles.now}>
              <h3 className="label">{t("Now")}</h3>
              <p>
                {t(
                  "Rhino runs on one system and can automate work across inventory and sales.",
                )}
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
