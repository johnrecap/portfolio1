import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Plus, Search, Star, Trash2 } from 'lucide-react';
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
import { getLocalizedValue, groupSkillsByCategory, resolveMediaField, type SkillRecord } from '@/lib/content-hub';
import { normalizeMediaUrl } from '@/lib/media';

type SkillFormState = {
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  proficiency: string;
  icon: string;
  iconAssetId: string;
  categoryOrder: string;
  order: string;
  featured: boolean;
};

const initialFormState: SkillFormState = {
  name: '',
  nameAr: '',
  category: '',
  categoryAr: '',
  description: '',
  descriptionAr: '',
  proficiency: '80',
  icon: '',
  iconAssetId: '',
  categoryOrder: '1',
  order: '1',
  featured: false,
};

function filterSkills(items: SkillRecord[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    [item.name, item.nameAr, item.category, item.categoryAr, item.description, item.descriptionAr]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

function buildSkillPayload(formData: SkillFormState) {
  return Object.fromEntries(
    Object.entries({
      name: formData.name.trim(),
      nameAr: formData.nameAr.trim(),
      category: formData.category.trim(),
      categoryAr: formData.categoryAr.trim(),
      description: formData.description.trim(),
      descriptionAr: formData.descriptionAr.trim(),
      proficiency: Number(formData.proficiency || '0'),
      icon: normalizeMediaUrl(formData.icon),
      iconAssetId: formData.iconAssetId.trim(),
      categoryOrder: Number(formData.categoryOrder || '0'),
      order: Number(formData.order || '0'),
      featured: formData.featured,
    }).filter(([, value]) => value !== ''),
  );
}

export const DashboardSkills = () => {
  const { data: skills, loading, addDocument, updateDocument, removeDocument } = useCollection<SkillRecord>('skills');
  const { assets } = useMediaLibrary();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<SkillFormState>(initialFormState);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isArabic = i18n.language === 'ar';

  const filteredSkills = useMemo(() => filterSkills(skills, search), [skills, search]);
  const groupedSkills = useMemo(() => groupSkillsByCategory(filteredSkills, isArabic), [filteredSkills, isArabic]);

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
    const payload = buildSkillPayload(formData);

    if (editingId) {
      await updateDocument(editingId, payload);
    } else {
      await addDocument(payload);
    }

    handleDialogChange(false);
  };

  const handleEdit = (skill: SkillRecord) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name || '',
      nameAr: skill.nameAr || '',
      category: skill.category || '',
      categoryAr: skill.categoryAr || '',
      description: skill.description || '',
      descriptionAr: skill.descriptionAr || '',
      proficiency: String(skill.proficiency ?? 0),
      icon: skill.icon || '',
      iconAssetId: skill.iconAssetId || '',
      categoryOrder: typeof skill.categoryOrder === 'number' ? String(skill.categoryOrder) : '1',
      order: typeof skill.order === 'number' ? String(skill.order) : '1',
      featured: Boolean(skill.featured),
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
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">{t('dashboardSkills.skillsSetup')}</h1>
          <p className="mt-2 text-muted-foreground">{t('dashboardSkills.manageProficiencies')}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('dashboardSkills.searchSkills')} className="h-12 rounded-full pl-11" />
          </div>

          <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger className={buttonVariants({ className: 'h-12 gap-2 rounded-full px-6 font-semibold' })}>
              <Plus className="h-4 w-4" />
              {t('dashboardSkills.addSkill')}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <DialogHeader>
                  <DialogTitle>{editingId ? t('dashboardSkills.editSkill') : t('dashboardSkills.newSkill')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('dashboardSkills.skillName')}</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameAr">{t('dashboardSkills.skillNameAr')}</Label>
                    <Input id="nameAr" name="nameAr" value={formData.nameAr} onChange={handleChange} dir="rtl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t('dashboardSkills.category')}</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryAr">{t('dashboardSkills.categoryAr')}</Label>
                    <Input id="categoryAr" name="categoryAr" value={formData.categoryAr} onChange={handleChange} dir="rtl" />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('dashboardSkills.description')}</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="min-h-[120px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descriptionAr">{t('dashboardSkills.descriptionAr')}</Label>
                    <Textarea id="descriptionAr" name="descriptionAr" value={formData.descriptionAr} onChange={handleChange} dir="rtl" className="min-h-[120px]" />
                  </div>
                </div>

                <MediaPicker
                  label={t('dashboardSkills.iconBlock')}
                  assetLabel={t('dashboardSkills.iconAsset')}
                  urlLabel={t('dashboardSkills.iconUrl')}
                  url={formData.icon}
                  assetId={formData.iconAssetId}
                  assets={assets}
                  kind="image"
                  previewAlt={formData.name || 'Skill icon'}
                  onUrlChange={(value) => setFormData((current) => ({ ...current, icon: value }))}
                  onAssetIdChange={(value) => setFormData((current) => ({ ...current, iconAssetId: value }))}
                />

                <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_220px]">
                  <div className="space-y-2">
                    <Label htmlFor="proficiency">{t('dashboardSkills.proficiency')}</Label>
                    <Input id="proficiency" name="proficiency" type="number" min="0" max="100" value={formData.proficiency} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryOrder">{t('dashboardSkills.categoryOrder')}</Label>
                    <Input id="categoryOrder" name="categoryOrder" type="number" min="0" value={formData.categoryOrder} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">{t('dashboardSkills.order')}</Label>
                    <Input id="order" name="order" type="number" min="0" value={formData.order} onChange={handleChange} />
                  </div>
                  <label className="flex items-center justify-between rounded-[1.25rem] border border-border/60 bg-muted/30 px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{t('dashboardSkills.featured')}</span>
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleCheckboxChange} className="h-5 w-5" />
                  </label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                    {t('dashboardSkills.cancel')}
                  </Button>
                  <Button type="submit">{t('dashboardSkills.save')}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <SkeletonBlocks count={4} className="lg:grid-cols-2" />
      ) : groupedSkills.length === 0 ? (
        <EmptyState title={t('dashboardSkills.noSkills')} description={t('dashboardSkills.emptyDescription')} />
      ) : (
        <div className="space-y-6">
          {groupedSkills.map((group) => (
            <section key={group.id} className="rounded-[1.75rem] border border-border/60 bg-card/70 shadow-sm">
              <div className="border-b border-border/60 px-6 py-5">
                <h2 className="font-heading text-2xl font-bold text-foreground">{group.label}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{t('dashboardSkills.groupSummary', { count: group.items.length })}</p>
              </div>

              <div className="divide-y divide-border/60">
                {group.items.map((skill) => {
                  const icon = resolveMediaField({ url: skill.icon, assetId: skill.iconAssetId }, assets);
                  const name = getLocalizedValue(skill.name, skill.nameAr, isArabic) || skill.name;
                  const description = getLocalizedValue(skill.description, skill.descriptionAr, isArabic);

                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          {icon.url ? <img src={icon.url} alt={name} className="h-8 w-8 rounded object-cover" /> : null}
                          <span className="font-semibold text-foreground">{name}</span>
                          {skill.featured ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              <Star className="h-3.5 w-3.5" />
                              {t('dashboardSkills.featured')}
                            </span>
                          ) : null}
                        </div>
                        {description ? <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p> : null}
                      </div>

                      <div className="flex min-w-[280px] items-center gap-4">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-primary" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="w-12 text-sm font-semibold text-muted-foreground">{skill.proficiency}%</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(skill)}
                            className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(skill.id)}
                            className="rounded-full border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboardSkills.confirmDeleteTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-7 text-muted-foreground">{t('dashboardSkills.confirmDelete')}</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              {t('dashboardSkills.cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={() => void confirmDelete()}>
              {t('dashboardSkills.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
