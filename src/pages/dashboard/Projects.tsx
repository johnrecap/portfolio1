import { useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Image as ImageIcon, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState, SkeletonBlocks } from '@/components/shared/PageState';
import { useCollection } from '@/hooks/useFirestore';
import { filterProjects, type ProjectRecord } from '@/lib/project-utils';

type ProjectFormState = {
  title: string;
  slug: string;
  description: string;
  category: string;
  type: string;
  image: string;
  demoUrl: string;
  githubUrl: string;
  tagsInput: string;
  featured: boolean;
  featuredOrder: string;
  problem: string;
  problemAr: string;
  solution: string;
  solutionAr: string;
  projectRole: string;
  projectRoleAr: string;
  result: string;
  resultAr: string;
};

const initialFormState: ProjectFormState = {
  title: '',
  slug: '',
  description: '',
  category: '',
  type: 'web',
  image: '',
  demoUrl: '',
  githubUrl: '',
  tagsInput: '',
  featured: false,
  featuredOrder: '',
  problem: '',
  problemAr: '',
  solution: '',
  solutionAr: '',
  projectRole: '',
  projectRoleAr: '',
  result: '',
  resultAr: '',
};

const projectTypes = ['web', 'mobile', 'dashboard', 'backend', 'other'] as const;

export const DashboardProjects = () => {
  const { data: projects, loading, addDocument, updateDocument, removeDocument } = useCollection<ProjectRecord>('projects');
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<ProjectFormState>(initialFormState);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredProjects = filterProjects(projects, {
    search,
    activeType: 'all',
    activeTag: '',
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / image.width);
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        const context = canvas.getContext('2d');
        context?.drawImage(image, 0, 0, canvas.width, canvas.height);
        setFormData((current) => ({
          ...current,
          image: canvas.toDataURL('image/webp', 0.84),
        }));
      };
      image.src = loadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      image: formData.image,
      demoUrl: formData.demoUrl,
      githubUrl: formData.githubUrl,
      color: 'bg-teal-500',
      featured: formData.featured,
      featuredOrder: formData.featuredOrder ? Number(formData.featuredOrder) : null,
      tags: formData.tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      problem: formData.problem,
      problemAr: formData.problemAr,
      solution: formData.solution,
      solutionAr: formData.solutionAr,
      projectRole: formData.projectRole,
      projectRoleAr: formData.projectRoleAr,
      result: formData.result,
      resultAr: formData.resultAr,
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== null),
    );

    if (editingId) {
      await updateDocument(editingId, cleanedPayload);
    } else {
      await addDocument(cleanedPayload);
    }

    handleDialogChange(false);
  };

  const handleEdit = (project: ProjectRecord) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      description: project.description || '',
      category: project.category || '',
      type: project.type || 'web',
      image: project.image || '',
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      tagsInput: (project.tags ?? []).join(', '),
      featured: Boolean(project.featured),
      featuredOrder: project.featuredOrder ? String(project.featuredOrder) : '',
      problem: project.problem || '',
      problemAr: project.problemAr || '',
      solution: project.solution || '',
      solutionAr: project.solutionAr || '',
      projectRole: project.projectRole || '',
      projectRoleAr: project.projectRoleAr || '',
      result: project.result || '',
      resultAr: project.resultAr || '',
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
          <div className="relative w-full sm:w-[280px]">
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
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

                <div className="grid gap-6 lg:grid-cols-[1fr_220px_220px]">
                  <div className="space-y-2">
                    <Label htmlFor="image">{t('dashboardProjects.imageUrl')}</Label>
                    <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    {formData.image ? (
                      <p className="text-xs text-muted-foreground">
                        {formData.image.startsWith('data:')
                          ? t('dashboardProjects.imageAttachedLocal')
                          : t('dashboardProjects.imageAttachedUrl')}
                      </p>
                    ) : null}
                  </div>
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
                    <Input
                      id="featuredOrder"
                      name="featuredOrder"
                      type="number"
                      min="1"
                      value={formData.featuredOrder}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('dashboardProjects.description')}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="min-h-[120px]"
                  />
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
                      <Textarea id="problem" name="problem" value={formData.problem} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problemAr">{t('dashboardProjects.problemAr')}</Label>
                      <Textarea id="problemAr" name="problemAr" value={formData.problemAr} onChange={handleChange} dir="rtl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="solution">{t('dashboardProjects.solution')}</Label>
                      <Textarea id="solution" name="solution" value={formData.solution} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="solutionAr">{t('dashboardProjects.solutionAr')}</Label>
                      <Textarea id="solutionAr" name="solutionAr" value={formData.solutionAr} onChange={handleChange} dir="rtl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectRole">{t('dashboardProjects.projectRole')}</Label>
                      <Textarea id="projectRole" name="projectRole" value={formData.projectRole} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectRoleAr">{t('dashboardProjects.projectRoleAr')}</Label>
                      <Textarea id="projectRoleAr" name="projectRoleAr" value={formData.projectRoleAr} onChange={handleChange} dir="rtl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="result">{t('dashboardProjects.result')}</Label>
                      <Textarea id="result" name="result" value={formData.result} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resultAr">{t('dashboardProjects.resultAr')}</Label>
                      <Textarea id="resultAr" name="resultAr" value={formData.resultAr} onChange={handleChange} dir="rtl" />
                    </div>
                  </div>
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
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 shadow-sm"
            >
              <div className="grid sm:grid-cols-[220px_1fr]">
                <div className="h-48 overflow-hidden bg-muted">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="space-y-5 p-6">
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
                      <h2 className="mt-3 font-heading text-2xl font-bold text-foreground">{project.title}</h2>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(project.id)}
                        className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {(project.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboardProjects.confirmDeleteTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t('dashboardProjects.confirmDelete')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t('dashboardProjects.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t('dashboardProjects.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
