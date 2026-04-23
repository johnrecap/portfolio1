import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getPageSectionDefinitions,
  getSectionDefinition,
  normalizeSectionVariant,
  sanitizePageSections,
} from './section-registry';

test('getPageSectionDefinitions returns only the sections allowed on a page', () => {
  const homeSections = getPageSectionDefinitions('home');
  const contactSections = getPageSectionDefinitions('contact');

  assert.deepEqual(
    homeSections.map((section) => section.type),
    ['hero', 'showcase', 'featuredProjects', 'testimonials', 'cta'],
  );
  assert.deepEqual(
    contactSections.map((section) => section.type),
    ['contactIntro', 'contactMethods', 'contactForm', 'availability'],
  );
});

test('normalizeSectionVariant falls back to the section default when the variant is not allowed', () => {
  assert.equal(normalizeSectionVariant('hero', 'grid'), 'split');
  assert.equal(normalizeSectionVariant('cta', 'card'), 'card');
});

test('sanitizePageSections keeps allowed sections only and normalizes order and variants', () => {
  const sanitized = sanitizePageSections('about', [
    {
      id: 'bad-hero',
      type: 'hero',
      order: 3,
      enabled: true,
      variant: 'split',
      content: {},
      stylePreset: 'default',
      visibilityRules: null,
    },
    {
      id: 'editor',
      type: 'editorCard',
      order: 2,
      enabled: true,
      variant: 'grid',
      content: { filename: 'about-workspace.ts' },
      stylePreset: 'contrast',
      visibilityRules: null,
    },
    {
      id: 'intro',
      type: 'aboutIntro',
      order: 1,
      enabled: true,
      variant: 'minimal',
      content: {},
      stylePreset: 'default',
      visibilityRules: null,
    },
  ]);

  assert.deepEqual(
    sanitized.map((section) => section.id),
    ['intro', 'editor'],
  );
  assert.equal(sanitized[0]?.variant, 'minimal');
  assert.equal(sanitized[1]?.variant, 'editor');
  assert.equal(sanitized[1]?.stylePreset, 'contrast');
});

test('getSectionDefinition exposes field metadata for composer forms', () => {
  const definition = getSectionDefinition('contactIntro');

  assert.equal(definition.type, 'contactIntro');
  assert.equal(definition.defaultVariant, 'split');
  assert.equal(definition.fields.some((field) => field.key === 'title'), true);
  assert.equal(definition.fields.some((field) => field.key === 'subtitleAr'), true);
});
