import { cn } from "./cn";

type Props = {
  id?: string;
  className?: string;
  /** max content width; defaults to a comfortable reading measure */
  width?: "default" | "wide" | "narrow";
  children: React.ReactNode;
  as?: "section" | "div" | "footer" | "header";
};

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export function SectionWrapper({
  id,
  className,
  width = "default",
  children,
  as: Tag = "section",
}: Props) {
  return (
    <Tag id={id} className={cn("relative px-5 sm:px-8", className)}>
      <div className={cn("mx-auto w-full", widths[width])}>{children}</div>
    </Tag>
  );
}
