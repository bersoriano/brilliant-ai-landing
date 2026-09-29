// Destination: components/ui/Kicker.tsx
// Economist-style rubric: a 32×4 accent bar above a mono uppercase label.
// Pass already-translated text: <Kicker>{t("Our approach")}</Kicker>
import type { ElementType, ReactNode } from "react";

export function Kicker({
  children,
  as: Tag = "p",
  id,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  id?: string;
  className?: string;
}) {
  return (
    <Tag id={id} className={`kicker ${className}`.trim()}>
      {children}
    </Tag>
  );
}
