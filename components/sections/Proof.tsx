"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { shouldRenderCaseStudy } from "@/lib/caseStudy";
import { CaseStudy } from "./CaseStudy";
import { Icon } from "../ui/Icon";
import styles from "./Proof.module.css";

/** Named client story has no invented metrics; measured case study stays gated. */
export function Proof() {
  const { t } = useLanguage();
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
        <div className={styles.story}>
          <div>
            <h3 className="label">{t("Before")}</h3>
            <p>
              {t(
                "Raw materials, finished-product stock, and sales were managed in separate software.",
              )}
            </p>
          </div>
          <div>
            <h3 className="label">{t("What we built")}</h3>
            <p>
              {t(
                "We built a custom CRM from scratch, developing each part as a module and connecting them through shared APIs.",
              )}
            </p>
          </div>
          <div>
            <h3 className="label">{t("Now")}</h3>
            <p>
              {t(
                "Rhino works from one integrated system and can automate workflows across inventory and sales.",
              )}
            </p>
          </div>
        </div>
      </section>
      {shouldRenderCaseStudy(process.env.NODE_ENV === "production") && (
        <CaseStudy />
      )}
    </>
  );
}
