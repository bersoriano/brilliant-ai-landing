"use client";
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import { useFirstView } from "./motion";

/**
 * Fades its children up the first time they scroll into view. Used for
 * exhibits and cards only, so the page settles rather than performs.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** ms, for staggering siblings */
  delay?: number;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children" | "style">) {
  const [ref, state] = useFirstView<HTMLElement>(0.15);
  return (
    <Tag
      ref={ref}
      {...rest}
      className={`reveal ${className}`.trim()}
      data-view={state}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
