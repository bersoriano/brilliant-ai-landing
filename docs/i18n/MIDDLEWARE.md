# Language routing on Cloudflare Pages

`app/[[...path]]` exports English and Mexican Spanish HTML using static params.
The URL determines the language for visitors and crawlers on every request.

The advanced Pages Function runs `cloudflare/routing.ts`.

1. API paths, Next.js assets, and file requests bypass language handling.
2. Existing `?lang=en|es` links remove only `lang`, retain other query parameters,
   set a one-year language cookie, and return a private `307` to the selected URL.
3. Known trailing-slash URLs redirect with `308` to their canonical URL. HTML
   responses revalidate on each visit. Unknown URLs return `404`.

Header and footer switchers link directly to both language versions. They
highlight a saved language or the browser's first supported language when it
differs from the current page. Selecting a language with JavaScript stores the
choice and retains the query and fragment. On landing pages, native history and
bilingual data preserve calculator and form state. Blog switches load the other
exported HTML document. Currency defaults still follow the selected language.

See the [deployment runbook](../deployment/CLOUDFLARE.md) for Function quotas,
assets excluded from execution, and staging checks.
