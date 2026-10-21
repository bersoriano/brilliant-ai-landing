"use client";
import type { ReactNode } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localePath } from "@/lib/locale";
import type { NoteLink } from "@/lib/posts";
import {
  CONTACT_EMAIL,
  DISCOVERY_CALL_HREF,
  PRIMARY_CTA,
  WHATSAPP_CTA,
  WHATSAPP_HREF,
  WHATSAPP_NUMBER,
} from "@/lib/site";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./Landing.module.css";

/**
 * Building blocks for the service pages (/workflows, /agents, /custom-erp,
 * /custom-software, /services), in the layout of /custom-crm. Every string
 * arrives translated, except the CTA label, which is a constant from
 * lib/site.ts and is translated here.
 */

/** Back link, the pitch and the review on the left; the exhibit on the right. */
export function LandingHero({
  titleId,
  kicker,
  title,
  lead,
  children,
  cta = PRIMARY_CTA,
  secondary,
  aside,
}: {
  titleId: string;
  kicker: string;
  title: ReactNode;
  lead: ReactNode;
  /** Between the lead and the actions, e.g. the starting price. */
  children?: ReactNode;
  cta?: string;
  secondary?: ReactNode;
  aside?: ReactNode;
}) {
  const { t, locale } = useLanguage();
  return (
    <section id="top" className={`shell ${styles.hero}`} aria-labelledby={titleId}>
      <a className="text-link" href={localePath(locale, "/")}>
        {t("← Back to home")}
      </a>
      <div className={`grid-12 ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <Kicker>{kicker}</Kicker>
          <h1 id={titleId} className="h2">
            {title}
          </h1>
          <p className="lead">{lead}</p>
          {children}
          <div className={styles.actions}>
            <a className="button" href={DISCOVERY_CALL_HREF}>
              {t(cta)}
            </a>
            {secondary}
          </div>
          <p className="caption">
            {t("Bookings run on Haab Calendar, a booking app we built.")}
          </p>
        </div>
        {aside ? <div className={styles.heroExhibit}>{aside}</div> : null}
      </div>
    </section>
  );
}

/** The page's last ask (#contact): the review, then WhatsApp and email. */
export function LandingClose({
  kicker = "Start with a workflow review",
  title,
  lead,
  cta = PRIMARY_CTA,
}: {
  kicker?: string;
  title: ReactNode;
  lead: string;
  cta?: string;
}) {
  const { t } = useLanguage();
  return (
    <section
      id="contact"
      className={`shell section grid-12 ${styles.close}`}
      aria-labelledby="close-title"
    >
      <div className={styles.closeCopy}>
        <Kicker>{t(kicker)}</Kicker>
        <h2 id="close-title" className="h2">
          {title}
        </h2>
        <p className="lead">{lead}</p>
      </div>
      <div className={styles.closeActions}>
        <a className="button" href={DISCOVERY_CALL_HREF}>
          {t(cta)}
        </a>
        <p className="caption">
          {t("Bookings run on Haab Calendar, a booking app we built.")}
        </p>
        <p className="label">{t("Prefer another channel?")}</p>
        <a className="text-link" href={WHATSAPP_HREF} rel="noopener">
          {t(WHATSAPP_CTA)} <span className="caption">{WHATSAPP_NUMBER}</span>
        </a>
        <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL} <Icon name="arrow" size={16} />
        </a>
      </div>
    </section>
  );
}

/**
 * Notes from the blog that explain the page's rules. Titles come from the
 * posts themselves (getNoteLinks, on the server), so they follow the language.
 */
export function NotesList({ notes }: { notes: NoteLink[] }) {
  const { t, locale } = useLanguage();
  if (!notes.length) return null;
  return (
    <ul className={styles.notes}>
      {notes.map((note) => (
        <li key={note.slug}>
          <a href={localePath(locale, `/blog/${note.slug}`)}>
            <span className="label">{t("Note")}</span>
            <span className={styles.noteTitle}>
              {note.title} <Icon name="arrow" size={14} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
