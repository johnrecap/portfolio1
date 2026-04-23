import assert from 'node:assert/strict';
import test from 'node:test';

import type { DashboardSettings } from './types';
import {
  buildPublicThemeVariables,
  normalizeContactSettings,
  normalizeFooterSettings,
  normalizeNavigationSettings,
  normalizeSeoSettings,
  normalizeSiteSettings,
} from './settings';

test('normalizeSiteSettings merges incoming values over the default site settings', () => {
  const result = normalizeSiteSettings({
    siteName: 'Portfolio One',
    siteNameAr: 'بورتفوليو ون',
    logoAssetId: 'brand-mark',
    primaryCtaEnabled: false,
  });

  assert.equal(result.siteName, 'Portfolio One');
  assert.equal(result.siteNameAr, 'بورتفوليو ون');
  assert.equal(result.logoAssetId, 'brand-mark');
  assert.equal(result.primaryCtaEnabled, false);
  assert.equal(result.status, 'published');
});

test('normalizeSiteSettings falls back when site name fields are present but empty', () => {
  const result = normalizeSiteSettings({
    siteName: '',
    siteNameAr: '   ',
  });

  assert.equal(result.siteName, 'Mohamed Studio');
  assert.equal(result.siteNameAr, 'محمد ستوديو');
});

test('normalizeNavigationSettings keeps only valid items and falls back to defaults when needed', () => {
  const result = normalizeNavigationSettings({
    items: [
      { id: 'home', label: 'Home', labelAr: 'الرئيسية', href: '/', enabled: true },
      { id: '', href: '/broken' },
    ],
    showThemeToggle: false,
  });

  assert.deepEqual(result.items.map((item) => item.id), ['home']);
  assert.equal(result.showThemeToggle, false);

  const fallback = normalizeNavigationSettings({ items: [] });
  assert.equal(fallback.items.length > 0, true);
});

test('normalizeNavigationSettings backfills skills into the legacy default navigation shape', () => {
  const result = normalizeNavigationSettings({
    items: [
      { id: 'home', label: 'Home', labelAr: 'الرئيسية', href: '/', enabled: true },
      { id: 'about', label: 'About', labelAr: 'نبذة', href: '/about', enabled: true },
      { id: 'projects', label: 'Projects', labelAr: 'المشروعات', href: '/projects', enabled: true },
      { id: 'blog', label: 'Blog', labelAr: 'المدونة', href: '/blog', enabled: true },
      { id: 'contact', label: 'Contact', labelAr: 'تواصل', href: '/contact', enabled: true },
    ],
  });

  assert.deepEqual(
    result.items.map((item) => item.id),
    ['home', 'about', 'projects', 'skills', 'blog', 'contact'],
  );
  assert.equal(result.items[3]?.href, '/skills');
});

test('normalizeFooterSettings keeps valid links and social links only', () => {
  const result = normalizeFooterSettings({
    tagline: 'Built carefully.',
    taglineAr: 'مبني بعناية.',
    links: [
      { id: 'projects', label: 'Projects', labelAr: 'المشروعات', href: '/projects' },
      { id: '' },
    ],
    socialLinks: [
      { id: 'github', label: 'GitHub', href: 'https://github.com/example' },
      { href: '' },
    ],
  });

  assert.deepEqual(result.links.map((item) => item.id), ['projects']);
  assert.deepEqual(result.socialLinks.map((item) => item.id), ['github']);
  assert.equal(result.status, 'published');
});

test('normalizeSeoSettings falls back safely for missing values', () => {
  const result = normalizeSeoSettings({
    defaultTitle: 'Portfolio',
    defaultTitleAr: 'بورتفوليو',
  });

  assert.equal(result.defaultTitle, 'Portfolio');
  assert.equal(result.defaultTitleAr, 'بورتفوليو');
  assert.equal(result.defaultDescription.length > 0, true);
  assert.equal(result.status, 'published');
});

test('normalizeSeoSettings preserves the configured Open Graph asset ID', () => {
  const result = normalizeSeoSettings({
    ogImageAssetId: 'social-preview',
  });

  assert.equal(result.ogImageAssetId, 'social-preview');
});

test('normalizeContactSettings preserves valid contact fields', () => {
  const result = normalizeContactSettings({
    email: 'hello@example.com',
    whatsapp: '+20123456789',
    availabilityLabel: 'Available now',
    availabilityLabelAr: 'متاح الآن',
    responseTime: 'Within 24 hours',
    responseTimeAr: 'خلال 24 ساعة',
  });

  assert.equal(result.email, 'hello@example.com');
  assert.equal(result.whatsapp, '+20123456789');
  assert.equal(result.status, 'published');
});

test('normalizeDashboardSettings keeps valid dashboard modules, widgets, and quick actions only', async () => {
  const module = (await import('./settings')) as Record<string, unknown>;
  const normalizeDashboardSettings = module.normalizeDashboardSettings as
    | ((value: unknown) => DashboardSettings)
    | undefined;

  assert.equal(typeof normalizeDashboardSettings, 'function');

  const result = normalizeDashboardSettings?.({
    dashboardName: 'Studio Console',
    introTitle: 'Run the workspace',
    sidebarModules: [
      { id: 'messages', label: 'Inbox', labelAr: 'الوارد', enabled: false },
      { id: 'projects', label: 'Projects Lab', labelAr: 'مختبر المشاريع', enabled: true },
      { id: 'messages', label: 'Duplicate', labelAr: 'مكرر', enabled: true },
      { id: 'unknown', label: 'Broken', labelAr: 'معطل', enabled: true },
    ],
    overviewWidgets: ['unreadMessages', 'workspaceSnapshot', 'unknown', 'unreadMessages'],
    quickActions: ['messages', 'blog', 'invalid', 'blog'],
    accent: 'rose',
    surfaceStyle: 'solid',
  });

  assert.ok(result);
  assert.equal(result.dashboardName, 'Studio Console');
  assert.equal(result.introTitle, 'Run the workspace');
  assert.deepEqual(result.sidebarModules.slice(0, 2).map((item) => item.id), ['messages', 'projects']);
  assert.equal(result.sidebarModules.find((item) => item.id === 'messages')?.enabled, false);
  assert.equal(result.sidebarModules.some((item) => item.id === 'site'), true);
  assert.deepEqual(result.overviewWidgets, ['unreadMessages', 'workspaceSnapshot']);
  assert.deepEqual(result.quickActions, ['messages', 'blog']);
  assert.equal(result.accent, 'rose');
  assert.equal(result.surfaceStyle, 'solid');
});

test('normalizeDashboardSettings falls back to the default overview widgets and quick actions', async () => {
  const module = (await import('./settings')) as Record<string, unknown>;
  const normalizeDashboardSettings = module.normalizeDashboardSettings as
    | ((value: unknown) => DashboardSettings)
    | undefined;

  assert.equal(typeof normalizeDashboardSettings, 'function');

  const result = normalizeDashboardSettings?.({
    quickActions: [],
    overviewWidgets: ['unknown'],
  });

  assert.ok(result);
  assert.deepEqual(result.overviewWidgets, [
    'totalProjects',
    'featuredProjects',
    'blogPosts',
    'unreadMessages',
    'recentActivity',
    'workspaceSnapshot',
  ]);
  assert.deepEqual(result.quickActions, ['messages', 'projects', 'blog']);
});

test('buildDashboardThemeVariables exposes dashboard accent and surface tokens', async () => {
  const module = (await import('./settings')) as Record<string, unknown>;
  const buildDashboardThemeVariables = module.buildDashboardThemeVariables as
    | ((value: DashboardSettings) => Record<string, string>)
    | undefined;

  assert.equal(typeof buildDashboardThemeVariables, 'function');

  const variables = buildDashboardThemeVariables?.({
    dashboardName: 'Studio Console',
    dashboardNameAr: 'لوحة الاستوديو',
    subtitle: '',
    subtitleAr: '',
    introTitle: '',
    introTitleAr: '',
    introBody: '',
    introBodyAr: '',
    iconUrl: '',
    iconAssetId: '',
    avatarUrl: '',
    avatarAssetId: '',
    sidebarModules: [],
    overviewWidgets: ['totalProjects'],
    quickActions: ['messages'],
    accent: 'cyan',
    surfaceStyle: 'outline',
    status: 'published',
  });

  assert.ok(variables);
  assert.equal(variables['--dashboard-accent'], '#67E8F9');
  assert.equal(variables['--dashboard-surface'], '#1F2430');
  assert.equal(variables['--dashboard-border'], '#4A5564');
});

test('buildPublicThemeVariables returns token overrides for light and dark shells', () => {
  const light = buildPublicThemeVariables(
    {
      mode: 'system',
      accent: 'rose',
      surfaceStyle: 'solid',
      radiusScale: 'pill',
      shadowDensity: 'bold',
      backgroundPreset: 'noise',
      dashboardAccent: 'teal',
      dashboardSurfaceStyle: 'glass',
    },
    false,
  );

  assert.equal(light['--primary'], '#E11D48');
  assert.equal(light['--radius-lg'], '20px');
  assert.equal(light['--site-shell-shadow'], '0 20px 60px rgba(15, 23, 42, 0.16)');

  const dark = buildPublicThemeVariables(
    {
      mode: 'system',
      accent: 'teal',
      surfaceStyle: 'glass',
      radiusScale: 'rounded',
      shadowDensity: 'subtle',
      backgroundPreset: 'grid',
      dashboardAccent: 'teal',
      dashboardSurfaceStyle: 'glass',
    },
    true,
  );

  assert.equal(dark['--primary'], '#2DD4BF');
  assert.equal(dark['--card'], '#21252BF2');
  assert.equal(dark['--site-shell-shadow'], '0 12px 32px rgba(0, 0, 0, 0.16)');
});
