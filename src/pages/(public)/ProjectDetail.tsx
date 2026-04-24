import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Code, ExternalLink, Monitor, Rocket } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PageSeo } from '@/components/shared/PageSeo';
import { EmptyState, SkeletonBlocks, SkeletonMedia } from '@/components/shared/PageState';
import { usePublicCollection, usePublicMediaLibrary } from '@/hooks/public-firestore';
import { getLocalizedValue, resolveEntitySeo, resolveMediaField } from '@/lib/content-hub';
import { normalizeMediaUrl } from '@/lib/media';
import { getLocalizedCaseStudyValue, type ProjectRecord } from '@/lib/project-utils';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: projects, loading } = usePublicCollection<ProjectRecord>('projects');
  const { assets, loading: mediaLoading } = usePublicMediaLibrary();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === 'ar';
  const backIconClass = isArabic ? 'rotate-180' : '';
  const project = projects.find((item) => item.slug === slug);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10">
        <SkeletonBlocks count={3} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-4xl py-20">
        <EmptyState
          title={t('projectDetail.notFoundTitle')}
          description={t('projectDetail.notFoundDescription')}
        />
      </div>
    );
  }

  const title = getLocalizedValue(project.title, project.titleAr, isArabic) || project.title;
  const description = getLocalizedValue(project.description, project.descriptionAr, isArabic) || project.description;
  const seo = resolveEntitySeo(project, assets, isArabic);
  const heroImage = resolveMediaField({ url: project.image, assetId: project.imageAssetId }, assets);
  const galleryImages = [
    ...new Set(
      (project.galleryImages ?? []).map((imageUrl) => normalizeMediaUrl(imageUrl)).filter(Boolean),
    ),
  ];
  const caseStudyBlocks = [
    {
      key: 'problem',
      title: t('projectDetail.problem'),
      value: getLocalizedCaseStudyValue(project.problem, project.problemAr, isArabic),
    },
    {
      key: 'solution',
      title: t('projectDetail.solution'),
      value: getLocalizedCaseStudyValue(project.solution, project.solutionAr, isArabic),
    },
    {
      key: 'projectRole',
      title: t('projectDetail.role'),
      value: getLocalizedCaseStudyValue(project.projectRole, project.projectRoleAr, isArabic),
    },
    {
      key: 'result',
      title: t('projectDetail.result'),
      value: getLocalizedCaseStudyValue(project.result, project.resultAr, isArabic),
    },
  ].filter((item) => item.value);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pt-10 pb-20">
      <PageSeo title={seo.title || title} description={seo.description || description} image={seo.image || heroImage.url} />

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-primary">
          {t('projectDetail.breadcrumbHome')}
        </Link>
        <span>/</span>
        <Link to="/projects" className="transition-colors hover:text-primary">
          {t('projectDetail.breadcrumbProjects')}
        </Link>
        <span>/</span>
        <span className="text-primary">{project.slug}</span>
      </div>

      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {project.category}
          </span>
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-black tracking-tight text-foreground md:text-6xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noreferrer">
                <Button size="lg" className="gap-2">
                  {t('projectDetail.livePreview')}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            ) : null}
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-border/70 bg-card/60"
                >
                  {t('projectDetail.sourceCode')}
                  <Code className="h-4 w-4" />
                </Button>
              </a>
            ) : null}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-slate-800 bg-[#0d1117] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-5 py-3 font-mono text-xs text-slate-400">
            <span>{project.slug}.app</span>
            <Monitor className="h-4 w-4" />
          </div>
          <div className="aspect-video bg-slate-950">
            {mediaLoading ? (
              <SkeletonMedia className="h-full w-full rounded-none bg-slate-800/70" />
            ) : heroImage.url ? (
              <img
                src={heroImage.url}
                alt={title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-600">
                {t('projectDetail.emptyPreview')}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-6">
          {galleryImages.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((imageUrl) => (
                <div key={imageUrl} className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-card/60 shadow-sm">
                  <img src={imageUrl} alt={title} referrerPolicy="no-referrer" className="aspect-video w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
          {caseStudyBlocks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {caseStudyBlocks.map((item) => (
                <div
                  key={item.key}
                  className="rounded-[1.5rem] border border-border/60 bg-card/60 p-6 shadow-sm"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-border/60 bg-card/60 p-6 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {t('projectDetail.overview')}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t('projectDetail.caseStudyFallback')}
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-5 rounded-[1.5rem] border border-border/60 bg-card/60 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="h-5 w-5" />
            <h2 className="font-heading text-xl font-bold text-foreground">
              {t('projectDetail.techStack')}
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t('projectDetail.technologies')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2" dir="ltr">
                {(project.tags ?? []).length > 0 ? (
                  (project.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">{t('projectDetail.noTech')}</span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </section>

      <div>
        <Link to="/projects">
          <Button variant="ghost" className="gap-2 px-0 text-primary hover:bg-transparent">
            <ArrowLeft className={`h-4 w-4 ${backIconClass}`} />
            {t('projectDetail.backToProjects')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
