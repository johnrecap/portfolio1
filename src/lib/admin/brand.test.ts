import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveLocalizedSeoTitle, resolveLocalizedSiteBrand } from './brand';

test('resolveLocalizedSiteBrand falls back to the canonical site brand when the site identity mirrors the profile', () => {
  const brand = resolveLocalizedSiteBrand(
    {
      siteName: 'Mohamed Saied',
      siteNameAr: 'محمد سعيد',
    },
    {
      displayName: 'Mohamed Saied',
      displayNameAr: 'محمد سعيد',
    },
    true,
  );

  assert.equal(brand, 'محمد ستوديو');
});

test('resolveLocalizedSiteBrand keeps an explicitly configured site brand', () => {
  const brand = resolveLocalizedSiteBrand(
    {
      siteName: 'Acme Studio',
      siteNameAr: 'استوديو أكمي',
    },
    {
      displayName: 'Mohamed Saied',
      displayNameAr: 'محمد سعيد',
    },
    false,
  );

  assert.equal(brand, 'Acme Studio');
});

test('resolveLocalizedSeoTitle falls back to the canonical SEO title when the configured title mirrors the profile name', () => {
  const title = resolveLocalizedSeoTitle(
    {
      defaultTitle: 'Mohamed Saied',
      defaultTitleAr: 'محمد سعيد',
    },
    {
      displayName: 'Mohamed Saied',
      displayNameAr: 'محمد سعيد',
      metaTitle: 'Custom Meta',
      metaTitleAr: 'ميتا مخصص',
    },
    false,
  );

  assert.equal(title, 'Mohamed Studio | Mohamed Saied');
});

test('resolveLocalizedSeoTitle keeps explicitly configured branded titles', () => {
  const title = resolveLocalizedSeoTitle(
    {
      defaultTitle: 'Acme Studio | Founder Name',
      defaultTitleAr: 'استوديو أكمي | اسم المؤسس',
    },
    {
      displayName: 'Mohamed Saied',
      displayNameAr: 'محمد سعيد',
      metaTitle: 'Custom Meta',
      metaTitleAr: 'ميتا مخصص',
    },
    true,
  );

  assert.equal(title, 'استوديو أكمي | اسم المؤسس');
});
