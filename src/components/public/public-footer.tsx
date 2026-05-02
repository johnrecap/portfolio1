import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SkeletonLine } from '@/components/shared/PageState';
import { buttonVariants } from '@/components/ui/button-variants';
import { useProfile } from '@/hooks/useProfile';
import { useContactSettings, useFooterSettings, useSiteSettings } from '@/hooks/usePlatformSettings';
import { resolveLocalizedSiteBrand } from '@/lib/admin/brand';
import { PUBLIC_MOSTAQL_URL } from '@/lib/admin/defaults';

function useDeferredPublicReads() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      return;
    }

    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (browserWindow.requestIdleCallback) {
      const handle = browserWindow.requestIdleCallback(() => setEnabled(true), { timeout: 1800 });
      return () => browserWindow.cancelIdleCallback?.(handle);
    }

    const handle = window.setTimeout(() => setEnabled(true), 1200);
    return () => window.clearTimeout(handle);
  }, [enabled]);

  return enabled;
}

export const PublicFooter = () => {
  const footerReadsEnabled = useDeferredPublicReads();
  const publicReadOptions = { publicRead: true, disabled: !footerReadsEnabled };
  const { profile, loading: profileLoading } = useProfile({ disabled: !footerReadsEnabled });
  const { footerSettings, loading: footerLoading } = useFooterSettings(publicReadOptions);
  const { siteSettings, loading: siteLoading } = useSiteSettings(publicReadOptions);
  const { contactSettings, loading: contactLoading } = useContactSettings(publicReadOptions);
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
  const requiredSocialLinks = [{ href: PUBLIC_MOSTAQL_URL, label: 'Mostaql' }];
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
  const baseSocialLinks = footerSettings.socialLinks.length > 0 ? footerSettings.socialLinks : fallbackSocialLinks;
  const socialLinks = [
    ...baseSocialLinks,
    ...requiredSocialLinks.filter((requiredLink) =>
      !baseSocialLinks.some((item) => item.href === requiredLink.href),
    ),
  ];
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
          <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground dark:text-slate-100">
            {t('footer.quickLinks')}
          </h2>
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
          <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground dark:text-slate-100">
            {t('footer.connect')}
          </h2>
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
                  rel="noopener noreferrer"
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
