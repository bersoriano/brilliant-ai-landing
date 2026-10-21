"use client";
import {
  useLanguage,
  LanguageSwitch,
} from "@/components/i18n/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { DISCOVERY_CALL_HREF, NAV_CTA, NAV_LINKS, PRIMARY_CTA } from "@/lib/site";
import { localePath } from "@/lib/locale";
import { SERVICES } from "@/lib/services";
import { Brand, Icon } from "../ui/Icon";
import styles from "./Navbar.module.css";

/** The nav item that opens the list of service pages. */
const SERVICES_HREF = "/services";

export function Navbar() {
  const { t, locale } = useLanguage();
  // Every link follows the language; "/#…" anchors land on the homepage.
  const navHref = (href: string) => localePath(locale, href);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const servicesToggle = useRef<HTMLButtonElement>(null);
  const servicesMenu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (servicesOpen) {
        setServicesOpen(false);
        servicesToggle.current?.focus();
      } else if (open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, servicesOpen]);
  // The services list closes on a click outside it.
  useEffect(() => {
    if (!servicesOpen) return;
    const away = (e: PointerEvent) => {
      if (!servicesMenu.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [servicesOpen]);
  const serviceLinks = (className: string, onClick?: () => void) =>
    SERVICES.map((item) => (
      <li key={item.id}>
        <a href={navHref(item.path)} className={className} onClick={onClick}>
          <span className={styles.serviceName}>{t(item.name)}</span>
          <span className={styles.serviceLine}>{t(item.line)}</span>
        </a>
      </li>
    ));
  return (
    <>
      <div className={styles.utility}>
        <div className={`shell ${styles.utilityInner}`}>
          <span className="label">{t("United States · Canada · México")}</span>
          <LanguageSwitch />
        </div>
      </div>
      <header className={styles.header}>
        <nav
          className={`shell ${styles.inner}`}
          aria-label={t("Main navigation")}
        >
          <Brand />
          <div className={styles.links}>
            {NAV_LINKS.map((link) =>
              link.href === SERVICES_HREF ? (
                <div
                  key={link.href}
                  ref={servicesMenu}
                  className={styles.menu}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null))
                      setServicesOpen(false);
                  }}
                >
                  <button
                    ref={servicesToggle}
                    type="button"
                    className={styles.menuToggle}
                    aria-expanded={servicesOpen}
                    aria-controls="services-menu"
                    onClick={() => setServicesOpen(!servicesOpen)}
                  >
                    {t(link.label)}
                    <span className={styles.caret} aria-hidden="true" />
                  </button>
                  {/* In the HTML even when closed, so crawlers find every page. */}
                  <div id="services-menu" className={styles.dropdown} hidden={!servicesOpen}>
                    <ul>{serviceLinks(styles.serviceLink, () => setServicesOpen(false))}</ul>
                    <a
                      href={navHref(SERVICES_HREF)}
                      className={`text-link text-link--accent ${styles.allServices}`}
                      onClick={() => setServicesOpen(false)}
                    >
                      {t("All services")} <Icon name="arrow" size={15} />
                    </a>
                  </div>
                </div>
              ) : (
                <a href={navHref(link.href)} key={link.href}>
                  {t(link.label)}
                </a>
              ),
            )}
          </div>
          <a
            href={DISCOVERY_CALL_HREF}
            className={`button button--outline ${styles.cta}`}
          >
            {t(NAV_CTA)}
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
              {NAV_LINKS.map((link) =>
                link.href === SERVICES_HREF ? (
                  <div key={link.href} className={styles.panelGroup}>
                    <a
                      href={navHref(link.href)}
                      className={styles.panelLink}
                      onClick={() => setOpen(false)}
                    >
                      {t(link.label)}
                    </a>
                    <ul className={styles.panelServices}>
                      {serviceLinks(styles.panelService, () => setOpen(false))}
                    </ul>
                  </div>
                ) : (
                  <a
                    key={link.href}
                    href={navHref(link.href)}
                    className={styles.panelLink}
                    onClick={() => setOpen(false)}
                  >
                    {t(link.label)}
                  </a>
                ),
              )}
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
