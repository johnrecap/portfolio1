export const PLATFORM_SETTING_DOC_IDS = [
  'profile',
  'site',
  'theme',
  'navigation',
  'footer',
  'seo',
  'dashboard',
  'contact',
] as const;

export const PLATFORM_PAGE_IDS = ['home', 'about', 'projects', 'blog', 'contact'] as const;

export const DASHBOARD_MODULE_IDS = [
  'overview',
  'site',
  'theme',
  'navigation',
  'footer',
  'seo',
  'contact',
  'pages',
  'projects',
  'skills',
  'blog',
  'testimonials',
  'media',
  'messages',
  'dashboardSettings',
  'adminAccess',
] as const;

export const DASHBOARD_WIDGET_IDS = [
  'totalProjects',
  'featuredProjects',
  'blogPosts',
  'unreadMessages',
  'recentActivity',
  'workspaceSnapshot',
] as const;

export const DASHBOARD_QUICK_ACTION_IDS = [
  'site',
  'theme',
  'navigation',
  'footer',
  'seo',
  'contact',
  'pages',
  'projects',
  'skills',
  'blog',
  'testimonials',
  'media',
  'messages',
  'dashboardSettings',
] as const;

export const PAGE_SECTION_TYPES = [
  'hero',
  'showcase',
  'featuredProjects',
  'testimonials',
  'cta',
  'aboutIntro',
  'strengths',
  'editorCard',
  'contactIntro',
  'contactMethods',
  'contactForm',
  'availability',
  'projectsHero',
  'projectsListing',
  'blogHero',
  'blogListing',
] as const;

export const PAGE_SECTION_VARIANTS = [
  'default',
  'split',
  'centered',
  'editor',
  'minimal',
  'grid',
  'spotlight',
  'carousel',
  'banner',
  'card',
  'terminal-strip',
] as const;

export const STYLE_PRESETS = ['default', 'muted', 'emphasis', 'contrast'] as const;
export const PUBLISH_STATUSES = ['draft', 'published'] as const;
export const THEME_MODES = ['light', 'dark', 'system'] as const;
export const THEME_ACCENTS = ['teal', 'cyan', 'blue', 'indigo', 'rose', 'amber'] as const;
export const SURFACE_STYLES = ['glass', 'solid', 'outline'] as const;
export const RADIUS_SCALES = ['sharp', 'rounded', 'pill'] as const;
export const SHADOW_DENSITIES = ['subtle', 'medium', 'bold'] as const;
export const BACKGROUND_PRESETS = ['grid', 'gradient', 'noise'] as const;
export const MEDIA_KINDS = ['image', 'video'] as const;

export type PlatformSettingDocId = (typeof PLATFORM_SETTING_DOC_IDS)[number];
export type PlatformPageId = (typeof PLATFORM_PAGE_IDS)[number];
export type DashboardModuleId = (typeof DASHBOARD_MODULE_IDS)[number];
export type DashboardWidgetId = (typeof DASHBOARD_WIDGET_IDS)[number];
export type DashboardQuickActionId = (typeof DASHBOARD_QUICK_ACTION_IDS)[number];
export type PageSectionType = (typeof PAGE_SECTION_TYPES)[number];
export type PageSectionVariant = (typeof PAGE_SECTION_VARIANTS)[number];
export type StylePreset = (typeof STYLE_PRESETS)[number];
export type PublishStatus = (typeof PUBLISH_STATUSES)[number];
export type ThemeMode = (typeof THEME_MODES)[number];
export type ThemeAccent = (typeof THEME_ACCENTS)[number];
export type SurfaceStyle = (typeof SURFACE_STYLES)[number];
export type RadiusScale = (typeof RADIUS_SCALES)[number];
export type ShadowDensity = (typeof SHADOW_DENSITIES)[number];
export type BackgroundPreset = (typeof BACKGROUND_PRESETS)[number];
export type MediaKind = (typeof MEDIA_KINDS)[number];

export interface ProfileSettings {
  displayName: string;
  displayNameAr: string;
  title: string;
  titleAr: string;
  bio: string;
  bioAr: string;
  isAvailable: boolean;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  metaTitle: string;
  metaTitleAr: string;
  metaDescription: string;
  metaDescriptionAr: string;
  profileImage: string;
  profileImageAssetId: string;
  heroImage: string;
  heroImageAssetId: string;
}

export interface SiteSettings {
  siteName: string;
  siteNameAr: string;
  siteTagline: string;
  siteTaglineAr: string;
  logoUrl: string;
  logoAssetId: string;
  primaryCtaEnabled: boolean;
  primaryCtaLabel: string;
  primaryCtaLabelAr: string;
  primaryCtaHref: string;
  status: PublishStatus;
}

export interface ThemeSettings {
  mode: ThemeMode;
  accent: ThemeAccent;
  surfaceStyle: SurfaceStyle;
  radiusScale: RadiusScale;
  shadowDensity: ShadowDensity;
  backgroundPreset: BackgroundPreset;
  dashboardAccent: ThemeAccent;
  dashboardSurfaceStyle: SurfaceStyle;
}

export interface NavigationItem {
  id: string;
  label: string;
  labelAr: string;
  href: string;
  enabled: boolean;
}

export interface NavigationSettings {
  items: NavigationItem[];
  primaryCtaLabel: string;
  primaryCtaLabelAr: string;
  primaryCtaHref: string;
  showLanguageToggle: boolean;
  showThemeToggle: boolean;
  status: PublishStatus;
}

export interface FooterLink {
  id: string;
  label: string;
  labelAr: string;
  href: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterSettings {
  tagline: string;
  taglineAr: string;
  ctaLabel: string;
  ctaLabelAr: string;
  ctaHref: string;
  statusStrip: string;
  statusStripAr: string;
  links: FooterLink[];
  socialLinks: SocialLink[];
  status: PublishStatus;
}

export interface SeoSettings {
  defaultTitle: string;
  defaultTitleAr: string;
  defaultDescription: string;
  defaultDescriptionAr: string;
  ogImage: string;
  ogImageAssetId: string;
  siteUrl: string;
  status: PublishStatus;
}

export interface DashboardModuleConfig {
  id: DashboardModuleId;
  label: string;
  labelAr: string;
  enabled: boolean;
}

export interface DashboardSettings {
  dashboardName: string;
  dashboardNameAr: string;
  subtitle: string;
  subtitleAr: string;
  introTitle: string;
  introTitleAr: string;
  introBody: string;
  introBodyAr: string;
  iconUrl: string;
  iconAssetId: string;
  avatarUrl: string;
  avatarAssetId: string;
  sidebarModules: DashboardModuleConfig[];
  overviewWidgets: DashboardWidgetId[];
  quickActions: DashboardQuickActionId[];
  accent: ThemeAccent;
  surfaceStyle: SurfaceStyle;
  status: PublishStatus;
}

export interface ContactSettings {
  email: string;
  whatsapp: string;
  location: string;
  locationAr: string;
  availabilityLabel: string;
  availabilityLabelAr: string;
  responseTime: string;
  responseTimeAr: string;
  status: PublishStatus;
}

export interface PageSeoOverrides {
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  imageAssetId?: string;
}

export interface AdminPageSection {
  id: string;
  type: PageSectionType;
  order: number;
  enabled: boolean;
  variant: PageSectionVariant;
  content: Record<string, unknown>;
  stylePreset: StylePreset;
  visibilityRules: Record<string, unknown> | null;
}

export interface AdminPageConfig {
  pageId: PlatformPageId;
  title: string;
  titleAr: string;
  slug: string;
  status: PublishStatus;
  seo: PageSeoOverrides;
  sections: AdminPageSection[];
}

export interface TestimonialRecord {
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  company: string;
  companyAr: string;
  quote: string;
  quoteAr: string;
  outcome: string;
  outcomeAr: string;
  avatarUrl: string;
  avatarAssetId: string;
  logoUrl: string;
  logoAssetId: string;
  visible: boolean;
  featured: boolean;
  order: number;
}

export interface MediaAssetRecord {
  title: string;
  titleAr: string;
  alt: string;
  altAr: string;
  url: string;
  kind: MediaKind;
  group: string;
  tags?: string[];
}
