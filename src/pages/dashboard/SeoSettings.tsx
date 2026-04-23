import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { SettingsCard } from '@/components/dashboard/forms/settings-card';
import { SettingsShell } from '@/components/dashboard/forms/settings-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { isSeoTitleMirroringProfile } from '@/lib/admin/brand';
import { createDefaultSeoSettings } from '@/lib/admin/defaults';
import { useProfile } from '@/hooks/useProfile';
import { useSeoSettings } from '@/hooks/usePlatformSettings';
import type { SeoSettings } from '@/lib/admin/types';

export const DashboardSeoSettings = () => {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { seoSettings, loading, setDocument } = useSeoSettings();
  const [formData, setFormData] = useState<SeoSettings>(seoSettings);
  const [isSaving, setIsSaving] = useState(false);
  const seoTitleMirrorsProfile = isSeoTitleMirroringProfile(formData, profile);

  useEffect(() => {
    setFormData(seoSettings);
  }, [seoSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDocument(formData);
      toast.success(t('dashboardSettings.saveSuccess'));
    } catch {
      toast.error(t('dashboardSettings.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreCanonicalSeoTitle = () => {
    const canonicalSeo = createDefaultSeoSettings();

    setFormData((current) => ({
      ...current,
      defaultTitle: canonicalSeo.defaultTitle,
      defaultTitleAr: canonicalSeo.defaultTitleAr,
    }));
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
      title={t('dashboardSeo.title')}
      description={t('dashboardSeo.description')}
      isSaving={isSaving}
      saveLabel={t('dashboardSettings.saveChanges')}
      savingLabel={t('dashboardSettings.saving')}
      onSave={handleSave}
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SettingsCard title={t('dashboardSeo.defaultMeta')}>
          {seoTitleMirrorsProfile ? (
            <div className="mb-4 rounded-[1.5rem] border border-amber-500/25 bg-amber-500/10 p-4">
              <p className="font-semibold text-foreground">{t('dashboardSeo.profileMirrorWarningTitle')}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {t('dashboardSeo.profileMirrorWarningBody')}
              </p>
              <Button type="button" variant="outline" className="mt-4" onClick={handleRestoreCanonicalSeoTitle}>
                {t('dashboardSeo.restoreCanonicalSeoTitle')}
              </Button>
            </div>
          ) : null}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('dashboardSeo.defaultTitle')}</Label>
              <Input value={formData.defaultTitle} onChange={(event) => setFormData((current) => ({ ...current, defaultTitle: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboardSeo.defaultTitleAr')}</Label>
              <Input dir="rtl" value={formData.defaultTitleAr} onChange={(event) => setFormData((current) => ({ ...current, defaultTitleAr: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboardSeo.defaultDescription')}</Label>
              <Textarea
                value={formData.defaultDescription}
                onChange={(event) => setFormData((current) => ({ ...current, defaultDescription: event.target.value }))}
                className="min-h-[140px]"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboardSeo.defaultDescriptionAr')}</Label>
              <Textarea
                dir="rtl"
                value={formData.defaultDescriptionAr}
                onChange={(event) => setFormData((current) => ({ ...current, defaultDescriptionAr: event.target.value }))}
                className="min-h-[140px]"
              />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title={t('dashboardSeo.openGraph')}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('dashboardSeo.ogImage')}</Label>
              <Input value={formData.ogImage} onChange={(event) => setFormData((current) => ({ ...current, ogImage: event.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboardSeo.siteUrl')}</Label>
              <Input value={formData.siteUrl} onChange={(event) => setFormData((current) => ({ ...current, siteUrl: event.target.value }))} placeholder="https://example.com" />
            </div>
          </div>
        </SettingsCard>
      </div>
    </SettingsShell>
  );
};
