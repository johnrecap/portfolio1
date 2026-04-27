import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState, SkeletonBlocks } from '@/components/shared/PageState';
import { usePublicCollection, usePublicMediaLibrary } from '@/hooks/public-firestore';
import { getLocalizedValue, resolveMediaField } from '@/lib/content-hub';
import { DEMO_PROJECTS } from '@/lib/demo-projects';
import { getFeaturedProjects, normalizeProjectType, type ProjectRecord } from '@/lib/project-utils';
import { readComposerText } from '@/lib/admin/page-content';

const projectTypeKeyMap = {
  web: 'projects.types.web',
  mobile: 'projects.types.mobile',
  dashboard: 'projects.types.dashboard',
  backend: 'projects.types.backend',
  other: 'projects.types.other',
} as const;

type FeaturedProjectsGridProps = {
  variant?: 'spotlight' | 'grid' | 'carousel';
  content?: Record<string, unknown>;
};

export const FeaturedProjectsGrid = ({ variant = 'spotlight', content = {} }: FeaturedProjectsGridProps) => {
  const { data, loading } = usePublicCollection<ProjectRecord>('projects');
  const { assets } = usePublicMediaLibrary();
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredProjects = [
    ...DEMO_PROJECTS,
    ...getFeaturedProjects(data, 4).filter(
      (project) => !DEMO_PROJECTS.some((demoProject) => demoProject.slug === project.slug || demoProject.id === project.id),
    ),
  ];
  const activeProject = featuredProjects[Math.min(activeIndex, Math.max(featuredProjects.length - 1, 0))];
  const isArabic = i18n.language === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const eyebrow = readComposerText(content, 'eyebrow', t('featuredProjects.eyebrow'), isArabic);
  const title = readComposerText(content, 'title', t('featuredProjects.title'), isArabic);
  const subtitle = readComposerText(content, 'subtitle', t('featuredProjects.subtitle'), isArabic);
  const viewAllLabel = readComposerText(content, 'viewAllLabel', t('featuredProjects.viewAll'), isArabic);

  if (loading && featuredProjects.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <SkeletonBlocks count={2} className="lg:grid-cols-2" />
        </div>
      </section>
    );
  }

  if (featuredProjects.length === 0 || !activeProject) {
    return (
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <EmptyState
            title={t('featuredProjects.emptyTitle')}
            description={t('featuredProjects.emptyDescription')}
          />
        </div>
      </section>
    );
  }

  const normalizedType = normalizeProjectType(activeProject.type ?? activeProject.category);
  const activeProjectTitle = getLocalizedValue(activeProject.title, activeProject.titleAr, isArabic) || activeProject.title;
  const activeProjectDescription =
    getLocalizedValue(activeProject.description, activeProject.descriptionAr, isArabic) || activeProject.description;
  const highlightLabel = getLocalizedValue(activeProject.highlightLabel, activeProject.highlightLabelAr, isArabic);
  const previewImage = resolveMediaField(
    { url: activeProject.image, assetId: activeProject.imageAssetId },
    assets,
  );

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        </div>

        <div className={`mb-5 flex flex-wrap gap-2 ${variant === 'grid' ? 'justify-start' : ''}`}>
          {featuredProjects.map((project, index) => {
            const projectTitle = getLocalizedValue(project.title, project.titleAr, isArabic) || project.title;
            const buttonLabel = isArabic ? `افتح ${projectTitle}` : `$ open ${projectTitle}`;

            return (
              <button
                key={project.id}
                onClick={() => setActiveIndex(index)}
                dir={isArabic ? 'rtl' : 'ltr'}
                className={`rounded-full border px-4 py-2 font-mono text-xs transition-colors sm:text-sm ${
                  activeProject.id === project.id
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground'
                }`}
              >
                {buttonLabel}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-[#0d1117] shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-5 py-3 font-mono text-xs text-slate-400">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            <span>featured-project.ts</span>
            <div className="w-12" />
          </div>

          <div className={`grid ${variant === 'grid' ? 'xl:grid-cols-[1fr_1fr]' : 'lg:grid-cols-[0.95fr_1.05fr]'}`}>
            <div className="border-b border-slate-800 p-6 lg:border-b-0 lg:border-e">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <Layers3 className="h-4 w-4" />
                    <span className="font-mono text-xs uppercase tracking-[0.18em]">
                      {t('featuredProjects.projectObject')}
                    </span>
                  </div>

                  <div className="space-y-4 rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-200">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                        {t('featuredProjects.name')}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">{activeProjectTitle}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                          {t('featuredProjects.type')}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          {t(projectTypeKeyMap[normalizedType])}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                          {t('featuredProjects.status')}
                        </p>
                        <p className="mt-2 text-sm text-emerald-400">{t('featuredProjects.liveStatus')}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                        {t('featuredProjects.summary')}
                      </p>
                      <p className="mt-2 leading-7 text-slate-300">{activeProjectDescription}</p>
                    </div>
                    {highlightLabel ? (
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                          {t('featuredProjects.highlightLabel')}
                        </p>
                        <p className="mt-2 text-sm text-primary">{highlightLabel}</p>
                      </div>
                    ) : null}
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                        {t('featuredProjects.stack')}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2" dir="ltr">
                        {(activeProject.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {activeProject.demoUrl ? (
                      <a
                        href={activeProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({
                          className:
                            'gap-2 bg-primary text-primary-foreground hover:bg-primary-hover',
                        })}
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t('featuredProjects.liveDemo')}
                      </a>
                    ) : null}
                    {activeProject.githubUrl ? (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({
                          variant: 'outline',
                          className:
                            'gap-2 border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white',
                        })}
                      >
                        <Github className="h-4 w-4" />
                        {t('featuredProjects.github')}
                      </a>
                    ) : null}
                    <Link
                      to={`/projects/${activeProject.slug}`}
                      className={buttonVariants({
                        variant: 'ghost',
                        className: 'gap-2 text-white hover:bg-slate-800 hover:text-white',
                      })}
                    >
                      {t('featuredProjects.details')}
                      <ArrowIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative flex min-h-[360px] items-center justify-center bg-[#0a0d12] p-6 lg:p-10">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[70%] w-[70%] rounded-full bg-primary/15 blur-[100px]" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  className="relative z-10 w-full overflow-hidden rounded-[1.75rem] border border-slate-700/60 bg-[#151a21] shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-3 font-mono text-xs text-slate-400">
                    <span dir={isArabic ? 'rtl' : 'ltr'}>
                      {isArabic ? activeProjectTitle : `${activeProject.slug}.app`}
                    </span>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-400">
                      {t('featuredProjects.featured')}
                    </span>
                  </div>
                  <div className="aspect-video overflow-hidden bg-slate-950">
                    {previewImage.url ? (
                      <img
                        src={previewImage.url}
                        alt={activeProjectTitle}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-600">
                        {t('featuredProjects.emptyPreview')}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className={`mt-6 flex ${variant === 'grid' ? 'justify-start' : 'justify-center'}`}>
          <Link
            to="/projects"
            className={buttonVariants({
              variant: 'ghost',
              className: 'gap-2 font-mono text-sm hover:bg-muted',
            })}
          >
            {viewAllLabel}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
