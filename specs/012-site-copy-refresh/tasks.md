# Site Copy Refresh Tasks

## Source Audit

Audit artifact: `specs/012-site-copy-refresh/source-audit.md`

- [x] T001 Map every public copy source across `src/locales/en.json`, `src/locales/ar.json`, `src/lib/admin/defaults.ts`, public component fallbacks, and Firestore-backed public content overrides.
- [x] T002 Mark the exact in-scope public sections: `hero`, `about`, `projects`, `skills`, `blog`, `services`, `contact`, `footer`, and supporting public labels/empty states.
- [x] T003 Record the explicitly out-of-scope areas so admin/dashboard wording is not changed by accident.

## Editorial Direction

Editorial artifact: `specs/012-site-copy-refresh/editorial-direction.md`

- [x] T004 Write a compact tone guide for both languages: personal, simple, direct, professional, and clients-first.
- [x] T005 Record banned copy patterns to remove during implementation: inflated claims, vague product-speak, generic AI-sounding phrasing, filler, and over-friendly slang.
- [x] T006 Define Arabic/English parity rules so meaning stays aligned without literal translation.

## High-Impact Public Copy

- [x] T007 Rewrite the homepage hero fallback copy, including headline, subheadline, CTA labels, supporting stat cards, and terminal-card messaging.
- [x] T008 Rewrite the about-page fallback copy, including intro, strengths, editorial card messaging, availability wording, and section CTAs.
- [x] T009 Rewrite the projects-page fallback copy, including hero copy, search/sort/filter labels, badges, empty states, and project action labels.
- [x] T010 Rewrite the contact-page fallback copy, including intro, form labels/placeholders, availability card, FAQ, response messaging, and success/error text.
- [x] T011 Rewrite footer copy, including summary, status strip, footer CTA, quick-link framing, and bottom-line supporting text.

## Supporting Public Copy

- [x] T012 Rewrite skills-page fallback copy, including title, subtitle, empty states, and supporting stats labels.
- [x] T013 Rewrite blog-page fallback copy, including hero copy, search/category labels, empty states, and supporting reading labels.
- [x] T014 Rewrite services, showcase, and testimonials-related copy, including section intros, fallback testimonial text, and any static public cards that still sound generic.
- [x] T015 Rewrite supporting public CTA copy such as featured-projects labels, CTA sections, navigation labels if needed, and any small public utility strings that still break the tone.

## Fallback and Settings Layers

- [x] T016 Refresh public-facing defaults in `src/lib/admin/defaults.ts`, including site tagline, footer defaults, public CTA defaults, and SEO/public metadata fallbacks where they affect live public messaging.
- [x] T017 Review which public strings come from site/contact/footer settings or page-composer content so runtime overrides do not leave older copy active.
- [x] T018 Record any manual follow-up needed inside the dashboard for Firestore-managed public content that will not change through repo fallback edits alone.

## Bilingual Quality Pass

- [x] T019 Review the Arabic pass end-to-end for clarity, restraint, and natural phrasing.
- [x] T020 Review the English pass end-to-end for the same tone and remove any remaining generic portfolio language.
- [x] T021 Compare the Arabic and English versions section by section to confirm they match in intent, warmth, and specificity.

## Verification

- [x] T022 Run `npm run test:admin`.
- [x] T023 Run `npm run test:locales`.
- [x] T024 Run `npm run i18n:check`.
- [x] T025 Run `npm run build`.
- [x] T026 Manually review the public pages in both languages: `/`, `/about`, `/projects`, `/blog`, and `/contact`.
- [x] T027 Check compact UI strings for fit in buttons, cards, chips, empty states, and SEO-related text.
- [x] T028 Review the final diff to confirm the refresh stayed within public-site copy scope.

## Dashboard Follow-Up

Follow-up artifact: `specs/012-site-copy-refresh/settings-follow-up.md`

- [ ] T029 Update `Dashboard -> Site Settings` (`settings/profile` and `settings/site`) so the live profile title, bio, site tagline, and metadata-facing copy match the refreshed repo baseline.
- [ ] T030 Update `Dashboard -> Footer Settings` and `Dashboard -> Contact Settings` so stale footer, availability, response-time, and location overrides are either rewritten to the new tone or cleared to fall back safely.
- [ ] T031 Update `Dashboard -> SEO Settings` and `Dashboard -> Page Composer` for `home`, `about`, `projects`, `blog`, and `contact` wherever older page-level copy still overrides the refreshed repo copy.
- [ ] T032 Re-review the live public pages after dashboard changes and only then mark the packet fully complete or explicitly deferred.
