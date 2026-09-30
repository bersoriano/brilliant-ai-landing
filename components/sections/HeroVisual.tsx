"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { HERO_STEPS, SCENES } from "@/lib/scenes";
import { DocumentScene } from "../ui/DocumentScene";
import { Exhibit } from "../ui/Exhibit";
import styles from "./Hero.module.css";

/** Exhibit 1: an invoice that doesn't match its PO, and the approval card. */
export function HeroVisual() {
  const { t } = useLanguage();
  return (
    <Exhibit
      className={styles.exhibit}
      label={t("Exhibit {number}", { number: 1 })}
      status={{ text: t("Running"), tone: "live" }}
      title={t("An invoice that doesn’t match its PO, and what your team receives")}
      titleId="exhibit-1-title"
      caption={t(
        "Illustrative. Exceptions always go to a person before anything is approved. Payment stays under your control.",
      )}
    >
      <DocumentScene scene={SCENES["invoice-approvals"]} steps={HERO_STEPS} />
    </Exhibit>
  );
}
