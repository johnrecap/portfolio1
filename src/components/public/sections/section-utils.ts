import { readComposerText } from '@/lib/admin/page-content';
import type { AdminPageSection, StylePreset } from '@/lib/admin/types';

export function getSurfaceTone(stylePreset: StylePreset) {
  switch (stylePreset) {
    case 'muted':
      return 'border-border/40 bg-background/60';
    case 'emphasis':
      return 'border-primary/20 bg-primary/5';
    case 'contrast':
      return 'border-slate-800 bg-[#0d1117] text-slate-100';
    case 'default':
    default:
      return 'border-border/60 bg-card/70';
  }
}

export function readSectionText(
  section: AdminPageSection,
  key: string,
  fallback: string,
  isArabic: boolean,
) {
  return readComposerText(section.content, key, fallback, isArabic);
}
