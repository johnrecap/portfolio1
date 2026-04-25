import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createEmptyPublicBootstrapPacket,
  escapePublicBootstrapJson,
  getInitialPublicDocument,
  PUBLIC_BOOTSTRAP_VERSION,
  PUBLIC_CACHE_KEY,
  readPublicCacheFromStorage,
  updatePublicDocumentCache,
  validatePublicBootstrapPacket,
  writePublicCacheToStorage,
  type PublicBootstrapPacket,
} from './public-bootstrap';

class MemoryStorage {
  values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

test('validatePublicBootstrapPacket accepts allowed public data only', () => {
  const result = validatePublicBootstrapPacket({
    version: PUBLIC_BOOTSTRAP_VERSION,
    generatedAt: 123,
    documents: {
      'settings/profile': { id: 'profile', displayName: 'Mohamed' },
      'admin/private': { secret: true },
    },
    collections: {
      projects: [{ id: 'project-1', title: 'Project' }],
      messages: [{ id: 'message-1', text: 'Private' }],
    },
  });

  assert.equal(result?.documents['settings/profile']?.displayName, 'Mohamed');
  assert.equal(result?.documents['admin/private'], undefined);
  assert.equal(result?.collections.projects?.length, 1);
  assert.equal(result?.collections.messages, undefined);
});

test('localStorage public cache helpers round-trip valid packets', () => {
  const storage = new MemoryStorage();
  const packet = createEmptyPublicBootstrapPacket();
  packet.documents['settings/profile'] = { id: 'profile', displayName: 'Cached' };

  assert.equal(writePublicCacheToStorage(storage, packet), true);

  const result = readPublicCacheFromStorage(storage);
  assert.equal(result?.documents['settings/profile']?.displayName, 'Cached');
});

test('getInitialPublicDocument prefers bootstrap data over cache data', () => {
  const storage = new MemoryStorage();
  const cachedPacket = createEmptyPublicBootstrapPacket();
  cachedPacket.documents['settings/profile'] = { id: 'profile', displayName: 'Cached' };
  storage.setItem(PUBLIC_CACHE_KEY, JSON.stringify(cachedPacket));

  const bootstrapPacket: PublicBootstrapPacket = createEmptyPublicBootstrapPacket();
  bootstrapPacket.documents['settings/profile'] = { id: 'profile', displayName: 'Bootstrapped' };

  (globalThis as any).window = {
    __PUBLIC_BOOTSTRAP__: bootstrapPacket,
    localStorage: storage,
  };

  try {
    const result = getInitialPublicDocument('settings', 'profile');
    assert.equal(result.hasData, true);
    assert.equal(result.data?.displayName, 'Bootstrapped');
  } finally {
    delete (globalThis as any).window;
  }
});

test('getInitialPublicDocument falls back to storage when bootstrap is partial', () => {
  const storage = new MemoryStorage();
  const cachedPacket = createEmptyPublicBootstrapPacket();
  cachedPacket.documents['settings/profile'] = { id: 'profile', displayName: 'Cached' };
  storage.setItem(PUBLIC_CACHE_KEY, JSON.stringify(cachedPacket));

  (globalThis as any).window = {
    __PUBLIC_BOOTSTRAP__: createEmptyPublicBootstrapPacket(),
    localStorage: storage,
  };

  try {
    const result = getInitialPublicDocument('settings', 'profile');
    assert.equal(result.hasData, true);
    assert.equal(result.data?.displayName, 'Cached');
  } finally {
    delete (globalThis as any).window;
  }
});

test('updatePublicDocumentCache preserves richer storage data when bootstrap is partial', () => {
  const storage = new MemoryStorage();
  const cachedPacket = createEmptyPublicBootstrapPacket();
  cachedPacket.collections.projects = [{ id: 'project-1', title: 'Cached Project' }];
  storage.setItem(PUBLIC_CACHE_KEY, JSON.stringify(cachedPacket));

  (globalThis as any).window = {
    __PUBLIC_BOOTSTRAP__: createEmptyPublicBootstrapPacket(),
    localStorage: storage,
  };

  try {
    updatePublicDocumentCache('settings', 'profile', { id: 'profile', displayName: 'Fresh' });

    const result = readPublicCacheFromStorage(storage);
    assert.equal(result?.documents['settings/profile']?.displayName, 'Fresh');
    assert.equal(result?.collections.projects?.[0]?.title, 'Cached Project');
  } finally {
    delete (globalThis as any).window;
  }
});

test('escapePublicBootstrapJson escapes html-breaking characters', () => {
  const packet = createEmptyPublicBootstrapPacket();
  packet.documents['settings/profile'] = {
    id: 'profile',
    displayName: '</script><img src=x onerror=alert(1)>',
  };

  const result = escapePublicBootstrapJson(packet);
  assert.equal(result.includes('</script>'), false);
  assert.equal(result.includes('<img'), false);
  assert.equal(result.includes('\\u003c'), true);
});
