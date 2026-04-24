# Site Copy Settings Follow-Up

## Status

Repo-controlled copy refresh: complete.

Runtime-managed dashboard cleanup: pending.

## Purpose

This note lists the runtime-managed fields that can still override the refreshed repository copy. Use it after the code pass so the live public site does not keep older wording from Firestore-backed settings or page-composer content.

## Recommended Execution Order

Work through the runtime-managed layers in this order so the highest-impact public overrides are resolved first:

1. `Dashboard -> Site Settings`
   - Screen: `src/pages/dashboard/SiteSettings.tsx`
   - Writes: `settings/profile` and `settings/site`
2. `Dashboard -> Footer Settings`
   - Screen: `src/pages/dashboard/FooterSettings.tsx`
   - Writes: `settings/footer`
3. `Dashboard -> Contact Settings`
   - Screen: `src/pages/dashboard/ContactSettings.tsx`
   - Writes: `settings/contact`
4. `Dashboard -> SEO Settings`
   - Screen: `src/pages/dashboard/SeoSettings.tsx`
   - Writes: `settings/seo`
5. `Dashboard -> Page Composer`
   - Screen: `src/pages/dashboard/PageComposer.tsx`
   - Writes: `pages/{home|about|projects|blog|contact}`
6. Re-review the public pages after saving the dashboard changes.

## Repo-Controlled Layers Updated In This Phase

- `src/lib/admin/defaults.ts`
  - `createDefaultProfileSettings()`
  - `createDefaultSiteSettings()`
  - `createDefaultFooterSettings()`
  - `createDefaultSeoSettings()`
  - `createDefaultContactSettings()`
  - `createDefaultPageConfig()`
- `src/hooks/useProfile.ts`
  - public fallback profile values now inherit the same baseline instead of a separate stale copy block

These updates improve the fallback behavior when a settings document is missing or incomplete.

## Dashboard Follow-Up Checklist

### 1. Site Settings

Review `Dashboard -> Site Settings` because these fields can still override the refreshed tone:

- `displayName` / `displayNameAr`
- `title` / `titleAr`
- `bio` / `bioAr`
- `metaDescription` / `metaDescriptionAr`
- `siteTagline` / `siteTaglineAr`
- `primaryCtaLabel` / `primaryCtaLabelAr`
- `primaryCtaHref`

Notes:

- `profile.title` appears in the public footer and blog-post author card.
- `profile.bio` appears in the about page and blog-post author card.
- `profile.metaDescription` can still flow into `PageSeo` if page-level and global SEO descriptions are empty.
- `siteTagline` / `siteTaglineAr` currently affect the public footer summary directly.
- `primaryCtaLabel` / `primaryCtaLabelAr` / `primaryCtaHref` are still stored in site settings, but they are not the active public header CTA in the current navbar implementation.

Recommended baseline values if the live settings still contain older portfolio copy:

- `title`: `Product Engineer`
- `titleAr`: `مهندس منتجات رقمية`
- `bio`: `I build public websites, dashboards, and internal tools for teams that need clear structure and practical day-to-day use.`
- `bioAr`: `أبني مواقع عامة، ولوحات إدارة، وأدوات داخلية لفرق تحتاج إلى هيكل واضح واستخدام عملي يمكن الاعتماد عليه يوميًا.`
- `siteTagline`: `I build public-facing websites, dashboards, and internal tools with the same focus on clarity and day-to-day usability.`
- `siteTaglineAr`: `أبني مواقع عامة، ولوحات إدارة، وأدوات داخلية مع اهتمام واضح بسهولة الاستخدام وسهولة التطوير لاحقًا.`
- `metaDescription`: `Mohamed Saied builds public websites, dashboards, and internal tools for small teams and founders who need clear structure, practical delivery, and bilingual support.`
- `metaDescriptionAr`: `يبني محمد سعيد مواقع عامة، ولوحات إدارة، وأدوات داخلية لفرق صغيرة وأصحاب مشاريع يحتاجون إلى هيكل واضح، وتنفيذ عملي، ودعم ثنائي اللغة.`

Optional consistency cleanup:

- Keep `primaryCtaLabel` / `primaryCtaLabelAr` / `primaryCtaHref` aligned with the repo baseline if you want the stored settings to stay coherent:
  - `Start a Conversation`
  - `ابدأ محادثة`
  - `/contact`
- Do not treat those fields as a blocker for this copy-refresh closeout unless the public implementation starts reading them again.

### 2. Footer Settings

Review `Dashboard -> Footer Settings`:

- `tagline` / `taglineAr`
- `statusStrip` / `statusStripAr`
- `ctaLabel` / `ctaLabelAr`
- footer links
- footer social links

These fields override the repo fallback in the public footer directly.

Recommended action:

- If `tagline` / `taglineAr` still contain the older generic summary line, clear them unless you intentionally want custom footer copy.
  Reason: the public footer already falls back safely when these fields are empty.
- Keep `statusStrip` / `statusStripAr` aligned with the refreshed tone:
  - `statusStrip`: `Open to a small number of client projects`
  - `statusStripAr`: `متاح لعدد محدود من مشاريع العملاء`
- Keep `ctaLabel` / `ctaLabelAr` aligned with the refreshed CTA:
  - `ctaLabel`: `Start a Conversation`
  - `ctaLabelAr`: `ابدأ محادثة`
- Keep `ctaHref` at `/contact` unless there is a deliberate routing reason to change it.

### 3. Contact Settings

Review `Dashboard -> Contact Settings`:

- `availabilityLabel` / `availabilityLabelAr`
- `responseTime` / `responseTimeAr`
- `location` / `locationAr`
- `email`
- `whatsapp`

Important:

- The field named `availabilityLabel` currently powers the public availability description, not only a short label.
- `location` / `locationAr` are safe to clear if you want the public contact card to fall back to the refreshed locale copy.

Recommended action:

- Update `availabilityLabel` / `availabilityLabelAr` to:
  - `I am most useful on projects that need a clear public experience and the systems behind it to work well too.`
  - `أكون الأنسب للمشاريع التي تحتاج واجهة عامة واضحة، مع نظام خلفي يسهل العمل عليه أيضًا.`
- Update `responseTime` / `responseTimeAr` to:
  - `Usually 1-2 business days`
  - `غالبًا خلال يوم إلى يومي عمل`
- For `location` / `locationAr`:
  - preferred: clear both fields if they contain stale or URL-like values, so the public card falls back to the refreshed locale wording
  - acceptable custom values if you want an explicit override:
    - `Cairo, Egypt / Working remotely with clients`
    - `القاهرة، مصر / أعمل عن بُعد مع العملاء`

### 4. SEO Settings

Review `Dashboard -> SEO Settings`:

- `defaultTitle` / `defaultTitleAr`
- `defaultDescription` / `defaultDescriptionAr`
- `ogImage`

These values are used by `PageSeo` when a page does not provide a more specific override.

Recommended baseline values if the current SEO settings still sound older or more generic:

- `defaultDescription`: `Public websites, dashboards, and internal tools built by Mohamed Saied with a focus on clarity, practical delivery, and bilingual support.`
- `defaultDescriptionAr`: `مواقع عامة، ولوحات إدارة، وأدوات داخلية يبنيها محمد سعيد مع تركيز على الوضوح، والتنفيذ العملي، ودعم العربية والإنجليزية.`

### 5. Page Composer

Review `Dashboard -> Page Composer` for the public pages because section content overrides repo fallbacks field-by-field.

Pages to review:

- `home`
- `about`
- `projects`
- `blog`
- `contact`

Fields that commonly keep older tone alive:

- page-level `title` / `titleAr`
- page-level `seo.title` / `seo.titleAr`
- page-level `seo.description` / `seo.descriptionAr`

High-risk section overrides:

- `home -> hero`
  - `title`, `highlight`, `subtitle`, `primaryLabel`, `secondaryLabel`
- `home -> showcase`
  - `title`, `subtitle`
- `home -> featuredProjects`
  - `title`, `subtitle`, `viewAllLabel`
- `home/about/projects/blog -> cta`
  - `title`, `subtitle`, `primaryLabel`, `secondaryLabel`
- `about -> aboutIntro`
  - `title`, `intro`
- `about -> strengths`
  - `strength1`, `strength2`, `strength3`
- `about -> editorCard`
  - `comment`
- `projects -> projectsHero`
  - `eyebrow`, `title`, `subtitle`
- `projects -> projectsListing`
  - `title`, `subtitle`
- `blog -> blogHero`
  - `eyebrow`, `title`, `subtitle`
- `blog -> blogListing`
  - `title`, `subtitle`
- `contact -> contactIntro`
  - `title`, `highlight`, `subtitle`
- `contact -> contactMethods`
  - `title`, `directTitle`, `socialTitle`
- `contact -> contactForm`
  - `title`, `subtitle`
- `contact -> availability`
  - `title`, `subtitle`

Recommended action:

- If a page-level or section-level override still carries older wording, update it to match the refreshed repo copy.
- If a field does not need to stay custom, clear the override so the public route can inherit the refreshed fallback instead of maintaining duplicate copy manually.
- Re-check these pages first because they were explicitly reviewed during the repo pass:
  - `home`
  - `about`
  - `projects`
  - `blog`
  - `contact`

### Page Composer Quick Pass

Use this route-by-route pass during `T031`:

#### `home`

- page title / SEO description
- `hero`: `title`, `highlight`, `subtitle`, `primaryLabel`, `secondaryLabel`
- `showcase`: `title`, `subtitle`
- `featuredProjects`: `title`, `subtitle`, `viewAllLabel`
- `testimonials`: `title`, `subtitle`
- `cta`: `title`, `subtitle`, `primaryLabel`, `secondaryLabel`

#### `about`

- page title / SEO description
- `aboutIntro`: `title`, `intro`
- `strengths`: `strength1`, `strength2`, `strength3`
- `editorCard`: `comment`
- `cta`: `title`, `subtitle`, `primaryLabel`, `secondaryLabel`

#### `projects`

- page title / SEO description
- `projectsHero`: `eyebrow`, `title`, `subtitle`
- `projectsListing`: `title`, `subtitle`
- `cta`: `title`, `subtitle`, `primaryLabel`, `secondaryLabel`

#### `blog`

- page title / SEO description
- `blogHero`: `eyebrow`, `title`, `subtitle`
- `blogListing`: `title`, `subtitle`
- `cta`: `title`, `subtitle`, `primaryLabel`, `secondaryLabel`

#### `contact`

- page title / SEO description
- `contactIntro`: `title`, `highlight`, `subtitle`
- `contactMethods`: `title`, `directTitle`, `socialTitle`
- `contactForm`: `title`, `subtitle`
- `availability`: `title`, `subtitle`

Pass rule:

- If the live page already looks right and the custom copy is intentional, keep the override.
- If the override is only preserving older wording, clear it and let the refreshed repo fallback carry the page.

## Out-Of-Scope But Still Manual If Needed

These are not changed by the shared fallback-copy pass:

- project record titles, descriptions, highlights, and case-study text
- blog post titles, excerpts, and body content
- testimonial quotes and outcomes
- skill names and descriptions

If any of those still sound off, they need a separate content pass inside the dashboard collections.

## Manual Review Findings From 2026-04-24

The repo-controlled copy pass is in place, but the local manual review still surfaced older runtime-managed wording in a few live spots.

### Footer

- English and Arabic footers still showed the older site-summary line from runtime settings instead of the refreshed repo fallback.
- Likely dashboard follow-up:
  - `Site Settings -> siteTagline` / `siteTaglineAr`

### About Page

- The about-page editor card still showed the older profile title rather than the refreshed fallback title.
- Likely dashboard follow-up:
  - `Site Settings -> title` / `titleAr`

### Contact Page

- The contact availability and response-time cards still surfaced older runtime wording.
- The English base/location card still showed a URL-like value instead of the refreshed location wording.
- Likely dashboard follow-up:
  - `Contact Settings -> availabilityLabel` / `availabilityLabelAr`
  - `Contact Settings -> responseTime` / `responseTimeAr`
  - `Contact Settings -> location` / `locationAr`

These findings match the override risks listed above and confirm that the remaining cleanup is editorial dashboard work, not another repo fallback change.

## Completion Rule

Do not mark the packet fully complete until one of these is true:

- the runtime-managed dashboard fields above have been updated to the new copy, or
- the stale overrides have been intentionally cleared so the refreshed repo fallbacks are now visible live, or
- the remaining runtime-managed cleanup has been explicitly deferred with that decision recorded in the tasks list.
