"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { LandingClose, LandingHero } from "./Landing";
import { Navbar } from "./Navbar";
import { OnsiteConsulting } from "./OnsiteConsulting";
import { ServiceCards, ServicesClose } from "./Services";

/**
 * /services: the five offers on one page, each linking its own, plus the
 * onsite review and every question we get asked (the homepage keeps six).
 */
export function ServicesIndex() {
  const { t } = useLanguage();
  return (
    <>
      <Navbar />
      <main id="main">
        <LandingHero
          titleId="services-title"
          kicker={t("Services")}
          title={
            <>
              {t("We set up and run the systems and agents your team uses every day.")}{" "}
              <em>{t("Shaped to the way you already work.")}</em>
            </>
          }
          lead={t("You keep every approval. We handle the repetitive work.")}
        />
        <section
          id="services"
          className="band-paper"
          aria-label={t("Services")}
        >
          <div className="section shell">
            <ServiceCards />
            <ServicesClose />
          </div>
        </section>
        <OnsiteConsulting />
        <Faq />
        <LandingClose
          title={
            <>
              {t("One workflow.")} <em>{t("A practical way forward.")}</em>
            </>
          }
          lead={t("A focused 20-minute conversation. No technical brief needed.")}
        />
      </main>
      <Footer />
    </>
  );
}
