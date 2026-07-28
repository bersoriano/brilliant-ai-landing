import { cn } from "./cn";

/** Small uppercase kicker that sits above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent-300",
        className
      )}
    >
      <span aria-hidden className="h-px w-6 bg-accent-400/60" />
      {children}
    </span>
  );
}
