"use client";
import {
  useLanguage,
  LanguageSwitch,
} from "@/components/i18n/LanguageProvider";
import { Brand } from "@/components/ui/Icon";
import { CONTACT_EMAIL } from "@/lib/site";
import { localePath } from "@/lib/locale";
import styles from "./Privacy.module.css";
export default function PrivacyContent() {
  const { t, locale } = useLanguage();
  return (
    <>
      <header className={`shell ${styles.header}`}>
        <Brand />
        <LanguageSwitch />
      </header>
      <main id="main" className={`shell ${styles.page}`}>
        <a className="text-link" href={localePath(locale, "/")}>
          {t("← Back to home")}
        </a>
        <h1 className="h2">{t("Website privacy notice")}</h1>
        <p>
          {t(
            "This notice describes how the features on this website handle information.",
          )}
        </p>
        <h2>{t("Contacting us")}</h2>
        <p>
          {t(
            "The contact form sends your name, work email, industry, message, and language to our server, which forwards them to our team through an email delivery provider. Submissions are not stored in a website database, and their contents are not logged. If delivery fails, the form offers to prepare the same message in your device’s email application instead. We use information you send to respond to your inquiry and discuss the services you request.",
          )}
        </p>
        <h2>{t("Calculator inputs")}</h2>
        <p>
          {t(
            "The capacity calculator runs in your browser. Its inputs and results are not submitted to us. Saving an estimate downloads a text file to your device.",
          )}
        </p>
        <h2>{t("Language preference")}</h2>
        <p>
          {t(
            "English is served at the main address and Mexican Spanish at /es. We may use your browser language and, when available, a country code from our hosting provider to send first-time visitors to the matching language URL. Search engines receive the URL they request. We do not request your precise location. Choosing English or Español updates the URL and saves a language-only cookie for one year.",
          )}
        </p>
        <h2>{t("Website services")}</h2>
        <p>
          {t(
            "This application does not include advertising trackers or analytics scripts. Fonts are served with the website. The hosting provider may process technical request information, such as IP addresses, for website delivery, security, and diagnostics.",
          )}
        </p>
        <h2>{t("External services")}</h2>
        <p>
          {t(
            "If you follow a scheduling link, the scheduling provider’s privacy terms apply. Email and hosting providers operate under their own terms and policies.",
          )}
        </p>
        <h2>{t("Your information")}</h2>
        <p>
          {t(
            "To ask about information you have sent us, or request its correction or deletion, contact",
          )}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {t(
            ". Please avoid sending patient records, account credentials, or sensitive financial information through the inquiry form or email.",
          )}
        </p>
      </main>
    </>
  );
}
