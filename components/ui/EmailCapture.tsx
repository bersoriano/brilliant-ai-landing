"use client";

import { useState } from "react";
import { Button } from "./Button";
import { cn } from "./cn";

type Props = {
  /** Where this instance lives, sent with the payload for routing/analytics */
  source: string;
  cta: string;
  placeholder?: string;
  /** Optional structured data to attach (e.g. the ROI result breakdown) */
  payload?: Record<string, unknown>;
  className?: string;
  compact?: boolean;
};

type Status = "idle" | "loading" | "success" | "error";

export function EmailCapture({
  source,
  cta,
  placeholder = "you@company.com",
  payload,
  className,
  compact,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validEmail) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");

    try {
      // -----------------------------------------------------------------
      // TODO: wire your email endpoint here.
      // Replace this block with a real request, e.g.:
      //   const res = await fetch("/api/subscribe", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ email, source, payload }),
      //   });
      //   if (!res.ok) throw new Error("Request failed");
      // See README → "Wiring the email endpoint".
      // -----------------------------------------------------------------
      await new Promise((r) => setTimeout(r, 600)); // simulated latency
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.info("[EmailCapture] would submit:", { email, source, payload });
      }

      setStatus("success");
      setMessage("You're in. We'll be in touch shortly.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const inputId = `email-${source}`;

  if (status === "success") {
    return (
      <p
        role="status"
        className={cn(
          "flex items-center gap-2 rounded-full bg-accent-500/12 px-4 py-3 text-sm font-medium text-accent-200 ring-1 ring-accent-400/30",
          className
        )}
      >
        <span aria-hidden>✓</span>
        {message}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("w-full", className)}
      aria-describedby={message ? `${inputId}-msg` : undefined}
    >
      <div
        className={cn(
          "flex gap-2",
          compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"
        )}
      >
        <div className="flex-1">
          <label htmlFor={inputId} className="sr-only">
            Work email address
          </label>
          <input
            id={inputId}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={placeholder}
            aria-invalid={status === "error"}
            className="w-full rounded-full border hairline bg-ink-950/80 px-5 py-3 text-sm text-mist-100 placeholder:text-mist-500 focus:border-accent-400 focus:outline-none"
          />
        </div>
        <Button type="submit" disabled={status === "loading"} className="shrink-0">
          {status === "loading" ? "Sending…" : cta}
        </Button>
      </div>
      {message && status === "error" ? (
        <p id={`${inputId}-msg`} role="alert" className="mt-2 text-sm text-red-400">
          {message}
        </p>
      ) : null}
    </form>
  );
}
