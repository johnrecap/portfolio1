# Site Copy Source Audit

## Purpose

This audit maps where public-facing copy currently comes from so the refresh can cover every relevant layer without assuming all text lives in `src/locales/*.json`.

## Source Layers

### 1. Locale Namespaces

Primary public-copy namespaces currently live in:

- `src/locales/en.json`
- `src/locales/ar.json`

Core in-scope namespaces:

- `nav`
- `footer`
- `hero`
- `about`
- `projects`
- `skills`
- `blog`
- `services`
- `contact`

Supporting public namespaces also in scope because they materially shape the visitor experience:

- `featuredProjects`
- `showcase`
- `ctaSection`
- `testimonials`

Public-but-out-of-scope locale namespace for this pass:

- `login`
  Reason: public route, but not part of the client-facing site copy refresh.

### 2. Repo-Controlled Defaults and Fallbacks

Public copy is also defined outside locale files:

- `src/lib/admin/defaults.ts`
  - `createDefaultSiteSettings()`
  - `createDefaultNavigationSettings()`
  - `createDefaultFooterSettings()`
  - `createDefaultSeoSettings()`
  - `createDefaultProfileSettings()`
  - `createDefaultPageConfig()`
- `src/components/public/layout-components.tsx`
  - public navbar fallback links
  - footer fallback links
  - footer fallback summary/status/CTA wiring
- `src/components/public/hero-section.tsx`
  - hero copy and terminal-card fallbacks
- `src/components/public/page-composer.tsx`
  - about intro / strengths / editor card
  - contact intro / methods / form / availability
- `src/components/public/featured-projects.tsx`
  - section intro copy, empty state copy, and shared UI labels
- `src/components/public/showcase-section.tsx`
  - section intro plus shared card labels/descriptions
- `src/components/public/testimonials-section.tsx`
  - section intro plus fallback testimonial copy when no records exist
- `src/components/public/cta-section.tsx`
  - CTA block copy and supporting response/focus panels
- `src/components/public/services-section.tsx`
  - section intro and service-card descriptions
- `src/pages/(public)/*.tsx`
  - page-level SEO fallbacks
  - route-level hero/listing fallbacks for `projects`, `blog`, `skills`, `about`, `contact`, and `home`

### 3. Runtime Override Layers

Even after repo copy is refreshed, live public text may still come from runtime-managed sources:

- `usePageConfig(pageId)`
  - `pageConfig.title`
  - `pageConfig.titleAr`
  - `pageConfig.seo.*`
  - `pageConfig.sections[*].content`
- `useSiteSettings()`
  - site name, site tagline, and public CTA defaults
- `useNavigationSettings()`
  - nav item labels and header CTA configuration history
- `useFooterSettings()`
  - footer tagline, status strip, links, and footer CTA
- `useContactSettings()`
  - contact availability, location, response time, and direct-contact labels
- `useProfile()`
  - display name, professional title, bio, and metadata-facing profile copy

### 4. Public Data Content vs Shared Site Copy

The site also surfaces collection-driven content that is public but not part of the shared fallback-copy layer:

- project records
- blog post records
- testimonial records
- skill records

These records affect public wording, but they are content entries rather than shared site-shell copy. They should not be changed accidentally during the fallback-copy refresh.

## Exact In-Scope Public Surfaces

### Shared Public Shell

- public navigation labels in `nav`
- footer copy in `footer`
- supporting public CTA/empty-state labels where they appear in visitor-facing routes
- SEO fallback descriptions and titles used by public pages

### Home Route

Default page-config sections in `createDefaultPageConfig('home')`:

- `hero`
- `showcase`
- `featuredProjects`
- `testimonials`
- `cta`

### About Route

Default page-config sections in `createDefaultPageConfig('about')`:

- `aboutIntro`
- `strengths`
- `editorCard`
- `cta`

### Projects Route

Default page-config sections in `createDefaultPageConfig('projects')`:

- `projectsHero`
- `projectsListing`
- `cta`

### Skills Route

- top-level page copy from `skills`
- supporting stats/empty-state labels rendered directly by `src/pages/(public)/Skills.tsx`

### Blog Route

Default page-config sections in `createDefaultPageConfig('blog')`:

- `blogHero`
- `blogListing`
- `cta`

Plus listing/search/category/read-state labels from the `blog` namespace.

### Contact Route

Default page-config sections in `createDefaultPageConfig('contact')`:

- `contactIntro`
- `contactMethods`
- `contactForm`
- `availability`

### Additional Supporting Public Surfaces

- `services-section.tsx`
  Note: the component exists in the repo but is not part of the current default page-config section list. It remains an in-scope public copy surface because it is still a repo-owned visitor-facing component.
- shared showcase / featured-project / testimonial / CTA labels and empty states

## Out-of-Scope Surfaces for This Pass

- dashboard/admin namespaces and dashboard components
- admin-login page copy under `login`
- record-level public content in Firestore collections:
  - project titles, descriptions, case-study details, and highlights
  - blog titles, excerpts, and article bodies
  - testimonial quotes, names, roles, and outcomes
  - skill names, descriptions, and category records

## Follow-Up Implications for Implementation

- Refreshing locale files alone will not fully update the live public site.
- Refreshing repo fallbacks alone will not fully update the live public site either.
- `pageConfig.sections[*].content` may still override refreshed fallbacks on `home`, `about`, `projects`, `blog`, and `contact`.
- `site`, `footer`, `contact`, and `profile` settings may still expose older tone after the repo pass.
- Implementation must keep a short manual follow-up list for dashboard-managed public content that needs editorial cleanup after code changes land.
