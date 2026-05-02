import assert from 'node:assert/strict';
import test from 'node:test';

import { hasOptimizedImage, resolveOptimizedImage } from './image-sources';

test('resolveOptimizedImage returns generated variants for demo previews', () => {
  const image = resolveOptimizedImage('/demo-previews/ShopNest-Commerce.png');

  assert.equal(image.optimized, true);
  assert.equal(image.width > 0, true);
  assert.equal(image.height > 0, true);
  assert.equal(image.sources.some((source) => source.type === 'image/avif'), true);
  assert.equal(image.sources.some((source) => source.type === 'image/webp'), true);
});

test('resolveOptimizedImage normalizes absolute URLs to path lookups', () => {
  const image = resolveOptimizedImage('https://portfolio.saeeddev.com/demo-previews/ShopNest-Commerce.png');

  assert.equal(image.optimized, true);
  assert.equal(hasOptimizedImage(image.fallbackSrc), true);
});

test('resolveOptimizedImage keeps unknown image URLs as fallbacks', () => {
  const image = resolveOptimizedImage('/uploads/custom-project.png');

  assert.equal(image.optimized, false);
  assert.equal(image.src, '/uploads/custom-project.png');
  assert.deepEqual(image.sources, []);
});
