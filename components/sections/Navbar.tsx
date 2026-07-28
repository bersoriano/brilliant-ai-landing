"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "../ui/cn";
import { CALCULATOR_ANCHOR, NAV_LINKS, PRIMARY_CTA } from "@/lib/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b hairline bg-ink-950/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
          <Logo />
          <span className="text-[1.05rem]">Brilliant AI</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-mist-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button href={CALCULATOR_ANCHOR} className="hidden sm:inline-flex">
            {PRIMARY_CTA}
          </Button>
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border hairline text-mist-100"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-nav" className="border-t hairline bg-ink-900/95 backdrop-blur-xl md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-mist-300 hover:bg-ink-800 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <Button href={CALCULATOR_ANCHOR} className="w-full" onClick={() => setOpen(false)}>
                {PRIMARY_CTA}
              </Button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}

function Logo() {
  return (
    <span
      aria-hidden
      className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 shadow-[0_6px_20px_-6px_var(--color-accent-500)]"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1.5l1.7 4.2 4.3 1.6-4.3 1.6L8 14.5 6.3 8.9 2 7.3l4.3-1.6L8 1.5z"
          fill="white"
        />
      </svg>
    </span>
  );
}
