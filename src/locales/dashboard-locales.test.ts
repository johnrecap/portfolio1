import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const REQUIRED_DASHBOARD_KEYS = {
  dashboardLayout: ['testimonials', 'media', 'viewSite'],
  dashboardSkills: [
    'confirmDeleteTitle',
    'skillNameAr',
    'categoryAr',
    'description',
    'descriptionAr',
    'iconBlock',
    'iconAsset',
    'iconUrl',
    'categoryOrder',
    'order',
    'featured',
    'searchSkills',
    'emptyDescription',
    'groupSummary',
  ],
  dashboardBlog: [
    'confirmDeleteTitle',
    'titleAr',
    'tags',
    'readTime',
    'searchArticles',
    'featured',
    'featuredHint',
    'excerptAr',
    'contentAr',
    'coverBlock',
    'coverAsset',
    'seo',
    'seoTitle',
    'seoTitleAr',
    'seoDescription',
    'seoDescriptionAr',
    'seoImageBlock',
    'seoImageAsset',
    'seoImage',
    'emptyDescription',
    'delete',
  ],
  dashboardProjects: [
    'titleAr',
    'descriptionAr',
    'primaryMedia',
    'primaryMediaAsset',
    'gallery',
    'galleryHint',
    'galleryHelper',
    'highlightLabel',
    'highlightLabelAr',
    'seo',
    'seoTitle',
    'seoTitleAr',
    'seoDescription',
    'seoDescriptionAr',
    'seoImageBlock',
    'seoImageAsset',
    'seoImage',
    'galleryCount',
    'seoReady',
    'ready',
    'pending',
  ],
  dashboardTestimonials: [
    'title',
    'description',
    'totalCount',
    'featuredCount',
    'libraryLinked',
    'search',
    'addTestimonial',
    'addNewTestimonial',
    'editTestimonial',
    'name',
    'nameAr',
    'role',
    'roleAr',
    'company',
    'companyAr',
    'quote',
    'quoteAr',
    'outcome',
    'outcomeAr',
    'avatar',
    'avatarAsset',
    'avatarUrl',
    'logo',
    'logoAsset',
    'logoUrl',
    'visible',
    'featured',
    'hidden',
    'order',
    'orderHintTitle',
    'orderHintBody',
    'saveChanges',
    'cancel',
    'emptyTitle',
    'emptyDescription',
    'deleteTitle',
    'deleteDescription',
    'delete',
  ],
  dashboardMessages: [
    'status',
    'priority',
    'statusOptions.new',
    'statusOptions.reviewed',
    'statusOptions.archived',
    'priorityOptions.normal',
    'priorityOptions.high',
  ],
  dashboardMedia: [
    'title',
    'description',
    'totalAssets',
    'imageAssets',
    'assetGroups',
    'search',
    'addAsset',
    'addNewAsset',
    'editAsset',
    'assetTitle',
    'assetTitleAr',
    'kind',
    'kindImage',
    'kindVideo',
    'group',
    'url',
    'alt',
    'altAr',
    'tags',
    'previewHint',
    'cancel',
    'saveChanges',
    'emptyTitle',
    'emptyDescription',
    'deleteTitle',
    'deleteDescription',
    'delete',
  ],
  dashboardMediaPicker: [
    'description',
    'manualOption',
    'uploadFromDevice',
    'replaceFromDevice',
    'uploading',
    'uploadHint',
    'localImageValue',
    'localImageAttached',
    'invalidImageType',
    'imageTooLarge',
    'noMedia',
  ],
} as const;

function readLocale(locale: 'en' | 'ar') {
  const localePath = path.join(process.cwd(), 'src', 'locales', `${locale}.json`);
  return JSON.parse(readFileSync(localePath, 'utf8')) as Record<string, unknown>;
}

function getByPath(source: Record<string, unknown>, dottedPath: string) {
  return dottedPath.split('.').reduce<unknown>((value, part) => {
    if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
      return (value as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

for (const locale of ['en', 'ar'] as const) {
  test(`${locale} dashboard locales expose the required keys`, () => {
    const translations = readLocale(locale);

    for (const [namespace, keys] of Object.entries(REQUIRED_DASHBOARD_KEYS)) {
      for (const key of keys) {
        const pathKey = `${namespace}.${key}`;
        const value = getByPath(translations, pathKey);

        assert.equal(typeof value, 'string', `Missing locale key: ${locale}.${pathKey}`);
        assert.notEqual((value as string).trim(), '', `Empty locale key: ${locale}.${pathKey}`);
      }
    }
  });
}

test('arabic dashboard locales do not contain placeholder question marks', () => {
  const translations = readLocale('ar');

  for (const [namespace, keys] of Object.entries(REQUIRED_DASHBOARD_KEYS)) {
    for (const key of keys) {
      const pathKey = `${namespace}.${key}`;
      const value = getByPath(translations, pathKey);

      assert.equal(typeof value, 'string', `Missing Arabic locale key: ${pathKey}`);
      assert.equal(
        (value as string).includes('?'),
        false,
        `Arabic locale still contains placeholder characters: ${pathKey}`,
      );
    }
  }
});
