import { useMemo } from 'react';

import { useOptionalPublicData } from '@/contexts/PublicDataProvider';
import {
  getInitialPublicCollection,
  getInitialPublicDocument,
} from '@/lib/public-bootstrap';
import type { MediaAssetRecord } from '@/lib/content-hub';

export const PUBLIC_FIRESTORE_READ_OPTIONS = {
  suppressPermissionDenied: true,
} as const;

export function usePublicCollection<T>(path: string) {
  const publicData = useOptionalPublicData();
  const initial = getInitialPublicCollection(path);
  const data = (publicData?.collections[path] ?? initial.data) as (T & { id: string })[];

  return useMemo(
    () => ({ data, loading: false, error: null, addDocument: async () => undefined, updateDocument: async () => undefined, removeDocument: async () => undefined }),
    [data],
  );
}

export function usePublicDocument<T>(path: string, docId: string) {
  const publicData = useOptionalPublicData();
  const initial = getInitialPublicDocument(path, docId);
  const data = (publicData?.documents[`${path}/${docId}`] ?? initial.data) as (T & { id: string }) | null;

  return useMemo(
    () => ({ data, loading: false, error: null, setDocument: async (_docData?: unknown, _merge?: boolean) => undefined }),
    [data],
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
