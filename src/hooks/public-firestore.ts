import { useCollection, useDocument } from './useFirestore';
import { useMediaLibrary } from './useMediaLibrary';
import { mergeDemoProjects } from '@/lib/demo-projects';
import {
  getInitialPublicCollection,
  getInitialPublicDocument,
  updatePublicCollectionCache,
  updatePublicDocumentCache,
  type PublicBootstrapCollectionItem,
  type PublicBootstrapDocument,
} from '@/lib/public-bootstrap';

export const PUBLIC_FIRESTORE_READ_OPTIONS = {
  suppressPermissionDenied: true,
} as const;

export function usePublicCollection<T>(path: string) {
  const initial = getInitialPublicCollection(path);
  const initialData = path === 'projects'
    ? mergeDemoProjects(initial.data as any[])
    : initial.data;

  return useCollection<T>(path, {
    ...PUBLIC_FIRESTORE_READ_OPTIONS,
    initialData,
    hasInitialData: initial.hasData || path === 'projects',
    keepDataOnSuppressedError: true,
    onData: (data) => {
      const nextData = path === 'projects'
        ? mergeDemoProjects(data as any[])
        : data;
      updatePublicCollectionCache(path, nextData as PublicBootstrapCollectionItem[]);
    },
  });
}

export function usePublicDocument<T>(path: string, docId: string) {
  const initial = getInitialPublicDocument(path, docId);

  return useDocument<T>(path, docId, {
    ...PUBLIC_FIRESTORE_READ_OPTIONS,
    initialData: initial.data,
    hasInitialData: initial.hasData,
    keepDataOnSuppressedError: true,
    onData: (data) => updatePublicDocumentCache(path, docId, data as PublicBootstrapDocument | null),
  });
}

export function usePublicMediaLibrary() {
  const initial = getInitialPublicCollection('mediaAssets');

  return useMediaLibrary({
    ...PUBLIC_FIRESTORE_READ_OPTIONS,
    initialData: initial.data,
    hasInitialData: initial.hasData,
    keepDataOnSuppressedError: true,
    onData: (data) => updatePublicCollectionCache('mediaAssets', data as PublicBootstrapCollectionItem[]),
  });
}
