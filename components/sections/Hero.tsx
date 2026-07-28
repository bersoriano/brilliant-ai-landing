import { Button } from "../ui/Button";
import { SectionWrapper } from "../ui/SectionWrapper";
import { HeroVisual } from "./HeroVisual";
import { CALCULATOR_ANCHOR, DISCOVERY_CALL_HREF } from "@/lib/site";

export function Hero() {
  return (
    <SectionWrapper
      id="top"
      width="wide"
      className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24"
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="glow-orb animate-drift"
        style={{
          width: 520,
          height: 520,
          top: -140,
          right: -80,
          background:
            "radial-gradient(circle,var(--color-accent-500),transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="glow-orb"
        style={{
          width: 380,
          height: 380,
          bottom: -160,
          left: -120,
          background: "radial-gradient(circle,var(--color-glow-cyan),transparent 70%)",
          opacity: 0.2,
        }}
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-h-[calc(100svh-9rem)] flex flex-col justify-center lg:min-h-0">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border hairline bg-ink-850/60 px-3 py-1.5 text-xs font-medium text-mist-300">
            <span className="h-1.5 w-1.5 rounded-full bg-glow-cyan" />
            AI automation, built for the team you already have
          </span>

          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Become the leader who{" "}
            <span className="gradient-text">unlocked the ceiling.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist-300">
            We&rsquo;re an AI automation consultancy. We find the repetitive work
            draining your team, and build systems that just run it&nbsp;&mdash; so your
            people spend their days on the work only they can do.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button href={CALCULATOR_ANCHOR} size="lg">
              Calculate what your capacity is worth
            </Button>
            <a
              href={DISCOVERY_CALL_HREF}
              className="text-sm text-mist-300 underline-offset-4 hover:text-white hover:underline"
            >
              or book a 20-min discovery call
            </a>
          </div>

          <p className="mt-6 text-sm text-mist-500">
            {/* Do not invent proof — swap for a real trust line before launch. */}
            [PLACEHOLDER: trust micro-copy &mdash; e.g. &ldquo;Trusted by ops
            leaders at teams of 20&ndash;500&rdquo; once you have permission to
            name them]
          </p>
        </div>

        <div className="relative hidden lg:block">
          <HeroVisual />
        </div>
      </div>
    </SectionWrapper>
  );
}
