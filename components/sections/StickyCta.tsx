"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useEffect, useState } from "react";
import { DISCOVERY_CALL_HREF, NAV_CTA } from "@/lib/site";
import styles from "./StickyCta.module.css";

/**
 * Mobile-only bar (<= 700px, via CSS) that appears after ~40% of the page and
 * steps aside while the contact form itself is on screen.
 */
export function StickyCta() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const contact = document.getElementById("contact");
    let contactInView = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(max > 0 && window.scrollY / max > 0.4 && !contactInView);
    };
    const observer = new IntersectionObserver(([entry]) => {
      contactInView = entry.isIntersecting;
      update();
    });
    if (contact) observer.observe(contact);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);
  return (
    <div className={styles.bar} data-visible={visible} aria-hidden={!visible}>
      <a
        href={DISCOVERY_CALL_HREF}
        className="button"
        tabIndex={visible ? 0 : -1}
      >
        {t(NAV_CTA)}
      </a>
    </div>
  );
}
