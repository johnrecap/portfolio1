import assert from 'node:assert/strict';
import test from 'node:test';

import { createPageConfigResolver, movePageSection, resolvePageConfig } from './page-config';

test('resolvePageConfig sanitizes incoming sections against the page registry', () => {
  const config = resolvePageConfig('home', {
    title: 'Homepage',
    sections: [
      {
        id: 'bad-contact',
        type: 'contactForm',
        order: 2,
        enabled: true,
        variant: 'default',
        content: {},
        stylePreset: 'default',
        visibilityRules: null,
      },
      {
        id: 'hero',
        type: 'hero',
        order: 1,
        enabled: true,
        variant: 'grid',
        content: { title: 'Build products' },
        stylePreset: 'default',
        visibilityRules: null,
      },
    ],
  });

  assert.equal(config.title, 'Homepage');
  assert.deepEqual(config.sections.map((section) => section.type), ['hero']);
  assert.equal(config.sections[0]?.variant, 'split');
});

test('movePageSection swaps order safely without losing content', () => {
  const config = resolvePageConfig('contact', {
    sections: [
      {
        id: 'intro',
        type: 'contactIntro',
        order: 1,
        enabled: true,
        variant: 'split',
        content: { title: 'Talk about the next build' },
        stylePreset: 'default',
        visibilityRules: null,
      },
      {
        id: 'form',
        type: 'contactForm',
        order: 2,
        enabled: true,
        variant: 'default',
        content: { title: 'Contact form' },
        stylePreset: 'default',
        visibilityRules: null,
      },
    ],
  });

  const moved = movePageSection(config.sections, 'form', 'up');

  assert.deepEqual(moved.map((section) => section.id), ['form', 'intro']);
  assert.deepEqual(moved.map((section) => section.order), [1, 2]);
  assert.equal(moved[0]?.content.title, 'Contact form');
});

test('createPageConfigResolver reuses the same normalized object for the same raw page document', () => {
  const resolver = createPageConfigResolver('home');
  const rawValue = {
    title: 'Homepage',
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        order: 1,
        enabled: true,
        variant: 'split',
        content: {},
        stylePreset: 'default',
        visibilityRules: null,
      },
    ],
  };

  const first = resolver(rawValue);
  const second = resolver(rawValue);

  assert.equal(first, second);
});

test('createPageConfigResolver reuses the same default page config while no document exists', () => {
  const resolver = createPageConfigResolver('contact');

  const first = resolver(null);
  const second = resolver(undefined);

  assert.equal(first, second);
});
