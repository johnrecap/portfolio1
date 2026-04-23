# aaPanel Production Readiness Spec

## Summary

Define and execute a complete readiness pass for deploying Mohamed Studio to `aaPanel/VPS`, covering launch blockers, operational safeguards, quality gates, and post-launch improvements in one tracked packet.

## Problem

The repository is close to deployable but still relies on undocumented or weakly enforced assumptions:

- Production setup depends on Firebase project selection, Firebase Auth authorized domains, Firestore rules, and a single verified admin email that live outside normal app code.
- Deployment guidance does not clearly pin the supported Node.js version or document the full `aaPanel` startup contract.
- The Express server still exposes a mock route that is useful for development but risky to leave public in production.
- Verification exists, but there is no canonical `npm run test` script and no CI workflow enforcing release gates.
- Bundle-size warnings and operational caveats exist, but they are not separated cleanly into ship-now vs. later work.

## Goals

- Make `aaPanel/VPS` deployment reproducible from repository docs and scripts.
- Identify which issues block release immediately and which are follow-up work.
- Reduce production risk without redesigning the app architecture.
- Add minimum release gates so readiness can be checked repeatedly, not only once.

## Non-Goals

- Replacing `aaPanel/VPS` with another hosting model
- Migrating away from Firebase Authentication or Firestore
- Rewriting the app into SSR or a different frontend stack
- Treating every performance enhancement as a release blocker

## Priority Lanes

### P0 Launch Blockers

Work that can stop deployment or break the first production release.

### P1 Operational Safety

Work that does not always block launch but materially reduces production risk.

### P2 Quality Gates

Work that makes future release checks repeatable and automated.

### P3 Post-Launch Improvements

Work that should remain visible after launch without delaying the first safe deployment.

## User Scenarios & Testing

### User Story 1 - Deploy the App to aaPanel Reliably (Priority: P1)

As a maintainer, I need a documented deployment path for `aaPanel/VPS` so I can install dependencies, build, start, and proxy the app without hidden assumptions.

**Why this priority**: The main purpose of this work is to turn a locally working project into a repeatable production deployment.

**Independent Test**: Follow the deployment docs on a clean environment and confirm the app builds, starts, and returns a healthy response on the configured port.

**Acceptance Scenarios**:

1. **Given** a fresh `aaPanel/VPS` project with the supported Node version, **When** the maintainer follows the documented install/build/start steps, **Then** the app starts successfully and serves the built site.
2. **Given** the app is running behind the configured reverse proxy, **When** the maintainer checks the documented health endpoint, **Then** the app reports a healthy status.

### User Story 2 - Configure Firebase and Admin Access Safely (Priority: P1)

As a maintainer, I need the external Firebase and admin prerequisites documented clearly so production auth and data access work as intended.

**Why this priority**: A successful deploy is not enough if admin login or Firestore access fails due to missing external configuration.

**Independent Test**: Verify the documented Firebase project, authorized domains, Firestore rules expectations, and super-admin identity before release sign-off.

**Acceptance Scenarios**:

1. **Given** the production domain is not yet added to Firebase Authorized Domains, **When** the release checklist is reviewed, **Then** the missing prerequisite is called out before deployment.
2. **Given** the wrong Firebase project config is wired into the app, **When** the readiness checklist is executed, **Then** the mismatch is detected before release approval.
3. **Given** the intended admin email is not verified or does not match the configured super-admin identity, **When** login readiness is checked, **Then** the release checklist fails clearly.

### User Story 3 - Run Standard Release Checks Before Shipping (Priority: P2)

As a maintainer, I need one canonical verification path so I can confirm the repository is safe to push and deploy.

**Why this priority**: Release readiness degrades quickly if verification remains manual and inconsistent.

**Independent Test**: Run the documented verification commands locally and through CI.

**Acceptance Scenarios**:

1. **Given** a release candidate branch, **When** the maintainer runs the canonical verification commands, **Then** linting, tests, localization checks, and production build all run through standard scripts.
2. **Given** a pull request or push, **When** CI executes, **Then** the same release gates run automatically and fail the workflow if a check breaks.

### User Story 4 - Keep Non-Blocking Follow-Up Work Visible (Priority: P3)

As a maintainer, I need bundle-size and performance follow-ups tracked separately so they stay visible without blocking the first safe release.

**Why this priority**: Readiness work should not silently turn into an open-ended optimization effort.

**Independent Test**: Review the spec packet and confirm non-blocking improvements are isolated under `P3`.

**Acceptance Scenarios**:

1. **Given** the current build emits bundle-size warnings, **When** the readiness packet is reviewed, **Then** those items are tracked as post-launch work unless they are proven launch blockers.

## Edge Cases

- Required environment variables are missing, malformed, or inconsistent with `aaPanel` runtime settings.
- The server runs with a Node.js version older than what current dependencies expect.
- Firebase Auth allows local development but production login fails because the public domain is not authorized.
- The app points to the wrong Firebase project and appears healthy while production data/admin behavior is incorrect.
- Release checks pass locally, but a mock/demo route remains exposed in production.
- The repository contains unrelated local changes, causing accidental deploy noise unless branch hygiene is documented.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST define a single readiness packet for `aaPanel/VPS` deployment under `specs/011-aapanel-production-readiness/`.
- **FR-002**: The readiness packet MUST classify work into `P0`, `P1`, `P2`, and `P3` so release blockers are separated from follow-up improvements.
- **FR-003**: The repository MUST document the minimum supported Node.js version for local and `aaPanel/VPS` deployment.
- **FR-004**: The repository MUST document the canonical `aaPanel/VPS` install, build, start, and health-check flow.
- **FR-005**: The repository MUST document the runtime environment contract, including required and optional environment variables and their expected production values.
- **FR-006**: The repository MUST document external Firebase prerequisites for production, including target project alignment, Firebase Auth authorized domains, Firestore rule expectations, and super-admin identity assumptions.
- **FR-007**: The production server MUST not expose non-essential mock/demo routes unless they are explicitly restricted to non-production use.
- **FR-008**: The repository MUST expose a canonical automated test entrypoint through `package.json`.
- **FR-009**: The repository MUST define a standard verification set for release readiness, covering linting, tests, localization checks, and production build validation.
- **FR-010**: The repository MUST add automated CI coverage for the standard release verification set.
- **FR-011**: The readiness packet MUST document operational safety checks for `aaPanel/VPS`, including reverse-proxy assumptions, health verification, and rollback basics.
- **FR-012**: The readiness packet MUST document repository hygiene expectations before `push` and deployment so unrelated local artifacts do not leak into releases.
- **FR-013**: The readiness packet MUST record bundle-size and performance follow-up work separately from launch blockers.
- **FR-014**: Any implementation that changes deployment or verification conventions MUST update `.specify/memory/constitution.md`.

### Key Entities

- **Production Environment Contract**: The documented runtime assumptions for `aaPanel/VPS`, including Node version, environment variables, install/build/start commands, and reverse-proxy expectations.
- **Release Checklist**: The ordered set of checks that must pass before a branch is considered safe to deploy.
- **Quality Gate**: A repeatable local or CI verification step such as lint, tests, localization checks, build, or health validation.
- **External Firebase Prerequisites**: The non-code dependencies required for production correctness, including Firebase project choice, authorized domains, admin identity, and rules alignment.

## Success Criteria

- **SC-001**: A maintainer can follow repository documentation to deploy the app to `aaPanel/VPS` without relying on unstated setup steps.
- **SC-002**: The production readiness packet clearly identifies which items are release blockers and which items are post-launch follow-ups.
- **SC-003**: The repository exposes a standard verification path covering lint, tests, localization checks, and production build.
- **SC-004**: CI automatically runs the standard verification path on repository changes.
- **SC-005**: Production no longer exposes the current mock/demo route unless it is explicitly gated away from production traffic.
- **SC-006**: The release checklist explicitly covers Firebase project alignment, Firebase Authorized Domains, admin identity, environment variables, Node version, and health verification.
