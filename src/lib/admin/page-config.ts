import { createPlatformSettingResolver } from './platform-settings';
import { createDefaultPageConfig, normalizePageConfig } from './defaults';
import { sanitizePageSections } from './section-registry';
import type { AdminPageConfig, AdminPageSection, PlatformPageId } from './types';

export function resolvePageConfig(pageId: PlatformPageId, value: unknown): AdminPageConfig {
  const config = normalizePageConfig(pageId, value);

  return {
    ...config,
    sections: sanitizePageSections(pageId, config.sections),
  };
}

export function createPageConfigResolver(pageId: PlatformPageId) {
  return createPlatformSettingResolver(
    (value: Record<string, unknown>) => resolvePageConfig(pageId, value),
    () => createDefaultPageConfig(pageId),
  );
}

export function movePageSection(
  sections: AdminPageSection[],
  sectionId: string,
  direction: 'up' | 'down',
): AdminPageSection[] {
  const index = sections.findIndex((section) => section.id === sectionId);

  if (index === -1) {
    return sections;
  }

  const targetIndex = direction === 'up' ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= sections.length) {
    return sections;
  }

  const reordered = [...sections];
  [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

  return reordered.map((section, position) => ({
    ...section,
    order: position + 1,
  }));
}
