// Destination: lib/fonts.ts
// B5 type system, served locally (no third-party font requests).
// Bodoni Moda = display (opsz 6–96, wght 400–900). Geist = UI/body. Geist Mono = labels.
import localFont from "next/font/local";

export const bodoni = localFont({
  src: [
    {
      path: "../public/fonts/bodoni-moda/BodoniModa-Variable.woff2",
      weight: "400 900",
      style: "normal",
    },
    {
      path: "../public/fonts/bodoni-moda/BodoniModa-Italic-Variable.woff2",
      weight: "400 900",
      style: "italic",
    },
  ],
  variable: "--font-bodoni",
  display: "swap",
  // "Bodoni 72" stays in globals.css only: next/font emits fallbacks unquoted,
  // and an unquoted name with a number invalidates the whole font-family.
  fallback: ["Didot", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
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

/** Apply on <body>: exposes --font-bodoni, --font-geist, --font-geist-mono. */
export const fontVariables = `${bodoni.variable} ${geist.variable} ${geistMono.variable}`;
