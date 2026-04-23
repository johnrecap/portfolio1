import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, FileText, Plus, Search, Star, Trash2 } from 'lucide-react';
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
import { getLocalizedValue, resolveMediaField, type BlogRecord } from '@/lib/content-hub';
import { normalizeMediaUrl } from '@/lib/media';

type BlogFormState = {
  title: string;
  titleAr: string;
  slug: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  category: string;
  coverImage: string;
  coverImageAssetId: string;
  tagsInput: string;
  readTime: string;
  featured: boolean;
  seoTitle: string;
  seoTitleAr: string;
  seoDescription: string;
  seoDescriptionAr: string;
  seoImage: string;
  seoImageAssetId: string;
};

const initialFormState: BlogFormState = {
  title: '',
  titleAr: '',
  slug: '',
  excerpt: '',
  excerptAr: '',
  content: '',
  contentAr: '',
  category: '',
  coverImage: '',
  coverImageAssetId: '',
  tagsInput: '',
  readTime: '',
  featured: false,
  seoTitle: '',
  seoTitleAr: '',
  seoDescription: '',
  seoDescriptionAr: '',
  seoImage: '',
  seoImageAssetId: '',
};

function splitTags(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function filterArticles(items: BlogRecord[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    [item.title, item.titleAr, item.excerpt, item.excerptAr, item.category, ...(item.tags ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

function buildBlogPayload(formData: BlogFormState) {
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
    excerpt: formData.excerpt.trim(),
    excerptAr: formData.excerptAr.trim(),
    content: formData.content.trim(),
    contentAr: formData.contentAr.trim(),
    category: formData.category.trim(),
    coverImage: normalizeMediaUrl(formData.coverImage),
    coverImageAssetId: formData.coverImageAssetId.trim(),
    image: normalizeMediaUrl(formData.coverImage),
    imageAssetId: formData.coverImageAssetId.trim(),
    tags: splitTags(formData.tagsInput),
    readTime: formData.readTime.trim(),
    featured: formData.featured,
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

      return value !== '';
    }),
  );
}

export const DashboardBlog = () => {
  const { data: blogs, loading, addDocument, updateDocument, removeDocument } = useCollection<BlogRecord>('blogs');
  const { assets } = useMediaLibrary();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<BlogFormState>(initialFormState);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isArabic = i18n.language === 'ar';

  const filteredBlogs = useMemo(() => filterArticles(blogs, search), [blogs, search]);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: checked }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = buildBlogPayload(formData);

    if (editingId) {
      await updateDocument(editingId, payload);
    } else {
      await addDocument(payload);
    }

    handleDialogChange(false);
  };

  const handleEdit = (blog: BlogRecord) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title || '',
      titleAr: blog.titleAr || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      excerptAr: blog.excerptAr || '',
      content: blog.content || '',
      contentAr: blog.contentAr || '',
      category: blog.category || '',
      coverImage: blog.coverImage || blog.image || '',
      coverImageAssetId: blog.coverImageAssetId || blog.imageAssetId || '',
      tagsInput: (blog.tags ?? []).join(', '),
      readTime: blog.readTime || '',
      featured: Boolean(blog.featured),
      seoTitle: blog.seo?.title || '',
      seoTitleAr: blog.seo?.titleAr || '',
      seoDescription: blog.seo?.description || '',
      seoDescriptionAr: blog.seo?.descriptionAr || '',
      seoImage: blog.seo?.image || '',
      seoImageAssetId: blog.seo?.imageAssetId || '',
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
            {t('dashboardBlog.blogManager')}
          </h1>
          <p className="mt-2 text-muted-foreground">{t('dashboardBlog.publishThoughts')}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('dashboardBlog.searchArticles')}
              className="h-12 rounded-full pl-11"
            />
          </div>

          <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger className={buttonVariants({ className: 'h-12 gap-2 rounded-full px-6 font-semibold' })}>
              <Plus className="h-4 w-4" />
              {t('dashboardBlog.newArticle')}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? t('dashboardBlog.editArticle') : t('dashboardBlog.newArticle')}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('dashboardBlog.title')}</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleAr">{t('dashboardBlog.titleAr')}</Label>
                    <Input id="titleAr" name="titleAr" value={formData.titleAr} onChange={handleChange} dir="rtl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">{t('dashboardBlog.slug')}</Label>
                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t('dashboardBlog.category')}</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagsInput">{t('dashboardBlog.tags')}</Label>
                    <Input id="tagsInput" name="tagsInput" value={formData.tagsInput} onChange={handleChange} placeholder="frontend, product, firebase" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="readTime">{t('dashboardBlog.readTime')}</Label>
                    <Input id="readTime" name="readTime" value={formData.readTime} onChange={handleChange} placeholder="6 min read" />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                  <label className="flex items-center justify-between rounded-[1.25rem] border border-border/60 bg-muted/30 px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{t('dashboardBlog.featured')}</span>
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleCheckboxChange} className="h-5 w-5" />
                  </label>
                  <div className="rounded-[1.25rem] border border-border/60 bg-background/70 px-4 py-3 text-sm leading-7 text-muted-foreground">
                    {t('dashboardBlog.featuredHint')}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">{t('dashboardBlog.excerpt')}</Label>
                    <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} className="min-h-[120px]" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerptAr">{t('dashboardBlog.excerptAr')}</Label>
                    <Textarea id="excerptAr" name="excerptAr" value={formData.excerptAr} onChange={handleChange} dir="rtl" className="min-h-[120px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">{t('dashboardBlog.content')}</Label>
                    <Textarea id="content" name="content" value={formData.content} onChange={handleChange} className="min-h-[280px] font-mono text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contentAr">{t('dashboardBlog.contentAr')}</Label>
                    <Textarea id="contentAr" name="contentAr" value={formData.contentAr} onChange={handleChange} dir="rtl" className="min-h-[280px]" />
                  </div>
                </div>

                <MediaPicker
                  label={t('dashboardBlog.coverBlock')}
                  assetLabel={t('dashboardBlog.coverAsset')}
                  urlLabel={t('dashboardBlog.coverImage')}
                  url={formData.coverImage}
                  assetId={formData.coverImageAssetId}
                  assets={assets}
                  kind="image"
                  previewAlt={formData.title || 'Cover image'}
                  onUrlChange={(value) => setFormData((current) => ({ ...current, coverImage: value }))}
                  onAssetIdChange={(value) => setFormData((current) => ({ ...current, coverImageAssetId: value }))}
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Star className="h-4 w-4" />
                    <h3 className="font-heading text-lg font-bold text-foreground">{t('dashboardBlog.seo')}</h3>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitle">{t('dashboardBlog.seoTitle')}</Label>
                      <Input id="seoTitle" name="seoTitle" value={formData.seoTitle} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoTitleAr">{t('dashboardBlog.seoTitleAr')}</Label>
                      <Input id="seoTitleAr" name="seoTitleAr" value={formData.seoTitleAr} onChange={handleChange} dir="rtl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">{t('dashboardBlog.seoDescription')}</Label>
                      <Textarea id="seoDescription" name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescriptionAr">{t('dashboardBlog.seoDescriptionAr')}</Label>
                      <Textarea id="seoDescriptionAr" name="seoDescriptionAr" value={formData.seoDescriptionAr} onChange={handleChange} dir="rtl" className="min-h-[120px]" />
                    </div>
                  </div>

                  <MediaPicker
                    label={t('dashboardBlog.seoImageBlock')}
                    assetLabel={t('dashboardBlog.seoImageAsset')}
                    urlLabel={t('dashboardBlog.seoImage')}
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
                    {t('dashboardBlog.cancel')}
                  </Button>
                  <Button type="submit">{t('dashboardBlog.publish')}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <SkeletonBlocks count={4} className="lg:grid-cols-2" />
      ) : filteredBlogs.length === 0 ? (
        <EmptyState title={t('dashboardBlog.noArticles')} description={t('dashboardBlog.emptyDescription')} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredBlogs.map((blog, index) => {
            const cover = resolveMediaField({ url: blog.coverImage || blog.image, assetId: blog.coverImageAssetId || blog.imageAssetId }, assets);
            const title = getLocalizedValue(blog.title, blog.titleAr, isArabic) || blog.title;
            const excerpt = getLocalizedValue(blog.excerpt, blog.excerptAr, isArabic) || blog.excerpt;

            return (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 shadow-sm"
              >
                <div className="grid sm:grid-cols-[220px_1fr]">
                  <div className="h-52 overflow-hidden bg-muted">
                    {cover.url ? (
                      <img src={cover.url} alt={title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <FileText className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {blog.category}
                          </span>
                          {blog.featured ? (
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              {t('dashboardBlog.featured')}
                            </span>
                          ) : null}
                        </div>
                        <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">{title}</h2>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{excerpt}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(blog)}
                          className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(blog.id)}
                          className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(blog.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                      {blog.readTime ? (
                        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                          {blog.readTime}
                        </span>
                      ) : null}
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
            <DialogTitle>{t('dashboardBlog.confirmDeleteTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-7 text-muted-foreground">{t('dashboardBlog.confirmDelete')}</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              {t('dashboardBlog.cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={() => void confirmDelete()}>
              {t('dashboardBlog.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
