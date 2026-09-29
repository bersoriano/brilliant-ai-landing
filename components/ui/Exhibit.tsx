// Destination: components/ui/Exhibit.tsx
// Consulting-report figure: "EXHIBIT n" label, optional status, serif title,
// body, and a caption. All strings arrive translated from the caller:
//   <Exhibit label={t("Exhibit {number}", { number: 1 })} title={t(...)} ...>
import type { ReactNode } from "react";

export type ExhibitStatus = { text: string; tone?: "live" | "ready" | "review" | "done" };

export function Exhibit({
  label,
  title,
  titleId,
  status,
  caption,
  children,
  className = "",
}: {
  label: string;
  title?: ReactNode;
  titleId?: string;
  status?: ExhibitStatus;
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`exhibit ${className}`.trim()} aria-labelledby={titleId}>
      <div className="exhibit__head">
        <span className="exhibit__label">{label}</span>
        {status ? (
          <span className={`status status--${status.tone ?? "done"}`}>{status.text}</span>
        ) : null}
      </div>
      {title ? (
        <p id={titleId} className="exhibit__title">
          {title}
        </p>
      ) : null}
      {children}
      {caption ? <figcaption className="exhibit__caption">{caption}</figcaption> : null}
    </figure>
  );
}
