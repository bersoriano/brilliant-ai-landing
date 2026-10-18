---
description: Draft a new bilingual blog post (EN + es-MX MDX) that passes the site's rules
argument-hint: <topic> [audience, key points, source notes, slug, length]
---

Write a new blog post for this site.

Brief from the user:

$ARGUMENTS

If the brief contains finished post text, it is the post: keep the author's wording, structure and claims. Only fix typos, convert it to MDX (headings, lists, links), write the title, description and slug from it, and add the closing section below if the text has none. Write the other language from it (EN or es-MX, whichever is missing). List any edit beyond typos in your reply, and flag (don't silently remove) anything that breaks the honesty rules below. Skip the outline step.

If the brief is empty, ask for the topic and stop. Otherwise fill the gaps yourself: infer the audience (finance or healthcare operations teams in the US, Canada and Mexico), propose a slug, and aim for about 800 words unless the brief says otherwise. If the brief gives no key points, show a 4–6 point outline and wait for approval before writing.

## Files

- Follow CLAUDE.md. Create `content/posts/<slug>/en.mdx` and `content/posts/<slug>/es.mdx`. Copy the format from `content/posts/example-post/`.
- Frontmatter in both files: `title`, `description` (one sentence, under 160 characters, used for SEO), `date` (today, YYYY-MM-DD), `draft: true`. Both files use the same `date` and `draft`.
- If the slug folder already exists, stop and ask.

## Writing

- Write the English first. Then write a native Mexican Spanish version, not a word-for-word translation: use *tú* with the reader and Mexican terms (CFDI, OC, RFC, preautorización, aseguradora, iguala, junta). Call a workflow "proceso", as the rest of the site does.
- Start the body with a paragraph; the page already renders the title. Use `##` and `###` headings, short paragraphs, and lists or a table only where they help. Don't use raw `<` or `{` in prose (MDX reads them as JSX); put them in backticks.
- Link to site pages with plain paths (`/security`, `/finance-automation`, `/healthcare-automation`, `/custom-crm`, `/about`). They get localized automatically. Link external sources with full URLs.
- Close every post with a `## Next step: …` section (`## Siguiente paso: …` in Spanish): one small exercise tied to the post's topic (2–4 sentences, or a short list), then one calm line inviting the reader to bring that work to a 20-minute workflow review, e.g. “a 20-minute workflow review is usually enough to see whether it’s worth piloting” (“una revisión de 20 minutos suele bastar para ver si vale la pena hacer un piloto”). No urgency or hard sell.
- End that section with `<BookReview />` on its own line. It renders the booking button with the `PRIMARY_CTA` label, and the page adds no other button, so every post needs exactly one (a test checks). Don't link the review in prose or write your own button label. Sources and footnotes go after it.

## Honesty (non-negotiable)

- Never invent stats, clients, results, quotes, or certifications. Present workflows as examples and tools as potential integrations.
- Money appears only as labelled illustrative examples: USD in English, MXN in Spanish, no FX conversion.
- Don't name former employers or the CRM foundation. Don't claim SOC 2, HIPAA, or ISO certification. Security points describe a process the client controls (see `/security`).
- If a point needs a number or fact the brief doesn't give, leave `[TODO: source]` in both files instead of making one up.
- Images: only ones the user provides. Put them in `public/blog/<slug>/` and reference them with a local path, with alt text in each language.

## Finish

1. Run `npm test` and fix anything it flags.
2. Reply with both titles and descriptions, a short outline, every `[TODO]` left, and the preview URLs (`/blog/<slug>` and `/es/blog/<slug>` under `npm run dev`; drafts show only in dev).
3. Don't commit, and don't set `draft: false`. The user publishes.
