import type { ReactNode } from "react";
import { Kicker } from "../ui/Kicker";
import { Reveal } from "../ui/Reveal";
import styles from "./Services.module.css";

/**
 * A system offer inside Services; the CRM, the ERP and custom software share
 * this layout: the pitch and two short notes, the exhibit, then one ruled row
 * with the price and what's included (titles only on phones). Every string
 * arrives translated from Services.
 */
export function SystemOffer({
  id,
  kicker,
  title,
  intro,
  actions,
  exhibit,
  notes,
  plan,
  included,
}: {
  id: string;
  kicker: string;
  title: ReactNode;
  intro: ReactNode;
  actions?: ReactNode;
  exhibit: ReactNode;
  notes: [title: string, body: string, caption?: string][];
  plan: ReactNode;
  included: {
    label: string;
    link?: ReactNode;
    features: [title: string, line: string][];
  };
}) {
  return (
    <article id={id} className={`grid-12 ${styles.offer}`} aria-labelledby={`${id}-title`}>
      <div className={styles.copy}>
        <Kicker>{kicker}</Kicker>
        <h3 id={`${id}-title`} className="h2-sm">
          {title}
        </h3>
        <p className="body">{intro}</p>
        {actions}
        <dl className={styles.notes}>
          {notes.map(([term, detail, caption]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>
                {detail}
                {caption ? <span className="caption">{caption}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <Reveal className={styles.side}>{exhibit}</Reveal>

      <div id={`${id}-pricing`} className={`grid-12 ${styles.terms}`}>
        <div className={styles.plan}>{plan}</div>
        <div className={styles.included}>
          <p className={styles.includedHead}>
            <span className="label">{included.label}</span>
            {included.link}
          </p>
          <ul className={styles.features}>
            {included.features.map(([name, line]) => (
              <li key={name}>
                <strong>{name}</strong>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
