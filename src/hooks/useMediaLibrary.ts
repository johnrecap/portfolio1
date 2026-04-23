import { useMemo } from 'react';

import { useCollection } from './useFirestore';
import type { MediaAssetRecord } from '@/lib/content-hub';

type UseMediaLibraryOptions = {
  suppressPermissionDenied?: boolean;
};

export function useMediaLibrary(options?: UseMediaLibraryOptions) {
  const collectionState = useCollection<MediaAssetRecord>('mediaAssets', options);

  const assets = useMemo(
    () =>
      [...collectionState.data].sort((left, right) => {
        const leftGroup = left.group?.trim() || 'general';
        const rightGroup = right.group?.trim() || 'general';

        if (leftGroup !== rightGroup) {
          return leftGroup.localeCompare(rightGroup);
        }

        return left.title.localeCompare(right.title);
      }),
    [collectionState.data],
  );

  return {
    ...collectionState,
    assets,
  };
}
