import { useMemo } from 'react';

import { useDocument } from './useFirestore';
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

function usePlatformSetting<T>(
  docId: string,
  normalize: (value: unknown) => T,
  createDefault: () => T,
) {
  const { data, loading, setDocument } = useDocument<Record<string, unknown>>('settings', docId);
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

export function useSiteSettings() {
  const { data, loading, setDocument } = usePlatformSetting<SiteSettings>(
    'site',
    normalizeSiteSettings,
    createDefaultSiteSettings,
  );

  return { siteSettings: data, loading, setDocument };
}

export function useThemeSettings() {
  const { data, loading, setDocument } = usePlatformSetting<ThemeSettings>(
    'theme',
    normalizeThemeSettings,
    createDefaultThemeSettings,
  );

  return { themeSettings: data, loading, setDocument };
}

export function useNavigationSettings() {
  const { data, loading, setDocument } = usePlatformSetting<NavigationSettings>(
    'navigation',
    normalizeNavigationSettings,
    createDefaultNavigationSettings,
  );

  return { navigationSettings: data, loading, setDocument };
}

export function useFooterSettings() {
  const { data, loading, setDocument } = usePlatformSetting<FooterSettings>(
    'footer',
    normalizeFooterSettings,
    createDefaultFooterSettings,
  );

  return { footerSettings: data, loading, setDocument };
}

export function useSeoSettings() {
  const { data, loading, setDocument } = usePlatformSetting<SeoSettings>(
    'seo',
    normalizeSeoSettings,
    createDefaultSeoSettings,
  );

  return { seoSettings: data, loading, setDocument };
}

export function useContactSettings() {
  const { data, loading, setDocument } = usePlatformSetting<ContactSettings>(
    'contact',
    normalizeContactSettings,
    createDefaultContactSettings,
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
