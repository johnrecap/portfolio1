<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run Mohamed Studio locally

This repository contains the bilingual Mohamed Studio portfolio and admin workspace for Mohamed Saied.

## Run Locally

**Prerequisites:** Node.js 20 or newer


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` if you need local overrides.
3. Set `GEMINI_API_KEY` in `.env.local` only if you use Gemini-powered features.
4. Run the app:
   `npm run dev`

## Verification

Run the same quality gates locally that the repository expects in CI:

1. `npm run lint`
2. `npm run test`
3. `npm run i18n:check`
4. `npm run build`
5. `npm run bundle:budget`

GitHub Actions runs the same verification path on repository changes.

## Performance and SEO Checks

Use these commands when changing public pages, images, metadata, or deployment behavior:

- `npm run images:optimize` regenerates WebP/AVIF preview images and their manifest.
- `npm run seo:sitemap` regenerates `public/sitemap.xml` and `public/robots.txt` for the canonical host.
- `npm run bundle:budget` checks the public entry JS/CSS budgets after `npm run build:client`.
- `npm run lighthouse:all` writes Lighthouse reports to `.agent/lighthouse/`.
- `npm run budgets` checks the latest Lighthouse reports against the configured score gates.

The bilingual SEO model is documented in [docs/seo/bilingual-seo.md](docs/seo/bilingual-seo.md). The current strategy is one canonical URL per route with runtime language switching, not separate `/ar` and `/en` URLs.

## Production on aaPanel / VPS

The canonical deployment runbook lives in [docs/deployment/aapanel-vps-production.md](docs/deployment/aapanel-vps-production.md).

Minimum release requirements:

- Node.js `20+`
- A server-side `.env` created from `.env.example`
- A Firebase project config in [src/config/firebase-client-config.json](src/config/firebase-client-config.json) that matches the target production project
- Firebase Authentication Authorized Domains that include the final production domain
- A verified super-admin account matching `mohamedsaied.m20@gmail.com`

Quick deploy flow:

1. Install exact dependencies:
   `npm ci`
2. Create `.env` on the server from `.env.example` and set `APP_URL`, `PORT`, `HOST`, and any optional secrets you use.
3. Build the app:
   `npm run build`
4. Verify the public bundle budget:
   `npm run bundle:budget`
5. Start the production server:
   `npm start`
6. Verify the internal health endpoint:
   `http://127.0.0.1:<PORT>/api/health`

The mock route `/api/mock/data` is development-only and is intentionally not exposed in production.

## Branding Notes

- Browser and repo branding live in `index.html`, `metadata.json`, and `public/`.
- Runtime branding fallbacks live in `src/lib/admin/defaults.ts` and `src/hooks/useProfile.ts`.
- Firebase Studio workspace-facing naming is a manual step; see [docs/firebase-studio-workspace-branding.md](docs/firebase-studio-workspace-branding.md).
