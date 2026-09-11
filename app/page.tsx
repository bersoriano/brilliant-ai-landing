import { InquiryProvider } from "@/components/inquiry/InquiryContext";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Solution } from "@/components/sections/Solution";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PastExperience } from "@/components/sections/PastExperience";
import { WhyBrilliant } from "@/components/sections/WhyBrilliant";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { Faq } from "@/components/sections/Faq";
import { OnsiteConsulting } from "@/components/sections/OnsiteConsulting";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <InquiryProvider>
        <main id="main">
          <Hero />
          <TrustBar />
          <Solution />
          <Services />
          <HowItWorks />
          <WhyBrilliant />
          <PastExperience />
          <RoiCalculator />
          <Faq />
          <OnsiteConsulting />
          <FinalCta />
        </main>
      </InquiryProvider>
      <Footer />
    </>
  );
}
