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
      documents: Object.fromEntries(
        documentEntries.map(([path, docId]) => [
          publicDocumentKey(path, docId),
          getInitialPublicDocument(path, docId).data,
        ]),
      ),
      collections: Object.fromEntries(
        collectionEntries.map((path) => [path, getInitialPublicCollection(path).data]),
      ),
    };
  }, []);

  return <PublicDataContext.Provider value={value}>{children}</PublicDataContext.Provider>;
}

export function useOptionalPublicData() {
  return useContext(PublicDataContext);
}
