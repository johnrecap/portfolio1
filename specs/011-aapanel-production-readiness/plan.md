# aaPanel Production Readiness Plan

## Goal

Turn the current readiness audit into an executable `Speckit` packet that can drive safe deployment of Mohamed Studio to `aaPanel/VPS`.

## Scope

- `docs/superpowers/specs/2026-04-23-aapanel-production-readiness-design.md`
- `specs/011-aapanel-production-readiness/spec.md`
- `specs/011-aapanel-production-readiness/plan.md`
- `specs/011-aapanel-production-readiness/tasks.md`
- Expected implementation targets:
  - `README.md`
  - `.env.example`
  - `package.json`
  - `server.ts`
  - `.github/workflows/*` (new)
  - `.specify/memory/constitution.md`

## Constitution Check

- Constitution read: yes
- Workflow file read: yes
- Skill matcher read: yes
- Relevant skill used: `brainstorming`
- Matched workflow skills unavailable in-session and handled manually:
  - `speckit-specify`
  - `speckit-plan`
  - `speckit-tasks`
  - `verification-before-completion`
  - `auto-constitution`

## Approach

1. Capture the audited readiness gaps in one packet instead of scattering them across ad hoc notes.
2. Resolve `P0` blockers first: deployment contract, Node version, Firebase/Auth prerequisites, and production-safe server behavior.
3. Add `P1` operational safeguards around health checks, reverse-proxy assumptions, rollback basics, and branch hygiene.
4. Add `P2` release gates by promoting the current tests into a standard `npm run test` path and wiring CI around the canonical verification set.
5. Record current bundle/performance warnings under `P3` so they remain visible without blocking the first safe release.
6. Update the constitution after implementation so deployment and verification conventions stay discoverable.

## Risks

- Firebase readiness depends partly on external console configuration, so documentation alone is not enough unless the release checklist is explicit.
- The repo currently has many unrelated local changes, so implementation must stay tightly scoped to readiness work.
- `aaPanel` environment differences can hide issues if the documented Node/runtime assumptions stay vague.
- CI must use the same Node expectations as the deployment target or the gates will drift.
- Bundle-size improvements can expand scope quickly if they are not kept in the `P3` lane.
