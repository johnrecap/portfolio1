import type { CSSProperties } from 'react';

import {
  createDefaultContactSettings,
  createDefaultDashboardSettings,
  createDefaultFooterSettings,
  createDefaultNavigationSettings,
  createDefaultSeoSettings,
  createDefaultSiteSettings,
  createDefaultThemeSettings,
  normalizeThemeSettings,
} from './defaults';
import {
  DASHBOARD_MODULE_COPY,
  isDashboardRouteModuleId,
} from './dashboard-config';
import type {
  ContactSettings,
  DashboardModuleConfig,
  DashboardQuickActionId,
  DashboardSettings,
  DashboardWidgetId,
  FooterSettings,
  NavigationSettings,
  SeoSettings,
  SiteSettings,
  SocialLink,
  SurfaceStyle,
  ThemeAccent,
  ThemeSettings,
} from './types';
import { DASHBOARD_QUICK_ACTION_IDS, DASHBOARD_WIDGET_IDS } from './types';

type FooterLink = FooterSettings['links'][number];
type NavigationItem = NavigationSettings['items'][number];
const LEGACY_NAVIGATION_ITEM_IDS = ['home', 'about', 'projects', 'blog', 'contact'] as const;
const DEFAULT_SKILLS_NAV_ITEM: NavigationItem = {
  id: 'skills',
  label: 'Skills',
  labelAr: 'المهارات',
  href: '/skills',
  enabled: true,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

function readNonEmptyString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function readStatus(value: unknown, fallback: SiteSettings['status']) {
  return value === 'draft' || value === 'published' ? value : fallback;
}

function normalizeNavigationItem(item: unknown): NavigationItem | null {
  if (!isRecord(item)) {
    return null;
  }

  if (
    typeof item.id !== 'string' ||
    typeof item.label !== 'string' ||
    typeof item.labelAr !== 'string' ||
    typeof item.href !== 'string' ||
    item.id.length === 0 ||
    item.label.length === 0 ||
    item.labelAr.length === 0 ||
    item.href.length === 0
  ) {
    return null;
  }

  return {
    id: item.id,
    label: item.label,
    labelAr: item.labelAr,
    href: item.href,
    enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
  };
}

function ensureSkillsNavigationItem(items: NavigationItem[]): NavigationItem[] {
  if (items.some((item) => item.id === 'skills' || item.href === '/skills')) {
    return items;
  }

  const itemIds = items.map((item) => item.id);
  const isLegacyDefaultShape =
    itemIds.length === LEGACY_NAVIGATION_ITEM_IDS.length &&
    LEGACY_NAVIGATION_ITEM_IDS.every((id, index) => itemIds[index] === id);

  if (!isLegacyDefaultShape) {
    return items;
  }

  return [...items.slice(0, 3), DEFAULT_SKILLS_NAV_ITEM, ...items.slice(3)];
}

function normalizeFooterLink(item: unknown): FooterLink | null {
  if (!isRecord(item)) {
    return null;
  }

  if (
    typeof item.id !== 'string' ||
    typeof item.label !== 'string' ||
    typeof item.labelAr !== 'string' ||
    typeof item.href !== 'string' ||
    item.id.length === 0 ||
    item.label.length === 0 ||
    item.labelAr.length === 0 ||
    item.href.length === 0
  ) {
    return null;
  }

  return {
    id: item.id,
    label: item.label,
    labelAr: item.labelAr,
    href: item.href,
  };
}

function normalizeSocialLink(item: unknown): SocialLink | null {
  if (!isRecord(item)) {
    return null;
  }

  if (
    typeof item.id !== 'string' ||
    typeof item.label !== 'string' ||
    typeof item.href !== 'string' ||
    item.id.length === 0 ||
    item.label.length === 0 ||
    item.href.length === 0
  ) {
    return null;
  }

  return {
    id: item.id,
    label: item.label,
    href: item.href,
  };
}

function readAccent(value: unknown, fallback: ThemeAccent) {
  return value === 'teal' || value === 'cyan' || value === 'blue' || value === 'indigo' || value === 'rose' || value === 'amber'
    ? value
    : fallback;
}

function readSurfaceStyle(value: unknown, fallback: SurfaceStyle) {
  return value === 'glass' || value === 'solid' || value === 'outline' ? value : fallback;
}

function normalizeDashboardModule(item: unknown): DashboardModuleConfig | null {
  if (!isRecord(item) || typeof item.id !== 'string' || !isDashboardRouteModuleId(item.id as DashboardModuleConfig['id'])) {
    return null;
  }

  const id = item.id as DashboardModuleConfig['id'];
  const copy = DASHBOARD_MODULE_COPY[id];

  return {
    id,
    label: readString(item.label, copy.label),
    labelAr: readString(item.labelAr, copy.labelAr),
    enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
  };
}

function normalizeDashboardModules(value: unknown, fallback: DashboardModuleConfig[]): DashboardModuleConfig[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const seen = new Set<DashboardModuleConfig['id']>();
  const items: DashboardModuleConfig[] = [];

  for (const item of value) {
    const normalized = normalizeDashboardModule(item);
    if (!normalized || seen.has(normalized.id)) {
      continue;
    }

    seen.add(normalized.id);
    items.push(normalized);
  }

  for (const fallbackItem of fallback) {
    if (seen.has(fallbackItem.id)) {
      continue;
    }

    seen.add(fallbackItem.id);
    items.push(fallbackItem);
  }

  return items;
}

function normalizeDashboardWidgets(
  value: unknown,
  fallback: DashboardSettings['overviewWidgets'],
): DashboardSettings['overviewWidgets'] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const seen = new Set<DashboardWidgetId>();
  const items: DashboardWidgetId[] = [];

  for (const item of value) {
    if (typeof item !== 'string' || !DASHBOARD_WIDGET_IDS.includes(item as DashboardWidgetId)) {
      continue;
    }

    const widgetId = item as DashboardWidgetId;
    if (seen.has(widgetId)) {
      continue;
    }

    seen.add(widgetId);
    items.push(widgetId);
  }

  return items.length > 0 ? items : fallback;
}

function normalizeDashboardQuickActions(
  value: unknown,
  fallback: DashboardSettings['quickActions'],
): DashboardSettings['quickActions'] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const seen = new Set<DashboardQuickActionId>();
  const items: DashboardQuickActionId[] = [];

  for (const item of value) {
    if (typeof item !== 'string' || !DASHBOARD_QUICK_ACTION_IDS.includes(item as DashboardQuickActionId)) {
      continue;
    }

    const actionId = item as DashboardQuickActionId;
    if (seen.has(actionId)) {
      continue;
    }

    seen.add(actionId);
    items.push(actionId);
  }

  return items.length > 0 ? items : fallback;
}

export function normalizeSiteSettings(value: unknown): SiteSettings {
  const fallback = createDefaultSiteSettings();

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    siteName: readNonEmptyString(value.siteName, fallback.siteName),
    siteNameAr: readNonEmptyString(value.siteNameAr, fallback.siteNameAr),
    siteTagline: readString(value.siteTagline, fallback.siteTagline),
    siteTaglineAr: readString(value.siteTaglineAr, fallback.siteTaglineAr),
    logoUrl: readString(value.logoUrl, fallback.logoUrl),
    logoAssetId: readString(value.logoAssetId, fallback.logoAssetId),
    primaryCtaEnabled: readBoolean(value.primaryCtaEnabled, fallback.primaryCtaEnabled),
    primaryCtaLabel: readString(value.primaryCtaLabel, fallback.primaryCtaLabel),
    primaryCtaLabelAr: readString(value.primaryCtaLabelAr, fallback.primaryCtaLabelAr),
    primaryCtaHref: readString(value.primaryCtaHref, fallback.primaryCtaHref),
    status: readStatus(value.status, fallback.status),
  };
}

export function normalizeNavigationSettings(value: unknown): NavigationSettings {
  const fallback = {
    ...createDefaultNavigationSettings(),
    items: ensureSkillsNavigationItem(createDefaultNavigationSettings().items),
  };

  if (!isRecord(value)) {
    return fallback;
  }

  const items = Array.isArray(value.items)
    ? value.items
        .map(normalizeNavigationItem)
        .filter((item): item is NavigationItem => item !== null)
    : [];

  return {
    items: items.length > 0 ? ensureSkillsNavigationItem(items) : fallback.items,
    primaryCtaLabel: readString(value.primaryCtaLabel, fallback.primaryCtaLabel),
    primaryCtaLabelAr: readString(value.primaryCtaLabelAr, fallback.primaryCtaLabelAr),
    primaryCtaHref: readString(value.primaryCtaHref, fallback.primaryCtaHref),
    showLanguageToggle: readBoolean(value.showLanguageToggle, fallback.showLanguageToggle),
    showThemeToggle: readBoolean(value.showThemeToggle, fallback.showThemeToggle),
    status: readStatus(value.status, fallback.status),
  };
}

export function normalizeFooterSettings(value: unknown): FooterSettings {
  const fallback = createDefaultFooterSettings();

  if (!isRecord(value)) {
    return fallback;
  }

  const links = Array.isArray(value.links)
    ? value.links
        .map(normalizeFooterLink)
        .filter((item): item is FooterLink => item !== null)
    : [];
  const socialLinks = Array.isArray(value.socialLinks)
    ? value.socialLinks
        .map(normalizeSocialLink)
        .filter((item): item is SocialLink => item !== null)
    : [];

  return {
    tagline: readString(value.tagline, fallback.tagline),
    taglineAr: readString(value.taglineAr, fallback.taglineAr),
    ctaLabel: readString(value.ctaLabel, fallback.ctaLabel),
    ctaLabelAr: readString(value.ctaLabelAr, fallback.ctaLabelAr),
    ctaHref: readString(value.ctaHref, fallback.ctaHref),
    statusStrip: readString(value.statusStrip, fallback.statusStrip),
    statusStripAr: readString(value.statusStripAr, fallback.statusStripAr),
    links: links.length > 0 ? links : fallback.links,
    socialLinks,
    status: readStatus(value.status, fallback.status),
  };
}

export function normalizeSeoSettings(value: unknown): SeoSettings {
  const fallback = createDefaultSeoSettings();

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    defaultTitle: readString(value.defaultTitle, fallback.defaultTitle),
    defaultTitleAr: readString(value.defaultTitleAr, fallback.defaultTitleAr),
    defaultDescription: readString(value.defaultDescription, fallback.defaultDescription),
    defaultDescriptionAr: readString(value.defaultDescriptionAr, fallback.defaultDescriptionAr),
    ogImage: readString(value.ogImage, fallback.ogImage),
    ogImageAssetId: readString(value.ogImageAssetId, fallback.ogImageAssetId),
    siteUrl: readString(value.siteUrl, fallback.siteUrl),
    status: readStatus(value.status, fallback.status),
  };
}

export function normalizeContactSettings(value: unknown): ContactSettings {
  const fallback = createDefaultContactSettings();

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    email: readString(value.email, fallback.email),
    whatsapp: readString(value.whatsapp, fallback.whatsapp),
    location: readString(value.location, fallback.location),
    locationAr: readString(value.locationAr, fallback.locationAr),
    availabilityLabel: readString(value.availabilityLabel, fallback.availabilityLabel),
    availabilityLabelAr: readString(value.availabilityLabelAr, fallback.availabilityLabelAr),
    responseTime: readString(value.responseTime, fallback.responseTime),
    responseTimeAr: readString(value.responseTimeAr, fallback.responseTimeAr),
    status: readStatus(value.status, fallback.status),
  };
}

export function normalizeDashboardSettings(value: unknown): DashboardSettings {
  const fallback = createDefaultDashboardSettings();

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    dashboardName: readString(value.dashboardName, fallback.dashboardName),
    dashboardNameAr: readString(value.dashboardNameAr, fallback.dashboardNameAr),
    subtitle: readString(value.subtitle, fallback.subtitle),
    subtitleAr: readString(value.subtitleAr, fallback.subtitleAr),
    introTitle: readString(value.introTitle, fallback.introTitle),
    introTitleAr: readString(value.introTitleAr, fallback.introTitleAr),
    introBody: readString(value.introBody, fallback.introBody),
    introBodyAr: readString(value.introBodyAr, fallback.introBodyAr),
    iconUrl: readString(value.iconUrl, fallback.iconUrl),
    iconAssetId: readString(value.iconAssetId, fallback.iconAssetId),
    avatarUrl: readString(value.avatarUrl, fallback.avatarUrl),
    avatarAssetId: readString(value.avatarAssetId, fallback.avatarAssetId),
    sidebarModules: normalizeDashboardModules(value.sidebarModules, fallback.sidebarModules),
    overviewWidgets: normalizeDashboardWidgets(value.overviewWidgets, fallback.overviewWidgets),
    quickActions: normalizeDashboardQuickActions(value.quickActions, fallback.quickActions),
    accent: readAccent(value.accent, fallback.accent),
    surfaceStyle: readSurfaceStyle(value.surfaceStyle, fallback.surfaceStyle),
    status: readStatus(value.status, fallback.status),
  };
}

const ACCENT_TOKENS: Record<
  ThemeAccent,
  {
    light: { primary: string; hover: string; ring: string; accent: string; accentForeground: string; highlight: string };
    dark: { primary: string; hover: string; ring: string; accent: string; accentForeground: string; highlight: string };
  }
> = {
  teal: {
    light: {
      primary: '#0F766E',
      hover: '#115E59',
      ring: '#14B8A6',
      accent: '#14B8A6',
      accentForeground: '#FFFFFF',
      highlight: '#CCFBF1',
    },
    dark: {
      primary: '#2DD4BF',
      hover: '#5EEAD4',
      ring: '#2DD4BF',
      accent: '#67E8F9',
      accentForeground: '#042F2E',
      highlight: '#133A38',
    },
  },
  cyan: {
    light: {
      primary: '#0891B2',
      hover: '#0E7490',
      ring: '#06B6D4',
      accent: '#06B6D4',
      accentForeground: '#FFFFFF',
      highlight: '#CFFAFE',
    },
    dark: {
      primary: '#22D3EE',
      hover: '#67E8F9',
      ring: '#22D3EE',
      accent: '#67E8F9',
      accentForeground: '#083344',
      highlight: '#123744',
    },
  },
  blue: {
    light: {
      primary: '#2563EB',
      hover: '#1D4ED8',
      ring: '#3B82F6',
      accent: '#3B82F6',
      accentForeground: '#FFFFFF',
      highlight: '#DBEAFE',
    },
    dark: {
      primary: '#60A5FA',
      hover: '#93C5FD',
      ring: '#60A5FA',
      accent: '#93C5FD',
      accentForeground: '#172554',
      highlight: '#1D355F',
    },
  },
  indigo: {
    light: {
      primary: '#4F46E5',
      hover: '#4338CA',
      ring: '#6366F1',
      accent: '#6366F1',
      accentForeground: '#FFFFFF',
      highlight: '#E0E7FF',
    },
    dark: {
      primary: '#818CF8',
      hover: '#A5B4FC',
      ring: '#818CF8',
      accent: '#A5B4FC',
      accentForeground: '#1E1B4B',
      highlight: '#333863',
    },
  },
  rose: {
    light: {
      primary: '#E11D48',
      hover: '#BE123C',
      ring: '#F43F5E',
      accent: '#F43F5E',
      accentForeground: '#FFFFFF',
      highlight: '#FFE4E6',
    },
    dark: {
      primary: '#FB7185',
      hover: '#FDA4AF',
      ring: '#FB7185',
      accent: '#FDA4AF',
      accentForeground: '#4C0519',
      highlight: '#4A2231',
    },
  },
  amber: {
    light: {
      primary: '#D97706',
      hover: '#B45309',
      ring: '#F59E0B',
      accent: '#F59E0B',
      accentForeground: '#FFFFFF',
      highlight: '#FEF3C7',
    },
    dark: {
      primary: '#FBBF24',
      hover: '#FCD34D',
      ring: '#FBBF24',
      accent: '#FCD34D',
      accentForeground: '#451A03',
      highlight: '#473620',
    },
  },
};

const SURFACE_TOKENS = {
  light: {
    glass: {
      background: '#F7F8FC',
      card: '#FFFFFFE8',
      popover: '#FFFFFFF2',
      surface: '#FFFFFFE6',
      surface2: '#F8FAFCE6',
      surfaceOffset: '#F1F5F9',
      border: '#E2E8F0',
      input: '#E2E8F0',
      divider: '#E5E7EB',
    },
    solid: {
      background: '#F7F8FC',
      card: '#FFFFFF',
      popover: '#FFFFFF',
      surface: '#FFFFFF',
      surface2: '#F8FAFC',
      surfaceOffset: '#EEF2F7',
      border: '#D8E1EC',
      input: '#D8E1EC',
      divider: '#D8E1EC',
    },
    outline: {
      background: '#F8FAFC',
      card: '#FFFFFF',
      popover: '#FFFFFF',
      surface: '#FFFFFF',
      surface2: '#FFFFFF',
      surfaceOffset: '#F8FAFC',
      border: '#CBD5E1',
      input: '#CBD5E1',
      divider: '#CBD5E1',
    },
  },
  dark: {
    glass: {
      background: '#282C34',
      card: '#21252BF2',
      popover: '#21252BF7',
      surface: '#21252BE8',
      surface2: '#282C34E8',
      surfaceOffset: '#3E4451',
      border: '#3E4451',
      input: '#3E4451',
      divider: '#3E4451',
    },
    solid: {
      background: '#1E222A',
      card: '#20242C',
      popover: '#20242C',
      surface: '#20242C',
      surface2: '#262B33',
      surfaceOffset: '#343B45',
      border: '#3C4450',
      input: '#3C4450',
      divider: '#3C4450',
    },
    outline: {
      background: '#1B1F27',
      card: '#1F2430',
      popover: '#1F2430',
      surface: '#1F2430',
      surface2: '#252B36',
      surfaceOffset: '#303744',
      border: '#4A5564',
      input: '#4A5564',
      divider: '#4A5564',
    },
  },
} as const;

const RADIUS_TOKENS = {
  sharp: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
  rounded: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  pill: {
    sm: '12px',
    md: '14px',
    lg: '20px',
    xl: '28px',
  },
} as const;

const SHADOW_TOKENS = {
  subtle: '0 12px 32px rgba(0, 0, 0, 0.16)',
  medium: '0 16px 40px rgba(15, 23, 42, 0.14)',
  bold: '0 20px 60px rgba(15, 23, 42, 0.16)',
} as const;

const BACKGROUND_TOKENS = {
  grid: {
    patternOpacity: '0.1',
    accentOpacity: '0.1',
    codeOpacity: '0.1',
  },
  gradient: {
    patternOpacity: '0.04',
    accentOpacity: '0.16',
    codeOpacity: '0.06',
  },
  noise: {
    patternOpacity: '0.02',
    accentOpacity: '0.08',
    codeOpacity: '0.12',
  },
} as const;

export function buildPublicThemeVariables(
  rawThemeSettings: ThemeSettings,
  isDark: boolean,
): Record<string, string> {
  const themeSettings = normalizeThemeSettings(rawThemeSettings);
  const colorMode = isDark ? 'dark' : 'light';
  const accent = ACCENT_TOKENS[themeSettings.accent][colorMode];
  const surfaces = SURFACE_TOKENS[colorMode][themeSettings.surfaceStyle];
  const radii = RADIUS_TOKENS[themeSettings.radiusScale];
  const background = BACKGROUND_TOKENS[themeSettings.backgroundPreset];
  const shellShadow =
    themeSettings.shadowDensity === 'subtle'
      ? SHADOW_TOKENS.subtle
      : themeSettings.shadowDensity === 'bold'
        ? SHADOW_TOKENS.bold
        : SHADOW_TOKENS.medium;

  return {
    '--primary': accent.primary,
    '--primary-hover': accent.hover,
    '--ring': accent.ring,
    '--accent': accent.accent,
    '--accent-foreground': accent.accentForeground,
    '--primary-highlight': accent.highlight,
    '--sidebar-primary': accent.primary,
    '--sidebar-ring': accent.ring,
    '--background': surfaces.background,
    '--card': surfaces.card,
    '--popover': surfaces.popover,
    '--surface': surfaces.surface,
    '--surface2': surfaces.surface2,
    '--surface-offset': surfaces.surfaceOffset,
    '--border': surfaces.border,
    '--input': surfaces.input,
    '--divider': surfaces.divider,
    '--radius-sm': radii.sm,
    '--radius-md': radii.md,
    '--radius-lg': radii.lg,
    '--radius-xl': radii.xl,
    '--radius': radii.md,
    '--site-shell-shadow': shellShadow,
    '--site-pattern-opacity': background.patternOpacity,
    '--site-accent-opacity': background.accentOpacity,
    '--site-code-opacity': background.codeOpacity,
  };
}

export function buildDashboardThemeVariables(rawDashboardSettings: DashboardSettings): Record<string, string> {
  const dashboardSettings = normalizeDashboardSettings(rawDashboardSettings);
  const accent = ACCENT_TOKENS[dashboardSettings.accent].dark;
  const surfaces = SURFACE_TOKENS.dark[dashboardSettings.surfaceStyle];

  return {
    '--primary': accent.primary,
    '--primary-hover': accent.hover,
    '--ring': accent.ring,
    '--accent': accent.accent,
    '--accent-foreground': accent.accentForeground,
    '--background': surfaces.background,
    '--card': surfaces.card,
    '--popover': surfaces.popover,
    '--surface': surfaces.surface,
    '--surface2': surfaces.surface2,
    '--surface-offset': surfaces.surfaceOffset,
    '--border': surfaces.border,
    '--input': surfaces.input,
    '--divider': surfaces.divider,
    '--dashboard-accent': accent.accent,
    '--dashboard-accent-strong': accent.primary,
    '--dashboard-accent-foreground': accent.accentForeground,
    '--dashboard-background': surfaces.background,
    '--dashboard-panel': surfaces.card,
    '--dashboard-header': surfaces.popover,
    '--dashboard-surface': surfaces.surface,
    '--dashboard-surface-alt': surfaces.surface2,
    '--dashboard-muted': surfaces.surfaceOffset,
    '--dashboard-border': surfaces.border,
    '--dashboard-input': surfaces.input,
    '--dashboard-divider': surfaces.divider,
    '--dashboard-foreground': '#F8FAFC',
    '--dashboard-muted-foreground': '#94A3B8',
    '--dashboard-shell-shadow': '0 20px 60px rgba(2, 6, 23, 0.42)',
  };
}

export function buildPublicThemeStyle(rawThemeSettings: ThemeSettings, isDark: boolean): CSSProperties {
  return buildPublicThemeVariables(rawThemeSettings, isDark) as CSSProperties;
}

export function buildDashboardThemeStyle(rawDashboardSettings: DashboardSettings): CSSProperties {
  return buildDashboardThemeVariables(rawDashboardSettings) as CSSProperties;
}

export { normalizeThemeSettings };
