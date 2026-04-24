# Site Copy Refresh Plan

## Goal

Turn the approved copy direction into an executable Speckit packet that guides a complete public-site copy refresh for clients-first messaging in Arabic and English.

## Scope

- `docs/superpowers/specs/2026-04-24-site-copy-refresh-speckit-design.md`
- `specs/012-site-copy-refresh/spec.md`
- `specs/012-site-copy-refresh/plan.md`
- `specs/012-site-copy-refresh/tasks.md`
- Expected implementation targets:
  - `src/locales/en.json`
  - `src/locales/ar.json`
  - `src/lib/admin/defaults.ts`
  - public copy fallbacks in `src/components/public/*`
  - public page shells in `src/pages/(public)/*`
  - any maintainer notes needed if Firestore-backed content overrides refreshed fallback copy

## Summary

Use one packet to audit all public copy sources, define one editorial standard for both languages, rewrite the public-facing strings section by section, and verify that the final language feels grounded, client-oriented, and complete across the full site.

## Technical Context

**Language/Version**: TypeScript 5.x, JSON, Markdown  
**Primary Dependencies**: React 19, Vite 6, react-i18next, Firebase-backed settings/page-composer hooks  
**Storage**: Public copy is split across locale JSON, repo fallbacks in code, admin defaults, and Firestore-backed page/settings content  
**Testing**: `npm run test:locales`, `npm run build`, manual public-page review in Arabic and English  
**Target Platform**: Web / public portfolio site  
**Project Type**: React/Vite bilingual portfolio with admin-managed content layers

## Constitution Check

*GATE: Must pass before implementation.*

- Constitution read: yes.
- Skill matcher read: yes.
- Matched available skills in use:
  - `brainstorming`
- Missing matched skills handled manually:
  - `speckit-specify`
  - `speckit-plan`
  - `speckit-tasks`
- Localization impact: high.
- Verification required before completion: yes.
- Constitution update required after implementation: no expected requirement unless copy-governance rules become a repo standard.

## Approach

1. Build a source map first so the refresh covers locale strings, fallback defaults, and Firestore-managed public content touchpoints.
2. Lock the editorial standard before rewriting anything: clients-first, personal, simple, direct, and professional.
3. Prioritize the highest-value customer journey copy first: hero, about, projects, contact, and footer.
4. Refresh supporting public sections next so the whole site shares one voice: skills, blog, services, showcase-style sections, featured-project copy, and empty states.
5. Review Arabic and English as paired writing passes that preserve meaning and tone without literal translation.
6. Check where live Firestore content may still override refreshed repository fallbacks and record those follow-up actions explicitly.
7. Verify with locale tests, production build, and manual page review in both languages.

## Risks

- Firestore-backed page-composer content may still surface older wording after repo copy is refreshed.
- Over-editing can make the copy sound too formal or too sparse if the client voice is not kept practical.
- Arabic may require more structural rewriting than English to stay natural while fitting the current UI.
- Short UI strings such as CTAs, chips, empty states, and labels can overflow or lose clarity if rewritten carelessly.
- The site currently mixes marketing-style copy with product/system language, so consistency will require section-by-section discipline.

## Completion Criteria

- Every public section in scope has a tracked rewrite step.
- The packet distinguishes clearly between repo-controlled copy and Firestore-managed overrides.
- Arabic and English tone guidance is explicit and usable.
- Verification steps cover both correctness and presentation risk.
- The packet is detailed enough that implementation can proceed without relying on memory.
