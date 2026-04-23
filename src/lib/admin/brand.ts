import { createDefaultSeoSettings, createDefaultSiteSettings } from './defaults';
import type { ProfileSettings, SeoSettings, SiteSettings } from './types';

function normalizeValue(value: string | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

function matchesProfileValue(configuredValue: string | undefined, profileValue: string | undefined) {
  const normalizedConfiguredValue = normalizeValue(configuredValue);
  return normalizedConfiguredValue.length > 0 && normalizedConfiguredValue === normalizeValue(profileValue);
}

export function isSiteBrandMirroringProfile(
  siteSettings: Pick<SiteSettings, 'siteName' | 'siteNameAr'>,
  profile: Pick<ProfileSettings, 'displayName' | 'displayNameAr'>,
) {
  return (
    matchesProfileValue(siteSettings.siteName, profile.displayName) &&
    matchesProfileValue(siteSettings.siteNameAr, profile.displayNameAr)
  );
}

export function resolveLocalizedSiteBrand(
  siteSettings: Pick<SiteSettings, 'siteName' | 'siteNameAr'>,
  profile: Pick<ProfileSettings, 'displayName' | 'displayNameAr'>,
  isArabic: boolean,
) {
  const canonicalSiteSettings = createDefaultSiteSettings();

  if (isSiteBrandMirroringProfile(siteSettings, profile)) {
    return isArabic ? canonicalSiteSettings.siteNameAr : canonicalSiteSettings.siteName;
  }

  if (isArabic) {
    return siteSettings.siteNameAr || siteSettings.siteName || canonicalSiteSettings.siteNameAr;
  }

  return siteSettings.siteName || canonicalSiteSettings.siteName;
}

export function isSeoTitleMirroringProfile(
  seoSettings: Pick<SeoSettings, 'defaultTitle' | 'defaultTitleAr'>,
  profile: Pick<ProfileSettings, 'displayName' | 'displayNameAr'>,
) {
  return (
    matchesProfileValue(seoSettings.defaultTitle, profile.displayName) &&
    matchesProfileValue(seoSettings.defaultTitleAr, profile.displayNameAr)
  );
}

export function resolveLocalizedSeoTitle(
  seoSettings: Pick<SeoSettings, 'defaultTitle' | 'defaultTitleAr'>,
  profile: Pick<ProfileSettings, 'displayName' | 'displayNameAr' | 'metaTitle' | 'metaTitleAr'>,
  isArabic: boolean,
) {
  const canonicalSeoSettings = createDefaultSeoSettings();

  if (isSeoTitleMirroringProfile(seoSettings, profile)) {
    return isArabic ? canonicalSeoSettings.defaultTitleAr : canonicalSeoSettings.defaultTitle;
  }

  if (isArabic) {
    return seoSettings.defaultTitleAr || profile.metaTitleAr || profile.metaTitle || canonicalSeoSettings.defaultTitleAr;
  }

  return seoSettings.defaultTitle || profile.metaTitle || canonicalSeoSettings.defaultTitle;
}
