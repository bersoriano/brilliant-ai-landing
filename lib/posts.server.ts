import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import type { MDXContent } from "mdx/types";
import type { Locale } from "./locale";
import {
  POSTS_DIR,
  isValidSlug,
  isVisible,
  parsePost,
  sortPosts,
  type NoteLink,
  type Post,
} from "./posts";

const production = process.env.NODE_ENV === "production";
const root = path.join(process.cwd(), POSTS_DIR);

async function readPost(slug: string, locale: Locale): Promise<Post | null> {
  if (!isValidSlug(slug)) return null;
  try {
    const raw = await fs.readFile(path.join(root, slug, `${locale}.mdx`), "utf8");
    return parsePost(raw, slug, locale);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function listSlugs() {
  try {
    const entries = await fs.readdir(root, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && isValidSlug(entry.name))
      .map((entry) => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

/** Visible posts in one language, newest first. Drafts show in development only. */
export const getPosts = cache(async (locale: Locale) => {
  const posts = await Promise.all(
    (await listSlugs()).map((slug) => readPost(slug, locale)),
  );
  return sortPosts(
    posts.filter((post): post is Post => !!post && isVisible(post, production)),
  );
});

export const getPost = cache(async (slug: string, locale: Locale) => {
  const post = await readPost(slug, locale);
  return post && isVisible(post, production) ? post : null;
});

/** Links to the given notes, in order; missing and draft notes are skipped. */
export async function getNoteLinks(slugs: string[], locale: Locale): Promise<NoteLink[]> {
  const posts = await Promise.all(slugs.map((slug) => getPost(slug, locale)));
  return posts
    .filter((post): post is Post => !!post)
    .map(({ slug, title }) => ({ slug, title }));
}

// Posts are trusted repo content; compile each once per server instance in
// production, and on every request in development so edits show on reload.
const compiled = new Map<string, Promise<MDXContent>>();

// GFM footnotes (`[^id]`) render as a visible "Sources" list in the post's language.
const FOOTNOTES: Record<Locale, { label: string; back: string }> = {
  en: { label: "Sources", back: "Back to reference" },
  es: { label: "Fuentes", back: "Volver a la referencia" },
};

export function compilePost(post: Post): Promise<MDXContent> {
  const key = `${post.slug}/${post.locale}`;
  const hit = production ? compiled.get(key) : undefined;
  if (hit) return hit;
  const result = evaluate(post.body, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    remarkRehypeOptions: {
      footnoteLabel: FOOTNOTES[post.locale].label,
      footnoteLabelProperties: {},
      footnoteBackLabel: (index, rereference) =>
        `${FOOTNOTES[post.locale].back} ${index + 1}${rereference > 1 ? `-${rereference}` : ""}`,
    },
  }).then((module) => module.default);
  if (production) compiled.set(key, result);
  return result;
}
