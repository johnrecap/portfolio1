import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, LayoutTemplate, Layers3, Route } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { SettingsCard } from '@/components/dashboard/forms/settings-card';
import { SettingsShell } from '@/components/dashboard/forms/settings-shell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePageConfig } from '@/hooks/usePageConfig';
import { movePageSection, resolvePageConfig } from '@/lib/admin/page-config';
import { getPageSectionDefinitions, getSectionDefinition } from '@/lib/admin/section-registry';
import type {
  AdminPageConfig,
  AdminPageSection,
  PageSectionVariant,
  PlatformPageId,
  StylePreset,
} from '@/lib/admin/types';

const SELECT_CLASS =
  'flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50';

const PAGE_META: Record<
  PlatformPageId,
  { label: string; labelAr: string; route: string; note: string; noteAr: string }
> = {
  home: {
    label: 'Home',
    labelAr: 'الرئيسية',
    route: '/',
    note: 'Landing page sequence and first-impression sections.',
    noteAr: 'تسلسل الصفحة الرئيسية والسكاشن المسؤولة عن الانطباع الأول.',
  },
  about: {
    label: 'About',
    labelAr: 'نبذة عني',
    route: '/about',
    note: 'Profile story, strengths, and support surfaces.',
    noteAr: 'السرد التعريفي، ونقاط القوة، والأسطح الداعمة لها.',
  },
  projects: {
    label: 'Projects',
    labelAr: 'المشروعات',
    route: '/projects',
    note: 'Page-level framing for the projects index.',
    noteAr: 'التحكم على مستوى الصفحة لواجهة فهرس المشروعات.',
  },
  blog: {
    label: 'Blog',
    labelAr: 'المدونة',
    route: '/blog',
    note: 'Page-level framing for the blog index.',
    noteAr: 'التحكم على مستوى الصفحة لواجهة فهرس المدونة.',
  },
  contact: {
    label: 'Contact',
    labelAr: 'التواصل',
    route: '/contact',
    note: 'Lead-in, form, and supporting contact surfaces.',
    noteAr: 'المقدمة، والنموذج، والسكاشن الداعمة بصفحة التواصل.',
  },
};

const STYLE_PRESET_META: Array<{ value: StylePreset; label: string; labelAr: string }> = [
  { value: 'default', label: 'Default', labelAr: 'افتراضي' },
  { value: 'muted', label: 'Muted', labelAr: 'هادئ' },
  { value: 'emphasis', label: 'Emphasis', labelAr: 'بارز' },
  { value: 'contrast', label: 'Contrast', labelAr: 'متباين' },
];

const VARIANT_LABELS: Record<PageSectionVariant, { label: string; labelAr: string }> = {
  default: { label: 'Default', labelAr: 'افتراضي' },
  split: { label: 'Split', labelAr: 'منقسم' },
  centered: { label: 'Centered', labelAr: 'متمركز' },
  editor: { label: 'Editor', labelAr: 'محرر' },
  minimal: { label: 'Minimal', labelAr: 'مختصر' },
  grid: { label: 'Grid', labelAr: 'شبكي' },
  spotlight: { label: 'Spotlight', labelAr: 'تركيز' },
  carousel: { label: 'Carousel', labelAr: 'دوّار' },
  banner: { label: 'Banner', labelAr: 'شريطي' },
  card: { label: 'Card', labelAr: 'بطاقة' },
  'terminal-strip': { label: 'Terminal Strip', labelAr: 'شريط طرفية' },
};

function readSectionFieldValue(section: AdminPageSection, key: string): string {
  const value = section.content[key];
  return typeof value === 'string' ? value : '';
}

function getInputDirection(sectionKey: string, type: 'text' | 'textarea' | 'url') {
  if (type === 'url') {
    return 'ltr';
  }

  return sectionKey.endsWith('Ar') ? 'rtl' : 'auto';
}

export const DashboardPageComposer = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar';
  const [activePageId, setActivePageId] = useState<PlatformPageId>('home');
  const { pageConfig, loading, setDocument } = usePageConfig(activePageId);
  const [formData, setFormData] = useState<AdminPageConfig>(pageConfig);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(pageConfig);
  }, [pageConfig]);

  const availableSections = useMemo(() => getPageSectionDefinitions(activePageId), [activePageId]);
  const enabledCount = formData.sections.filter((section) => section.enabled).length;

  const handlePageSelect = (pageId: PlatformPageId) => {
    setActivePageId(pageId);
  };

  const handlePageFieldChange = (key: keyof AdminPageConfig, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleSeoFieldChange = (key: keyof AdminPageConfig['seo'], value: string) => {
    setFormData((current) => ({
      ...current,
      seo: {
        ...current.seo,
        [key]: value,
      },
    }));
  };

  const handleSectionChange = (sectionId: string, updater: (section: AdminPageSection) => AdminPageSection) => {
    setFormData((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === sectionId ? updater(section) : section)),
    }));
  };

  const handleSectionMove = (sectionId: string, direction: 'up' | 'down') => {
    setFormData((current) => ({
      ...current,
      sections: movePageSection(current.sections, sectionId, direction),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const next = resolvePageConfig(activePageId, formData);
      await setDocument(next, false);
      toast.success(t('dashboardPages.saveSuccess'));
    } catch {
      toast.error(t('dashboardPages.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">
        {t('dashboardSettings.loading')}
      </div>
    );
  }

  return (
    <SettingsShell
      title={t('dashboardPages.title')}
      description={t('dashboardPages.description')}
      isSaving={isSaving}
      saveLabel={t('dashboardSettings.saveChanges')}
      savingLabel={t('dashboardSettings.saving')}
      onSave={handleSave}
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SettingsCard title={t('dashboardPages.selectPage')} description={t('dashboardPages.selectPageHint')}>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(PAGE_META).map(([pageId, meta]) => {
                const selected = activePageId === pageId;
                return (
                  <button
                    key={pageId}
                    type="button"
                    onClick={() => handlePageSelect(pageId as PlatformPageId)}
                    className={`rounded-[1.5rem] border p-4 text-start transition-colors ${
                      selected
                        ? 'border-primary/30 bg-primary/10'
                        : 'border-border/60 bg-card/50 hover:border-primary/20 hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-heading text-lg font-bold text-foreground">
                          {isArabic ? meta.labelAr : meta.label}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {isArabic ? meta.noteAr : meta.note}
                        </p>
                      </div>
                      <span className="rounded-full border border-border/60 px-3 py-1 font-mono text-xs text-muted-foreground" dir="ltr">
                        {meta.route}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardPages.pageIdentity')} description={t('dashboardPages.pageIdentityHint')}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="page-title">{t('dashboardPages.pageTitle')}</Label>
                <Input
                  id="page-title"
                  value={formData.title}
                  onChange={(event) => handlePageFieldChange('title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-title-ar">{t('dashboardPages.pageTitleAr')}</Label>
                <Input
                  id="page-title-ar"
                  value={formData.titleAr}
                  dir="rtl"
                  onChange={(event) => handlePageFieldChange('titleAr', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-slug">{t('dashboardPages.slug')}</Label>
                <Input
                  id="page-slug"
                  value={formData.slug}
                  dir="ltr"
                  onChange={(event) => handlePageFieldChange('slug', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-status">{t('dashboardPages.status')}</Label>
                <select
                  id="page-status"
                  className={SELECT_CLASS}
                  value={formData.status}
                  onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value as AdminPageConfig['status'] }))}
                >
                  <option value="draft">{t('dashboardPages.statusDraft')}</option>
                  <option value="published">{t('dashboardPages.statusPublished')}</option>
                </select>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardPages.seoOverrides')} description={t('dashboardPages.seoOverridesHint')}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seo-title">{t('dashboardPages.seoTitle')}</Label>
                <Input
                  id="seo-title"
                  value={formData.seo.title ?? ''}
                  onChange={(event) => handleSeoFieldChange('title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-title-ar">{t('dashboardPages.seoTitleAr')}</Label>
                <Input
                  id="seo-title-ar"
                  value={formData.seo.titleAr ?? ''}
                  dir="rtl"
                  onChange={(event) => handleSeoFieldChange('titleAr', event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seo-description">{t('dashboardPages.seoDescription')}</Label>
                <Textarea
                  id="seo-description"
                  className="min-h-[120px]"
                  value={formData.seo.description ?? ''}
                  onChange={(event) => handleSeoFieldChange('description', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-description-ar">{t('dashboardPages.seoDescriptionAr')}</Label>
                <Textarea
                  id="seo-description-ar"
                  className="min-h-[120px]"
                  dir="rtl"
                  value={formData.seo.descriptionAr ?? ''}
                  onChange={(event) => handleSeoFieldChange('descriptionAr', event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-image">{t('dashboardPages.seoImage')}</Label>
              <Input
                id="seo-image"
                value={formData.seo.image ?? ''}
                dir="ltr"
                onChange={(event) => handleSeoFieldChange('image', event.target.value)}
              />
            </div>
          </SettingsCard>
        </div>

        <div className="space-y-6">
          <SettingsCard title={t('dashboardPages.pageOverview')} description={t('dashboardPages.pageOverviewHint')}>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <LayoutTemplate className="h-4 w-4" />
                  <p className="text-sm font-semibold text-foreground">{t('dashboardPages.activeRoute')}</p>
                </div>
                <p className="mt-3 font-mono text-lg text-foreground" dir="ltr">
                  {PAGE_META[activePageId].route}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Layers3 className="h-4 w-4" />
                  <p className="text-sm font-semibold text-foreground">{t('dashboardPages.enabledSections')}</p>
                </div>
                <p className="mt-3 font-heading text-3xl font-black text-foreground">{enabledCount}</p>
              </div>
              <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Eye className="h-4 w-4" />
                  <p className="text-sm font-semibold text-foreground">{t('dashboardPages.availableSections')}</p>
                </div>
                <p className="mt-3 font-heading text-3xl font-black text-foreground">{availableSections.length}</p>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardPages.sections')} description={t('dashboardPages.sectionsHint')}>
            <div className="space-y-5">
              {formData.sections.map((section, index) => {
                const definition = getSectionDefinition(section.type);
                return (
                  <div
                    key={section.id}
                    className="rounded-[1.75rem] border border-border/60 bg-card/50 p-5"
                  >
                    <div className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-heading text-xl font-bold text-foreground">
                          {isArabic ? definition.titleAr : definition.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {isArabic ? definition.descriptionAr : definition.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSectionMove(section.id, 'up')}
                          disabled={index === 0}
                          className="rounded-full border border-border px-3 py-2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSectionMove(section.id, 'down')}
                          disabled={index === formData.sections.length - 1}
                          className="rounded-full border border-border px-3 py-2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <label className="flex items-center gap-3 rounded-full border border-border px-4 py-2 text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={section.enabled}
                            onChange={(event) =>
                              handleSectionChange(section.id, (current) => ({
                                ...current,
                                enabled: event.target.checked,
                              }))
                            }
                          />
                          {t('dashboardPages.enabled')}
                        </label>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-[0.36fr_0.64fr]">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${section.id}-variant`}>{t('dashboardPages.variant')}</Label>
                          <select
                            id={`${section.id}-variant`}
                            className={SELECT_CLASS}
                            value={section.variant}
                            onChange={(event) =>
                              handleSectionChange(section.id, (current) => ({
                                ...current,
                                variant: event.target.value as PageSectionVariant,
                              }))
                            }
                          >
                            {definition.variants.map((variant) => (
                              <option key={variant} value={variant}>
                                {isArabic ? VARIANT_LABELS[variant].labelAr : VARIANT_LABELS[variant].label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${section.id}-style`}>{t('dashboardPages.stylePreset')}</Label>
                          <select
                            id={`${section.id}-style`}
                            className={SELECT_CLASS}
                            value={section.stylePreset}
                            onChange={(event) =>
                              handleSectionChange(section.id, (current) => ({
                                ...current,
                                stylePreset: event.target.value as StylePreset,
                              }))
                            }
                          >
                            {STYLE_PRESET_META.map((option) => (
                              <option key={option.value} value={option.value}>
                                {isArabic ? option.labelAr : option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 text-primary">
                            <Route className="h-4 w-4" />
                            <p className="font-semibold text-foreground">{t('dashboardPages.sectionMeta')}</p>
                          </div>
                          <div className="mt-4 space-y-2" dir="ltr">
                            <p>id: {section.id}</p>
                            <p>type: {section.type}</p>
                            <p>order: {section.order}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {definition.fields.map((field) => {
                          const value = readSectionFieldValue(section, field.key);
                          const inputDir = getInputDirection(field.key, field.type);
                          const commonProps = {
                            id: `${section.id}-${field.key}`,
                            dir: inputDir,
                            value,
                            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                              handleSectionChange(section.id, (current) => ({
                                ...current,
                                content: {
                                  ...current.content,
                                  [field.key]: event.target.value,
                                },
                              })),
                          };

                          return (
                            <div
                              key={field.key}
                              className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
                            >
                              <Label htmlFor={commonProps.id}>
                                {isArabic ? field.labelAr : field.label}
                              </Label>
                              {field.type === 'textarea' ? (
                                <Textarea
                                  {...commonProps}
                                  className="min-h-[120px]"
                                  rows={field.rows ?? 4}
                                />
                              ) : (
                                <Input
                                  {...commonProps}
                                  type={field.type === 'url' ? 'url' : 'text'}
                                  placeholder={isArabic ? field.placeholderAr : field.placeholder}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SettingsCard>
        </div>
      </div>
    </SettingsShell>
  );
};
