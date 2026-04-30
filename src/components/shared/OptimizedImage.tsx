import type { ImgHTMLAttributes } from 'react';

import { resolveOptimizedImage } from '@/lib/image-sources';

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'height' | 'sizes' | 'src' | 'srcSet' | 'width'> & {
  imageUrl: string;
  priority?: boolean;
  sizes?: string;
};

export const OptimizedImage = ({
  alt,
  className,
  decoding,
  imageUrl,
  loading,
  priority = false,
  referrerPolicy,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  ...props
}: OptimizedImageProps) => {
  const image = resolveOptimizedImage(imageUrl);
  const imageLoading = priority ? 'eager' : (loading ?? 'lazy');
  const imageDecoding = decoding ?? 'async';

  const img = (
    <img
      {...props}
      src={image.src}
      alt={alt}
      width={image.width || undefined}
      height={image.height || undefined}
      loading={imageLoading}
      decoding={imageDecoding}
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy={referrerPolicy ?? 'no-referrer'}
      className={className}
    />
  );

  if (!image.optimized || image.sources.length === 0) {
    return img;
  }

  return (
    <picture>
      {image.sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
      ))}
      {img}
    </picture>
  );
};
