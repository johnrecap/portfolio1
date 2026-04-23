import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { SettingsCard } from '@/components/dashboard/forms/settings-card';
import { SettingsShell } from '@/components/dashboard/forms/settings-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigationSettings } from '@/hooks/usePlatformSettings';
import type { NavigationSettings } from '@/lib/admin/types';

export const DashboardNavigationSettings = () => {
  const { t } = useTranslation();
  const { navigationSettings, loading, setDocument } = useNavigationSettings();
  const [formData, setFormData] = useState<NavigationSettings>(navigationSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(navigationSettings);
  }, [navigationSettings]);

  const updateNavItem = (id: string, key: keyof NavigationSettings['items'][number], value: string | boolean) => {
    setFormData((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    }));
  };

  const addNavItem = () => {
    const nextIndex = formData.items.length + 1;
    setFormData((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: `link-${nextIndex}`,
          label: `Link ${nextIndex}`,
          labelAr: `رابط ${nextIndex}`,
          href: '/',
          enabled: true,
        },
      ],
    }));
  };

  const removeNavItem = (id: string) => {
    setFormData((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  };

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

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">
        {t('dashboardSettings.loading')}
      </div>
    );
  }

  return (
    <SettingsShell
      title={t('dashboardNavigation.title')}
      description={t('dashboardNavigation.description')}
      isSaving={isSaving}
      saveLabel={t('dashboardSettings.saveChanges')}
      savingLabel={t('dashboardSettings.saving')}
      onSave={handleSave}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SettingsCard title={t('dashboardNavigation.navItems')}>
          <div className="space-y-4">
            {formData.items.map((item) => (
              <div key={item.id} className="space-y-4 rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-foreground">{item.id}</p>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeNavItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('dashboardNavigation.label')}</Label>
                    <Input value={item.label} onChange={(event) => updateNavItem(item.id, 'label', event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('dashboardNavigation.labelAr')}</Label>
                    <Input value={item.labelAr} dir="rtl" onChange={(event) => updateNavItem(item.id, 'labelAr', event.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{t('dashboardNavigation.href')}</Label>
                    <Input value={item.href} onChange={(event) => updateNavItem(item.id, 'href', event.target.value)} />
                  </div>
                </div>
                <label className="flex items-center justify-between rounded-[1.25rem] border border-border/60 bg-card px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{t('dashboardNavigation.enabled')}</span>
                  <input type="checkbox" checked={item.enabled} onChange={(event) => updateNavItem(item.id, 'enabled', event.target.checked)} className="h-5 w-5" />
                </label>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" className="gap-2" onClick={addNavItem}>
            <Plus className="h-4 w-4" />
            {t('dashboardNavigation.addItem')}
          </Button>
        </SettingsCard>

        <div className="space-y-6">
          <SettingsCard title={t('dashboardNavigation.primaryCta')}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('dashboardSite.primaryCtaLabel')}</Label>
                <Input
                  value={formData.primaryCtaLabel}
                  onChange={(event) => setFormData((current) => ({ ...current, primaryCtaLabel: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('dashboardSite.primaryCtaLabelAr')}</Label>
                <Input
                  dir="rtl"
                  value={formData.primaryCtaLabelAr}
                  onChange={(event) => setFormData((current) => ({ ...current, primaryCtaLabelAr: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('dashboardSite.primaryCtaHref')}</Label>
                <Input
                  value={formData.primaryCtaHref}
                  onChange={(event) => setFormData((current) => ({ ...current, primaryCtaHref: event.target.value }))}
                />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardNavigation.headerControls')}>
            <label className="flex items-center justify-between rounded-[1.5rem] border border-border/60 bg-background/70 px-5 py-4">
              <div>
                <p className="font-semibold text-foreground">{t('dashboardNavigation.showLanguageToggle')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t('dashboardNavigation.showLanguageToggleHint')}</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showLanguageToggle}
                onChange={(event) => setFormData((current) => ({ ...current, showLanguageToggle: event.target.checked }))}
                className="h-5 w-5"
              />
            </label>
            <label className="flex items-center justify-between rounded-[1.5rem] border border-border/60 bg-background/70 px-5 py-4">
              <div>
                <p className="font-semibold text-foreground">{t('dashboardNavigation.showThemeToggle')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t('dashboardNavigation.showThemeToggleHint')}</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showThemeToggle}
                onChange={(event) => setFormData((current) => ({ ...current, showThemeToggle: event.target.checked }))}
                className="h-5 w-5"
              />
            </label>
          </SettingsCard>
        </div>
      </div>
    </SettingsShell>
  );
};
