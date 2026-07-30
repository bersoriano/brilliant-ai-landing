import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brilliant AI — Unlock your team's ceiling",
  description:
    "Brilliant AI turns the repetitive work draining your team into automated systems that just run — so your people do the work only humans can.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
