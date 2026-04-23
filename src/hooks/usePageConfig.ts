import { useMemo } from 'react';

import { usePublicDocument } from './public-firestore';
import { createPageConfigResolver } from '@/lib/admin/page-config';
import type { AdminPageConfig, PlatformPageId } from '@/lib/admin/types';

export function usePageConfig(pageId: PlatformPageId) {
  const { data, loading, setDocument } = usePublicDocument<Record<string, unknown>>('pages', pageId);
  const resolvePageConfig = useMemo(() => createPageConfigResolver(pageId), [pageId]);

  const pageConfig: AdminPageConfig = resolvePageConfig(data);

  return {
    pageConfig,
    loading,
    setDocument,
  };
}
