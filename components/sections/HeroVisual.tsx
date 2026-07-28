/**
 * Abstract, non-literal representation of trapped, repetitive work being
 * released into open capacity. Pure CSS/SVG — no images, no libraries.
 * All motion is disabled under prefers-reduced-motion (see globals.css).
 */
export function HeroVisual() {
  const particles = Array.from({ length: 7 });
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-md"
    >
      {/* the "trap" — a bounded grid of repetitive units at the base */}
      <div className="absolute bottom-6 left-1/2 w-[74%] -translate-x-1/2 rounded-2xl border hairline bg-ink-850/70 p-4 backdrop-blur">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-mist-500/50" />
          <span className="h-2 w-2 rounded-full bg-mist-500/50" />
          <span className="h-2 w-2 rounded-full bg-mist-500/50" />
          <span className="ml-2 text-[0.6rem] uppercase tracking-widest text-mist-500">
            repetitive work
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="h-5 rounded-md bg-gradient-to-br from-ink-700 to-ink-600"
            />
          ))}
        </div>
      </div>

      {/* freed capacity rising up and out */}
      {particles.map((_, i) => (
        <span
          key={i}
          className="particle absolute h-3 w-3 rounded-md"
          style={{
            left: `${18 + i * 10}%`,
            bottom: "42%",
            background:
              i % 2 === 0
                ? "var(--color-accent-400)"
                : "var(--color-glow-cyan)",
            boxShadow: "0 0 18px var(--color-accent-500)",
            animation: `riseFree ${3.4 + (i % 4) * 0.6}s ease-in ${i * 0.5}s infinite`,
          }}
        />
      ))}

      {/* the destination — an open ring of capacity/potential */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2">
        <div className="relative grid h-28 w-28 place-items-center">
          <span
            className="pulse-ring absolute inset-0 rounded-full border border-accent-400/50"
            style={{ animation: "pulseRing 3.2s ease-out infinite" }}
          />
          <span
            className="pulse-ring absolute inset-0 rounded-full border border-glow-cyan/40"
            style={{ animation: "pulseRing 3.2s ease-out 1.6s infinite" }}
          />
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 shadow-[0_0_40px_-4px_var(--color-accent-500)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l2.4 6 6.1 2.3-6.1 2.3L12 19l-2.4-6.4L3.5 10.3 9.6 8 12 2z"
                fill="white"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
