import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, MessageSquareQuote, Plus, Search, Star, Trash2 } from 'lucide-react';
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
import type { TestimonialRecord } from '@/lib/content-hub';
import { getFeaturedTestimonials, getLocalizedValue, resolveMediaField } from '@/lib/content-hub';
import { normalizeMediaUrl } from '@/lib/media';

type TestimonialFormState = {
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  company: string;
  companyAr: string;
  quote: string;
  quoteAr: string;
  outcome: string;
  outcomeAr: string;
  avatarUrl: string;
  avatarAssetId: string;
  logoUrl: string;
  logoAssetId: string;
  visible: boolean;
  featured: boolean;
  order: string;
};

const initialFormState: TestimonialFormState = {
  name: '',
  nameAr: '',
  role: '',
  roleAr: '',
  company: '',
  companyAr: '',
  quote: '',
  quoteAr: '',
  outcome: '',
  outcomeAr: '',
  avatarUrl: '',
  avatarAssetId: '',
  logoUrl: '',
  logoAssetId: '',
  visible: true,
  featured: false,
  order: '1',
};

function filterTestimonials(items: TestimonialRecord[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    [item.name, item.nameAr, item.role, item.roleAr, item.company, item.companyAr, item.quote, item.quoteAr]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export const DashboardTestimonials = () => {
  const { t, i18n } = useTranslation();
  const { data, loading, addDocument, updateDocument, removeDocument } = useCollection<TestimonialRecord>('testimonials');
  const { assets } = useMediaLibrary();
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<TestimonialFormState>(initialFormState);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isArabic = i18n.language === 'ar';

  const featuredSnapshot = useMemo(() => getFeaturedTestimonials(data, 3), [data]);
  const filteredTestimonials = useMemo(() => filterTestimonials(data, search), [data, search]);

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

    const payload = {
      name: formData.name.trim(),
      nameAr: formData.nameAr.trim(),
      role: formData.role.trim(),
      roleAr: formData.roleAr.trim(),
      company: formData.company.trim(),
      companyAr: formData.companyAr.trim(),
      quote: formData.quote.trim(),
      quoteAr: formData.quoteAr.trim(),
      outcome: formData.outcome.trim(),
      outcomeAr: formData.outcomeAr.trim(),
      avatarUrl: normalizeMediaUrl(formData.avatarUrl),
      avatarAssetId: formData.avatarAssetId.trim(),
      logoUrl: normalizeMediaUrl(formData.logoUrl),
      logoAssetId: formData.logoAssetId.trim(),
      visible: formData.visible,
      featured: formData.featured,
      order: Number(formData.order || '0'),
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== '' && value !== null),
    );

    if (editingId) {
      await updateDocument(editingId, cleanedPayload);
    } else {
      await addDocument(cleanedPayload);
    }

    handleDialogChange(false);
  };

  const handleEdit = (item: TestimonialRecord) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      nameAr: item.nameAr || '',
      role: item.role || '',
      roleAr: item.roleAr || '',
      company: item.company || '',
      companyAr: item.companyAr || '',
      quote: item.quote || '',
      quoteAr: item.quoteAr || '',
      outcome: item.outcome || '',
      outcomeAr: item.outcomeAr || '',
      avatarUrl: item.avatarUrl || '',
      avatarAssetId: item.avatarAssetId || '',
      logoUrl: item.logoUrl || '',
      logoAssetId: item.logoAssetId || '',
      visible: item.visible !== false,
      featured: Boolean(item.featured),
      order: typeof item.order === 'number' ? String(item.order) : '1',
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
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
            {t('dashboardTestimonials.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">{t('dashboardTestimonials.description')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t('dashboardTestimonials.totalCount')}
            </p>
            <p className="mt-3 font-heading text-4xl font-black text-foreground">{data.length}</p>
          </div>
          <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t('dashboardTestimonials.featuredCount')}
            </p>
            <p className="mt-3 font-heading text-4xl font-black text-foreground">
              {featuredSnapshot.length}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t('dashboardTestimonials.libraryLinked')}
            </p>
            <p className="mt-3 font-heading text-4xl font-black text-foreground">
              {data.filter((item) => item.avatarAssetId || item.logoAssetId).length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('dashboardTestimonials.search')}
            className="h-12 rounded-full pl-11"
          />
        </div>

        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger className={buttonVariants({ className: 'h-12 gap-2 rounded-full px-6 font-semibold' })}>
            <Plus className="h-4 w-4" />
            {t('dashboardTestimonials.addTestimonial')}
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? t('dashboardTestimonials.editTestimonial') : t('dashboardTestimonials.addNewTestimonial')}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('dashboardTestimonials.name')}</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">{t('dashboardTestimonials.nameAr')}</Label>
                  <Input id="nameAr" name="nameAr" value={formData.nameAr} onChange={handleChange} dir="rtl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('dashboardTestimonials.role')}</Label>
                  <Input id="role" name="role" value={formData.role} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleAr">{t('dashboardTestimonials.roleAr')}</Label>
                  <Input id="roleAr" name="roleAr" value={formData.roleAr} onChange={handleChange} dir="rtl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">{t('dashboardTestimonials.company')}</Label>
                  <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAr">{t('dashboardTestimonials.companyAr')}</Label>
                  <Input id="companyAr" name="companyAr" value={formData.companyAr} onChange={handleChange} dir="rtl" />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quote">{t('dashboardTestimonials.quote')}</Label>
                  <Textarea id="quote" name="quote" value={formData.quote} onChange={handleChange} className="min-h-[140px]" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quoteAr">{t('dashboardTestimonials.quoteAr')}</Label>
                  <Textarea id="quoteAr" name="quoteAr" value={formData.quoteAr} onChange={handleChange} dir="rtl" className="min-h-[140px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outcome">{t('dashboardTestimonials.outcome')}</Label>
                  <Textarea id="outcome" name="outcome" value={formData.outcome} onChange={handleChange} className="min-h-[110px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outcomeAr">{t('dashboardTestimonials.outcomeAr')}</Label>
                  <Textarea id="outcomeAr" name="outcomeAr" value={formData.outcomeAr} onChange={handleChange} dir="rtl" className="min-h-[110px]" />
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <MediaPicker
                  label={t('dashboardTestimonials.avatar')}
                  assetLabel={t('dashboardTestimonials.avatarAsset')}
                  urlLabel={t('dashboardTestimonials.avatarUrl')}
                  url={formData.avatarUrl}
                  assetId={formData.avatarAssetId}
                  assets={assets}
                  kind="image"
                  group="people"
                  previewAlt={formData.name || 'Avatar'}
                  onUrlChange={(value) => setFormData((current) => ({ ...current, avatarUrl: value }))}
                  onAssetIdChange={(value) => setFormData((current) => ({ ...current, avatarAssetId: value }))}
                />

                <MediaPicker
                  label={t('dashboardTestimonials.logo')}
                  assetLabel={t('dashboardTestimonials.logoAsset')}
                  urlLabel={t('dashboardTestimonials.logoUrl')}
                  url={formData.logoUrl}
                  assetId={formData.logoAssetId}
                  assets={assets}
                  kind="image"
                  group="branding"
                  previewAlt={formData.company || 'Logo'}
                  onUrlChange={(value) => setFormData((current) => ({ ...current, logoUrl: value }))}
                  onAssetIdChange={(value) => setFormData((current) => ({ ...current, logoAssetId: value }))}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-[220px_220px_220px_1fr]">
                <label className="flex items-center justify-between rounded-[1.25rem] border border-border/60 bg-muted/30 px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{t('dashboardTestimonials.visible')}</span>
                  <input
                    type="checkbox"
                    name="visible"
                    checked={formData.visible}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5"
                  />
                </label>
                <label className="flex items-center justify-between rounded-[1.25rem] border border-border/60 bg-muted/30 px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{t('dashboardTestimonials.featured')}</span>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5"
                  />
                </label>
                <div className="space-y-2">
                  <Label htmlFor="order">{t('dashboardTestimonials.order')}</Label>
                  <Input id="order" name="order" type="number" min="0" value={formData.order} onChange={handleChange} />
                </div>
                <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                  <p className="text-sm font-semibold text-foreground">{t('dashboardTestimonials.orderHintTitle')}</p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{t('dashboardTestimonials.orderHintBody')}</p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                  {t('dashboardTestimonials.cancel')}
                </Button>
                <Button type="submit">{t('dashboardTestimonials.saveChanges')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <SkeletonBlocks count={4} className="lg:grid-cols-2" />
      ) : filteredTestimonials.length === 0 ? (
        <EmptyState
          title={t('dashboardTestimonials.emptyTitle')}
          description={t('dashboardTestimonials.emptyDescription')}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredTestimonials.map((item, index) => {
            const avatar = resolveMediaField({ url: item.avatarUrl, assetId: item.avatarAssetId }, assets);
            const logo = resolveMediaField({ url: item.logoUrl, assetId: item.logoAssetId }, assets);
            const displayName = getLocalizedValue(item.name, item.nameAr, isArabic) || item.name;
            const role = getLocalizedValue(item.role, item.roleAr, isArabic);
            const company = getLocalizedValue(item.company, item.companyAr, isArabic);
            const quote = getLocalizedValue(item.quote, item.quoteAr, isArabic) || item.quote;
            const outcome = getLocalizedValue(item.outcome, item.outcomeAr, isArabic);

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 p-6 shadow-sm"
              >
                <div className="absolute right-5 top-5 flex items-center gap-2">
                  {item.visible === false ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {t('dashboardTestimonials.hidden')}
                    </span>
                  ) : null}
                  {item.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Star className="h-3.5 w-3.5" />
                      {t('dashboardTestimonials.featured')}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(item.id)}
                    className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-start gap-4 pr-16">
                  {avatar.url ? (
                    <img
                      src={avatar.url}
                      alt={displayName}
                      className="h-14 w-14 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted text-primary">
                      <MessageSquareQuote className="h-5 w-5" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <h2 className="font-heading text-xl font-bold text-foreground">{displayName}</h2>
                    {(role || company) ? (
                      <p className="text-sm text-muted-foreground">
                        {[role, company].filter(Boolean).join(' / ')}
                      </p>
                    ) : null}
                  </div>
                </div>

                <blockquote className="mt-6 text-base leading-8 text-foreground">
                  “{quote}”
                </blockquote>

                {outcome ? (
                  <p className="mt-5 rounded-[1.25rem] border border-border/60 bg-background/70 px-4 py-3 text-sm leading-7 text-muted-foreground">
                    {outcome}
                  </p>
                ) : null}

                {logo.url ? (
                  <div className="mt-6 flex items-center justify-end">
                    <img src={logo.url} alt={company || displayName} className="h-10 max-w-[140px] object-contain" />
                  </div>
                ) : null}
              </motion.article>
            );
          })}
        </div>
      )}

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboardTestimonials.deleteTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-7 text-muted-foreground">{t('dashboardTestimonials.deleteDescription')}</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              {t('dashboardTestimonials.cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={() => void confirmDelete()}>
              {t('dashboardTestimonials.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
