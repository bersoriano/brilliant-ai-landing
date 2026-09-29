"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localePath } from "@/lib/locale";
import { Icon } from "../ui/Icon";
import { Kicker } from "../ui/Kicker";
import styles from "./Trust.module.css";

/**
 * Commitments about process, not certifications. Where terms vary by client
 * (model providers, agreements, retention), the copy says the client sets them.
 */
const points = [
  [
    "You set the terms for your documents.",
    "Which systems and model providers may process your documents — and on what terms, including no training on your data — is decided by you before we connect anything.",
  ],
  [
    "Access is scoped, logged, and revocable.",
    "We ask for access one workflow at a time. You can see it, and you can revoke it.",
  ],
  [
    "Nothing posts, pays, or files on its own.",
    "Nothing is recorded, paid, or submitted until a person you name approves it.",
  ],
  [
    "Your agreements, your requirements.",
    "We work under the BAA, DPA, or NDA your team requires, agreed after discovery. An automation is not compliance by itself.",
  ],
];

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
          <a
            className="text-link text-link--accent"
            href={localePath(locale, "/security")}
          >
            {t("Read how we handle financial and patient data")}{" "}
            <Icon name="arrow" size={16} />
          </a>
        </div>
        <ul className={styles.points}>
          {points.map(([title, body]) => (
            <li key={title}>
              <h3 className={styles.pointTitle}>{t(title)}</h3>
              <p className="body">{t(body)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
