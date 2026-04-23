import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Image as ImageIcon, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { MediaPicker } from '@/components/dashboard/media/media-picker';
import { EmptyState, SkeletonBlocks } from '@/components/shared/PageState';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCollection } from '@/hooks/useFirestore';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { getLocalizedValue, resolveMediaField, type ProjectRecord } from '@/lib/content-hub';
import { normalizeMediaUrl, normalizeMediaUrls } from '@/lib/media';
import { filterProjects } from '@/lib/project-utils';

type ProjectFormState = {
  title: string;
  titleAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  category: string;
  type: string;
  image: string;
  imageAssetId: string;
  demoUrl: string;
  githubUrl: string;
  tagsInput: string;
  featured: boolean;
  featuredOrder: string;
  highlightLabel: string;
  highlightLabelAr: string;
  galleryInput: string;
  problem: string;
  problemAr: string;
  solution: string;
  solutionAr: string;
  projectRole: string;
  projectRoleAr: string;
  result: string;
  resultAr: string;
  seoTitle: string;
  seoTitleAr: string;
  seoDescription: string;
  seoDescriptionAr: string;
  seoImage: string;
  seoImageAssetId: string;
};

const initialFormState: ProjectFormState = {
  title: '',
  titleAr: '',
  slug: '',
  description: '',
  descriptionAr: '',
  category: '',
  type: 'web',
  image: '',
  imageAssetId: '',
  demoUrl: '',
  githubUrl: '',
  tagsInput: '',
  featured: false,
  featuredOrder: '',
  highlightLabel: '',
  highlightLabelAr: '',
  galleryInput: '',
  problem: '',
  problemAr: '',
  solution: '',
  solutionAr: '',
  projectRole: '',
  projectRoleAr: '',
  result: '',
  resultAr: '',
  seoTitle: '',
  seoTitleAr: '',
  seoDescription: '',
  seoDescriptionAr: '',
  seoImage: '',
  seoImageAssetId: '',
};

const projectTypes = ['web', 'mobile', 'dashboard', 'backend', 'other'] as const;

function splitList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildProjectPayload(formData: ProjectFormState) {
  const seo = Object.fromEntries(
    Object.entries({
      title: formData.seoTitle.trim(),
      titleAr: formData.seoTitleAr.trim(),
      description: formData.seoDescription.trim(),
      descriptionAr: formData.seoDescriptionAr.trim(),
      image: normalizeMediaUrl(formData.seoImage),
      imageAssetId: formData.seoImageAssetId.trim(),
    }).filter(([, value]) => value !== ''),
  );

  const payload = {
    title: formData.title.trim(),
    titleAr: formData.titleAr.trim(),
    slug: formData.slug.trim(),
    description: formData.description.trim(),
    descriptionAr: formData.descriptionAr.trim(),
    category: formData.category.trim(),
    type: formData.type,
    image: normalizeMediaUrl(formData.image),
    imageAssetId: formData.imageAssetId.trim(),
    demoUrl: formData.demoUrl.trim(),
    githubUrl: formData.githubUrl.trim(),
    color: 'bg-teal-500',
    featured: formData.featured,
    featuredOrder: formData.featuredOrder ? Number(formData.featuredOrder) : null,
    tags: splitList(formData.tagsInput),
    highlightLabel: formData.highlightLabel.trim(),
    highlightLabelAr: formData.highlightLabelAr.trim(),
    galleryImages: normalizeMediaUrls(splitList(formData.galleryInput)),
    problem: formData.problem.trim(),
    problemAr: formData.problemAr.trim(),
    solution: formData.solution.trim(),
    solutionAr: formData.solutionAr.trim(),
    projectRole: formData.projectRole.trim(),
    projectRoleAr: formData.projectRoleAr.trim(),
    result: formData.result.trim(),
    resultAr: formData.resultAr.trim(),
    seo,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (value && typeof value === 'object') {
        return Object.keys(value).length > 0;
      }

      return value !== '' && value !== null;
    }),
  );
}

export const DashboardProjects = () => {
  const { data: projects, loading, addDocument, updateDocument, removeDocument } = useCollection<ProjectRecord>('projects');
  const { assets } = useMediaLibrary();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<ProjectFormState>(initialFormState);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isArabic = i18n.language === 'ar';

  const filteredProjects = useMemo(
    () =>
      filterProjects(projects, {
        search,
        activeType: 'all',
        activeTag: '',
      }),
    [projects, search],
  );

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: checked }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = buildProjectPayload(formData);

    if (editingId) {
      await updateDocument(editingId, payload);
    } else {
      await addDocument(payload);
    }

    handleDialogChange(false);
  };

  const handleEdit = (project: ProjectRecord) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || '',
      titleAr: project.titleAr || '',
      slug: project.slug || '',
      description: project.description || '',
      descriptionAr: project.descriptionAr || '',
      category: project.category || '',
      type: project.type || 'web',
      image: project.image || '',
      imageAssetId: project.imageAssetId || '',
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      tagsInput: (project.tags ?? []).join(', '),
      featured: Boolean(project.featured),
      featuredOrder: typeof project.featuredOrder === 'number' ? String(project.featuredOrder) : '',
      highlightLabel: project.highlightLabel || '',
      highlightLabelAr: project.highlightLabelAr || '',
      galleryInput: (project.galleryImages ?? []).join('\n'),
      problem: project.problem || '',
      problemAr: project.problemAr || '',
      solution: project.solution || '',
      solutionAr: project.solutionAr || '',
      projectRole: project.projectRole || '',
      projectRoleAr: project.projectRoleAr || '',
      result: project.result || '',
      resultAr: project.resultAr || '',
      seoTitle: project.seo?.title || '',
      seoTitleAr: project.seo?.titleAr || '',
      seoDescription: project.seo?.description || '',
      seoDescriptionAr: project.seo?.descriptionAr || '',
      seoImage: project.seo?.image || '',
      seoImageAssetId: project.seo?.imageAssetId || '',
    });
    setIsOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      return;
    }

    await removeDocument(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 pt-10 pb-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
            {t('dashboardProjects.projects')}
          </h1>
          <p className="mt-2 text-muted-foreground">{t('dashboardProjects.managePortfolio')}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('dashboardProjects.searchProjects')}
              className="h-12 rounded-full pl-11"
            />
          </div>

          <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger className={buttonVariants({ className: 'h-12 gap-2 rounded-full px-6 font-semibold' })}>
              <Plus className="h-4 w-4" />
              {t('dashboardProjects.addProject')}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? t('dashboardProjects.editProject') : t('dashboardProjects.addNewProject')}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('dashboardProjects.title')}</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleAr">{t('dashboardProjects.titleAr')}</Label>
                    <Input id="titleAr" name="titleAr" value={formData.titleAr} onChange={handleChange} dir="rtl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">{t('dashboardProjects.slug')}</Label>
                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                    <p className="text-xs text-muted-foreground">{t('dashboardProjects.slugHint')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t('dashboardProjects.category')}</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">{t('dashboardProjects.type')}</Label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3"
                    >
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {t(`dashboardProjects.types.${type}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagsInput">{t('dashboardProjects.techStack')}</Label>
                    <Input
                      id="tagsInput"
                      name="tagsInput"
                      value={formData.tagsInput}
                      onChange={handleChange}
                      placeholder="React, Firebase, Tailwind CSS"
                    />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('dashboardProjects.description')}</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="min-h-[140px]" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descriptionAr">{t('dashboardProjects.descriptionAr')}</Label>
                    <Textarea id="descriptionAr" name="descriptionAr" value={formData.descriptionAr} onChange={handleChange} dir="rtl" className="min-h-[140px]" />
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <MediaPicker
                    label={t('dashboardProjects.primaryMedia')}
                    assetLabel={t('dashboardProjects.primaryMediaAsset')}
                    urlLabel={t('dashboardProjects.imageUrl')}
                    url={formData.image}
                    assetId={formData.imageAssetId}
                    assets={assets}
                    kind="image"
                    previewAlt={formData.title || 'Project preview'}
                    onUrlChange={(value) => setFormData((current) => ({ ...current, image: value }))}
                    onAssetIdChange={(value) => setFormData((current) => ({ ...current, imageAssetId: value }))}
                  />

                  <div className="space-y-4 rounded-[1.5rem] border border-border/60 bg-background/60 p-4">
                    <div className="space-y-2">
                      <Label htmlFor="galleryInput">{t('dashboardProjects.gallery')}</Label>
                      <Textarea
                        id="galleryInput"
                        name="galleryInput"
                        value={formData.galleryInput}
                        onChange={handleChange}
                        className="min-h-[220px]"
                        dir="ltr"
                        placeholder={t('dashboardProjects.galleryHint')}
                      />
                    </div>
                    <p className="text-xs leading-6 text-muted-foreground">{t('dashboardProjects.galleryHelper')}</p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="demoUrl">{t('dashboardProjects.demoUrl')}</Label>
                    <Input id="demoUrl" name="demoUrl" value={formData.demoUrl} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">{t('dashboardProjects.githubUrl')}</Label>
                    <Input id="githubUrl" name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highlightLabel">{t('dashboardProjects.highlightLabel')}</Label>
                    <Input id="highlightLabel" name="highlightLabel" value={formData.highlightLabel} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[220px_220px_1fr]">
                  <label className="flex items-center justify-between rounded-[1.25rem] border border-border/60 bg-muted/30 px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{t('dashboardProjects.featured')}</span>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5"
                    />
                  </label>
                  <div className="space-y-2">
                    <Label htmlFor="featuredOrder">{t('dashboardProjects.featuredOrder')}</Label>
                    <Input id="featuredOrder" name="featuredOrder" type="number" min="1" value={formData.featuredOrder} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highlightLabelAr">{t('dashboardProjects.highlightLabelAr')}</Label>
                    <Input id="highlightLabelAr" name="highlightLabelAr" value={formData.highlightLabelAr} onChange={handleChange} dir="rtl" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {t('dashboardProjects.caseStudy')}
                    </h3>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="problem">{t('dashboardProjects.problem')}</Label>
                      <Textarea id="problem" name="problem" value={formData.problem} onChange={handleChange} className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problemAr">{t('dashboardProjects.problemAr')}</Label>
                      <Textarea id="problemAr" name="problemAr" value={formData.problemAr} onChange={handleChange} dir="rtl" className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="solution">{t('dashboardProjects.solution')}</Label>
                      <Textarea id="solution" name="solution" value={formData.solution} onChange={handleChange} className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="solutionAr">{t('dashboardProjects.solutionAr')}</Label>
                      <Textarea id="solutionAr" name="solutionAr" value={formData.solutionAr} onChange={handleChange} dir="rtl" className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectRole">{t('dashboardProjects.projectRole')}</Label>
                      <Textarea id="projectRole" name="projectRole" value={formData.projectRole} onChange={handleChange} className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectRoleAr">{t('dashboardProjects.projectRoleAr')}</Label>
                      <Textarea id="projectRoleAr" name="projectRoleAr" value={formData.projectRoleAr} onChange={handleChange} dir="rtl" className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="result">{t('dashboardProjects.result')}</Label>
                      <Textarea id="result" name="result" value={formData.result} onChange={handleChange} className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resultAr">{t('dashboardProjects.resultAr')}</Label>
                      <Textarea id="resultAr" name="resultAr" value={formData.resultAr} onChange={handleChange} dir="rtl" className="min-h-[120px]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {t('dashboardProjects.seo')}
                    </h3>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitle">{t('dashboardProjects.seoTitle')}</Label>
                      <Input id="seoTitle" name="seoTitle" value={formData.seoTitle} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoTitleAr">{t('dashboardProjects.seoTitleAr')}</Label>
                      <Input id="seoTitleAr" name="seoTitleAr" value={formData.seoTitleAr} onChange={handleChange} dir="rtl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">{t('dashboardProjects.seoDescription')}</Label>
                      <Textarea id="seoDescription" name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescriptionAr">{t('dashboardProjects.seoDescriptionAr')}</Label>
                      <Textarea id="seoDescriptionAr" name="seoDescriptionAr" value={formData.seoDescriptionAr} onChange={handleChange} dir="rtl" className="min-h-[120px]" />
                    </div>
                  </div>

                  <MediaPicker
                    label={t('dashboardProjects.seoImageBlock')}
                    assetLabel={t('dashboardProjects.seoImageAsset')}
                    urlLabel={t('dashboardProjects.seoImage')}
                    url={formData.seoImage}
                    assetId={formData.seoImageAssetId}
                    assets={assets}
                    kind="image"
                    previewAlt={formData.title || 'SEO image'}
                    onUrlChange={(value) => setFormData((current) => ({ ...current, seoImage: value }))}
                    onAssetIdChange={(value) => setFormData((current) => ({ ...current, seoImageAssetId: value }))}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                    {t('dashboardProjects.cancel')}
                  </Button>
                  <Button type="submit">{t('dashboardProjects.saveChanges')}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <SkeletonBlocks count={4} className="lg:grid-cols-2" />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title={t('dashboardProjects.noProjects')}
          description={t('dashboardProjects.noProjectsDescription')}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredProjects.map((project, index) => {
            const previewImage = resolveMediaField({ url: project.image, assetId: project.imageAssetId }, assets);
            const title = getLocalizedValue(project.title, project.titleAr, isArabic) || project.title;
            const description = getLocalizedValue(project.description, project.descriptionAr, isArabic) || project.description;
            const highlightLabel = getLocalizedValue(project.highlightLabel, project.highlightLabelAr, isArabic);

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 shadow-sm"
              >
                <div className="grid sm:grid-cols-[220px_1fr]">
                  <div className="h-48 overflow-hidden bg-muted">
                    {previewImage.url ? (
                      <img
                        src={previewImage.url}
                        alt={title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {project.type || project.category}
                          </span>
                          {project.featured ? (
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              {t('dashboardProjects.featured')}
                            </span>
                          ) : null}
                        </div>
                        <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">{title}</h2>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(project)}
                          className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(project.id)}
                          className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {highlightLabel ? (
                      <div className="rounded-[1rem] border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                        {highlightLabel}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      {(project.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1rem] border border-border/60 bg-background/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{t('dashboardProjects.galleryCount')}</p>
                        <p className="mt-2 font-semibold text-foreground">{project.galleryImages?.length ?? 0}</p>
                      </div>
                      <div className="rounded-[1rem] border border-border/60 bg-background/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{t('dashboardProjects.seoReady')}</p>
                        <p className="mt-2 font-semibold text-foreground">{project.seo ? t('dashboardProjects.ready') : t('dashboardProjects.pending')}</p>
                      </div>
                      <div className="rounded-[1rem] border border-border/60 bg-background/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{t('dashboardProjects.caseStudy')}</p>
                        <p className="mt-2 font-semibold text-foreground">
                          {[project.problem, project.solution, project.projectRole, project.result].filter(Boolean).length}/4
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboardProjects.confirmDeleteTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-7 text-muted-foreground">{t('dashboardProjects.confirmDelete')}</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              {t('dashboardProjects.cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={() => void confirmDelete()}>
              {t('dashboardProjects.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
