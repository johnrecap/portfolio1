import {
  BACKGROUND_PRESETS,
  PAGE_SECTION_TYPES,
  PAGE_SECTION_VARIANTS,
  PUBLISH_STATUSES,
  RADIUS_SCALES,
  STYLE_PRESETS,
  SURFACE_STYLES,
  THEME_ACCENTS,
  THEME_MODES,
  type AdminPageConfig,
  type AdminPageSection,
  type ContactSettings,
  type DashboardSettings,
  type FooterSettings,
  type MediaAssetRecord,
  type NavigationSettings,
  type PageSectionType,
  type PageSectionVariant,
  type PlatformPageId,
  type ProfileSettings,
  type SeoSettings,
  type SiteSettings,
  type StylePreset,
  type TestimonialRecord,
  type ThemeSettings,
} from './types';
import { DASHBOARD_MODULE_COPY, DASHBOARD_ROUTE_MODULE_IDS } from './dashboard-config';

const DEFAULT_PAGE_SECTIONS: Record<PlatformPageId, AdminPageSection[]> = {
  home: [
    createSection('hero-1', 'hero', 1, 'split'),
    createSection('showcase-1', 'showcase', 2, 'grid'),
    createSection('featured-projects-1', 'featuredProjects', 3, 'spotlight'),
    createSection('testimonials-1', 'testimonials', 4, 'card'),
    createSection('cta-1', 'cta', 5, 'banner'),
  ],
  about: [
    createSection('about-intro-1', 'aboutIntro', 1, 'split'),
    createSection('strengths-1', 'strengths', 2, 'grid'),
    createSection('editor-card-1', 'editorCard', 3, 'editor'),
    createSection('cta-1', 'cta', 4, 'card'),
  ],
  projects: [
    createSection('projects-hero-1', 'projectsHero', 1, 'centered'),
    createSection('projects-listing-1', 'projectsListing', 2, 'grid'),
    createSection('cta-1', 'cta', 3, 'terminal-strip'),
  ],
  blog: [
    createSection('blog-hero-1', 'blogHero', 1, 'centered'),
    createSection('blog-listing-1', 'blogListing', 2, 'grid'),
    createSection('cta-1', 'cta', 3, 'card'),
  ],
  contact: [
    createSection('contact-intro-1', 'contactIntro', 1, 'split'),
    createSection('contact-methods-1', 'contactMethods', 2, 'grid'),
    createSection('contact-form-1', 'contactForm', 3, 'default'),
    createSection('availability-1', 'availability', 4, 'card'),
  ],
};

const DEFAULT_PAGE_METADATA: Record<
  PlatformPageId,
  { title: string; titleAr: string; description: string; descriptionAr: string }
> = {
  home: {
    title: 'Websites and Dashboards',
    titleAr: 'مواقع ولوحات تحكم',
    description:
      'Public websites, dashboards, and internal tools for small teams and founders who need clear structure and practical delivery.',
    descriptionAr:
      'مواقع عامة، ولوحات إدارة، وأدوات داخلية لفرق صغيرة وأصحاب مشاريع يحتاجون إلى هيكل واضح وتنفيذ عملي.',
  },
  about: {
    title: 'About',
    titleAr: 'نبذة',
    description:
      'How Mohamed Saied approaches public websites, dashboards, and the internal systems behind them.',
    descriptionAr:
      'كيف يتعامل محمد سعيد مع المواقع العامة، ولوحات الإدارة، والأنظمة الداخلية التي تدعمها.',
  },
  projects: {
    title: 'Selected Work',
    titleAr: 'أعمال مختارة',
    description: 'Selected client work across public websites, dashboards, and practical product workflows.',
    descriptionAr: 'أعمال مختارة عبر مواقع عامة، ولوحات إدارة، وتدفقات منتج عملية.',
  },
  blog: {
    title: 'Notes',
    titleAr: 'ملاحظات',
    description:
      'Notes on product work, web systems, and the decisions behind public websites and internal tools.',
    descriptionAr:
      'ملاحظات عن العمل على المنتجات، وأنظمة الويب، والقرارات خلف المواقع العامة والأدوات الداخلية.',
  },
  contact: {
    title: 'Contact',
    titleAr: 'تواصل',
    description:
      'Share the project context, the current stage, and where you need help to start a practical conversation.',
    descriptionAr:
      'شارك سياق المشروع، والمرحلة الحالية، والجزء الذي تحتاج فيه إلى المساعدة لبدء محادثة عملية.',
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOneOf<T extends readonly string[]>(value: unknown, values: T): value is T[number] {
  return typeof value === 'string' && values.includes(value as T[number]);
}

function createSection(
  id: string,
  type: PageSectionType,
  order: number,
  variant: PageSectionVariant,
  stylePreset: StylePreset = 'default',
): AdminPageSection {
  return {
    id,
    type,
    order,
    enabled: true,
    variant,
    content: {},
    stylePreset,
    visibilityRules: null,
  };
}

function cloneSections(pageId: PlatformPageId) {
  return DEFAULT_PAGE_SECTIONS[pageId].map((section) => ({
    ...section,
    content: { ...section.content },
    visibilityRules: section.visibilityRules ? { ...section.visibilityRules } : null,
  }));
}

export function createDefaultProfileSettings(): ProfileSettings {
  return {
    displayName: 'Mohamed Saied',
    displayNameAr: 'محمد سعيد',
    title: 'Product Engineer',
    titleAr: 'مهندس منتجات رقمية',
    bio: 'I build public websites, dashboards, and internal tools for teams that need clear structure and practical day-to-day use.',
    bioAr: 'أبني مواقع عامة، ولوحات إدارة، وأدوات داخلية لفرق تحتاج إلى هيكل واضح واستخدام عملي يمكن الاعتماد عليه يوميًا.',
    isAvailable: true,
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    metaTitle: 'Mohamed Studio | Mohamed Saied',
    metaTitleAr: 'محمد ستوديو | محمد سعيد',
    metaDescription:
      'Mohamed Saied builds public websites, dashboards, and internal tools for small teams and founders who need clear structure, practical delivery, and bilingual support.',
    metaDescriptionAr:
      'يبني محمد سعيد مواقع عامة، ولوحات إدارة، وأدوات داخلية لفرق صغيرة وأصحاب مشاريع يحتاجون إلى هيكل واضح، وتنفيذ عملي، ودعم ثنائي اللغة.',
    profileImage: '',
    profileImageAssetId: '',
    heroImage: '',
    heroImageAssetId: '',
  };
}

export function createDefaultSiteSettings(): SiteSettings {
  return {
    siteName: 'Mohamed Studio',
    siteNameAr: 'محمد ستوديو',
    siteTagline: 'I build public-facing websites, dashboards, and internal tools with the same focus on clarity and day-to-day usability.',
    siteTaglineAr: 'أبني مواقع عامة، ولوحات إدارة، وأدوات داخلية مع اهتمام واضح بسهولة الاستخدام وسهولة التطوير لاحقًا.',
    logoUrl: '',
    logoAssetId: '',
    primaryCtaEnabled: true,
    primaryCtaLabel: 'Start a Conversation',
    primaryCtaLabelAr: 'ابدأ محادثة',
    primaryCtaHref: '/contact',
    status: 'published',
  };
}

export function createDefaultThemeSettings(): ThemeSettings {
  return {
    mode: 'system',
    accent: 'teal',
    surfaceStyle: 'glass',
    radiusScale: 'rounded',
    shadowDensity: 'medium',
    backgroundPreset: 'grid',
    dashboardAccent: 'teal',
    dashboardSurfaceStyle: 'glass',
  };
}

export function createDefaultNavigationSettings(): NavigationSettings {
  return {
    items: [
      { id: 'home', label: 'Home', labelAr: 'الرئيسية', href: '/', enabled: true },
      { id: 'about', label: 'About', labelAr: 'نبذة', href: '/about', enabled: true },
      { id: 'projects', label: 'Projects', labelAr: 'المشروعات', href: '/projects', enabled: true },
      { id: 'blog', label: 'Blog', labelAr: 'المدونة', href: '/blog', enabled: true },
      { id: 'contact', label: 'Contact', labelAr: 'تواصل', href: '/contact', enabled: true },
    ],
    primaryCtaLabel: 'Contact',
    primaryCtaLabelAr: 'تواصل معي',
    primaryCtaHref: '/contact',
    showLanguageToggle: true,
    showThemeToggle: true,
    status: 'published',
  };
}

export function createDefaultFooterSettings(): FooterSettings {
  return {
    tagline: '',
    taglineAr: '',
    ctaLabel: 'Start a Conversation',
    ctaLabelAr: 'ابدأ محادثة',
    ctaHref: '/contact',
    statusStrip: 'Open to a small number of client projects',
    statusStripAr: 'متاح لعدد محدود من مشاريع العملاء',
    links: [],
    socialLinks: [],
    status: 'published',
  };
}

export function createDefaultSeoSettings(): SeoSettings {
  return {
    defaultTitle: 'Mohamed Studio | Mohamed Saied',
    defaultTitleAr: 'محمد ستوديو | محمد سعيد',
    defaultDescription:
      'Public websites, dashboards, and internal tools built by Mohamed Saied with a focus on clarity, practical delivery, and bilingual support.',
    defaultDescriptionAr:
      'مواقع عامة، ولوحات إدارة، وأدوات داخلية يبنيها محمد سعيد مع تركيز على الوضوح، والتنفيذ العملي، ودعم العربية والإنجليزية.',
    ogImage: '',
    ogImageAssetId: '',
    siteUrl: '',
    status: 'published',
  };
}

export function createDefaultDashboardSettings(): DashboardSettings {
  return {
    dashboardName: 'Mohamed Studio Console',
    dashboardNameAr: 'وحدة تحكم محمد ستوديو',
    subtitle: 'Manage the public site, content, and brand system from one workspace.',
    subtitleAr: 'أدِر الموقع العام، والمحتوى، ونظام الهوية من مساحة عمل واحدة.',
    introTitle: 'Studio pulse',
    introTitleAr: 'نبض الاستوديو',
    introBody: 'Start from the overview, then jump into the highest-priority module with one click.',
    introBodyAr: 'ابدأ من النظرة العامة ثم انتقل مباشرة إلى الوحدة ذات الأولوية الأعلى.',
    iconUrl: '',
    iconAssetId: '',
    avatarUrl: '',
    avatarAssetId: '',
    sidebarModules: DASHBOARD_ROUTE_MODULE_IDS.map((id) => ({
      id,
      label: DASHBOARD_MODULE_COPY[id].label,
      labelAr: DASHBOARD_MODULE_COPY[id].labelAr,
      enabled: true,
    })),
    overviewWidgets: [
      'totalProjects',
      'featuredProjects',
      'blogPosts',
      'unreadMessages',
      'recentActivity',
      'workspaceSnapshot',
    ],
    quickActions: ['messages', 'projects', 'blog'],
    accent: 'teal',
    surfaceStyle: 'glass',
    status: 'published',
  };
}

export function createDefaultContactSettings(): ContactSettings {
  return {
    email: '',
    whatsapp: '',
    location: '',
    locationAr: '',
    availabilityLabel: 'I am most useful on projects that need a clear public experience and the systems behind it to work well too.',
    availabilityLabelAr: 'أكون الأنسب للمشاريع التي تحتاج واجهة عامة واضحة، مع نظام خلفي يسهل العمل عليه أيضًا.',
    responseTime: 'Usually 1-2 business days',
    responseTimeAr: 'غالبًا خلال يوم إلى يومي عمل',
    status: 'published',
  };
}

export function createDefaultPageConfig(pageId: PlatformPageId): AdminPageConfig {
  const metadata = DEFAULT_PAGE_METADATA[pageId];

  return {
    pageId,
    title: metadata.title,
    titleAr: metadata.titleAr,
    slug: pageId === 'home' ? '/' : `/${pageId}`,
    status: 'draft',
    seo: {
      description: metadata.description,
      descriptionAr: metadata.descriptionAr,
    },
    sections: cloneSections(pageId),
  };
}

export function createDefaultTestimonial(): TestimonialRecord {
  return {
    name: '',
    nameAr: '',
    role: '',
    roleAr: '',
    company: '',
    companyAr: '',
    quote: '',
    quoteAr: '',
    outcome: '',
    outcomeAr: '',
    avatarUrl: '',
    avatarAssetId: '',
    logoUrl: '',
    logoAssetId: '',
    visible: true,
    featured: false,
    order: 0,
  };
}

export function createDefaultMediaAsset(): MediaAssetRecord {
  return {
    title: '',
    titleAr: '',
    alt: '',
    altAr: '',
    url: '',
    kind: 'image',
    group: 'general',
  };
}

export function normalizePageConfig(pageId: PlatformPageId, value: unknown): AdminPageConfig {
  const fallback = createDefaultPageConfig(pageId);

  if (!isRecord(value)) {
    return fallback;
  }

  const sections = Array.isArray(value.sections)
    ? value.sections
        .filter((section): section is Record<string, unknown> => isRecord(section))
        .map((section, index) => {
          const type = isOneOf(section.type, PAGE_SECTION_TYPES) ? section.type : fallback.sections[index]?.type;
          const variant = isOneOf(section.variant, PAGE_SECTION_VARIANTS)
            ? section.variant
            : fallback.sections[index]?.variant ?? 'default';
          const stylePreset = isOneOf(section.stylePreset, STYLE_PRESETS) ? section.stylePreset : 'default';

          if (!type) {
            return null;
          }

          return {
            id: typeof section.id === 'string' && section.id.length > 0 ? section.id : `${type}-${index + 1}`,
            type,
            order: typeof section.order === 'number' ? section.order : index + 1,
            enabled: typeof section.enabled === 'boolean' ? section.enabled : true,
            variant,
            content: isRecord(section.content) ? section.content : {},
            stylePreset,
            visibilityRules: isRecord(section.visibilityRules) ? section.visibilityRules : null,
          };
        })
        .filter((section): section is AdminPageSection => section !== null)
        .sort((left, right) => left.order - right.order)
    : fallback.sections;

  return {
    pageId,
    title: typeof value.title === 'string' ? value.title : fallback.title,
    titleAr: typeof value.titleAr === 'string' ? value.titleAr : fallback.titleAr,
    slug: typeof value.slug === 'string' ? value.slug : fallback.slug,
    status: isOneOf(value.status, PUBLISH_STATUSES) ? value.status : fallback.status,
    seo: isRecord(value.seo) ? value.seo : fallback.seo,
    sections: sections.length > 0 ? sections : fallback.sections,
  };
}

export function normalizeThemeSettings(value: unknown): ThemeSettings {
  const fallback = createDefaultThemeSettings();

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    mode: isOneOf(value.mode, THEME_MODES) ? value.mode : fallback.mode,
    accent: isOneOf(value.accent, THEME_ACCENTS) ? value.accent : fallback.accent,
    surfaceStyle: isOneOf(value.surfaceStyle, SURFACE_STYLES) ? value.surfaceStyle : fallback.surfaceStyle,
    radiusScale: isOneOf(value.radiusScale, RADIUS_SCALES) ? value.radiusScale : fallback.radiusScale,
    shadowDensity:
      typeof value.shadowDensity === 'string' && ['subtle', 'medium', 'bold'].includes(value.shadowDensity)
        ? (value.shadowDensity as ThemeSettings['shadowDensity'])
        : fallback.shadowDensity,
    backgroundPreset: isOneOf(value.backgroundPreset, BACKGROUND_PRESETS)
      ? value.backgroundPreset
      : fallback.backgroundPreset,
    dashboardAccent: isOneOf(value.dashboardAccent, THEME_ACCENTS)
      ? value.dashboardAccent
      : fallback.dashboardAccent,
    dashboardSurfaceStyle: isOneOf(value.dashboardSurfaceStyle, SURFACE_STYLES)
      ? value.dashboardSurfaceStyle
      : fallback.dashboardSurfaceStyle,
  };
}
