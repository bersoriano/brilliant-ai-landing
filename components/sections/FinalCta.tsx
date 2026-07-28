import { SectionWrapper } from "../ui/SectionWrapper";
import { Button } from "../ui/Button";
import { CALCULATOR_ANCHOR } from "@/lib/site";

export function FinalCta() {
  return (
    <SectionWrapper width="wide" className="py-24 sm:py-32">
      <div className="relative overflow-hidden rounded-[2rem] border border-accent-400/30 bg-gradient-to-br from-accent-600/25 via-ink-900 to-ink-950 px-6 py-16 text-center sm:px-10 sm:py-24">
        <div
          aria-hidden
          className="glow-orb"
          style={{
            width: 460,
            height: 460,
            top: -180,
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle,var(--color-accent-500),transparent 70%)",
            opacity: 0.4,
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            How much is your team&rsquo;s trapped capacity worth?
          </h2>
          <p className="mt-5 text-lg text-mist-200">
            Find out in two minutes. Then decide what you do with the ceiling.
          </p>
          <div className="mt-9 flex justify-center">
            <Button href={CALCULATOR_ANCHOR} size="lg">
              Calculate your ROI
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
