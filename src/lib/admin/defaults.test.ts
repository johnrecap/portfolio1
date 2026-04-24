import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createDefaultDashboardSettings,
  createDefaultFooterSettings,
  createDefaultProfileSettings,
  createDefaultPageConfig,
  createDefaultSeoSettings,
  createDefaultSiteSettings,
  createDefaultThemeSettings,
  normalizePageConfig,
} from './defaults';

test('createDefaultProfileSettings returns media asset ID placeholders', () => {
  const result = createDefaultProfileSettings();

  assert.equal(result.profileImageAssetId, '');
  assert.equal(result.heroImageAssetId, '');
  assert.equal(result.title, 'Product Engineer');
  assert.equal(result.metaDescription.length > 0, true);
});

test('createDefaultSiteSettings returns a neutral site settings baseline', () => {
  const result = createDefaultSiteSettings();

  assert.equal(result.siteName, 'Mohamed Studio');
  assert.equal(result.siteNameAr, 'محمد ستوديو');
  assert.equal(result.logoAssetId, '');
  assert.equal(result.primaryCtaEnabled, true);
  assert.equal(result.primaryCtaHref, '/contact');
  assert.equal(result.siteTagline.length > 0, true);
  assert.equal(result.status, 'published');
});

test('createDefaultSeoSettings returns an Open Graph asset placeholder', () => {
  const result = createDefaultSeoSettings();

  assert.equal(result.defaultTitle, 'Mohamed Studio | Mohamed Saied');
  assert.equal(result.ogImageAssetId, '');
});

test('createDefaultFooterSettings keeps the status strip and summary layers distinct by default', () => {
  const result = createDefaultFooterSettings();

  assert.equal(result.tagline, '');
  assert.equal(result.taglineAr, '');
  assert.equal(result.statusStrip, 'Open to a small number of client projects');
  assert.equal(result.ctaHref, '/contact');
});

test('createDefaultDashboardSettings returns branded dashboard defaults', () => {
  const result = createDefaultDashboardSettings();

  assert.equal(result.dashboardName, 'Mohamed Studio Console');
  assert.equal(result.status, 'published');
});

test('createDefaultThemeSettings returns token-based defaults only', () => {
  const result = createDefaultThemeSettings();

  assert.equal(result.mode, 'system');
  assert.equal(result.accent, 'teal');
  assert.equal(result.surfaceStyle, 'glass');
  assert.equal(result.radiusScale, 'rounded');
});

test('createDefaultPageConfig returns the correct page scaffold', () => {
  const result = createDefaultPageConfig('home');

  assert.equal(result.pageId, 'home');
  assert.equal(result.title, 'Websites and Dashboards');
  assert.equal(result.titleAr, 'مواقع ولوحات تحكم');
  assert.equal(result.status, 'draft');
  assert.equal(result.seo.description?.length > 0, true);
  assert.equal(result.seo.descriptionAr?.length > 0, true);
  assert.equal(result.sections.length > 0, true);
  assert.deepEqual(
    result.sections.map((section) => section.type),
    ['hero', 'showcase', 'featuredProjects', 'testimonials', 'cta'],
  );
});

test('normalizePageConfig sorts sections and fills safe defaults', () => {
  const result = normalizePageConfig('contact', {
    status: 'published',
    sections: [
      { id: 'form', type: 'contactForm', order: 2, variant: 'default', content: {} },
      { id: 'intro', type: 'contactIntro', order: 1, variant: 'split', content: {}, enabled: false },
    ],
  });

  assert.equal(result.pageId, 'contact');
  assert.equal(result.status, 'published');
  assert.deepEqual(
    result.sections.map((section) => section.id),
    ['intro', 'form'],
  );
  assert.equal(result.sections[0]?.enabled, false);
  assert.equal(result.sections[0]?.stylePreset, 'default');
  assert.equal(result.sections[1]?.enabled, true);
});
