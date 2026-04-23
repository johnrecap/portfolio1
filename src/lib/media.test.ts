import assert from 'node:assert/strict';
import test from 'node:test';

import { estimateDataUrlBytes, normalizeMediaUrl } from './media';

test('normalizeMediaUrl converts Google Drive file links into direct preview URLs', () => {
  const result = normalizeMediaUrl(
    'https://drive.google.com/file/d/1ZdMuWzFpi-VoWdSXk5I3kh1FEWeHIF08/view?usp=sharing',
  );

  assert.equal(result, 'https://drive.google.com/uc?export=view&id=1ZdMuWzFpi-VoWdSXk5I3kh1FEWeHIF08');
});

test('normalizeMediaUrl preserves non-drive and data URLs', () => {
  assert.equal(normalizeMediaUrl('https://cdn.example.com/hero.webp'), 'https://cdn.example.com/hero.webp');
  assert.equal(normalizeMediaUrl('data:image/webp;base64,AAAA'), 'data:image/webp;base64,AAAA');
});

test('estimateDataUrlBytes calculates decoded byte size for base64 data URLs', () => {
  const result = estimateDataUrlBytes('data:image/webp;base64,QUJDRA==');

  assert.equal(result, 4);
});
