import { useEffect, useState } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { SettingsCard } from '@/components/dashboard/forms/settings-card';
import { SettingsShell } from '@/components/dashboard/forms/settings-shell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useThemeSettings } from '@/hooks/usePlatformSettings';
import { buildPublicThemeStyle } from '@/lib/admin/settings';
import type { ThemeSettings } from '@/lib/admin/types';
import { useTheme } from '@/components/shared/theme-provider';

const SELECT_CLASS =
  'flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50';

type ThemeOption<Value extends string> = {
  value: Value;
  label: string;
};

export const DashboardThemeSettings = () => {
  const { t } = useTranslation();
  const { themeSettings, loading, setDocument } = useThemeSettings();
  const { resolvedTheme } = useTheme();
  const [formData, setFormData] = useState<ThemeSettings>(themeSettings);
  const [isSaving, setIsSaving] = useState(false);
  const previewIsDark = formData.mode === 'system' ? resolvedTheme === 'dark' : formData.mode === 'dark';

  useEffect(() => {
    setFormData(themeSettings);
  }, [themeSettings]);

  const accentOptions: Array<ThemeOption<ThemeSettings['accent']>> = [
    { value: 'teal', label: t('dashboardTheme.accents.teal') },
    { value: 'cyan', label: t('dashboardTheme.accents.cyan') },
    { value: 'blue', label: t('dashboardTheme.accents.blue') },
    { value: 'indigo', label: t('dashboardTheme.accents.indigo') },
    { value: 'rose', label: t('dashboardTheme.accents.rose') },
    { value: 'amber', label: t('dashboardTheme.accents.amber') },
  ];

  const handleSelectChange = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
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
      title={t('dashboardTheme.title')}
      description={t('dashboardTheme.description')}
      isSaving={isSaving}
      saveLabel={t('dashboardSettings.saveChanges')}
      savingLabel={t('dashboardSettings.saving')}
      onSave={handleSave}
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <div className="space-y-6">
          <SettingsCard title={t('dashboardTheme.publicTheme')}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accent">{t('dashboardTheme.accent')}</Label>
                <select
                  id="accent"
                  className={SELECT_CLASS}
                  value={formData.accent}
                  onChange={(event) => handleSelectChange('accent', event.target.value as ThemeSettings['accent'])}
                >
                  {accentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="surfaceStyle">{t('dashboardTheme.surfaceStyle')}</Label>
                <select
                  id="surfaceStyle"
                  className={SELECT_CLASS}
                  value={formData.surfaceStyle}
                  onChange={(event) => handleSelectChange('surfaceStyle', event.target.value as ThemeSettings['surfaceStyle'])}
                >
                  <option value="glass">{t('dashboardTheme.surfaceStyles.glass')}</option>
                  <option value="solid">{t('dashboardTheme.surfaceStyles.solid')}</option>
                  <option value="outline">{t('dashboardTheme.surfaceStyles.outline')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="radiusScale">{t('dashboardTheme.radiusScale')}</Label>
                <select
                  id="radiusScale"
                  className={SELECT_CLASS}
                  value={formData.radiusScale}
                  onChange={(event) => handleSelectChange('radiusScale', event.target.value as ThemeSettings['radiusScale'])}
                >
                  <option value="sharp">{t('dashboardTheme.radiusScales.sharp')}</option>
                  <option value="rounded">{t('dashboardTheme.radiusScales.rounded')}</option>
                  <option value="pill">{t('dashboardTheme.radiusScales.pill')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shadowDensity">{t('dashboardTheme.shadowDensity')}</Label>
                <select
                  id="shadowDensity"
                  className={SELECT_CLASS}
                  value={formData.shadowDensity}
                  onChange={(event) => handleSelectChange('shadowDensity', event.target.value as ThemeSettings['shadowDensity'])}
                >
                  <option value="subtle">{t('dashboardTheme.shadowDensities.subtle')}</option>
                  <option value="medium">{t('dashboardTheme.shadowDensities.medium')}</option>
                  <option value="bold">{t('dashboardTheme.shadowDensities.bold')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backgroundPreset">{t('dashboardTheme.backgroundPreset')}</Label>
                <select
                  id="backgroundPreset"
                  className={SELECT_CLASS}
                  value={formData.backgroundPreset}
                  onChange={(event) => handleSelectChange('backgroundPreset', event.target.value as ThemeSettings['backgroundPreset'])}
                >
                  <option value="grid">{t('dashboardTheme.backgroundPresets.grid')}</option>
                  <option value="gradient">{t('dashboardTheme.backgroundPresets.gradient')}</option>
                  <option value="noise">{t('dashboardTheme.backgroundPresets.noise')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mode">{t('dashboardTheme.mode')}</Label>
                <select
                  id="mode"
                  className={SELECT_CLASS}
                  value={formData.mode}
                  onChange={(event) => handleSelectChange('mode', event.target.value as ThemeSettings['mode'])}
                >
                  <option value="system">{t('dashboardTheme.modes.system')}</option>
                  <option value="light">{t('dashboardTheme.modes.light')}</option>
                  <option value="dark">{t('dashboardTheme.modes.dark')}</option>
                </select>
              </div>
            </div>
          </SettingsCard>

        </div>

        <div className="space-y-6">
          <SettingsCard title={t('dashboardTheme.preview')}>
            <div
              className="space-y-5 rounded-[1.75rem] border border-border/60 p-5"
              style={buildPublicThemeStyle(formData, previewIsDark)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-heading text-lg font-bold text-foreground">{t('dashboardTheme.previewCardTitle')}</p>
                    <p className="text-sm text-muted-foreground">{t('dashboardTheme.previewCardDescription')}</p>
                  </div>
                </div>
                <div className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                  {accentOptions.find((option) => option.value === formData.accent)?.label}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-[var(--site-shell-shadow)]">
                <p className="text-sm text-muted-foreground">{t('dashboardTheme.previewSurface')}</p>
                <p className="mt-2 font-heading text-2xl font-bold text-foreground">{t('dashboardTheme.previewTitle')}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{t('dashboardTheme.previewBody')}</p>
                <div className="mt-5 flex gap-3">
                  <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                    {t('dashboardTheme.previewPrimary')}
                  </button>
                  <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
                    {t('dashboardTheme.previewSecondary')}
                  </button>
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardTheme.notes')}>
            <div className="rounded-[1.5rem] border border-border/60 bg-primary/5 p-5 text-sm leading-7 text-muted-foreground">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <p className="font-semibold text-foreground">{t('dashboardTheme.notes')}</p>
              </div>
              <p>{t('dashboardTheme.notesBody')}</p>
            </div>
          </SettingsCard>
        </div>
      </div>
    </SettingsShell>
  );
};
