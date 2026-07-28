import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Results } from "@/components/sections/Results";
import { WhyBrilliant } from "@/components/sections/WhyBrilliant";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustBar />
        <Problem />
        <Solution />
        <Services />
        <HowItWorks />
        <Results />
        <WhyBrilliant />
        <RoiCalculator />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
