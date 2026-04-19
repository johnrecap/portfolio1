import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, FileCode2, FileJson, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/components/ui/button';
import { PageSeo } from '@/components/shared/PageSeo';
import { useProfile } from '@/hooks/useProfile';
import { useCollection } from '@/hooks/useFirestore';

type AboutTab = 'profile' | 'focus' | 'stack';

export const About = () => {
  const [activeTab, setActiveTab] = useState<AboutTab>('profile');
  const { profile } = useProfile();
  const { data: projects } = useCollection<any>('projects');
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === 'ar';
  const displayName = isArabic
    ? profile.displayNameAr || profile.displayName
    : profile.displayName;
  const bio = isArabic ? profile.bioAr || profile.bio : profile.bio;

  const editorContent = {
    profile: [
      `name: "${displayName}"`,
      `role: "${isArabic ? profile.titleAr || profile.title : profile.title}"`,
      `location: "${t('about.locationValue')}"`,
      `availability: "${t(profile.isAvailable ? 'about.availableNow' : 'about.unavailableNow')}"`,
    ],
    focus: [
      `1. ${t('about.strength1')}`,
      `2. ${t('about.strength2')}`,
      `3. ${t('about.strength3')}`,
    ],
    stack: ['React', 'TypeScript', 'Firebase', 'Node.js', 'Tailwind CSS', 'Express'],
  } as const;

  return (
    <div className="flex w-full flex-1 flex-col gap-12 pt-8 pb-16">
      <PageSeo title={t('nav.about')} description={t('about.subtitle')} />

      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              {t('about.title')}
            </p>
            <h1 className="font-heading text-4xl font-black tracking-tight text-foreground md:text-6xl">
              {t('about.subtitle')}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {t('about.intro')}
            </p>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">{bio}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[t('about.strength1'), t('about.strength2'), t('about.strength3')].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-border/60 bg-card/60 p-5 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm font-semibold leading-7 text-foreground">{item}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-border/60 bg-card/60 p-5 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t('about.statProjects')}
              </p>
              <p className="mt-3 font-heading text-4xl font-black text-foreground">{projects.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/60 bg-card/60 p-5 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t('about.statAvailability')}
              </p>
              <p className="mt-3 font-heading text-xl font-bold text-foreground">
                {t(profile.isAvailable ? 'about.availableNow' : 'about.unavailableNow')}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/60 bg-card/60 p-5 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t('about.statDisciplines')}
              </p>
              <p className="mt-3 font-heading text-4xl font-black text-foreground">3</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/projects"
              className={buttonVariants({
                size: 'lg',
                className: 'h-12 gap-2 px-7 text-sm font-bold',
              })}
            >
              {t('about.viewProjects')}
              <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/contact"
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'h-12 border-border/70 bg-card/60 px-7 text-sm font-bold',
              })}
            >
              {t('about.contactCta')}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="overflow-hidden rounded-[2rem] border border-slate-800 bg-[#0d1117] shadow-2xl"
          dir="ltr"
        >
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-5 py-3 font-mono text-xs text-slate-400">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              about-workspace.ts
            </div>
            <div className="w-12" />
          </div>

          <div className="flex border-b border-slate-800 bg-[#141820]">
            {[
              { key: 'profile' as const, label: t('about.tabs.profile'), icon: FileCode2 },
              { key: 'focus' as const, label: t('about.tabs.focus'), icon: FileJson },
              { key: 'stack' as const, label: t('about.tabs.stack'), icon: FileCode2 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 border-t-2 px-4 py-3 text-xs transition-colors sm:text-sm ${
                  activeTab === tab.key
                    ? 'border-primary bg-[#0d1117] text-slate-100'
                    : 'border-transparent text-slate-500 hover:bg-[#1a1f28]'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[52px_1fr]">
            <div className="border-e border-slate-800 bg-[#0b0f14] py-5 text-right font-mono text-xs text-slate-600">
              {Array.from({ length: 18 }).map((_, index) => (
                <div key={index} className="px-3 leading-7">
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="space-y-3 px-5 py-5 font-mono text-sm text-slate-300">
              <p className="text-slate-500">/** {t('about.editorComment')} */</p>
              {editorContent[activeTab].map((line) => (
                <div key={line} className="leading-7">
                  {activeTab === 'stack' ? (
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
