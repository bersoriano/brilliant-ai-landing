"use client";
import {
  useLanguage,
  LanguageSwitch,
} from "@/components/i18n/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { DISCOVERY_CALL_HREF, NAV_LINKS } from "@/lib/site";
import { Brand, Icon } from "../ui/Icon";
export function Navbar() {
  const { t } = useLanguage();
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
    <header className="site-header">
      <nav className="shell nav-inner" aria-label={t("Main navigation")}>
        <Brand />
        <div className="desktop-nav">
          {NAV_LINKS.map((link) => (
            <a href={link.href} key={link.href}>
              {t(link.label)}
            </a>
          ))}
        </div>
        <LanguageSwitch />
        <a href={DISCOVERY_CALL_HREF} className="button button-nav">
          {t("Let’s talk")} <Icon name="diagonal" size={16} />
        </a>
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
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
          className="mobile-nav"
          aria-label={t("Mobile navigation")}
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {t(link.label)}
              <Icon name="arrow" size={16} />
            </a>
          ))}
          <a href={DISCOVERY_CALL_HREF} onClick={() => setOpen(false)}>
            {t("Let’s talk")} <Icon name="diagonal" size={16} />
          </a>
        </nav>
      )}
    </header>
  );
}
