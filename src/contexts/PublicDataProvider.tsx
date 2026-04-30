import { createContext, useContext, useMemo, type ReactNode } from 'react';

import {
  getInitialPublicCollection,
  getInitialPublicDocument,
  type PublicBootstrapCollectionItem,
  type PublicBootstrapDocument,
} from '@/lib/public-bootstrap';

type PublicDataContextValue = {
  documents: Record<string, PublicBootstrapDocument | null>;
  collections: Record<string, PublicBootstrapCollectionItem[]>;
};

const PublicDataContext = createContext<PublicDataContextValue | null>(null);

function publicDocumentKey(path: string, docId: string) {
  return `${path}/${docId}`;
}

export function readInitialPublicDocuments(entries: readonly (readonly [string, string])[]) {
  return Object.fromEntries(
    entries.flatMap(([path, docId]) => {
      const initial = getInitialPublicDocument(path, docId);

      if (!initial.hasData) {
        return [];
      }

      return [[publicDocumentKey(path, docId), initial.data]];
    }),
  );
}

export function readInitialPublicCollections(entries: readonly string[]) {
  return Object.fromEntries(
    entries.flatMap((path) => {
      const initial = getInitialPublicCollection(path);

      if (!initial.hasData) {
        return [];
      }

      return [[path, initial.data]];
    }),
  );
}

export function PublicDataProvider({ children }: { children: ReactNode }) {
  const value = useMemo<PublicDataContextValue>(() => {
    const documentEntries = [
      ['settings', 'profile'],
      ['settings', 'contact'],
      ['settings', 'theme'],
      ['settings', 'site'],
      ['settings', 'navigation'],
      ['settings', 'footer'],
      ['settings', 'seo'],
      ['pages', 'home'],
      ['pages', 'about'],
      ['pages', 'contact'],
      ['pages', 'projects'],
      ['pages', 'blog'],
    ] as const;

    const collectionEntries = ['mediaAssets', 'projects', 'blogs', 'skills', 'testimonials'] as const;

    return {
      documents: readInitialPublicDocuments(documentEntries),
      collections: readInitialPublicCollections(collectionEntries),
    };
  }, []);

  return <PublicDataContext.Provider value={value}>{children}</PublicDataContext.Provider>;
}

export function useOptionalPublicData() {
  return useContext(PublicDataContext);
}
