"use client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { CSSProperties } from "react";
export function Icon({
  name,
  size = 20,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h15M13 5l7 7-7 7" />
      </>
    ),
    diagonal: (
      <>
        <path d="M5 19 19 5M5 5h14v14" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    shield: (
      <>
        <path d="M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7l-9-4Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    document: (
      <>
        <path d="M14 3H5v18h14V8l-5-5Z" />
        <path d="M14 3v5h5M8 12h8M8 16h6" />
      </>
    ),
    flow: (
      <>
        <rect x="3" y="3" width="7" height="6" rx="1.5" />
        <rect x="14" y="15" width="7" height="6" rx="1.5" />
        <path d="M6 9v6a3 3 0 0 0 3 3h5M10 6h5a3 3 0 0 1 3 3v6" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v17h17M8 15V9M13 15V5M18 15v-4" />
      </>
    ),
    heart: (
      <>
        <path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 8 15 8 15S25 10 20 5Z" />
        <path d="M3 12h5l2-4 3 7 2-3h6" />
      </>
    ),
    bank: (
      <>
        <path d="m3 8 9-5 9 5H3ZM3 21h18M5 10v8M10 10v8M14 10v8M19 10v8" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    spark: (
      <>
        <path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z" />
      </>
    ),
    plug: (
      <>
        <path d="M8 3v5M16 3v5M5 8h14v4a7 7 0 0 1-14 0V8ZM12 19v3" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v2" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {paths[name] || paths.spark}
    </svg>
  );
}
export function Brand({ footer = false }: { footer?: boolean }) {
  const { t, locale } = useLanguage();
  return (
    <a
      href={locale === "es" ? "/es#top" : "/#top"}
      className={`brand${footer ? " brand-footer" : ""}`}
    >
      <span className="brand-mark">
        <Icon name="spark" size={25} />
      </span>
      <span>
        brilliant<span className="brand-ai"> ai</span>
        <span className="brand-period">.</span>
      </span>
      <span className="sr-only"> {t("home")}</span>
    </a>
  );
}
