"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localePath } from "@/lib/locale";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./Trust.module.css";

/**
 * The homepage's short version: the point of view and a link. The process
 * itself (scoped access, approvals, your agreements) lives on /security.
 */
export function Trust() {
  const { t, locale } = useLanguage();
  return (
    <section id="trust" className="band-paper" aria-labelledby="trust-title">
      <div className={`section shell grid-12 ${styles.trust}`}>
        <div className={styles.intro}>
          <Kicker>{t("Data and approvals")}</Kicker>
          <h2 id="trust-title" className="h2-sm">
            {t("Your data and your approvals")} <em>{t("stay yours.")}</em>
          </h2>
        </div>
        <div className={styles.body}>
          <p className={`body ${styles.view}`}>
            {t(
              "Our view: automation is only useful if your team can see what it did, stop it, and decide what it shouldn’t. So we design the approval first, and the automation around it.",
            )}
          </p>
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
