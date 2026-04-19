import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, buttonVariants } from '@/components/ui/button';
import { useTheme } from '@/components/shared/theme-provider';
import { useProfile } from '@/hooks/useProfile';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={t('nav.toggleTheme')}
      className="shrink-0 rounded-full"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/skills', label: t('nav.skills') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const isArabic = i18n.language === 'ar';
  const brandMark = isArabic
    ? profile.displayNameAr || profile.displayName
    : `${profile.displayName
        .split(' ')
        .map((segment: string) => segment.charAt(0))
        .join('')}.`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-[1344px] items-center justify-between px-4 sm:px-8">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight text-primary">
          {brandMark}
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-4 md:flex lg:gap-6">
          {navLinks.map((link) => {
            const active = location.pathname === link.href;
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
          <LanguageToggle />
          <div className="mx-1 h-4 w-px bg-border" />
          <ThemeToggle />
          <Link
            to="/contact"
            dir="ltr"
            className="ml-2 inline-flex items-center rounded-full bg-primary px-4 py-2 font-mono text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            ./contact.sh
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
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
              {navLinks.map((link) => {
                const active = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
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
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={buttonVariants({ className: 'mt-2 w-full rounded-full' })}
              >
                {t('hero.secondaryCta')}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export const PublicFooter = () => {
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const displayName = isArabic
    ? profile.displayNameAr || profile.displayName
    : profile.displayName;
  const title = isArabic ? profile.titleAr || profile.title : profile.title;

  const socialLinks = [
    profile.githubUrl ? { href: profile.githubUrl, label: 'GitHub' } : null,
    profile.linkedinUrl ? { href: profile.linkedinUrl, label: 'LinkedIn' } : null,
    profile.websiteUrl ? { href: profile.websiteUrl, label: t('footer.website') } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="relative z-10 mt-auto overflow-hidden border-t border-white/5 bg-[#0a0a0b]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 pb-12">
        <div className="rounded-b-[1.75rem] border-x border-b border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-sm text-slate-300" dir="ltr">
                <span className="text-primary">visitor@web</span>
                <span className="text-slate-500">:</span>
                <span className="text-slate-500">~</span>
                <span className="text-slate-500">$</span>
                <span className="font-semibold text-slate-100">{t('footer.statusLabel')}</span>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">
                {t('footer.statusDescription')}
              </p>
            </div>
            <Link
              to="/contact"
              className={buttonVariants({
                variant: 'outline',
                size: 'sm',
                className:
                  'border-white/10 text-white hover:bg-white/5 hover:text-white',
              })}
            >
              {t('footer.cta')}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-12">
        <div className="space-y-4">
          <Link to="/" className="font-heading text-2xl font-bold tracking-tight text-white">
            {displayName}
            <span className="text-primary">_</span>
          </Link>
          <p className="max-w-md text-sm leading-7 text-slate-400">{title}</p>
          <p className="max-w-md text-sm leading-7 text-slate-500">{t('footer.summary')}</p>
        </div>

        <div className="space-y-4">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">
            {t('footer.quickLinks')}
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            {[
              ['/', t('nav.home')],
              ['/about', t('nav.about')],
              ['/projects', t('nav.projects')],
              ['/contact', t('nav.contact')],
            ].map(([href, label]) => (
              <li key={href}>
                <Link to={href} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">
            {t('footer.connect')}
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            {socialLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/login" className="transition-colors hover:text-white">
                {t('nav.adminLogin')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center font-mono text-xs text-slate-500 md:flex-row md:text-start lg:px-12">
          <p>{t('footer.builtWith')}</p>
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};
