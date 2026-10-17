import { parse as parseYaml } from "yaml";
import type { Locale } from "./locale";

/**
 * Blog posts live in `content/posts/<slug>/en.mdx` and `es.mdx`. Every post
 * ships in both languages so the hreflang alternates always resolve. This
 * module is pure (no fs) so the tests can load it; the reader is
 * `posts.server.ts`.
 */
export const POSTS_DIR = "content/posts";
export const POST_LOCALES: readonly Locale[] = ["en", "es"];

export type PostMeta = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  updated?: string;
  /** Drafts render in development only. */
  draft: boolean;
};

export type Post = PostMeta & { body: string };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidSlug(slug: string) {
  return SLUG.test(slug);
}

function isIsoDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    ISO_DATE.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
  );
}

/** Split YAML frontmatter from an MDX file and validate it. Throws with the file name. */
export function parsePost(raw: string, slug: string, locale: Locale): Post {
  const file = `${POSTS_DIR}/${slug}/${locale}.mdx`;
  if (!isValidSlug(slug))
    throw new Error(`${file}: slug must be lowercase words joined by hyphens`);
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing --- frontmatter block`);
  const data = (parseYaml(match[1]) ?? {}) as Record<string, unknown>;
  const { title, description, date, updated, draft = false } = data;
  if (typeof title !== "string" || !title.trim())
    throw new Error(`${file}: title is required`);
  if (typeof description !== "string" || !description.trim())
    throw new Error(`${file}: description is required`);
  if (!isIsoDate(date)) throw new Error(`${file}: date must be YYYY-MM-DD`);
  if (updated !== undefined && !isIsoDate(updated))
    throw new Error(`${file}: updated must be YYYY-MM-DD`);
  if (typeof draft !== "boolean")
    throw new Error(`${file}: draft must be true or false`);
  return {
    slug,
    locale,
    title: title.trim(),
    description: description.trim(),
    date,
    updated,
    draft,
    body: match[2],
  };
}

export function isVisible(post: Pick<PostMeta, "draft">, production: boolean) {
  return !post.draft || !production;
}

/** Newest first; slug breaks ties so the order is stable. */
export function sortPosts<T extends Pick<PostMeta, "date" | "slug">>(posts: T[]) {
  return [...posts].sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
  );
}
