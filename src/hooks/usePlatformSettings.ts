import { useMemo } from 'react';

import { useDocument } from './useFirestore';
import {
  getInitialPublicDocument,
  updatePublicDocumentCache,
  type PublicBootstrapDocument,
} from '@/lib/public-bootstrap';
import {
  createDefaultContactSettings,
  createDefaultDashboardSettings,
  createDefaultFooterSettings,
  createDefaultNavigationSettings,
  createDefaultSeoSettings,
  createDefaultSiteSettings,
  createDefaultThemeSettings,
} from '@/lib/admin/defaults';
import {
  normalizeContactSettings,
  normalizeDashboardSettings,
  normalizeFooterSettings,
  normalizeNavigationSettings,
  normalizeSeoSettings,
  normalizeSiteSettings,
  normalizeThemeSettings,
} from '@/lib/admin/settings';
import { createPlatformSettingResolver } from '@/lib/admin/platform-settings';
import type {
  ContactSettings,
  DashboardSettings,
  FooterSettings,
  NavigationSettings,
  SeoSettings,
  SiteSettings,
  ThemeSettings,
} from '@/lib/admin/types';

type PlatformSettingsOptions = {
  publicRead?: boolean;
};

function usePlatformSetting<T>(
  docId: string,
  normalize: (value: unknown) => T,
  createDefault: () => T,
  options?: PlatformSettingsOptions,
) {
  const initial = options?.publicRead === true
    ? getInitialPublicDocument('settings', docId)
    : { data: null, hasData: false };
  const { data, loading, setDocument } = useDocument<Record<string, unknown>>('settings', docId, {
    suppressPermissionDenied: options?.publicRead === true,
    initialData: initial.data,
    hasInitialData: initial.hasData,
    keepDataOnSuppressedError: options?.publicRead === true,
    onData: options?.publicRead === true
      ? (value) => updatePublicDocumentCache('settings', docId, value as PublicBootstrapDocument | null)
      : undefined,
  });
  const resolveSetting = useMemo(
    () => createPlatformSettingResolver(normalize as (value: Record<string, unknown>) => T, createDefault),
    [normalize, createDefault],
  );

  return {
    data: resolveSetting(data),
    loading,
    setDocument,
  };
}

export function useSiteSettings(options?: PlatformSettingsOptions) {
  const { data, loading, setDocument } = usePlatformSetting<SiteSettings>(
    'site',
    normalizeSiteSettings,
    createDefaultSiteSettings,
    options,
  );

  return { siteSettings: data, loading, setDocument };
}

export function useThemeSettings(options?: PlatformSettingsOptions) {
  const { data, loading, setDocument } = usePlatformSetting<ThemeSettings>(
    'theme',
    normalizeThemeSettings,
    createDefaultThemeSettings,
    options,
  );

  return { themeSettings: data, loading, setDocument };
}

export function useNavigationSettings(options?: PlatformSettingsOptions) {
  const { data, loading, setDocument } = usePlatformSetting<NavigationSettings>(
    'navigation',
    normalizeNavigationSettings,
    createDefaultNavigationSettings,
    options,
  );

  return { navigationSettings: data, loading, setDocument };
}

export function useFooterSettings(options?: PlatformSettingsOptions) {
  const { data, loading, setDocument } = usePlatformSetting<FooterSettings>(
    'footer',
    normalizeFooterSettings,
    createDefaultFooterSettings,
    options,
  );

  return { footerSettings: data, loading, setDocument };
}

export function useSeoSettings(options?: PlatformSettingsOptions) {
  const { data, loading, setDocument } = usePlatformSetting<SeoSettings>(
    'seo',
    normalizeSeoSettings,
    createDefaultSeoSettings,
    options,
  );

  return { seoSettings: data, loading, setDocument };
}

export function useContactSettings(options?: PlatformSettingsOptions) {
  const { data, loading, setDocument } = usePlatformSetting<ContactSettings>(
    'contact',
    normalizeContactSettings,
    createDefaultContactSettings,
    options,
  );

  return { contactSettings: data, loading, setDocument };
}

export function useDashboardSettings() {
  const { data, loading, setDocument } = usePlatformSetting<DashboardSettings>(
    'dashboard',
    normalizeDashboardSettings,
    createDefaultDashboardSettings,
  );

  return { dashboardSettings: data, loading, setDocument };
}
