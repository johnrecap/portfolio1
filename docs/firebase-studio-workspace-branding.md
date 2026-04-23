# Firebase Studio Workspace Branding Runbook

## What this repo can change directly

The repository controls:

- browser tab title and shell metadata
- favicon and web manifest assets
- public-site branding fallbacks
- dashboard branding fallbacks
- local documentation and metadata files

These changes are versioned in git and are applied by editing the repo.

## What this repo cannot rename directly

The visible Firebase Studio workspace name is not controlled by the React/Vite code in this repository.

Based on the current Firebase Studio documentation, the documented workflow for changing the workspace-facing name is to create a duplicate workspace and give the duplicate the new name during duplication.

Official docs used for this runbook:

- https://firebase.google.com/docs/studio/get-started-workspace
- https://firebase.google.com/docs/studio/get-started-ai

## Recommended workflow

1. Finish the local branding changes in this repository first.
2. Open the Firebase Studio home screen.
3. Open the workspace overflow menu for the current workspace.
4. Choose `Duplicate`.
5. Enter the new branded workspace name, for example `Mohamed Studio`.
6. Open the duplicated workspace and confirm the visible workspace name now matches the repo identity.

## Firebase project alignment

If the duplicated workspace should use a separate Firebase project, follow the Firebase Studio docs and connect or create a new Firebase project for that workspace.

This matters because the App Prototyping agent documentation says that auto-generated Firebase projects can inherit a prefix that matches the workspace name.

Recommended order when you need both branding and a new backend project:

1. Duplicate the workspace with the correct branded name.
2. Open the duplicated workspace.
3. Create or connect the intended Firebase project there.
4. Verify any project-specific config files still point to the correct backend.

## Maintainer note

If Firebase Studio later documents an in-place rename flow, update this runbook and remove the duplicate-first workaround.
