import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink, Github, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { PageSeo } from '@/components/shared/PageSeo';
import { EmptyState, SkeletonBlocks, SkeletonMedia } from '@/components/shared/PageState';
import { usePublicCollection, usePublicMediaLibrary } from '@/hooks/public-firestore';
import { usePageConfig } from '@/hooks/usePageConfig';
import { readComposerText } from '@/lib/admin/page-content';
import { getLocalizedValue, resolveMediaField } from '@/lib/content-hub';
import { DEMO_PROJECTS } from '@/lib/demo-projects';
import {
  filterProjects,
  normalizeProjectType,
  sortProjects,
  type ProjectRecord,
  type ProjectSortMode,
} from '@/lib/project-utils';

const projectTypeKeyMap = {
  all: 'projects.types.all',
  web: 'projects.types.web',
  mobile: 'projects.types.mobile',
  dashboard: 'projects.types.dashboard',
  backend: 'projects.types.backend',
  other: 'projects.types.other',
} as const;

type DemoCategoryKey = 'all' | 'dashboard' | 'store' | 'website' | 'mobile' | 'system';

const demoCategoryOrder: DemoCategoryKey[] = ['all', 'dashboard', 'store', 'website', 'mobile', 'system'];

function getDemoCategory(project: ProjectRecord): Exclude<DemoCategoryKey, 'all'> {
  const category = project.category.toLowerCase();
  const type = normalizeProjectType(project.type ?? project.category);

  if (category.includes('commerce') || category.includes('store') || category.includes('shop')) {
    return 'store';
  }

  if (type === 'dashboard') {
    return 'dashboard';
  }

  if (type === 'mobile') {
    return 'mobile';
  }

  if (type === 'web') {
    return 'website';
  }

  return 'system';
}

function getDemoCategoryLabel(category: DemoCategoryKey, isArabic: boolean) {
  const labels: Record<DemoCategoryKey, { en: string; ar: string }> = {
    all: { en: 'All demos', ar: 'كل الديموز' },
    dashboard: { en: 'Dashboards', ar: 'لوحات تحكم' },
    store: { en: 'Stores', ar: 'متاجر' },
    website: { en: 'Websites', ar: 'مواقع' },
    mobile: { en: 'Apps', ar: 'تطبيقات' },
    system: { en: 'Systems', ar: 'أنظمة' },
  };

  return isArabic ? labels[category].ar : labels[category].en;
}

export const Projects = () => {
  const { data: projects, loading } = usePublicCollection<ProjectRecord>('projects');
  const { assets, loading: mediaLoading } = usePublicMediaLibrary();
  const { pageConfig } = usePageConfig('projects');
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'web' | 'mobile' | 'dashboard' | 'backend' | 'other'>('all');
  const [activeTag, setActiveTag] = useState('');
  const [activeDemoCategory, setActiveDemoCategory] = useState<DemoCategoryKey>('all');
  const [sortMode, setSortMode] = useState<ProjectSortMode>('featured');

  const demoProjects = DEMO_PROJECTS;
  const filteredProjects = filterProjects(projects, { search, activeType, activeTag });
  const sortedProjects = sortProjects(filteredProjects, sortMode);
  const tags = Array.from(new Set(projects.flatMap((project) => project.tags ?? []))).sort((left, right) =>
    left.localeCompare(right),
  );
  const isArabic = i18n.language === 'ar';
  const demoCategories = demoCategoryOrder.filter((category) => {
    if (category === 'all') {
      return true;
    }

    return demoProjects.some((project) => getDemoCategory(project) === category);
  });
  const filteredDemoProjects =
    activeDemoCategory === 'all'
      ? demoProjects
      : demoProjects.filter((project) => getDemoCategory(project) === activeDemoCategory);
  const heroSection = pageConfig.sections.find((section) => section.type === 'projectsHero');
  const listingSection = pageConfig.sections.find((section) => section.type === 'projectsListing');
  const seoTitle = isArabic
    ? pageConfig.seo.titleAr || pageConfig.titleAr || t('nav.projects')
    : pageConfig.seo.title || pageConfig.title || t('nav.projects');
  const seoDescription = isArabic
    ? pageConfig.seo.descriptionAr || t('projects.subtitle')
    : pageConfig.seo.description || t('projects.subtitle');
  const eyebrow = heroSection
    ? readComposerText(heroSection.content, 'eyebrow', t('projects.portfolio'), isArabic)
    : t('projects.portfolio');
  const title = heroSection
    ? readComposerText(heroSection.content, 'title', `${t('projects.title')} ${t('projects.works')}`, isArabic)
    : `${t('projects.title')} ${t('projects.works')}`;
  const subtitle = heroSection
    ? readComposerText(heroSection.content, 'subtitle', t('projects.subtitle'), isArabic)
    : t('projects.subtitle');
  const listingTitle = listingSection
    ? readComposerText(listingSection.content, 'title', '', isArabic)
    : '';
  const listingSubtitle = listingSection
    ? readComposerText(listingSection.content, 'subtitle', '', isArabic)
    : '';

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 pt-10 pb-20">
      <PageSeo title={seoTitle} description={seoDescription} image={pageConfig.seo.image} />

      <header className="order-1 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 font-heading text-4xl font-black tracking-tight text-foreground md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="relative w-full max-w-md" dir="ltr">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('projects.search')}
            className="h-12 rounded-full border-border/70 bg-card/60 pl-11"
          />
        </div>
      </header>

      <section className="order-3 flex flex-col gap-5">
        <div className="max-w-3xl space-y-3">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {listingTitle || t('projects.realProjectsTitle')}
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            {listingSubtitle || t('projects.realProjectsDescription')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(projectTypeKeyMap).map((key) => (
            <button
              key={key}
              onClick={() => setActiveType(key as typeof activeType)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeType === key
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(projectTypeKeyMap[key as keyof typeof projectTypeKeyMap])}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border/60 bg-card/60 p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag('')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTag === ''
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('projects.allTags')}
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTag === tag
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ['featured', t('projects.sortFeatured')],
              ['newest', t('projects.sortNewest')],
              ['alphabetical', t('projects.sortAlphabetical')],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSortMode(value as ProjectSortMode)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                  sortMode === value
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="order-4">
        {loading ? (
          <SkeletonBlocks count={6} className="md:grid-cols-2 xl:grid-cols-3" />
        ) : sortedProjects.length === 0 ? (
          <EmptyState
            title={t('projects.noProjects')}
            description={t('projects.noProjectsDescription')}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedProjects.map((project, index) => {
            const projectType = normalizeProjectType(project.type ?? project.category);
            const titleText = getLocalizedValue(project.title, project.titleAr, isArabic) || project.title;
            const descriptionText =
              getLocalizedValue(project.description, project.descriptionAr, isArabic) || project.description;
            const highlightLabel = getLocalizedValue(project.highlightLabel, project.highlightLabelAr, isArabic);
            const previewImage = resolveMediaField({ url: project.image, assetId: project.imageAssetId }, assets);

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <Link to={`/projects/${project.slug}`} className="block aspect-[16/10] overflow-hidden bg-muted">
                  {mediaLoading ? (
                    <SkeletonMedia className="h-full w-full rounded-none" />
                  ) : previewImage.url ? (
                    <img
                      src={previewImage.url}
                      alt={titleText}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      {t('projects.emptyPreview')}
                    </div>
                  )}
                </Link>

                <div className="space-y-5 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {t(projectTypeKeyMap[projectType])}
                    </span>
                    {project.featured ? (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {t('projects.featuredBadge')}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <Link to={`/projects/${project.slug}`}>
                      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {titleText}
                      </h2>
                    </Link>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {descriptionText}
                    </p>
                  </div>
                  {highlightLabel ? (
                    <div className="rounded-[1rem] border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                      {highlightLabel}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2" dir="ltr">
                    {(project.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {t('projects.details')}
                      <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
                    </Link>
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t('projects.liveDemo')}
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        <Github className="h-4 w-4" />
                        {t('projects.sourceCode')}
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
          </div>
        )}
      </section>

      <section className="order-2 flex flex-col gap-6 border-t border-border/60 pt-10">
        <div className="max-w-3xl space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {t('projects.demoBadge')}
          </p>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {t('projects.demoProjectsTitle')}
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            {t('projects.demoProjectsDescription')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {demoCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveDemoCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeDemoCategory === category
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {getDemoCategoryLabel(category, isArabic)}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDemoProjects.map((project, index) => {
            const projectType = normalizeProjectType(project.type ?? project.category);
            const demoCategory = getDemoCategory(project);
            const titleText = getLocalizedValue(project.title, project.titleAr, isArabic) || project.title;
            const descriptionText =
              getLocalizedValue(project.description, project.descriptionAr, isArabic) || project.description;
            const highlightLabel = getLocalizedValue(project.highlightLabel, project.highlightLabelAr, isArabic);
            const previewImage = resolveMediaField({ url: project.image, assetId: project.imageAssetId }, assets);

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group overflow-hidden rounded-[1.75rem] border border-primary/20 bg-card/70 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="block aspect-[16/10] overflow-hidden bg-slate-950"
                >
                  {previewImage.url ? (
                    <img
                      src={previewImage.url}
                      alt={titleText}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full flex-col justify-between p-6 text-slate-100">
                      <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                        <span dir={isArabic ? 'rtl' : 'ltr'}>
                          {isArabic ? titleText : `${project.slug}.app`}
                        </span>
                        <span>{t('projects.demoBadge')}</span>
                      </div>
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal-300">
                          {project.category}
                        </p>
                        <h3 className="mt-3 font-heading text-3xl font-black tracking-tight">{titleText}</h3>
                      </div>
                    </div>
                  )}
                </Link>

                <div className="space-y-5 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {t(projectTypeKeyMap[projectType])}
                    </span>
                    <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {t('projects.demoBadge')}
                    </span>
                    <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
                      {getDemoCategoryLabel(demoCategory, isArabic)}
                    </span>
                  </div>

                  <div>
                    <Link to={`/projects/${project.slug}`}>
                      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {titleText}
                      </h2>
                    </Link>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {descriptionText}
                    </p>
                  </div>
                  {highlightLabel ? (
                    <div className="rounded-[1rem] border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                      {highlightLabel}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2" dir="ltr">
                    {(project.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {t('projects.details')}
                      <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
                    </Link>
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t('projects.liveDemo')}
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
