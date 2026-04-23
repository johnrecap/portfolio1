import assert from 'node:assert/strict';
import test from 'node:test';

import { readComposerText } from './page-content';

test('readComposerText prefers localized composer content and falls back safely', () => {
  const content = {
    title: 'Build products with intent',
    titleAr: 'أبني منتجات رقمية بوضوح وتنفيذ دقيق',
  };

  assert.equal(readComposerText(content, 'title', 'Default title', false), 'Build products with intent');
  assert.equal(readComposerText(content, 'title', 'Default title', true), 'أبني منتجات رقمية بوضوح وتنفيذ دقيق');
  assert.equal(readComposerText({}, 'title', 'Default title', true), 'Default title');
});
