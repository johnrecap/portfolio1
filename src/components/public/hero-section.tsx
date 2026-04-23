import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Copy, Layers3, Rocket, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { readComposerText } from '@/lib/admin/page-content';

type HeroSectionProps = {
  variant?: 'split' | 'centered' | 'minimal';
  content?: Record<string, unknown>;
};

export const HeroSection = ({ variant = 'split', content = {} }: HeroSectionProps) => {
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const isArabic = i18n.language === 'ar';
  const displayName = isArabic
    ? profile.displayNameAr || profile.displayName
    : profile.displayName;
  const title = isArabic ? profile.titleAr || profile.title : profile.title;
  const installCommand = `npm i @${profile.displayName.toLowerCase().replace(/\s+/g, '')}/portfolio-kit`;
  const sectionTitle = readComposerText(content, 'title', t('hero.headline'), isArabic);
  const sectionHighlight = readComposerText(content, 'highlight', t('hero.highlight'), isArabic);
  const sectionSubtitle = readComposerText(content, 'subtitle', t('hero.subheadline'), isArabic);
  const primaryLabel = readComposerText(content, 'primaryLabel', t('hero.primaryCta'), isArabic);
  const secondaryLabel = readComposerText(content, 'secondaryLabel', t('hero.secondaryCta'), isArabic);
  const primaryHref = readComposerText(content, 'primaryHref', '/projects', false);
  const secondaryHref = readComposerText(content, 'secondaryHref', '/contact', false);
  const eyebrow = readComposerText(content, 'eyebrow', `${displayName} / ${title}`, isArabic);
  const isCentered = variant === 'centered';
  const isMinimal = variant === 'minimal';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-20 md:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div
        className={`mx-auto ${isCentered ? 'max-w-5xl' : 'max-w-6xl'} items-center gap-12 ${
          isCentered
            ? 'flex flex-col'
            : isMinimal
              ? 'grid max-w-4xl'
              : 'grid lg:grid-cols-[1.15fr_0.85fr]'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`space-y-8 ${isCentered ? 'text-center' : ''}`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            {t('hero.availability')}
          </div>

          <div className="space-y-4">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </p>
            <h1
              className={`font-heading text-4xl font-black leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-7xl ${
                isCentered ? 'mx-auto max-w-4xl' : 'max-w-4xl'
              }`}
            >
              {sectionTitle}{' '}
              <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                {sectionHighlight}
              </span>
            </h1>
            <p
              className={`text-base leading-8 text-muted-foreground md:text-lg ${
                isCentered ? 'mx-auto max-w-3xl' : 'max-w-2xl'
              }`}
            >
              {sectionSubtitle}
            </p>
          </div>

          <div className={`flex flex-col gap-4 sm:flex-row ${isCentered ? 'justify-center' : ''}`}>
            <Link
              to={primaryHref}
              className={buttonVariants({
                size: 'lg',
                className:
                  'h-12 gap-2 px-7 text-sm font-bold shadow-lg shadow-primary/20',
              })}
            >
              {primaryLabel}
              <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to={secondaryHref}
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className:
                  'h-12 border-border/70 bg-background/50 px-7 text-sm font-bold backdrop-blur',
              })}
            >
              {secondaryLabel}
            </Link>
          </div>

          <div className={`grid gap-3 sm:grid-cols-3 ${isCentered ? 'mx-auto w-full max-w-4xl' : ''}`}>
            <div className="rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {t('hero.surfaceLabel')}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{t('hero.surfaceValue')}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {t('hero.deliveryLabel')}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{t('hero.deliveryValue')}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {t('hero.languageLabel')}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{t('hero.languageValue')}</p>
            </div>
          </div>
        </motion.div>

        {!isMinimal ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97, x: 16 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className={`relative ${isCentered ? 'w-full max-w-3xl' : ''}`}
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-teal-400/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-[#0d1117] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-5 py-3 font-mono text-xs text-slate-400">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                build-summary.ts
              </div>
              <div className="w-12" />
            </div>

            <div className="space-y-6 p-6 text-sm text-slate-200">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Layers3 className="h-4 w-4" />
                  <span className="font-mono text-xs uppercase tracking-[0.18em]">
                    {t('hero.cardTitle')}
                  </span>
                </div>
                <p className="leading-7 text-slate-300">{t('hero.cardDescription')}</p>
              </div>

              <div
                className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-colors hover:border-slate-700"
                onClick={handleCopy}
                dir="ltr"
              >
                <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{t('hero.commandLabel')}</span>
                  {copied ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <Check className="h-4 w-4" />
                      {t('hero.commandCopied')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Copy className="h-4 w-4" />
                      {t('hero.commandHint')}
                    </span>
                  )}
                </div>
                <code className="block overflow-x-auto font-mono text-sm text-slate-100">
                  {installCommand}
                </code>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-teal-300">
                    <Rocket className="h-4 w-4" />
                    <span className="font-mono text-xs uppercase tracking-[0.18em]">
                      {t('hero.outcomesTitle')}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{t('hero.outcomesText')}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                    {t('hero.stackTitle')}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2" dir="ltr">
                    {['React', 'TypeScript', 'Firebase', 'Node.js'].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        ) : null}
      </div>
    </section>
  );
};
