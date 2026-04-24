import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  FileText,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  Menu,
  Palette,
  PanelBottom,
  PanelsTopLeft,
  Quote,
  Search,
  Settings,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

import { auth } from '@/lib/firebase';
import { useDashboardSettings } from '@/hooks/usePlatformSettings';
import { useProfile } from '@/hooks/useProfile';
import { useCollection } from '@/hooks/useFirestore';
import { countUnreadMessages } from '@/lib/content-utils';
import { isSuperAdminUser } from '@/lib/admin/auth';
import {
  DASHBOARD_ROUTE_PATHS,
  type DashboardRouteModuleId,
} from '@/lib/admin/dashboard-config';
import { buildDashboardThemeStyle } from '@/lib/admin/settings';

const MODULE_ICONS: Record<DashboardRouteModuleId, LucideIcon> = {
  overview: LayoutDashboard,
  site: Globe,
  theme: Palette,
  navigation: PanelsTopLeft,
  footer: PanelBottom,
  seo: Search,
  contact: Mail,
  pages: LayoutTemplate,
  projects: Briefcase,
  skills: Zap,
  blog: FileText,
  testimonials: Quote,
  media: ImageIcon,
  messages: Mail,
  dashboardSettings: Settings,
};

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const { dashboardSettings } = useDashboardSettings();
  const { data: messages } = useCollection<{ read?: boolean }>('messages');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const unreadMessages = countUnreadMessages(messages);
  const navItems = useMemo(
    () =>
      dashboardSettings.sidebarModules
        .filter((module) => module.enabled)
        .map((module) => ({
          ...module,
          path: DASHBOARD_ROUTE_PATHS[module.id],
          icon: MODULE_ICONS[module.id],
          badge: module.id === 'messages' && unreadMessages > 0 ? unreadMessages : null,
        })),
    [dashboardSettings.sidebarModules, unreadMessages],
  );

  const dashboardName = isArabic
    ? dashboardSettings.dashboardNameAr || dashboardSettings.dashboardName
    : dashboardSettings.dashboardName;
  const dashboardSubtitle = isArabic
    ? dashboardSettings.subtitleAr || dashboardSettings.subtitle
    : dashboardSettings.subtitle;
  const dashboardAvatar = dashboardSettings.avatarUrl || profile.profileImage || '';
  const dashboardIcon = dashboardSettings.iconUrl || '';

  const handleLogout = async (event: React.MouseEvent) => {
    event.preventDefault();
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-muted-foreground">
        {t('dashboardLayout.loading')}
      </div>
    );
  }

  if (!isSuperAdminUser(user)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div
      className={`flex min-h-screen bg-[var(--dashboard-background)] text-[var(--dashboard-foreground)] antialiased ${
        isArabic ? 'rtl' : 'ltr'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
      style={buildDashboardThemeStyle(dashboardSettings)}
    >
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)} />
      ) : null}

      <nav
        className={`fixed inset-y-0 ${isArabic ? 'right-0 border-l' : 'left-0 border-r'} z-50 flex w-[292px] flex-col transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : isArabic ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          backgroundColor: 'var(--dashboard-panel)',
          borderColor: 'var(--dashboard-border)',
          boxShadow: 'var(--dashboard-shell-shadow)',
        }}
      >
        <div
          className={`md:hidden ${isArabic ? 'left-4' : 'right-4'} absolute top-4`}
        >
          <button
            className="rounded-full border border-transparent p-2 text-[var(--dashboard-muted-foreground)] transition-colors hover:border-[var(--dashboard-border)] hover:text-[var(--dashboard-foreground)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b px-6 py-8" style={{ borderColor: 'var(--dashboard-border)' }}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.25rem] border" style={{ borderColor: 'var(--dashboard-border)', backgroundColor: 'var(--dashboard-surface)' }}>
              {dashboardIcon ? (
                <img src={dashboardIcon} alt={dashboardName} className="h-full w-full object-cover" />
              ) : (
                <LayoutDashboard className="h-5 w-5 text-[var(--dashboard-accent)]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-lg font-black tracking-wide">{dashboardName}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--dashboard-muted-foreground)]">{dashboardSubtitle}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] border px-4 py-3" style={{ borderColor: 'var(--dashboard-border)', backgroundColor: 'var(--dashboard-surface)' }}>
            <div className="h-11 w-11 overflow-hidden rounded-full border" style={{ borderColor: 'var(--dashboard-border)', backgroundColor: 'var(--dashboard-muted)' }}>
              {dashboardAvatar ? <img src={dashboardAvatar} alt={profile.displayName} className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">{profile.displayName}</p>
              <p className="truncate text-sm text-[var(--dashboard-muted-foreground)]">{profile.title}</p>
            </div>
          </div>
        </div>

        <ul className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const isActive = item.id === 'overview' ? location.pathname === item.path : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-[1.25rem] px-4 py-3 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    backgroundColor: isActive ? 'var(--dashboard-surface-alt)' : 'transparent',
                    color: isActive ? 'var(--dashboard-accent)' : 'var(--dashboard-muted-foreground)',
                  }}
                >
                  {isActive ? (
                    <span
                      className={`absolute inset-y-3 ${isArabic ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'} w-1`}
                      style={{ backgroundColor: 'var(--dashboard-accent)' }}
                    />
                  ) : null}
                  <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5" />
                  <span className="truncate text-sm font-medium">
                    {isArabic ? item.labelAr || item.label : item.label}
                  </span>
                  {item.badge ? (
                    <span
                      className={`absolute ${isArabic ? 'left-4' : 'right-4'} rounded-full px-2 py-0.5 text-[10px] font-bold`}
                      style={{
                        backgroundColor: 'var(--dashboard-accent)',
                        color: 'var(--dashboard-accent-foreground)',
                      }}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="border-t px-4 py-4" style={{ borderColor: 'var(--dashboard-border)' }}>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium text-[var(--dashboard-muted-foreground)] transition-colors hover:bg-[var(--dashboard-surface)] hover:text-[var(--dashboard-foreground)]"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>{t('dashboardLayout.logout')}</span>
          </button>
        </div>
      </nav>

      <div className={`flex min-h-screen flex-1 flex-col ${isArabic ? 'md:mr-[292px]' : 'md:ml-[292px]'}`}>
        <header
          className={`fixed top-0 z-30 flex h-16 items-center justify-between border-b px-4 sm:px-6 ${
            isArabic ? 'left-0 md:right-[292px]' : 'right-0 md:left-[292px]'
          }`}
          style={{
            backgroundColor: 'var(--dashboard-header)',
            borderColor: 'var(--dashboard-border)',
            boxShadow: '0 10px 30px rgba(2, 6, 23, 0.24)',
          }}
        >
          <div className="flex w-full items-center gap-4">
            <button
              className="rounded-full border border-transparent p-2 text-[var(--dashboard-muted-foreground)] transition-colors hover:border-[var(--dashboard-border)] hover:text-[var(--dashboard-foreground)] md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden w-full max-w-md sm:block">
              <Search className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dashboard-muted-foreground)] ${isArabic ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                placeholder={t('dashboardLayout.quickSearch')}
                className={`h-11 w-full rounded-full border px-4 text-sm outline-none transition-colors placeholder:text-[var(--dashboard-muted-foreground)] ${
                  isArabic ? 'pr-11 pl-4' : 'pl-11 pr-4'
                }`}
                style={{
                  backgroundColor: 'var(--dashboard-surface)',
                  borderColor: 'var(--dashboard-border)',
                  color: 'var(--dashboard-foreground)',
                }}
              />
            </div>
          </div>

          <div className="ml-4 flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
              style={{
                backgroundColor: 'var(--dashboard-surface)',
                borderColor: 'var(--dashboard-border)',
                color: 'var(--dashboard-muted-foreground)',
              }}
            >
              <Bell className="h-5 w-5" />
              {unreadMessages > 0 ? (
                <span
                  className={`absolute top-2 ${isArabic ? 'left-2' : 'right-2'} h-2 w-2 rounded-full`}
                  style={{ backgroundColor: 'var(--dashboard-accent)' }}
                />
              ) : null}
            </button>

            <Link
              to="/"
              className="inline-flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm"
              style={{
                backgroundColor: 'var(--dashboard-surface)',
                borderColor: 'var(--dashboard-border)',
                color: 'var(--dashboard-muted-foreground)',
              }}
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span>{t('dashboardLayout.viewSite')}</span>
            </Link>

            <Link
              to="/dashboard/dashboard-settings"
              className="hidden h-10 w-10 items-center justify-center rounded-full border transition-colors sm:flex"
              style={{
                backgroundColor: 'var(--dashboard-surface)',
                borderColor: 'var(--dashboard-border)',
                color: 'var(--dashboard-muted-foreground)',
              }}
            >
              <Settings className="h-5 w-5" />
            </Link>

            <div className="h-10 w-10 overflow-hidden rounded-full border" style={{ borderColor: 'var(--dashboard-border)', backgroundColor: 'var(--dashboard-muted)' }}>
              {dashboardAvatar ? <img src={dashboardAvatar} alt={profile.displayName} className="h-full w-full object-cover" /> : null}
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col pt-16">
          <div className="flex flex-1 flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
