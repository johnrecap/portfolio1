import type {
  DashboardModuleId,
  DashboardQuickActionId,
  DashboardWidgetId,
} from './types';

export const DASHBOARD_ROUTE_MODULE_IDS = [
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
] as const;

export type DashboardRouteModuleId = (typeof DASHBOARD_ROUTE_MODULE_IDS)[number];

export const DASHBOARD_ROUTE_PATHS: Record<DashboardRouteModuleId, string> = {
  overview: '/dashboard',
  site: '/dashboard/site',
  theme: '/dashboard/theme',
  navigation: '/dashboard/navigation',
  footer: '/dashboard/footer',
  seo: '/dashboard/seo',
  contact: '/dashboard/contact',
  pages: '/dashboard/pages',
  projects: '/dashboard/projects',
  skills: '/dashboard/skills',
  blog: '/dashboard/blog',
  testimonials: '/dashboard/testimonials',
  media: '/dashboard/media',
  messages: '/dashboard/messages',
  dashboardSettings: '/dashboard/dashboard-settings',
};

export const DASHBOARD_MODULE_COPY: Record<DashboardModuleId, { label: string; labelAr: string }> = {
  overview: { label: 'Overview', labelAr: 'نظرة عامة' },
  site: { label: 'Site', labelAr: 'الموقع' },
  theme: { label: 'Theme', labelAr: 'الهوية البصرية' },
  navigation: { label: 'Navigation', labelAr: 'التنقل' },
  footer: { label: 'Footer', labelAr: 'التذييل' },
  seo: { label: 'SEO', labelAr: 'SEO' },
  contact: { label: 'Contact', labelAr: 'التواصل' },
  pages: { label: 'Pages', labelAr: 'الصفحات' },
  projects: { label: 'Projects', labelAr: 'المشاريع' },
  skills: { label: 'Skills', labelAr: 'المهارات' },
  blog: { label: 'Blog', labelAr: 'المدونة' },
  testimonials: { label: 'Testimonials', labelAr: 'التوصيات' },
  media: { label: 'Media Library', labelAr: 'مكتبة الوسائط' },
  messages: { label: 'Messages', labelAr: 'الرسائل' },
  dashboardSettings: { label: 'Dashboard Settings', labelAr: 'إعدادات اللوحة' },
  adminAccess: { label: 'Admin Access', labelAr: 'صلاحيات الإدارة' },
};

export const DASHBOARD_WIDGET_COPY: Record<
  DashboardWidgetId,
  { label: string; labelAr: string; group: 'metric' | 'panel' }
> = {
  totalProjects: { label: 'Total Projects', labelAr: 'إجمالي المشاريع', group: 'metric' },
  featuredProjects: { label: 'Featured Projects', labelAr: 'المشاريع المميزة', group: 'metric' },
  blogPosts: { label: 'Blog Posts', labelAr: 'مقالات المدونة', group: 'metric' },
  unreadMessages: { label: 'Inbox Messages', labelAr: 'رسائل البريد', group: 'metric' },
  recentActivity: { label: 'Recent Activity', labelAr: 'أحدث النشاطات', group: 'panel' },
  workspaceSnapshot: { label: 'Workspace Snapshot', labelAr: 'ملخص مساحة العمل', group: 'panel' },
};

export const DASHBOARD_QUICK_ACTION_COPY: Record<DashboardQuickActionId, { label: string; labelAr: string }> = {
  site: DASHBOARD_MODULE_COPY.site,
  theme: DASHBOARD_MODULE_COPY.theme,
  navigation: DASHBOARD_MODULE_COPY.navigation,
  footer: DASHBOARD_MODULE_COPY.footer,
  seo: DASHBOARD_MODULE_COPY.seo,
  contact: DASHBOARD_MODULE_COPY.contact,
  pages: DASHBOARD_MODULE_COPY.pages,
  projects: DASHBOARD_MODULE_COPY.projects,
  skills: DASHBOARD_MODULE_COPY.skills,
  blog: DASHBOARD_MODULE_COPY.blog,
  testimonials: DASHBOARD_MODULE_COPY.testimonials,
  media: DASHBOARD_MODULE_COPY.media,
  messages: DASHBOARD_MODULE_COPY.messages,
  dashboardSettings: DASHBOARD_MODULE_COPY.dashboardSettings,
};

export function isDashboardRouteModuleId(value: DashboardModuleId): value is DashboardRouteModuleId {
  return DASHBOARD_ROUTE_MODULE_IDS.includes(value as DashboardRouteModuleId);
}
