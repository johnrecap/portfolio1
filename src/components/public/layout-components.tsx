import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Github, Globe, Linkedin, Menu, MessageCircle, Moon, Store, Sun, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/components/ui/button-variants';
import { useTheme } from '@/components/shared/theme-provider';
import { SkeletonLine } from '@/components/shared/PageState';
import { useProfile } from '@/hooks/useProfile';
import { useNavigationSettings, useSiteSettings } from '@/hooks/usePlatformSettings';
import { resolveLocalizedSiteBrand } from '@/lib/admin/brand';
import { PUBLIC_KHAMSAT_URL, PUBLIC_MOSTAQL_URL, PUBLIC_WHATSAPP_URL } from '@/lib/admin/defaults';
import type { ThemeSettings } from '@/lib/admin/types';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={t('nav.toggleTheme')}
      className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'shrink-0 rounded-full' })}
    >
      {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(i18n.resolvedLanguage === 'ar' ? 'en' : 'ar')}
      aria-label={i18n.resolvedLanguage === 'ar' ? t('nav.switchToEnglish') : t('nav.switchToArabic')}
      className={buttonVariants({
        variant: 'ghost',
        size: 'sm',
        className: 'flex shrink-0 items-center gap-2 rounded-full px-3 font-medium',
      })}
    >
      <Globe className="h-4 w-4" />
      <span>{i18n.resolvedLanguage === 'ar' ? t('nav.enShort') : t('nav.arShort')}</span>
    </button>
  );
};

type PublicNavbarProps = {
  themeMode: ThemeSettings['mode'];
};

type HeaderContactLink = {
  href: string;
  label: string;
  icon: typeof MessageCircle;
};

const HeaderContactLinks = ({ links, compact = false }: { links: HeaderContactLink[]; compact?: boolean }) => {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className={compact ? 'grid grid-cols-2 gap-2' : 'hidden items-center gap-1 lg:flex'}>
      {links.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          title={item.label}
          className={
            compact
              ? 'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted'
              : 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/65 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary'
          }
        >
          <item.icon className="h-4 w-4" />
          {compact ? <span>{item.label}</span> : null}
        </a>
      ))}
    </div>
  );
};

export const PublicNavbar = ({ themeMode }: PublicNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { profile, loading: profileLoading } = useProfile();
  const { navigationSettings, loading: navigationLoading } = useNavigationSettings({ publicRead: true });
  const { siteSettings, loading: siteLoading } = useSiteSettings({ publicRead: true });
  const { t, i18n } = useTranslation();

  const fallbackNavLinks = [
    { id: 'home', href: '/', label: t('nav.home'), labelAr: t('nav.home') },
    { id: 'about', href: '/about', label: t('nav.about'), labelAr: t('nav.about') },
    { id: 'projects', href: '/projects', label: t('nav.projects'), labelAr: t('nav.projects') },
    { id: 'skills', href: '/skills', label: t('nav.skills'), labelAr: t('nav.skills') },
    { id: 'blog', href: '/blog', label: t('nav.blog'), labelAr: t('nav.blog') },
    { id: 'contact', href: '/contact', label: t('nav.contact'), labelAr: t('nav.contact') },
  ];

  const isArabic = i18n.language === 'ar';
  const navLinks =
    !navigationLoading && navigationSettings.items.length > 0
      ? navigationSettings.items.filter((item) => item.enabled).map((item) => ({
          id: item.id,
          href: item.href,
          label: isArabic ? item.labelAr || item.label : item.label,
        }))
      : fallbackNavLinks.map((item) => ({ id: item.id, href: item.href, label: item.label }));
  const brandMark = resolveLocalizedSiteBrand(siteSettings, profile, isArabic);
  const brandLoading = siteLoading || profileLoading;
  const showThemeToggle = !navigationLoading && navigationSettings.showThemeToggle && themeMode === 'system';
  const adminCtaHref = '/login';
  const adminCtaLabel = t('nav.adminLogin');
  const contactLinks: HeaderContactLink[] = [
    { href: PUBLIC_WHATSAPP_URL, label: isArabic ? '\u0648\u0627\u062a\u0633\u0627\u0628' : 'WhatsApp', icon: MessageCircle },
    { href: PUBLIC_MOSTAQL_URL, label: isArabic ? '\u0645\u0633\u062a\u0642\u0644' : 'Mostaql', icon: BriefcaseBusiness },
    { href: PUBLIC_KHAMSAT_URL, label: isArabic ? '\u062e\u0645\u0633\u0627\u062a' : 'Khamsat', icon: Store },
    profile.githubUrl ? { href: profile.githubUrl, label: 'GitHub', icon: Github } : null,
    profile.linkedinUrl ? { href: profile.linkedinUrl, label: 'LinkedIn', icon: Linkedin } : null,
  ].filter(Boolean) as HeaderContactLink[];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70"
      style={{ boxShadow: 'var(--site-shell-shadow, none)' }}
    >
      <div className="mx-auto flex h-16 max-w-[1344px] items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3 font-heading text-xl font-bold tracking-tight text-primary">
          {!siteLoading && siteSettings.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt={brandMark}
              className="h-9 w-9 rounded-full border border-border/60 bg-card object-cover"
            />
          ) : null}
          {brandLoading ? <SkeletonLine className="h-6 w-36" /> : <span>{brandMark}</span>}
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-4 md:flex lg:gap-6">
          {navigationLoading ? (
            <>
              <SkeletonLine className="h-4 w-14" />
              <SkeletonLine className="h-4 w-16" />
              <SkeletonLine className="h-4 w-20" />
              <SkeletonLine className="h-4 w-16" />
              <SkeletonLine className="h-4 w-14" />
            </>
          ) : navLinks.map((link) => {
            const active =
              link.href === '/'
                ? location.pathname === link.href
                : location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <HeaderContactLinks links={contactLinks} />
          {contactLinks.length > 0 ? <div className="mx-1 hidden h-4 w-px bg-border lg:block" /> : null}
          {!navigationLoading && navigationSettings.showLanguageToggle ? <LanguageToggle /> : null}
          {!navigationLoading && navigationSettings.showLanguageToggle && showThemeToggle ? (
            <div className="mx-1 h-4 w-px bg-border" />
          ) : null}
          {showThemeToggle ? <ThemeToggle /> : null}
          <Link
            to={adminCtaHref}
            className="ml-2 inline-flex items-center rounded-full bg-primary px-4 py-2 font-mono text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {adminCtaLabel}
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {!navigationLoading && navigationSettings.showLanguageToggle ? <LanguageToggle /> : null}
          {showThemeToggle ? <ThemeToggle /> : null}
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={isOpen}
            aria-controls="public-mobile-menu"
            className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'rounded-full' })}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div id="public-mobile-menu" className="border-t bg-background animate-in fade-in slide-in-from-top-2 md:hidden">
          <div className="space-y-3 px-4 py-4">
            {navigationLoading ? (
              <div className="space-y-3" aria-hidden="true">
                <SkeletonLine className="h-9 w-full rounded-xl" />
                <SkeletonLine className="h-9 w-full rounded-xl" />
                <SkeletonLine className="h-9 w-full rounded-xl" />
              </div>
            ) : navLinks.map((link) => {
              const active =
                link.href === '/'
                  ? location.pathname === link.href
                  : location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.id}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-xl px-3 py-2 text-sm font-medium ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to={adminCtaHref}
              onClick={() => setIsOpen(false)}
              className={buttonVariants({ className: 'mt-2 w-full rounded-full' })}
            >
              {adminCtaLabel}
            </Link>
            <div className="border-t border-border/70 pt-3">
              <HeaderContactLinks links={contactLinks} compact />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};
