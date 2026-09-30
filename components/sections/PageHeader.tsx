"use client";
import { LanguageSwitch, useLanguage } from "@/components/i18n/LanguageProvider";
import { localePath } from "@/lib/locale";
import { DISCOVERY_CALL_HREF, NAV_CTA } from "@/lib/site";
import { Brand } from "../ui/Icon";
import styles from "./PageHeader.module.css";

/** Slim header for the supporting pages (/security, /about). */
export function PageHeader() {
  const { t, locale } = useLanguage();
  const booking = DISCOVERY_CALL_HREF.startsWith("https://")
    ? DISCOVERY_CALL_HREF
    : `${localePath(locale, "/")}#contact`;
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <Brand />
        <div className={styles.right}>
          <LanguageSwitch />
          <a href={booking} className="button button--outline">
            {t(NAV_CTA)}
          </a>
        </div>
      </div>
    </header>
  );
}
