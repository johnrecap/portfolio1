import { useCollection, useDocument } from './useFirestore';
import { useMediaLibrary } from './useMediaLibrary';

export const PUBLIC_FIRESTORE_READ_OPTIONS = {
  suppressPermissionDenied: true,
} as const;

export function usePublicCollection<T>(path: string) {
  return useCollection<T>(path, PUBLIC_FIRESTORE_READ_OPTIONS);
}

export function usePublicDocument<T>(path: string, docId: string) {
  return useDocument<T>(path, docId, PUBLIC_FIRESTORE_READ_OPTIONS);
}

export function usePublicMediaLibrary() {
  return useMediaLibrary(PUBLIC_FIRESTORE_READ_OPTIONS);
}
