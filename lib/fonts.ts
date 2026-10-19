// Destination: lib/fonts.ts
// Type system, served locally (no third-party font requests).
// Bricolage Grotesque = display (opsz 12–96, wdth 75–100, wght 200–800). Geist = UI/body. Geist Mono = labels.
import localFont from "next/font/local";

export const bricolage = localFont({
  src: [
    {
      path: "../public/fonts/bricolage-grotesque/BricolageGrotesque-Variable.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
  variable: "--font-bricolage",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const geist = localFont({
  src: [
    {
      path: "../public/fonts/geist/Geist-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const geistMono = localFont({
  src: [
    {
      path: "../public/fonts/geist/GeistMono-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  adjustFontFallback: false,
});

/** Apply on <body>: exposes --font-bricolage, --font-geist, --font-geist-mono. */
export const fontVariables = `${bricolage.variable} ${geist.variable} ${geistMono.variable}`;
