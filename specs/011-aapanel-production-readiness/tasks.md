# aaPanel Production Readiness Tasks

## P0 Launch Blockers

- [x] T001 Confirm and document the minimum supported Node.js version for both local development and `aaPanel/VPS` deployment.
- [x] T002 Normalize the runtime environment contract in `.env.example` and deployment docs, including which variables are required, optional, and deployment-specific.
- [x] T003 Document the required Firebase production prerequisites: target project alignment, Firebase Auth Authorized Domains, super-admin identity, and Firestore rules expectations.
- [x] T004 Remove or non-production-gate the current mock/demo endpoint exposure in `server.ts`.
- [x] T005 Define and verify the canonical `aaPanel/VPS` deployment flow using `npm ci`, `npm run build`, `npm start`, and a documented health check.
- [x] T006 Add a release checklist that blocks deployment when any `P0` prerequisite is unresolved.

## P1 Operational Safety

- [x] T007 Document reverse-proxy expectations, process/runtime checks, and minimum rollback guidance for `aaPanel/VPS`.
- [x] T008 Document repository hygiene expectations before `push` or deploy, including how to avoid releasing unrelated local changes or generated artifacts.
- [x] T009 Capture any remaining manual production steps explicitly so deployment no longer depends on tribal knowledge.

## P2 Quality Gates

- [x] T010 Add a canonical `npm run test` script that runs the current TypeScript-based test suites.
- [x] T011 Add CI automation that runs linting, tests, localization checks, and production build validation.
- [x] T012 Align release documentation and constitution guidance with the new verification and deployment gates.

## P3 Post-Launch Improvements

- [x] T013 Record the current bundle-size warning and identify the first safe chunking/performance follow-up without re-scoping launch readiness.
- [x] T014 Keep post-launch improvements clearly separated from launch blockers in project docs so future releases remain scoped.

## Final Verification

- [x] T015 Before release sign-off, run the full readiness verification set and confirm the documented deployment flow still matches the repository state.
