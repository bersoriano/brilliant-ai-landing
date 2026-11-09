import { InquiryProvider } from "@/components/inquiry/InquiryContext";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ConsultantExperience } from "@/components/sections/ConsultantExperience";
import { Problem } from "@/components/sections/Problem";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Trust } from "@/components/sections/Trust";
import { Proof } from "@/components/sections/Proof";
import { Approach } from "@/components/sections/Approach";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { StickyCta } from "@/components/sections/StickyCta";
import type { Locale } from "@/lib/locale";
import { getNoteLinks } from "@/lib/posts.server";
import { HOMEPAGE_FAQS } from "@/lib/faq";
import { FEATURED_INSIGHTS } from "@/lib/insights";

/**
 * The homepage is the conversion page: the promise, one exhibit, the
 * calculator, the five offers as cards, how it works, trust, and the review.
 * Each offer's detail lives on its own page (see lib/services.ts).
 */
export default async function Home({ locale }: { locale: Locale }) {
  const notesFor = async (language: Locale) => Object.fromEntries(
    (await getNoteLinks([...FEATURED_INSIGHTS], language)).map(note => [note.slug, note]),
  );
  const noteBySlug = { en: await notesFor("en"), es: await notesFor("es") };
  return (
    <>
      <Navbar />
      <InquiryProvider>
        <main id="main">
          <Hero />
          <ConsultantExperience />
          <Problem />
          <RoiCalculator />
          <Services />
          <HowItWorks />
          <Trust />
          <Proof />
          <Approach notes={noteBySlug} />
          <Faq items={HOMEPAGE_FAQS} more />
          <FinalCta />
        </main>
      </InquiryProvider>
      <Footer />
      <StickyCta />
    </>
  );
}
