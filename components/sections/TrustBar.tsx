import { SectionWrapper } from "../ui/SectionWrapper";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export function TrustBar() {
  const slots = Array.from({ length: 6 });
  return (
    <SectionWrapper width="wide" className="py-10 border-y hairline">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-mist-500">
        Built with teams who refuse to hit their ceiling
      </p>
      <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {slots.map((_, i) => (
          <ImagePlaceholder
            key={i}
            label="Client logo"
            aspectRatio="5 / 2"
            description={i === 0 ? "Mono logo, sits quietly" : undefined}
          />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-mist-500">
        [PLACEHOLDER: real metric &mdash; e.g. &ldquo;X hours reclaimed across
        client teams&rdquo; once measured]
      </p>
    </SectionWrapper>
  );
}
