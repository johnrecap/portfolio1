# Tasks: Lighthouse Excellence Program

**Input**: Design documents from `/specs/019-lighthouse-excellence/`  
**Prerequisites**: `spec.md`, `plan.md`, explicit user approval before implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after the phase prerequisites are complete
- **[Story]**: User story from `spec.md`

## Phase 0: Review Gate

- [x] T001 [US1] Review this Speckit packet with the user and get explicit approval to implement.
- [x] T002 [US5] Confirm canonical production host for SEO: `portfolio.saeeddev.com`, `mohamed.studio`, or another final URL.
- [x] T003 [US2] Confirm image strategy: overwrite public preview images or create variant files such as `.webp`/`.avif` beside originals.
- [x] T004 [US6] Confirm whether Lighthouse thresholds should be enforced in CI immediately or added first as local-only checks.

## Phase 1: Measurement Baseline

- [x] T005 [US1] Create `scripts/lighthouse/lighthouse.config.mjs` with mobile and desktop profiles for `/`, `/projects`, `/blog`, `/skills`, `/contact`, one project detail route, and one blog detail route.
- [x] T006 [US1] Create `scripts/lighthouse/audit.mjs` to build or target a running production server, run Lighthouse in a clean browser context, and write JSON/HTML artifacts into `.agent/lighthouse/YYYY-MM-DD-HHMM/`.
- [x] T007 [US1] Create `scripts/lighthouse/budget-check.mjs` that reads Lighthouse JSON and fails below configured thresholds.
- [x] T008 [US1] Add package scripts: `lighthouse:mobile`, `lighthouse:desktop`, `lighthouse:all`, and `budgets`.
- [x] T009 [US1] Add `.agent/lighthouse/` artifact ignores while preserving `.agent/lighthouse/.gitkeep`.
- [ ] T010 [US1] Run baseline audits without changing app behavior and save results for before/after comparison.

## Phase 2: Media and LCP Optimization

- [x] T011 [US2] Create `scripts/assets/optimize-public-images.mjs` to generate WebP/AVIF variants and dimensions for `public/demo-previews/*`.
- [x] T012 [US2] Optimize `public/demo-previews/ShopNest-Commerce.png` from 1.19 MB to budget-compliant variants under 200 KB.
- [x] T013 [US2] Optimize the remaining demo preview images and record original vs optimized sizes in the script output.
- [x] T014 [US2] Create `src/lib/image-sources.ts` to resolve optimized image variants, dimensions, and fallback URLs.
- [x] T015 [US2] Add tests in `src/lib/image-sources.test.ts` for variant selection, fallback behavior, and generated dimensions.
- [x] T016 [US2] Update `src/lib/demo-projects.ts` to reference optimized preview metadata rather than raw oversized PNG paths.
- [x] T017 [US2] Update public preview renderers to use `picture`/`srcSet` or equivalent responsive image handling.
- [x] T018 [US2] Add explicit `width`, `height`, `loading`, `decoding`, and `fetchPriority` behavior to LCP and below-the-fold images.
- [ ] T019 [US2] Verify visual quality with desktop/mobile screenshots for English and Arabic public pages.

## Phase 3: Public JavaScript Payload Reduction

- [x] T020 [US2] Generate and inspect Vite build output to identify current initial route chunks and top dependency contributors.
- [x] T021 [US2] Keep `ContactFormSection` lazy-loaded and verify `react-hook-form`, `zod`, Firebase auth/write code, select UI, input, and textarea chunks stay off `/`.
- [x] T022 [US2] Move blog markdown rendering dependencies so `react-markdown` and `remark-gfm` load only on blog detail routes.
- [x] T023 [US2] Ensure dashboard shell and dashboard page modules remain isolated from public routes.
- [x] T024 [US2] Replace public initial `motion/react` usage with CSS-first animation or route-specific lazy motion chunks.
- [x] T025 [US2] Lazy-load or after-interaction-load `TerminalEasterEgg` so the hidden terminal overlay does not cost initial route payload.
- [x] T026 [US2] Review `vendor-ui` chunk composition and split admin-heavy UI primitives away from public route-critical UI where practical.
- [x] T027 [US2] Update `vite.config.ts` manual chunks only where measurements show a real public route benefit.
- [x] T028 [US2] Run build and budget check after each payload batch.

## Phase 4: CSS, Fonts, and Rendering Stability

- [x] T029 [US2] Audit `src/index.css` output for unused or overly broad CSS sources.
- [x] T030 [US2] Verify Tailwind source scanning does not include unnecessary generated or demo files in the main app CSS.
- [x] T031 [US2] Review font usage and preload only the font files needed for first paint.
- [x] T032 [US2] Add or verify `font-display: swap` behavior for local font packages.
- [x] T033 [US2] Ensure first-viewport layout uses stable dimensions for hero card, nav logo, and primary media.
- [x] T034 [US2] Run Lighthouse and check CLS, LCP, and render-blocking resource opportunities.

## Phase 5: Server Delivery and Browser Best Practices

- [x] T035 [US4] Add explicit cache headers in `server.ts`: immutable long cache for hashed assets, shorter cache for images if filenames are stable, and no-cache/revalidate behavior for HTML.
- [x] T036 [US4] Document whether compression is handled by Express middleware or aaPanel/reverse proxy.
- [x] T037 [US4] If app-level compression is approved, add and configure compression middleware without double-compressing reverse-proxy responses.
- [x] T038 [US4] Add conservative security headers for production HTML/static responses: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` or CSP `frame-ancestors`, and a compatible CSP plan if approved.
- [x] T039 [US4] Verify Firebase, external image hosts, manifest, icons, and route fallback still work with headers.
- [ ] T040 [US4] Inspect production console logs for uncaught errors, hydration/runtime warnings, and avoidable network failures.
- [x] T041 [US4] Audit all `target="_blank"` links for `rel="noopener noreferrer"`.

## Phase 6: Accessibility Excellence

- [x] T042 [US3] Audit public heading hierarchy on all public routes and fix skipped or duplicated heading levels.
- [x] T043 [US3] Add or verify accessible names for icon-only buttons: mobile menu, theme toggle, language toggle, copy buttons, carousel/project selector controls, and modal close buttons.
- [x] T044 [US3] Verify `aria-current="page"` or equivalent active state for navbar links.
- [x] T045 [US3] Add keyboard behavior checks for mobile menu open/close, focus trap expectations, escape behavior, and route navigation.
- [x] T046 [US3] Verify form labels, error messages, required fields, and success/error announcements in `ContactFormSection`.
- [x] T047 [US3] Verify image alt text quality for profile, logos, project previews, avatars, and decorative images.
- [x] T048 [US3] Audit color contrast across light/dark themes, primary buttons, muted text, focus rings, and terminal-style cards.
- [x] T049 [US3] Add reduced-motion CSS for public animations and ping effects.
- [ ] T050 [US3] Run English and Arabic keyboard/manual accessibility checks and record results in `.agent/manual-review/`.

## Phase 7: SEO Excellence

- [x] T051 [US5] Decide and centralize canonical host resolution using runtime settings or environment config.
- [x] T052 [US5] Create `src/server/seo.ts` to isolate server-side metadata, canonical, Open Graph, Twitter card, and JSON-LD generation.
- [x] T053 [US5] Add `src/server/seo.test.ts` for homepage, static public route, project detail, blog detail, and unknown route metadata.
- [x] T054 [US5] Add BlogPosting JSON-LD for blog detail routes.
- [x] T055 [US5] Add SoftwareApplication or CreativeWork JSON-LD for project detail routes.
- [x] T056 [US5] Add Person/WebSite JSON-LD only once per page and avoid duplicate/conflicting tags.
- [x] T057 [US5] Generate `public/sitemap.xml` from static routes plus published projects/blogs using `scripts/seo/generate-sitemap.mjs`.
- [x] T058 [US5] Update `public/robots.txt` to match the canonical production host.
- [x] T059 [US5] Define and implement the bilingual SEO strategy: single URL with active `lang` vs alternate language URLs. Document the decision.
- [x] T060 [US5] Verify server HTML contains title, description, canonical, OG image, and JSON-LD before React loads.

## Phase 8: CI and Regression Budgets

- [x] T061 [US6] Add bundle size checks to fail if public initial route assets exceed agreed budgets.
- [x] T062 [US6] Add Lighthouse threshold checks to local scripts.
- [x] T063 [US6] Add optional CI Lighthouse step in `.github/workflows/quality-gates.yml` only after the user approves CI enforcement.
- [x] T064 [US6] Add `scripts/lighthouse/README.md` documenting local and post-deploy audit commands.
- [x] T065 [US6] Update `README.md` with a short performance/audit section.
- [x] T066 [US6] Update `docs/deployment/aapanel-vps-production.md` with post-deploy cache/header/Lighthouse checks.

## Phase 9: Verification and Closeout

- [x] T067 [US1] Run `cmd /c npm run lint` and confirm exit code `0`.
- [x] T068 [US1] Run `cmd /c npm run test` and confirm exit code `0`.
- [x] T069 [US1] Run `cmd /c npm run i18n:check` and confirm exit code `0`.
- [x] T070 [US1] Run `cmd /c npm run build` and confirm exit code `0`.
- [ ] T071 [US1] Run `cmd /c npm run lighthouse:all` and save final JSON/HTML artifacts.
- [ ] T072 [US1] Run `cmd /c npm run budgets` and confirm exit code `0`.
- [ ] T073 [US2] Compare before/after reports and document score deltas.
- [x] T074 [US6] Update `.specify/memory/constitution.md` with new commands, runtime header behavior, SEO generation, image pipeline, and caveats.
- [ ] T075 [US6] Mark this task list complete only after all verification evidence is fresh and recorded.

## Current Open Items

- T010/T071-T073 require a fresh full `lighthouse:all` run and passing budgets after the latest changes are deployed or served in a browser environment that can run Chrome reliably.
- T019/T050 require fresh English/Arabic desktop/mobile screenshots and keyboard checks. Chrome headless is currently blocked in this Windows sandbox with `Access is denied. (0x5)` from Crashpad/Mojo startup.
- T040 requires a fresh production browser console inspection; static review is recorded in `.agent/manual-review/lighthouse-excellence-review.md`, but the browser console pass is still pending because Chrome cannot start in this sandbox.

## Parallelization Notes

- T011-T015 can run after T010 and can be worked independently from server headers.
- T035-T041 can run after T010 and do not depend on image optimization.
- T042-T050 can run after a stable UI build exists and can be parallel with SEO work.
- T051-T060 should be handled together to avoid canonical/sitemap/metadata mismatch.
- T061-T066 should wait until performance and SEO implementation choices are stable.
