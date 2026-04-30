# Bilingual SEO Strategy

The public site uses one canonical URL per route.

## Decision

- Canonical host: `https://portfolio.saeeddev.com`.
- Language strategy: single URL with runtime `lang` / `dir` switching.
- No alternate `/ar` or `/en` route set exists today, so the site must not emit fake `hreflang` alternates.
- Server-rendered metadata uses the default English content where a request does not carry a language signal.
- React updates `document.lang` and `document.dir` after hydration based on persisted or browser language preference.

## Why

This avoids duplicate canonical conflicts while the routing model is a single bilingual SPA. If dedicated localized routes are added later, sitemap generation, canonical tags, and `hreflang` output must be changed together.

## Verification

Before deployment, check that server HTML includes:

- `<title>`
- `<meta name="description">`
- `<link rel="canonical">`
- Open Graph tags
- Twitter card tags
- JSON-LD
