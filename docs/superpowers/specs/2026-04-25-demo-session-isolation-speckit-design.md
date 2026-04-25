# Demo Session Isolation Speckit Design

**Date**: 2026-04-25  
**Status**: Approved for Speckit creation  
**Area**: portfolio demos, isolated editable demo sessions

## Summary

Create a Speckit packet for integrating the first CRM demo into the portfolio as a live, editable demo while keeping every visitor's edits private to their own browser session. The demo should prove the portfolio owner can ship working dashboards without risking shared demo data being changed by public visitors.

## Problem

The first demo currently lives in `demo/` as an independent Vite app. It uses Zustand persistence with a fixed storage key, which is useful locally but not enough for a public portfolio demo because edits should not leak between visitors or become the new default demo state.

The desired behavior is:

- A public visitor can open the demo and edit leads, deals, clients, tasks, and settings.
- Another visitor opening the demo at the same time starts from clean demo data.
- Edits persist while the same visitor stays in the same browser session.
- Closing the browser tab/session returns the next visit to clean seed data.
- The main portfolio remains fast and stable.

## Current Demo Facts

- Current path: `demo/`
- Framework: Vite, React, TypeScript, Tailwind CSS
- State: Zustand with `persist`
- Current persistence key: `agency-flow-crm-storage`
- Current storage backend: default `localStorage`
- Data source: local mock data files in `demo/src/data`
- Routes: `dashboard`, `leads`, `deals`, `clients`, `tasks`, `reports`, `settings`, `support`
- The folder is currently untracked by Git.

## Options Considered

### 1. Import the demo into the main React app as normal routes

Mount the demo under the portfolio router, for example `/demos/agency-flow-crm`.

Pros:

- One build command and one React tree.
- Easier to link from the portfolio project detail page.

Cons:

- Higher risk of CSS/theme collisions.
- Adds demo dependencies and bundle weight to the main site.
- Harder to keep future demos isolated.

### 2. Keep the demo as a standalone Vite micro-app under `/demos/agency-flow-crm/`

Build the demo into `dist/demos/agency-flow-crm` and serve it from the existing Express production server.

Pros:

- Keeps the main portfolio app clean and fast.
- Each demo can have its own dependencies, styles, and router.
- Easier to add more demos later.
- Public project cards can link to the live demo URL.

Cons:

- Requires build and server routing integration.
- Requires configuring Vite `base` and React Router basename.

### 3. Host every demo on a separate subdomain

Deploy the CRM demo separately, for example `agencyflow.yourdomain.com`.

Pros:

- Maximum isolation.
- Simple cache and routing boundaries.

Cons:

- More deployment and DNS work.
- Harder to manage many demos from one portfolio repo.

## Recommended Approach

Use option 2.

Keep the current `demo/` as the source for the first standalone demo app and serve it from:

```text
/demos/agency-flow-crm/
```

The portfolio project entry should link to that path as the live demo. Future demos should follow the same pattern:

```text
/demos/{demo-slug}/
```

## Session Isolation Recommendation

Use client-only session isolation for version 1:

- Replace Zustand's default `localStorage` persistence with `sessionStorage`.
- Namespace persisted state with a generated per-tab session id.
- Keep seed data immutable and resettable.
- Add idle/absolute expiry metadata so long-running sessions can reset after a configured timeout.
- Add a visible "Reset demo" action in settings/topbar.

This is enough for a visual portfolio demo because browser storage is local to each visitor. No backend database is needed unless the demo later needs cross-device login or shareable saved states.

## Speckit Packet

Create:

- `specs/017-demo-session-isolation/spec.md`
- `specs/017-demo-session-isolation/plan.md`
- `specs/017-demo-session-isolation/tasks.md`

## Testing

- Open two different browsers or incognito windows and create different tasks.
- Confirm each session sees only its own edits.
- Close a tab and reopen the demo; confirm seed data returns.
- Reload during a session; confirm edits remain.
- Confirm `/demos/agency-flow-crm/tasks` deep-links to the demo app, not the main portfolio 404.
- Confirm main portfolio build and server still work.

