import {
  DEMO_PREVIEW_IMAGE_MANIFEST,
  type GeneratedImageEntry,
  type GeneratedImageSource,
} from './generated/demo-preview-images';

export type OptimizedImageEntry = GeneratedImageEntry & {
  optimized: boolean;
};

function normalizeImageUrl(value?: string | null) {
  const trimmedValue = typeof value === 'string' ? value.trim() : '';

  if (!trimmedValue) {
    return '';
  }

  try {
    const url = new URL(trimmedValue);
    return url.pathname;
  } catch {
    return trimmedValue.startsWith('/') ? trimmedValue : `/${trimmedValue}`;
  }
}

export function resolveOptimizedImage(value?: string | null): OptimizedImageEntry {
  const imageUrl = normalizeImageUrl(value);
  const optimizedImage = DEMO_PREVIEW_IMAGE_MANIFEST[imageUrl as keyof typeof DEMO_PREVIEW_IMAGE_MANIFEST];

  if (optimizedImage) {
    return {
      ...optimizedImage,
      optimized: true,
    };
  }

  return {
    src: imageUrl,
    fallbackSrc: imageUrl,
    width: 0,
    height: 0,
    originalWidth: 0,
    originalHeight: 0,
    sources: [] as GeneratedImageSource[],
    optimized: false,
  };
}

export function hasOptimizedImage(value?: string | null) {
  return resolveOptimizedImage(value).optimized;
}
