# Site Copy Refresh Tasks

## Source Audit

Audit artifact: `specs/012-site-copy-refresh/source-audit.md`

- [x] T001 Map every public copy source across `src/locales/en.json`, `src/locales/ar.json`, `src/lib/admin/defaults.ts`, public component fallbacks, and Firestore-backed public content overrides.
- [x] T002 Mark the exact in-scope public sections: `hero`, `about`, `projects`, `skills`, `blog`, `services`, `contact`, `footer`, and supporting public labels/empty states.
- [x] T003 Record the explicitly out-of-scope areas so admin/dashboard wording is not changed by accident.

## Editorial Direction

- [ ] T004 Write a compact tone guide for both languages: personal, simple, direct, professional, and clients-first.
- [ ] T005 Record banned copy patterns to remove during implementation: inflated claims, vague product-speak, generic AI-sounding phrasing, filler, and over-friendly slang.
- [ ] T006 Define Arabic/English parity rules so meaning stays aligned without literal translation.

## High-Impact Public Copy

- [ ] T007 Rewrite the homepage hero fallback copy, including headline, subheadline, CTA labels, supporting stat cards, and terminal-card messaging.
- [ ] T008 Rewrite the about-page fallback copy, including intro, strengths, editorial card messaging, availability wording, and section CTAs.
- [ ] T009 Rewrite the projects-page fallback copy, including hero copy, search/sort/filter labels, badges, empty states, and project action labels.
- [ ] T010 Rewrite the contact-page fallback copy, including intro, form labels/placeholders, availability card, FAQ, response messaging, and success/error text.
- [ ] T011 Rewrite footer copy, including summary, status strip, footer CTA, quick-link framing, and bottom-line supporting text.

## Supporting Public Copy

- [ ] T012 Rewrite skills-page fallback copy, including title, subtitle, empty states, and supporting stats labels.
- [ ] T013 Rewrite blog-page fallback copy, including hero copy, search/category labels, empty states, and supporting reading labels.
- [ ] T014 Rewrite services and showcase-related copy, including section intros and any static public cards that still sound generic.
- [ ] T015 Rewrite supporting public CTA copy such as featured-projects labels, CTA sections, navigation labels if needed, and any small public utility strings that still break the tone.

## Fallback and Settings Layers

- [ ] T016 Refresh public-facing defaults in `src/lib/admin/defaults.ts`, including site tagline, footer defaults, public CTA defaults, and SEO/public metadata fallbacks where they affect live public messaging.
- [ ] T017 Review which public strings come from site/contact/footer settings or page-composer content so runtime overrides do not leave older copy active.
- [ ] T018 Record any manual follow-up needed inside the dashboard for Firestore-managed public content that will not change through repo fallback edits alone.

## Bilingual Quality Pass

- [ ] T019 Review the Arabic pass end-to-end for clarity, restraint, and natural phrasing.
- [ ] T020 Review the English pass end-to-end for the same tone and remove any remaining generic portfolio language.
- [ ] T021 Compare the Arabic and English versions section by section to confirm they match in intent, warmth, and specificity.

## Verification

- [ ] T022 Run `npm run test:locales`.
- [ ] T023 Run `npm run build`.
- [ ] T024 Manually review the public pages in both languages: `/`, `/about`, `/projects`, `/blog`, and `/contact`.
- [ ] T025 Check compact UI strings for fit in buttons, cards, chips, empty states, and SEO-related text.
- [ ] T026 Review the final diff to confirm the refresh stayed within public-site copy scope.
