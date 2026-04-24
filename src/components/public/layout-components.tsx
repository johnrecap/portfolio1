import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, buttonVariants } from '@/components/ui/button';
import { useTheme } from '@/components/shared/theme-provider';
import { SkeletonLine } from '@/components/shared/PageState';
import { useProfile } from '@/hooks/useProfile';
import { useContactSettings, useFooterSettings, useNavigationSettings, useSiteSettings, useThemeSettings } from '@/hooks/usePlatformSettings';
import { resolveLocalizedSiteBrand } from '@/lib/admin/brand';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={t('nav.toggleTheme')}
      className="shrink-0 rounded-full"
    >
      {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => i18n.changeLanguage(i18n.resolvedLanguage === 'ar' ? 'en' : 'ar')}
      className="flex shrink-0 items-center gap-2 rounded-full px-3 font-medium"
    >
      <Globe className="h-4 w-4" />
      <span>{i18n.resolvedLanguage === 'ar' ? t('nav.enShort') : t('nav.arShort')}</span>
    </Button>
  );
};

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { profile, loading: profileLoading } = useProfile();
  const { navigationSettings, loading: navigationLoading } = useNavigationSettings();
  const { siteSettings, loading: siteLoading } = useSiteSettings();
  const { themeSettings, loading: themeLoading } = useThemeSettings();
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
  const showThemeToggle = !navigationLoading && !themeLoading && navigationSettings.showThemeToggle && themeSettings.mode === 'system';
  const adminCtaHref = '/login';
  const adminCtaLabel = t('nav.adminLogin');

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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen((current) => !current)}
            className="rounded-full"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-background md:hidden"
          >
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
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export const PublicFooter = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { footerSettings, loading: footerLoading } = useFooterSettings();
  const { siteSettings, loading: siteLoading } = useSiteSettings();
  const { contactSettings, loading: contactLoading } = useContactSettings();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const brandName = resolveLocalizedSiteBrand(siteSettings, profile, isArabic);
  const title = isArabic ? profile.titleAr || profile.title : profile.title;
  const footerSummary = isArabic
    ? siteSettings.siteTaglineAr || footerSettings.taglineAr || t('footer.summary')
    : siteSettings.siteTagline || footerSettings.tagline || t('footer.summary');

  const fallbackSocialLinks = [
    contactSettings.email ? { href: `mailto:${contactSettings.email}`, label: contactSettings.email } : null,
    contactSettings.whatsapp ? { href: `https://wa.me/${contactSettings.whatsapp.replace(/[^\d]/g, '')}`, label: contactSettings.whatsapp } : null,
    profile.githubUrl ? { href: profile.githubUrl, label: 'GitHub' } : null,
    profile.linkedinUrl ? { href: profile.linkedinUrl, label: 'LinkedIn' } : null,
    profile.websiteUrl ? { href: profile.websiteUrl, label: t('footer.website') } : null,
  ].filter(Boolean) as { href: string; label: string }[];
  const footerLinks =
    footerSettings.links.length > 0
      ? footerSettings.links.map((item) => ({
          href: item.href,
          label: isArabic ? item.labelAr || item.label : item.label,
        }))
      : [
          { href: '/', label: t('nav.home') },
          { href: '/about', label: t('nav.about') },
          { href: '/projects', label: t('nav.projects') },
          { href: '/contact', label: t('nav.contact') },
        ];
  const socialLinks = footerSettings.socialLinks.length > 0 ? footerSettings.socialLinks : fallbackSocialLinks;
  const footerContentLoading = profileLoading || footerLoading || siteLoading || contactLoading;

  return (
    <footer
      className="relative z-10 mt-auto overflow-hidden border-t border-border/70 bg-background dark:border-white/5 dark:bg-[#0a0a0b]"
      style={{ boxShadow: 'var(--site-shell-shadow, none)' }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 pb-12">
        <div className="rounded-b-[1.75rem] border-x border-b border-border/70 bg-card/85 px-6 py-5 backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground dark:text-slate-300" dir="ltr">
                <span className="text-primary">visitor@web</span>
                <span className="text-muted-foreground/70 dark:text-slate-500">:</span>
                <span className="text-muted-foreground/70 dark:text-slate-500">~</span>
                <span className="text-muted-foreground/70 dark:text-slate-500">$</span>
                <span className="font-semibold text-foreground dark:text-slate-100">
                  {footerLoading ? (
                    <SkeletonLine className="h-4 w-40" />
                  ) : (
                    isArabic ? footerSettings.statusStripAr || t('footer.statusLabel') : footerSettings.statusStrip || t('footer.statusLabel')
                  )}
                </span>
              </div>
              {footerLoading ? (
                <div className="mt-3 space-y-2" aria-hidden="true">
                  <SkeletonLine className="h-4 w-full max-w-xl" />
                  <SkeletonLine className="h-4 w-4/5 max-w-xl" />
                </div>
              ) : (
                <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground dark:text-slate-400">
                  {isArabic ? footerSettings.taglineAr || t('footer.statusDescription') : footerSettings.tagline || t('footer.statusDescription')}
                </p>
              )}
            </div>
            <Link
              to={footerSettings.ctaHref || '/contact'}
              className={buttonVariants({
                variant: 'outline',
                size: 'sm',
                className:
                  'border-border/70 bg-background/80 text-foreground hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:text-white',
              })}
            >
            {footerLoading ? <SkeletonLine className="h-4 w-20" /> : isArabic ? footerSettings.ctaLabelAr || t('footer.cta') : footerSettings.ctaLabel || t('footer.cta')}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-12">
        <div className="space-y-4">
          <Link to="/" className="font-heading text-2xl font-bold tracking-tight text-foreground dark:text-white">
            {siteLoading || profileLoading ? <SkeletonLine className="h-7 w-44" /> : <>{brandName}<span className="text-primary">_</span></>}
          </Link>
          {footerContentLoading ? (
            <div className="space-y-3" aria-hidden="true">
              <SkeletonLine className="h-4 w-56" />
              <SkeletonLine className="h-4 w-full max-w-md" />
              <SkeletonLine className="h-4 w-4/5 max-w-md" />
            </div>
          ) : (
            <>
              <p className="max-w-md text-sm leading-7 text-muted-foreground dark:text-slate-400">{title}</p>
              <p className="max-w-md text-sm leading-7 text-muted-foreground/80 dark:text-slate-500">{footerSummary}</p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground dark:text-slate-100">
            {t('footer.quickLinks')}
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground dark:text-slate-400">
            {footerLoading ? (
              <>
                <li><SkeletonLine className="h-4 w-20" /></li>
                <li><SkeletonLine className="h-4 w-24" /></li>
                <li><SkeletonLine className="h-4 w-16" /></li>
              </>
            ) : footerLinks.map(({ href, label }) => (
              <li key={href}>
                <Link to={href} className="transition-colors hover:text-foreground dark:hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground dark:text-slate-100">
            {t('footer.connect')}
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground dark:text-slate-400">
            {footerContentLoading ? (
              <>
                <li><SkeletonLine className="h-4 w-32" /></li>
                <li><SkeletonLine className="h-4 w-24" /></li>
                <li><SkeletonLine className="h-4 w-28" /></li>
              </>
            ) : socialLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-foreground dark:hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/login" className="transition-colors hover:text-foreground dark:hover:text-white">
                {t('nav.adminLogin')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 dark:border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center font-mono text-xs text-muted-foreground/80 dark:text-slate-500 md:flex-row md:text-start lg:px-12">
          <p>{t('footer.builtWith')}</p>
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};
