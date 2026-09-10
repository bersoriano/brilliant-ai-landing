import { getRequestLocale } from "@/lib/locale.server";
import { pageTitle, translate } from "@/lib/i18n";
import PrivacyContent from "./PrivacyContent";
export async function generateMetadata() {
  const locale = await getRequestLocale();
  return {
    title: pageTitle(locale, true),
    description: translate(
      "How the Brilliant AI website handles contact details and calculator inputs.",
      locale,
    ),
  };
}
export default function Privacy() {
  return <PrivacyContent />;
}
