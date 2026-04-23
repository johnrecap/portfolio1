import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getFeaturedTestimonials,
  getLocalizedValue,
  groupSkillsByCategory,
  resolveEntitySeo,
  resolveMediaField,
} from './content-hub';

const mediaAssets = [
  {
    id: 'hero-image',
    title: 'Hero image',
    titleAr: 'صورة الواجهة',
    alt: 'Hero alt',
    altAr: 'وصف صورة الواجهة',
    url: 'https://cdn.example.com/hero.webp',
    kind: 'image' as const,
    group: 'branding',
  },
  {
    id: 'avatar-image',
    title: 'Avatar',
    titleAr: 'الصورة الشخصية',
    alt: 'Avatar alt',
    altAr: 'وصف الصورة الشخصية',
    url: 'https://cdn.example.com/avatar.webp',
    kind: 'image' as const,
    group: 'people',
  },
];

test('resolveMediaField prefers the selected media asset over a manual URL', () => {
  const result = resolveMediaField(
    {
      url: 'https://fallback.example.com/manual.webp',
      assetId: 'hero-image',
    },
    mediaAssets,
  );

  assert.equal(result.url, 'https://cdn.example.com/hero.webp');
  assert.equal(result.alt, 'Hero alt');
  assert.equal(result.asset?.id, 'hero-image');
});

test('getLocalizedValue recovers swapped bilingual fields using script detection', () => {
  assert.equal(
    getLocalizedValue('متجر إلكتروني للملابس', 'Online clothing store', false),
    'Online clothing store',
  );
  assert.equal(
    getLocalizedValue('متجر إلكتروني للملابس', 'Online clothing store', true),
    'متجر إلكتروني للملابس',
  );
});

test('resolveMediaField falls back to the manual URL when no asset is selected', () => {
  const result = resolveMediaField(
    {
      url: 'https://fallback.example.com/manual.webp',
      assetId: 'missing-asset',
    },
    mediaAssets,
  );

  assert.equal(result.url, 'https://fallback.example.com/manual.webp');
  assert.equal(result.asset, undefined);
});

test('getFeaturedTestimonials prioritizes featured items using explicit order', () => {
  const result = getFeaturedTestimonials(
    [
      { id: 'plain', name: 'Plain', quote: 'Quote', featured: false, order: 1 },
      { id: 'second', name: 'Second', quote: 'Quote', featured: true, order: 2 },
      { id: 'first', name: 'First', quote: 'Quote', featured: true, order: 1 },
    ],
    2,
  );

  assert.deepEqual(
    result.map((item) => item.id),
    ['first', 'second'],
  );
});

test('getFeaturedTestimonials excludes hidden testimonials from public results', () => {
  const result = getFeaturedTestimonials(
    [
      { id: 'hidden-featured', name: 'Hidden', quote: 'Quote', featured: true, visible: false, order: 1 },
      { id: 'visible-featured', name: 'Visible featured', quote: 'Quote', featured: true, visible: true, order: 2 },
      { id: 'visible-plain', name: 'Visible plain', quote: 'Quote', featured: false, visible: true, order: 1 },
    ],
    3,
  );

  assert.deepEqual(
    result.map((item) => item.id),
    ['visible-featured', 'visible-plain'],
  );
});

test('groupSkillsByCategory sorts categories and skills using display metadata', () => {
  const result = groupSkillsByCategory(
    [
      {
        id: 'react',
        name: 'React',
        nameAr: 'ريأكت',
        category: 'Frontend',
        categoryAr: 'الواجهات',
        proficiency: 95,
        categoryOrder: 2,
        order: 2,
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        nameAr: 'تايب سكربت',
        category: 'Frontend',
        categoryAr: 'الواجهات',
        proficiency: 90,
        categoryOrder: 2,
        order: 1,
      },
      {
        id: 'flutter',
        name: 'Flutter',
        nameAr: 'فلاتر',
        category: 'Mobile',
        categoryAr: 'التطبيقات',
        proficiency: 88,
        categoryOrder: 1,
        order: 1,
      },
    ],
    true,
  );

  assert.deepEqual(
    result.map((group) => group.label),
    ['التطبيقات', 'الواجهات'],
  );
  assert.deepEqual(
    result[1]?.items.map((item) => item.id),
    ['typescript', 'react'],
  );
});

test('resolveEntitySeo merges localized entity SEO and media asset image overrides', () => {
  const result = resolveEntitySeo(
    {
      title: 'Base title',
      titleAr: 'عنوان أساسي',
      description: 'Base description',
      descriptionAr: 'وصف أساسي',
      seo: {
        title: 'SEO title',
        titleAr: 'عنوان سيو',
        description: 'SEO description',
        descriptionAr: 'وصف سيو',
        imageAssetId: 'hero-image',
      },
    },
    mediaAssets,
    true,
  );

  assert.equal(result.title, 'عنوان سيو');
  assert.equal(result.description, 'وصف سيو');
  assert.equal(result.image, 'https://cdn.example.com/hero.webp');
});
