import { ErpLanding } from "@/components/sections/ErpLanding";
import { ERP_POST_SLUG } from "@/lib/erp";
import { getRequestLocale } from "@/lib/locale.server";
import { getNoteLinks } from "@/lib/posts.server";

export default async function CustomErp() {
  const locale = await getRequestLocale();
  const notes = await getNoteLinks([ERP_POST_SLUG, "erp-vs-crm-small-business"], locale);
  return <ErpLanding notes={notes} />;
}
