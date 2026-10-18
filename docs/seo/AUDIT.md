# SEO audit and implementation

Reviewed October 17, 2026 (America/Mexico_City). Verification used a local production build; Search Console submission remains a separate operational step.

## Scope

The site has 30 canonical pages: eight site pages and seven published posts, each in English and Mexican Spanish. `/blog` is the only archive. `/post`, `/post/<slug>`, `/es/post`, and `/es/post/<slug>` do not exist and return 404. The redirects originally added for these mistaken paths were removed on October 18, 2026.

All seven published posts were reviewed and updated in both languages:

| Post path under `/blog/` | Search focus |
| --- | --- |
| `agents-in-regulated-work` | AI agents in finance and healthcare |
| `approval-points-without-bottlenecks` | Approval workflow design |
| `crm-systems-of-action` | Generative, predictive, and agentic AI in CRM |
| `erp-systems-of-action` | AI in ERP and human approvals |
| `erp-vs-crm-small-business` | ERP vs. CRM for small business, uses and costs |
| `measuring-capacity-reclaimed` | Measuring automation ROI and hours reclaimed |
| `why-invoice-automation-stalls` | Invoice automation and AP exception handling |

## Changes made

- Added concise, optional `seoTitle` frontmatter for each published translation. The full editorial title remains the visible heading and social title.
- Made the archive title, heading, and description describe its AI automation, CRM, and ERP coverage. Shortened the homepage description and clarified the ROI article description.
- Kept explicit canonical URLs, reciprocal language alternates, article metadata, and localized social cards together in a shared post metadata builder.
- Fixed client-side metadata updates that replaced the configured canonical domain with the browser's hostname on previews or alternate hosts.
- Added visible organization bylines and publication dates, with modification dates when authors provide them. No author identities or credentials were invented.
- Added article WebPage, BlogPosting, BreadcrumbList, Blog, and ItemList markup connected to the existing site graph.
- Replaced the address-less ProfessionalService markup with Organization and ContactPoint. Replaced the unsupported PrivacyPolicy page type with WebPage. Added service markup for the finance and healthcare pages.
- Added a unique 1200 × 630 social image for every article and language through `/og?post=<slug>`. Missing and unpublished posts return 404. Image responses use a bounded cache lifetime, and deployment traces include their content and fonts.
- Added contextual links from each article to relevant service pages. Existing related-article links remain in place.
- Updated sitemap dates per translation and archive freshness. Drafts and nonexistent `/post` paths are excluded; public pages remain crawlable, while `/api/` is excluded in robots.txt.
- Tightened frontmatter validation to reject impossible dates, modification dates before publication, and empty search titles.
- Fixed a missing `#top` target on supporting pages and article tables forcing the whole page wider than a mobile viewport.
- Improved language-control accessible labels, underlined the footer's inline contact link and article footnote return links, and restored native list semantics inside the CRM/ERP tab panels.

## Verification

- Production build and TypeScript checks pass.
- All 39 automated tests pass, including five SEO regression tests.
- `npm run verify:seo` checks all 30 rendered pages, seven published articles in both languages, 722 internal links and fragment targets, 14 generated article images, sitemap, robots.txt, 404s for the nonexistent `/post` archive and all seven mistaken article paths in both languages, unpublished posts, and missing-page responses.
- The crawler verifies initial HTML with Googlebot headers, a Spanish browser preference, and a Spanish preference cookie. English URLs remain accessible without a language redirect.
- Browser checks confirm the Spanish long-form article fits a 390-pixel viewport and service canonical URLs retain `https://brilliant.dev` after hydration.
- Independent code review found no material issues.

Mobile Lighthouse checks scored **100/100 for SEO, accessibility, and best practices** on the homepage, blog index, and a long Spanish article. Score summaries and lab timestamps are saved in [lighthouse-summary.json](./lighthouse-summary.json).

| Page | SEO | Accessibility | Best practices | Performance |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 100 | 100 | 100 | 83 |
| Blog index | 100 | 100 | 100 | 91 |
| Spanish ERP vs. CRM article | 100 | 100 | 100 | 90 |

To repeat the crawl, build and start a production server, then run the verifier from another terminal:

```sh
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
```

```sh
npm run verify:seo -- http://127.0.0.1:3100
```

The verifier requires published production behavior; development intentionally displays drafts.

## Remaining priorities

1. **Deploy and verify indexing.** After deployment, submit `https://brilliant.dev/sitemap.xml` in Google Search Console. Inspect the archive and seven article URLs in both languages. Check Google's selected canonical, rendered content, and indexing status. Search Console ownership and historical search data were not available for this audit.
2. **Improve and measure real visitor performance.** Use Search Console Core Web Vitals and PageSpeed Insights after deployment. Local Lighthouse is a lab sample, not real-user evidence. The homepage's initial mobile run identified the decorative hero video as the LCP element (4.7 seconds, performance 83/100). Test a prioritized responsive poster and defer decorative video playback; measure the visual and bandwidth tradeoff before changing the hero. The blog scored 91/100 for performance, with rendering and unused shared CSS/JavaScript as further opportunities.
3. **Publish evidence readers can inspect.** Add original workflow diagrams, worked examples, and approved case studies when available. Current article images are title cards; editorial diagrams or screenshots would give readers more useful visual evidence. Never invent client outcomes or certifications.
4. **Keep sources and ownership current.** Review vendor pricing and dated external citations regularly. Set `updated` only after meaningful editorial changes. Add named authors or reviewers only when their identities, role, and contribution are verified.
5. **Use actual search demand.** Once Search Console has enough impressions, refine titles and expand the questions readers already search for. Build relevant industry references and links through useful original material. No keyword-volume or backlink-profile claims were made without data.

A perfect technical audit score does not guarantee crawling, indexing, rich results, traffic, or rankings. Content usefulness, relevance, competition, and real user experience still matter.

## Primary guidance

- [Google's developer SEO guide](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- [Canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
