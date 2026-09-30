import { InquiryProvider } from "@/components/inquiry/InquiryContext";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Solution } from "@/components/sections/Solution";
import { Problem } from "@/components/sections/Problem";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Trust } from "@/components/sections/Trust";
import { Proof } from "@/components/sections/Proof";
import { Faq } from "@/components/sections/Faq";
import { OnsiteConsulting } from "@/components/sections/OnsiteConsulting";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { StickyCta } from "@/components/sections/StickyCta";
export default function Home() {
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
          <Faq />
          <OnsiteConsulting />
          <FinalCta />
        </main>
      </InquiryProvider>
      <Footer />
      <StickyCta />
    </>
  );
}
