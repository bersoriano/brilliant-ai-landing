import { cn } from "./cn";

type Props = {
  /** Short name shown large, e.g. "Client logo" or "Founder portrait" */
  label: string;
  /** CSS aspect ratio, e.g. "16 / 9", "1 / 1", "4 / 3" */
  aspectRatio?: string;
  /** One line describing the art a designer should drop in here */
  description?: string;
  id?: string;
  className?: string;
};

/**
 * Intentional, on-brand stand-in for real content imagery
 * (screenshots, portraits, client photos, logos).
 *
 * To ship a real image, replace this component at the call site with
 * next/image:
 *   <Image src="/logo.png" alt="Acme" width={160} height={48} />
 * See README → "Swapping image placeholders".
 */
export function ImagePlaceholder({
  label,
  aspectRatio = "16 / 9",
  description,
  id,
  className,
}: Props) {
  return (
    <div
      id={id}
      role="img"
      aria-label={`Image placeholder: ${label}${description ? `. ${description}` : ""}`}
      className={cn(
        "group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed p-4 text-center",
        "border-[color-mix(in_srgb,var(--color-accent-400)_38%,transparent)]",
        "bg-[radial-gradient(120%_120%_at_50%_0%,color-mix(in_srgb,var(--color-accent-500)_16%,transparent),transparent_60%)]",
        className
      )}
      style={{ aspectRatio }}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-mist-100)_1px,transparent_1px),linear-gradient(90deg,var(--color-mist-100)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <span className="relative text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-300">
        {label}
      </span>
      {description ? (
        <span className="relative mt-1.5 max-w-[26ch] text-xs leading-snug text-mist-400">
          {description}
        </span>
      ) : null}
    </div>
  );
}
