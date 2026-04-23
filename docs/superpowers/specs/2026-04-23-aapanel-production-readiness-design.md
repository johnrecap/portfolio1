# aaPanel Production Readiness Design

**Date**: 2026-04-23  
**Status**: Approved for spec packet creation  
**Deployment Target**: `aaPanel/VPS`

## Summary

Create a single spec-driven readiness packet that closes deployment blockers, reduces operational risk, adds missing release gates, and records non-blocking post-launch improvements for the Mohamed Studio portfolio.

## Problem

The application currently builds, passes type-checking, passes tests, and serves a production bundle locally, but its production readiness still depends on partially documented external setup and weak release safeguards.

Known gaps from the readiness audit:

- Firebase runtime configuration is fixed to one project and depends on external Auth/Firestore setup.
- Google admin login depends on Firebase Authorized Domains and a single verified admin email.
- The production server still exposes a mock endpoint that should not remain public by accident.
- The repository does not expose a canonical `npm run test` command or CI workflow for release verification.
- The deployment docs do not clearly pin the required Node version or provide a complete aaPanel release checklist.

## Goals

- Define one source of truth for aaPanel/VPS deployment readiness.
- Separate must-fix release blockers from lower-priority operational and post-launch work.
- Turn the current ad hoc audit findings into an executable `spec.md`, `plan.md`, and `tasks.md` packet.

## Non-Goals

- Replatforming away from `aaPanel/VPS`
- Replacing Firebase with a custom backend
- Redesigning the public or dashboard UI
- Treating bundle-size warnings as launch blockers unless they cause proven runtime failure

## Recommended Approach

Use a single `Speckit` feature packet named `011-aapanel-production-readiness` with four priority lanes:

1. `P0 Launch Blockers`
Document and fix anything that can stop deployment or break production immediately: environment contract, Node version, Firebase/Auth prerequisites, startup flow, and production-safe server behavior.

2. `P1 Operational Safety`
Document and tighten the release path around health checks, reverse proxy assumptions, rollback basics, and branch/repo hygiene.

3. `P2 Quality Gates`
Add a first-class `npm run test` entrypoint and CI verification for lint, tests, i18n, and build.

4. `P3 Post-Launch Improvements`
Capture non-blocking bundle/performance follow-up work so it stays visible without delaying launch.

## Delivery Shape

The approved design should be materialized as:

- `specs/011-aapanel-production-readiness/spec.md`
- `specs/011-aapanel-production-readiness/plan.md`
- `specs/011-aapanel-production-readiness/tasks.md`

## Success Signal

After implementation of the packet, a maintainer should be able to deploy the app to `aaPanel/VPS` using repository documentation alone, verify health and admin access safely, and rely on repeatable release checks before pushing production changes.
