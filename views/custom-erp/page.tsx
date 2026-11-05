import { ErpLanding } from "@/components/sections/ErpLanding";
import { ERP_POST_SLUG } from "@/lib/erp";
import type { Locale } from "@/lib/locale";
import { getNoteLinks } from "@/lib/posts.server";

export default async function CustomErp() {
  const links = (locale: Locale) => getNoteLinks([ERP_POST_SLUG, "erp-vs-crm-small-business"], locale);
  const notes = { en: await links("en"), es: await links("es") };
  return <ErpLanding notes={notes} />;
}
