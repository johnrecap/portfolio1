import assert from 'node:assert/strict';
import test from 'node:test';

import { createEmptyPublicBootstrapPacket, PUBLIC_CACHE_KEY } from '@/lib/public-bootstrap';
import { readInitialPublicCollections, readInitialPublicDocuments } from './PublicDataProvider';

class MemoryStorage {
  values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

test('public data provider omits missing bootstrap documents so Firestore fallback can run', () => {
  const storage = new MemoryStorage();

  (globalThis as any).window = {
    __PUBLIC_BOOTSTRAP__: createEmptyPublicBootstrapPacket(),
    localStorage: storage,
  };

  try {
    const documents = readInitialPublicDocuments([['settings', 'profile']]);

    assert.equal(Object.hasOwn(documents, 'settings/profile'), false);
  } finally {
    delete (globalThis as any).window;
  }
});

test('public data provider keeps cached documents for immediate public rendering', () => {
  const storage = new MemoryStorage();
  const cachedPacket = createEmptyPublicBootstrapPacket();
  cachedPacket.documents['settings/profile'] = { id: 'profile', profileImage: 'https://example.com/profile.jpg' };
  storage.setItem(PUBLIC_CACHE_KEY, JSON.stringify(cachedPacket));

  (globalThis as any).window = {
    __PUBLIC_BOOTSTRAP__: createEmptyPublicBootstrapPacket(),
    localStorage: storage,
  };

  try {
    const documents = readInitialPublicDocuments([['settings', 'profile']]);

    assert.equal(documents['settings/profile']?.profileImage, 'https://example.com/profile.jpg');
  } finally {
    delete (globalThis as any).window;
  }
});

test('public data provider omits missing bootstrap collections so Firestore fallback can run', () => {
  const storage = new MemoryStorage();

  (globalThis as any).window = {
    __PUBLIC_BOOTSTRAP__: createEmptyPublicBootstrapPacket(),
    localStorage: storage,
  };

  try {
    const collections = readInitialPublicCollections(['mediaAssets']);

    assert.equal(Object.hasOwn(collections, 'mediaAssets'), false);
  } finally {
    delete (globalThis as any).window;
  }
});
