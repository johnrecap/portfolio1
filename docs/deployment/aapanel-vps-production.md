# aaPanel / VPS Production Deployment

This runbook is the canonical production path for deploying Mohamed Studio on `aaPanel/VPS`.

## P0 Release Blockers

Do not deploy until every item below is true.

- [ ] The server is running `Node.js 20+`.
- [ ] `src/config/firebase-client-config.json` points to the intended production Firebase project.
- [ ] Firebase Authentication -> Authorized Domains includes the final production domain and any admin/login domain you will use.
- [ ] The intended admin account email is `mohamedsaied.m20@gmail.com` and that Google account is verified in Firebase Authentication.
- [ ] The active Firestore rules in the target Firebase project match the repository expectations in [firestore.rules](../../firestore.rules).
- [ ] The production `.env` was created from [.env.example](../../.env.example) and includes the correct `APP_URL`, `PORT`, and `HOST=0.0.0.0`.
- [ ] The branch you are deploying contains only the changes you intend to release.

If any box remains unchecked, treat the release as blocked.

## Runtime Contract

### Required Runtime Values

- `APP_URL`
  The full public origin for the deployed site, for example `https://mohamed.studio`.
- `PORT`
  The internal Node.js port configured in the `aaPanel` Node Project.
- `HOST`
  Keep this set to `0.0.0.0` on `aaPanel/VPS` so the reverse proxy can reach the app.

### Optional Runtime Values

- `GEMINI_API_KEY`
  Required only when Gemini-powered features are actually enabled for the workspace.

## Firebase Production Prerequisites

### Project Alignment

The client app reads Firebase configuration from [src/config/firebase-client-config.json](../../src/config/firebase-client-config.json). Before deploying, confirm that:

- `projectId` is the Firebase project you intend to use in production.
- `authDomain`, `storageBucket`, and `firestoreDatabaseId` belong to that same target project.
- You are not accidentally deploying with a local/test Firebase project configuration.

### Authentication

Admin login uses Google popup sign-in and is gated in the UI plus Firestore rules.

Before release:

- Add the final production domain to Firebase Authentication Authorized Domains.
- Confirm popup sign-in is enabled for Google in the target Firebase project.
- Confirm the admin user email is `mohamedsaied.m20@gmail.com`.
- Confirm that admin Google account has a verified email state in Firebase Authentication.

### Firestore Rules

The app expects the active Firebase project to enforce the repository rule set in [firestore.rules](../../firestore.rules), including:

- Public read access for the current public content collections and settings documents.
- Restricted writes for admin-only surfaces.
- Admin access tied to the verified email `mohamedsaied.m20@gmail.com`.

If the target Firebase project is using different rules, fix that before deployment.

## aaPanel Deployment Steps

1. Pull the intended release branch on the server.
2. Confirm the project runtime is `Node.js 20+` inside `aaPanel`.
3. Install exact dependencies:

```bash
npm ci
```

4. Create or update the production `.env` file from `.env.example`.
5. Build the project:

```bash
npm run build
```

6. Set the `aaPanel` startup command to:

```bash
npm start
```

7. Point the reverse proxy or bound domain to the same internal `PORT` value from `.env`.

## Release Verification Gates

Before `push` or server-side deployment, run the canonical verification set locally:

```bash
npm run lint
npm run test
npm run i18n:check
npm run build
```

The repository CI workflow runs this same sequence on GitHub Actions. Do not skip local verification just because CI exists.

## Reverse Proxy Expectations

Keep the app listening on the exact `PORT` from `.env` with `HOST=0.0.0.0`.

For aaPanel, use one public domain flow only:

- Either bind the domain through the Node Project mapping/domain flow.
- Or proxy the public domain to `http://127.0.0.1:<PORT>`.

Do not stack multiple reverse-proxy layers for the same domain unless you have a specific reason and understand the chain.

Expected reverse-proxy behavior:

- The public domain should terminate at aaPanel, then forward traffic to the same internal `PORT` used by the Node Project.
- `APP_URL` should stay set to the final public `https://` origin, not the internal port URL.
- If you change the internal `PORT`, update the Node Project settings, the reverse-proxy target, and the `.env` value together.

## Runtime and Process Checks

After deployment or restart, verify the aaPanel Node Project itself before debugging application code:

- The project status is `running`.
- The shown `PID` is present.
- The configured Node version is still `20+`.
- The startup command remains `npm start`.
- The project port matches the `PORT` value in `.env`.

If the app fails after deploy, inspect in this order:

1. aaPanel Node Project status, PID, and configured port
2. Project log in aaPanel
3. Website/reverse-proxy log if domain mapping is enabled
4. Internal health endpoint response
5. Public domain response after the proxy

If the internal health check passes but the public domain fails, debug the reverse proxy or SSL layer before changing app code.

## Health Check

After the process starts, verify the app internally before exposing the deployment:

```text
http://127.0.0.1:<PORT>/api/health
```

Expected response:

```json
{"status":"ok"}
```

Then verify the public domain:

- The homepage loads through the final domain.
- Admin login opens the Google popup on the final domain.
- No request to `/api/mock/data` succeeds in production.

## Repository Hygiene Before Push or Deploy

Do not deploy from a dirty or ambiguous tree.

Before `push` or server-side deploy:

1. Run `git status --short`.
2. Confirm only intended files are modified or staged.
3. Review the exact release diff before pushing.
4. Keep generated artifacts and machine-local files out of the release branch.

Files and paths that should not be part of a normal release commit:

- `.env*`
- `node_modules/`
- `dist/`
- `coverage/`
- `*.log`
- local screenshots or render artifacts such as `output-*.png`

Repo-specific note:

- `specs/` and `.specify/` are ignored by default in this repository. Only use forced adds for them when you intentionally want to version a spec packet or constitution change.

If `git status --short` shows unrelated deletes, experiments, or generated files, stop and clean up the release branch before deploying.

## Manual Production Steps That Stay Outside App Code

These are still required even when the repository is correct:

1. Add the final production domain in Firebase Authentication Authorized Domains.
2. Confirm the target Firebase project is the intended one for production.
3. Apply or verify the current Firestore rules in the target Firebase project.
4. Create or update the production `.env` file on the server.
5. Bind SSL to the final public domain in aaPanel.
6. Restart the Node Project after changing environment variables, runtime version, or startup command.

Treat these as mandatory release steps, not optional cleanup.

## Minimum Rollback Guidance

Keep at least one known-good commit or branch ready before shipping a new release.

If the new release fails after build, startup, or public verification:

1. Stop routing users to the failed release.
2. Restore the previous known-good commit or branch on the server.
3. Run `npm ci`.
4. Run `npm run build`.
5. Start the app again with `npm start`.
6. Re-check `http://127.0.0.1:<PORT>/api/health` and the public domain before reopening traffic.

Do not try to hot-fix the broken deployment directly on the public branch unless you understand the failure and have verified the fix locally first.

## P3 Post-Launch Improvements

These items are intentionally tracked after launch. They are visible on purpose, but they do not block release unless they begin causing proven runtime failure.

### Current Build Warning

The current production build still emits a Vite chunk-size warning for the main client bundle.

Current observed warning during build:

- Main `index` chunk is roughly `1.18 MB` minified and about `336 kB` gzip.

### First Safe Follow-Up

Do the smallest low-risk follow-up first:

1. Split `src/components/public/page-composer.tsx` so page rendering and contact-form logic stop living in one heavy routed-surface file.
2. Rebuild and re-measure chunk output.
3. Only then decide whether to add targeted `manualChunks` or deeper route/component splitting.

### Scope Guard

Keep these items separate from launch blockers:

- Do not delay deployment solely because of the current chunk warning.
- Do not start broad performance refactors during release hardening.
- Treat bundle work as a measured follow-up with before/after build evidence.

## Production Safety Notes

- `/api/mock/data` is intentionally development-only and should not be available in production.
- `npm start` sets `NODE_ENV=production` and serves the built output from `dist/`.
- If a release fails after build or health verification, restore the previous known-good branch or commit before reopening traffic.
