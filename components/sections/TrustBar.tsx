"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import styles from "./TrustBar.module.css";

/** Potential integrations, not partnerships. */
const TOOLS = ["Microsoft", "Salesforce", "OpenAI", "Google Workspace", "QuickBooks"];

export function TrustBar() {
  const { t } = useLanguage();
  return (
    <section className="shell" aria-labelledby="tools-label">
      <div className={styles.strip}>
        <p id="tools-label" className="label">
          {t("Tools we can connect")}
        </p>
        <ul className={styles.tools}>
          {TOOLS.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
