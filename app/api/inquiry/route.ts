import { NextResponse } from "next/server";

/**
 * Server-side inquiry delivery. Replaces the mailto: handoff so the visitor
 * never leaves the page and never has to own delivery themselves.
 *
 * Delivery is chosen from whichever transport is configured:
 *   RESEND_API_KEY       -> send the email directly
 *   INQUIRY_WEBHOOK_URL  -> POST the submission as JSON
 * With neither set the endpoint reports that it is unconfigured and the form
 * falls back to the email draft, so a misconfigured deploy never silently
 * swallows a lead.
 *
 * Submission content is never logged: it carries names, work emails, and
 * descriptions of internal processes.
 */

const MAX = { name: 100, email: 254, message: 2000, workflow: 120 };
const INDUSTRIES = new Set([
  "finance",
  "healthcare",
  "operations",
  "sales",
  "other",
]);
const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

/** Defence in depth: keep CR/LF out of anything placed in a subject line. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

type Submission = {
  name: string;
  email: string;
  industry: string;
  message: string;
  workflow: string;
  locale: "en" | "es";
};

function parse(body: unknown): Submission | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const text = (key: string, limit: number) => {
    const value = raw[key];
    if (typeof value !== "string") return "";
    return value.trim().slice(0, limit);
  };
  // Honeypot: a real person never sees or fills this field.
  if (text("company", 80)) return null;
  const name = oneLine(text("name", MAX.name));
  const email = oneLine(text("email", MAX.email));
  const industry = text("industry", 20);
  const message = text("message", MAX.message);
  if (!name || !EMAIL.test(email) || !INDUSTRIES.has(industry)) return null;
  const workflow = oneLine(text("workflowTitle", MAX.workflow));
  if (!message && !workflow) return null;
  return {
    name,
    email,
    industry,
    message,
    workflow,
    locale: raw.locale === "es" ? "es" : "en",
  };
}

/**
 * Small in-process throttle. It is not a substitute for edge rate limiting on
 * a multi-instance deploy, but it blunts a single noisy client for free.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function throttled(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [ip, times] of hits)
      if (!times.some((at) => now - at < WINDOW_MS)) hits.delete(ip);
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function render(submission: Submission) {
  const subject = `Workflow review — ${submission.industry} — ${submission.name}`;
  const lines = [
    `Name: ${submission.name}`,
    `Work email: ${submission.email}`,
    `Industry: ${submission.industry}`,
    `Language: ${submission.locale}`,
    ...(submission.workflow ? [`Starting point: ${submission.workflow}`] : []),
    "",
    "About their process:",
    submission.message || "(no additional detail provided)",
  ];
  return { subject: oneLine(subject), text: lines.join("\n") };
}

async function deliver(submission: Submission) {
  const { subject, text } = render(submission);
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;

  if (apiKey && to && from) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: submission.email,
        subject,
        text,
      }),
    });
    return response.ok ? "sent" : "failed";
  }

  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (webhook && /^https:\/\//.test(webhook)) {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ subject, text, ...submission }),
    });
    return response.ok ? "sent" : "failed";
  }

  return "unconfigured";
}

export async function POST(request: Request) {
  if (throttled(clientKey(request)))
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const submission = parse(body);
  if (!submission)
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  let outcome: Awaited<ReturnType<typeof deliver>>;
  try {
    outcome = await deliver(submission);
  } catch {
    outcome = "failed";
  }

  if (outcome === "sent") return NextResponse.json({ ok: true });
  // Log the outcome only — never the submission itself.
  console.error(`[inquiry] delivery ${outcome}`);
  return NextResponse.json({ ok: false, error: outcome }, { status: 502 });
}
