"use client";
import {
  useLanguage,
  LanguageSwitch,
} from "@/components/i18n/LanguageProvider";
import { Brand } from "@/components/ui/Icon";
import { CONTACT_EMAIL } from "@/lib/site";
import { localePath } from "@/lib/locale";
export default function PrivacyContent() {
  const { t, locale } = useLanguage();
  return (
    <>
      <header className="shell legal-header">
        <Brand />
        <LanguageSwitch />
      </header>
      <main id="main" className="shell legal-page">
        <a className="text-link" href={localePath(locale, "/")}>
          {t("← Back to home")}
        </a>
        <h1>{t("Website privacy notice")}</h1>
        <p>
          {t(
            "This notice describes how the features on this website handle information.",
          )}
        </p>
        <h2>{t("Contacting us")}</h2>
        <p>
          {t(
            "The contact form prepares an email using your device’s email application. The form does not send your entries to our server or store them in a website database. Your name, email address, industry, and message are included in the draft. If you send it, your email provider and ours process that message. We use information you send to respond to your inquiry and discuss the services you request.",
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
