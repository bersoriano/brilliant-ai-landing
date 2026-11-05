interface Statement {
  bind(...values: unknown[]): Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface InquiryEnv {
  INQUIRY_RATE_LIMIT?: { prepare(sql: string): Statement };
  INQUIRY_RATE_SALT?: string;
  RESEND_API_KEY?: string;
  INQUIRY_TO_EMAIL?: string;
  INQUIRY_FROM_EMAIL?: string;
  NEXT_PUBLIC_CONTACT_EMAIL?: string;
  INQUIRY_WEBHOOK_URL?: string;
}

/** One atomic write: sliding 60 seconds, at most five admitted attempts per IP.
 * D1 primary serializes writes globally; no isolate-local counters or KV races.
 * IPs are HMACed with a secret; submission content never enters the database.
 */
export async function limitInquiry(request: Request, env: InquiryEnv) {
  if (!env.INQUIRY_RATE_LIMIT || !env.INQUIRY_RATE_SALT) throw new Error("limiter unconfigured");
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.INQUIRY_RATE_SALT), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip));
  const hash = Array.from(new Uint8Array(signature), n => n.toString(16).padStart(2, "0")).join("");
  const now = Date.now();
  // Expired keys are deleted through an index. No request bodies or raw IPs stored.
  await env.INQUIRY_RATE_LIMIT.prepare("DELETE FROM inquiry_limits WHERE expires <= ?").bind(now).run();
  const admitted = await env.INQUIRY_RATE_LIMIT.prepare(`
    INSERT INTO inquiry_limits (key, hits, expires) VALUES (?, json_array(?), ?)
    ON CONFLICT(key) DO UPDATE SET
      hits = json_insert((SELECT json_group_array(value) FROM json_each(inquiry_limits.hits) WHERE value > ?), '$[#]', ?),
      expires = ?
    WHERE (SELECT count(*) FROM json_each(inquiry_limits.hits) WHERE value > ?) < 5
    RETURNING key
  `).bind(hash, now, now + 60_000, now - 60_000, now, now + 60_000, now - 60_000).first();
  return admitted !== null;
}
