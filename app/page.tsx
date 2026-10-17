import { InquiryProvider } from "@/components/inquiry/InquiryContext";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Solution } from "@/components/sections/Solution";
import { Problem } from "@/components/sections/Problem";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Trust } from "@/components/sections/Trust";
import { Proof } from "@/components/sections/Proof";
import { CustomCrm } from "@/components/sections/CustomCrm";
import { Faq } from "@/components/sections/Faq";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { OnsiteConsulting } from "@/components/sections/OnsiteConsulting";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { StickyCta } from "@/components/sections/StickyCta";
import { getRequestLocale } from "@/lib/locale.server";
import { getPosts } from "@/lib/posts.server";
export default async function Home() {
  const locale = await getRequestLocale();
  const posts = (await getPosts(locale)).slice(0, 3);
  return (
    <>
      <Navbar />
      <InquiryProvider>
        <main id="main">
          <Hero />
          <Solution />
          <Problem />
          <RoiCalculator />
          <HowItWorks />
          <Trust />
          <Proof />
          <CustomCrm />
          <Faq />
          <LatestPosts locale={locale} posts={posts} />
          <OnsiteConsulting />
          <FinalCta />
        </main>
      </InquiryProvider>
      <Footer />
      <StickyCta />
    </>
  );
}
