import { useMemo } from 'react';

import { useOptionalPublicData } from '@/contexts/PublicDataProvider';
import {
  getInitialPublicCollection,
  getInitialPublicDocument,
  updatePublicCollectionCache,
  updatePublicDocumentCache,
} from '@/lib/public-bootstrap';
import { useCollection, useDocument } from './useFirestore';
import type { MediaAssetRecord } from '@/lib/content-hub';

export const PUBLIC_FIRESTORE_READ_OPTIONS = {
  suppressPermissionDenied: true,
} as const;

export function usePublicCollection<T>(path: string) {
  const publicData = useOptionalPublicData();
  const initial = getInitialPublicCollection(path);
  const contextData = publicData?.collections[path];
  const hasBootstrapData = contextData !== undefined || initial.hasData;
  const fallback = useCollection<T>(path, {
    ...PUBLIC_FIRESTORE_READ_OPTIONS,
    disabled: hasBootstrapData,
    initialData: contextData ?? initial.data,
    hasInitialData: hasBootstrapData,
    keepDataOnSuppressedError: true,
    onData: (value) => updatePublicCollectionCache(path, value as Array<Record<string, unknown> & { id: string }>),
  });
  const data = (hasBootstrapData ? contextData ?? initial.data : fallback.data) as (T & { id: string })[];

  return useMemo(
    () => ({
      data,
      loading: hasBootstrapData ? false : fallback.loading,
      error: fallback.error,
      addDocument: fallback.addDocument,
      updateDocument: fallback.updateDocument,
      removeDocument: fallback.removeDocument,
    }),
    [data, fallback.loading, fallback.error, fallback.addDocument, fallback.updateDocument, fallback.removeDocument, hasBootstrapData],
  );
}

export function usePublicDocument<T>(path: string, docId: string) {
  const publicData = useOptionalPublicData();
  const initial = getInitialPublicDocument(path, docId);
  const documentKey = `${path}/${docId}`;
  const contextData = publicData?.documents[documentKey];
  const hasBootstrapData = Object.prototype.hasOwnProperty.call(publicData?.documents ?? {}, documentKey) || initial.hasData;
  const fallback = useDocument<T>(path, docId, {
    ...PUBLIC_FIRESTORE_READ_OPTIONS,
    disabled: hasBootstrapData,
    initialData: contextData ?? initial.data,
    hasInitialData: hasBootstrapData,
    keepDataOnSuppressedError: true,
    onData: (value) => updatePublicDocumentCache(path, docId, value as Record<string, unknown> | null),
  });
  const data = (hasBootstrapData ? contextData ?? initial.data : fallback.data) as (T & { id: string }) | null;

  return useMemo(
    () => ({
      data,
      loading: hasBootstrapData ? false : fallback.loading,
      error: fallback.error,
      setDocument: fallback.setDocument,
    }),
    [data, fallback.loading, fallback.error, fallback.setDocument, hasBootstrapData],
  );
}

export function usePublicMediaLibrary() {
  const publicData = useOptionalPublicData();
  const initial = getInitialPublicCollection('mediaAssets');
  const assets = (publicData?.collections.mediaAssets ?? initial.data) as MediaAssetRecord[];

  return useMemo(
    () => ({ assets, loading: false, error: null, addDocument: async () => undefined, updateDocument: async () => undefined, removeDocument: async () => undefined }),
    [assets],
  );
}
