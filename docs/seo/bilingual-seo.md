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

## Keyword Targeting

The current keyword strategy uses one canonical URL per route, so English and Arabic search terms must be supported by visible copy and metadata on the same route.

- `/` targets identity and core service intent: `Mohamed Saied`, `Mohamed Saeed`, `saeeddev`, `React developer Egypt`, websites, dashboards, and internal tools.
- `/about` targets trust and owner identity searches.
- `/projects` targets proof-led searches around React dashboards, admin panels, internal tools, CRM, inventory, clinic, ATS, and e-commerce workflows.
- `/skills` targets stack credibility: React, TypeScript, Firebase, Node.js, and bilingual Arabic-English web work.
- `/contact` targets hiring intent for websites, dashboards, internal tools, and bilingual web apps.
- Project detail routes target long-tail terms such as e-commerce admin dashboard, inventory dashboard React, clinic management dashboard, React CRM dashboard, and applicant tracking system dashboard.

Arabic keywords should be verified in the rendered site and dashboard-managed content before deployment. Some repository Arabic source has historical encoding artifacts, so visual and source-HTML checks are required before publishing Arabic SEO changes.

Do not add fake `/ar` or `/en` alternates for keyword coverage. If dedicated localized routes are introduced later, update canonical tags, sitemap generation, route metadata, and `hreflang` together.
