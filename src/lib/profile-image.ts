import type { CSSProperties } from 'react';

type ProfileImageControls = {
  profileImageFit?: string;
  profileImagePositionX?: number;
  profileImagePositionY?: number;
  profileImageZoom?: number;
};

export function clampProfileImageControlValue(value: unknown, fallback: number, min: number, max: number) {
  const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, numericValue));
}

export function buildProfileImageStyle(profile: ProfileImageControls): CSSProperties {
  const positionX = clampProfileImageControlValue(profile.profileImagePositionX, 50, 0, 100);
  const positionY = clampProfileImageControlValue(profile.profileImagePositionY, 50, 0, 100);
  const zoom = clampProfileImageControlValue(profile.profileImageZoom, 100, 100, 160);
  const fit = profile.profileImageFit === 'contain' ? 'contain' : 'cover';

  return {
    objectFit: fit,
    objectPosition: `${positionX}% ${positionY}%`,
    transform: `scale(${zoom / 100})`,
    transformOrigin: `${positionX}% ${positionY}%`,
  };
}
