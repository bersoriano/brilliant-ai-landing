import { limitInquiry, type InquiryEnv } from "./throttle";

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

const MAX = {
  name: 100,
  email: 254,
  message: 2000,
  workflow: 120,
  organization: 120,
  country: 20,
  phone: 40,
};
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
  organization: string;
  country: string;
  phone: string;
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
    organization: oneLine(text("organization", MAX.organization)),
    country: oneLine(text("country", MAX.country)),
    phone: oneLine(text("phone", MAX.phone)),
    industry,
    message,
    workflow,
    locale: raw.locale === "es" ? "es" : "en",
  };
}

function render(submission: Submission) {
  const subject = `Workflow review — ${submission.industry} — ${submission.name}`;
  const lines = [
    `Name: ${submission.name}`,
    `Work email: ${submission.email}`,
    ...(submission.organization ? [`Organization: ${submission.organization}`] : []),
    ...(submission.country ? [`Country: ${submission.country}`] : []),
    ...(submission.phone ? [`Phone / WhatsApp: ${submission.phone}`] : []),
    `Industry: ${submission.industry}`,
    `Language: ${submission.locale}`,
    ...(submission.workflow ? [`Starting point: ${submission.workflow}`] : []),
    "",
    "About their process:",
    submission.message || "(no additional detail provided)",
  ];
  return { subject: oneLine(subject), text: lines.join("\n") };
}

async function deliver(submission: Submission, env: InquiryEnv, send: typeof fetch) {
  const { subject, text } = render(submission);
  const apiKey = env.RESEND_API_KEY;
  const to = env.INQUIRY_TO_EMAIL || env.NEXT_PUBLIC_CONTACT_EMAIL;
  const from = env.INQUIRY_FROM_EMAIL;

  if (apiKey && to && from) {
    const response = await send("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
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

  const webhook = env.INQUIRY_WEBHOOK_URL;
  if (webhook && /^https:\/\//.test(webhook)) {
    const response = await send(webhook, {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ subject, text, ...submission }),
    });
    return response.ok ? "sent" : "failed";
  }

  return "unconfigured";
}

type Dependencies = { limit?: (request: Request, env: InquiryEnv) => Promise<boolean>; fetch?: typeof fetch };
const json = (body: unknown, init: ResponseInit = {}) => Response.json(body, {
  ...init, headers: { "Cache-Control": "no-store", ...init.headers },
});
export async function handleInquiry(request: Request, env: InquiryEnv, dependencies: Dependencies = {}) {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
  try {
    if (!await (dependencies.limit || limitInquiry)(request, env))
      return json({ ok: false, error: "rate_limited" }, { status: 429, headers: { "Retry-After": "60" } });
  } catch {
    return json({ ok: false, error: "failed" }, { status: 502 });
  }
  // Avoid buffering unbounded submissions in a free-tier isolate.
  if (Number(request.headers.get("content-length")) > 16_384)
    return json({ ok: false, error: "invalid" }, { status: 400 });
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("empty");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16_384) { await reader.cancel(); throw new Error("too large"); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const submission = parse(body);
  if (!submission)
    return json({ ok: false, error: "invalid" }, { status: 400 });

  let outcome: Awaited<ReturnType<typeof deliver>>;
  try {
    outcome = await deliver(submission, env, dependencies.fetch || fetch);
  } catch {
    outcome = "failed";
  }

  if (outcome === "sent") return json({ ok: true });
  // Log the outcome only — never the submission itself.
  console.error(`[inquiry] delivery ${outcome}`);
  return json({ ok: false, error: outcome }, { status: 502 });
}
