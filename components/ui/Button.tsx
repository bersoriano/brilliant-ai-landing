import Link from "next/link";
import { cn } from "./cn";

type Variant = "primary" | "ghost" | "link";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "rounded-full bg-accent-500 text-white shadow-[0_10px_40px_-12px_var(--color-accent-500)] hover:bg-accent-400 hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "rounded-full border border-[color-mix(in_srgb,var(--color-mist-400)_28%,transparent)] text-mist-100 hover:border-accent-400 hover:text-white hover:-translate-y-0.5",
  link: "text-mist-300 underline-offset-4 hover:text-white hover:underline",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsLink = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

type AsButton = CommonProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], className);

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
