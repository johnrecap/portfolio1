# Site Copy Bilingual Quality Pass

## Purpose

This pass checks the Arabic and English public copy together so both versions feel aligned in tone, clarity, and intent instead of reading like separate writing styles or literal translations.

## What Was Reviewed

- shared public copy in `src/locales/en.json`
- shared public copy in `src/locales/ar.json`
- fallback/default public messaging in `src/lib/admin/defaults.ts`
- profile fallback messaging in `src/hooks/useProfile.ts`

## Review Findings

### 1. Arabic and English are now aligned on audience

Both versions consistently speak to:

- clients
- founders
- small teams
- projects that need a clear public experience plus a practical system behind it

This replaced the older mix of generic portfolio language and broad product-marketing phrasing.

### 2. The main parity issue was not only wording

The footer had a structural fallback issue:

- the top availability paragraph
- and the lower summary block

were effectively pulling the same message by default, which made the site feel repetitive even after the wording improved.

This was corrected by:

- separating the default footer tagline layer from the site tagline layer
- keeping the top footer paragraph tied to availability/support copy
- keeping the lower footer summary tied to the broader site description

### 3. Secondary public copy needed cleanup too

A few older public-facing fallback namespaces still contained inflated or outdated tone, especially:

- `cta`
- `heroCode`

These were refreshed so they no longer reintroduce generic AI-sounding phrasing if reused later.

## Quality Decisions

### Arabic Pass

- Preferred natural Arabic rhythm over literal translation
- Kept the phrasing direct and professional
- Avoided heavy promotional wording and embellished claims
- Preserved warmth without slang or over-familiar phrasing

### English Pass

- Kept sentences short enough for UI fit
- Removed startup-style and agency-style exaggeration
- Favored concrete outcomes over capability claims
- Kept the voice personal without becoming chatty

## Remaining Manual Review Boundary

This pass improves repository-controlled copy and fallback behavior.

Live public wording can still be overridden by:

- site settings
- footer settings
- contact settings
- SEO settings
- page-composer section content
- record-level project/blog/testimonial/skill content

That follow-up is tracked separately in `specs/012-site-copy-refresh/settings-follow-up.md`.
