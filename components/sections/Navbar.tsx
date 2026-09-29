"use client";
import {
  useLanguage,
  LanguageSwitch,
} from "@/components/i18n/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { DISCOVERY_CALL_HREF, NAV_LINKS, PRIMARY_CTA } from "@/lib/site";
import { Icon } from "../ui/Icon";
import styles from "./Navbar.module.css";
export function Navbar() {
  const { t, locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <div className={styles.utility}>
        <div className={`shell ${styles.utilityInner}`}>
          <span className="label">{t("United States · Canada · México")}</span>
          <LanguageSwitch className={styles.language} />
        </div>
      </div>
      <header className={styles.header}>
        <nav
          className={`shell ${styles.inner}`}
          aria-label={t("Main navigation")}
        >
          <a
            href={locale === "es" ? "/es#top" : "/#top"}
            className={styles.wordmark}
          >
            Brilliant<span className={styles.period}>.</span>
            <span className="sr-only"> {t("home")}</span>
          </a>
          <div className={styles.links}>
            {NAV_LINKS.map((link) => (
              <a href={link.href} key={link.href}>
                {t(link.label)}
              </a>
            ))}
          </div>
          <a
            href={DISCOVERY_CALL_HREF}
            className={`button button--outline ${styles.cta}`}
          >
            {t(PRIMARY_CTA)}
          </a>
          <button
            ref={toggle}
            type="button"
            className={styles.toggle}
            aria-label={t(open ? "Close navigation" : "Open navigation")}
            aria-controls="mobile-nav"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </nav>
        {open && (
          <nav
            id="mobile-nav"
            className={styles.panel}
            aria-label={t("Mobile navigation")}
          >
            <div className="shell">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={styles.panelLink}
                  onClick={() => setOpen(false)}
                >
                  {t(link.label)}
                </a>
              ))}
              <a
                href={DISCOVERY_CALL_HREF}
                className={`button ${styles.panelCta}`}
                onClick={() => setOpen(false)}
              >
                {t(PRIMARY_CTA)}
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
