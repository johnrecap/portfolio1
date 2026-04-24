export const PUBLIC_BOOTSTRAP_VERSION = 1;
export const PUBLIC_CACHE_KEY = 'portfolio:public-bootstrap:v1';
export const PUBLIC_CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24;
export const PUBLIC_CACHE_MAX_BYTES = 4_500_000;

export type PublicBootstrapDocument = Record<string, unknown> & { id?: string };
export type PublicBootstrapCollectionItem = Record<string, unknown> & { id: string };

export type PublicBootstrapPacket = {
  version: typeof PUBLIC_BOOTSTRAP_VERSION;
  generatedAt: number;
  documents: Record<string, PublicBootstrapDocument | null>;
  collections: Record<string, PublicBootstrapCollectionItem[]>;
};

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

declare global {
  interface Window {
    __PUBLIC_BOOTSTRAP__?: unknown;
  }
}

export const PUBLIC_BOOTSTRAP_DOCUMENTS = [
  ['settings', 'profile'],
  ['settings', 'site'],
  ['settings', 'theme'],
  ['settings', 'navigation'],
  ['settings', 'footer'],
  ['settings', 'seo'],
  ['settings', 'contact'],
  ['pages', 'home'],
  ['pages', 'about'],
  ['pages', 'contact'],
  ['pages', 'projects'],
  ['pages', 'blog'],
] as const;

export const PUBLIC_BOOTSTRAP_COLLECTIONS = [
  'mediaAssets',
  'projects',
  'blogs',
  'skills',
  'testimonials',
] as const;

export function createEmptyPublicBootstrapPacket(): PublicBootstrapPacket {
  return {
    version: PUBLIC_BOOTSTRAP_VERSION,
    generatedAt: Date.now(),
    documents: {},
    collections: {},
  };
}

export function createPublicDocumentKey(path: string, docId: string) {
  return `${path}/${docId}`;
}

export function createPublicCollectionKey(path: string) {
  return path;
}

export function isAllowedPublicDocumentKey(key: string) {
  return PUBLIC_BOOTSTRAP_DOCUMENTS.some(([path, docId]) => createPublicDocumentKey(path, docId) === key);
}

export function isAllowedPublicCollectionKey(key: string) {
  return (PUBLIC_BOOTSTRAP_COLLECTIONS as readonly string[]).includes(key);
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validatePublicBootstrapPacket(value: unknown): PublicBootstrapPacket | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (value.version !== PUBLIC_BOOTSTRAP_VERSION || typeof value.generatedAt !== 'number') {
    return null;
  }

  if (!isObjectRecord(value.documents) || !isObjectRecord(value.collections)) {
    return null;
  }

  const documents: PublicBootstrapPacket['documents'] = {};
  const collections: PublicBootstrapPacket['collections'] = {};

  Object.entries(value.documents).forEach(([key, documentValue]) => {
    if (!isAllowedPublicDocumentKey(key)) {
      return;
    }

    documents[key] = documentValue === null || isObjectRecord(documentValue)
      ? (documentValue as PublicBootstrapDocument | null)
      : null;
  });

  Object.entries(value.collections).forEach(([key, collectionValue]) => {
    if (!isAllowedPublicCollectionKey(key) || !Array.isArray(collectionValue)) {
      return;
    }

    collections[key] = collectionValue.filter(
      (item): item is PublicBootstrapCollectionItem =>
        isObjectRecord(item) && typeof item.id === 'string',
    );
  });

  return {
    version: PUBLIC_BOOTSTRAP_VERSION,
    generatedAt: value.generatedAt,
    documents,
    collections,
  };
}

export function readPublicBootstrapGlobal() {
  if (typeof window === 'undefined') {
    return null;
  }

  return validatePublicBootstrapPacket(window.__PUBLIC_BOOTSTRAP__);
}

export function readPublicCacheFromStorage(storage: StorageLike | undefined | null) {
  if (!storage) {
    return null;
  }

  try {
    const rawValue = storage.getItem(PUBLIC_CACHE_KEY);
    if (!rawValue) {
      return null;
    }

    const packet = validatePublicBootstrapPacket(JSON.parse(rawValue));
    if (!packet) {
      return null;
    }

    if (Date.now() - packet.generatedAt > PUBLIC_CACHE_MAX_AGE_MS) {
      return null;
    }

    return packet;
  } catch {
    return null;
  }
}

export function readPublicCache() {
  if (typeof window === 'undefined') {
    return null;
  }

  return readPublicCacheFromStorage(window.localStorage);
}

export function writePublicCacheToStorage(storage: StorageLike | undefined | null, packet: PublicBootstrapPacket) {
  if (!storage) {
    return false;
  }

  try {
    const serialized = JSON.stringify(packet);
    if (serialized.length > PUBLIC_CACHE_MAX_BYTES) {
      return false;
    }

    storage.setItem(PUBLIC_CACHE_KEY, serialized);
    return true;
  } catch {
    return false;
  }
}

export function writePublicCache(packet: PublicBootstrapPacket) {
  if (typeof window === 'undefined') {
    return false;
  }

  return writePublicCacheToStorage(window.localStorage, packet);
}

export function getInitialPublicDocument(path: string, docId: string) {
  const key = createPublicDocumentKey(path, docId);
  const bootstrap = readPublicBootstrapGlobal();

  if (bootstrap && Object.prototype.hasOwnProperty.call(bootstrap.documents, key)) {
    return { data: bootstrap.documents[key] ?? null, hasData: true };
  }

  const cache = readPublicCache();
  if (cache && Object.prototype.hasOwnProperty.call(cache.documents, key)) {
    return { data: cache.documents[key] ?? null, hasData: true };
  }

  return { data: null, hasData: false };
}

export function getInitialPublicCollection(path: string) {
  const key = createPublicCollectionKey(path);
  const bootstrap = readPublicBootstrapGlobal();

  if (bootstrap && Object.prototype.hasOwnProperty.call(bootstrap.collections, key)) {
    return { data: bootstrap.collections[key] ?? [], hasData: true };
  }

  const cache = readPublicCache();
  if (cache && Object.prototype.hasOwnProperty.call(cache.collections, key)) {
    return { data: cache.collections[key] ?? [], hasData: true };
  }

  return { data: [], hasData: false };
}

function updatePublicCache(updater: (packet: PublicBootstrapPacket) => PublicBootstrapPacket) {
  const current = readPublicCache() ?? createEmptyPublicBootstrapPacket();
  const next = updater({
    ...current,
    version: PUBLIC_BOOTSTRAP_VERSION,
    generatedAt: Date.now(),
    documents: { ...current.documents },
    collections: { ...current.collections },
  });

  writePublicCache(next);
}

export function updatePublicDocumentCache(path: string, docId: string, data: PublicBootstrapDocument | null) {
  const key = createPublicDocumentKey(path, docId);
  if (!isAllowedPublicDocumentKey(key)) {
    return;
  }

  updatePublicCache((packet) => {
    packet.documents[key] = data;
    return packet;
  });
}

export function updatePublicCollectionCache(path: string, data: PublicBootstrapCollectionItem[]) {
  const key = createPublicCollectionKey(path);
  if (!isAllowedPublicCollectionKey(key)) {
    return;
  }

  updatePublicCache((packet) => {
    packet.collections[key] = data;
    return packet;
  });
}

export function escapePublicBootstrapJson(packet: PublicBootstrapPacket) {
  return JSON.stringify(packet)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
