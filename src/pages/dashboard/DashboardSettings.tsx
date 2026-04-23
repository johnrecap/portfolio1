import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, LayoutDashboard, Palette, PanelsTopLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { SettingsCard } from '@/components/dashboard/forms/settings-card';
import { SettingsShell } from '@/components/dashboard/forms/settings-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDashboardSettings } from '@/hooks/usePlatformSettings';
import {
  DASHBOARD_MODULE_COPY,
  DASHBOARD_QUICK_ACTION_COPY,
  DASHBOARD_ROUTE_PATHS,
  DASHBOARD_WIDGET_COPY,
} from '@/lib/admin/dashboard-config';
import type {
  DashboardQuickActionId,
  DashboardSettings,
  DashboardWidgetId,
} from '@/lib/admin/types';

const SELECT_CLASS =
  'flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50';

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(index, 1);
  nextItems.splice(nextIndex, 0, item);
  return nextItems;
}

function toggleOrderedItem<T extends string>(items: T[], id: T) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

export const DashboardSettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { dashboardSettings, loading, setDocument } = useDashboardSettings();
  const [formData, setFormData] = useState<DashboardSettings>(dashboardSettings);
  const [isSaving, setIsSaving] = useState(false);
  const isArabicPreview = i18n.resolvedLanguage === 'ar';

  useEffect(() => {
    setFormData(dashboardSettings);
  }, [dashboardSettings]);

  const moduleRows = formData.sidebarModules;
  const widgetRows = useMemo(() => {
    const active = formData.overviewWidgets;
    const inactive = Object.keys(DASHBOARD_WIDGET_COPY).filter(
      (id) => !active.includes(id as DashboardWidgetId),
    ) as DashboardWidgetId[];
    return [...active, ...inactive];
  }, [formData.overviewWidgets]);
  const moduleLabelById = useMemo(
    () =>
      Object.fromEntries(
        formData.sidebarModules.map((module) => [
          module.id,
          {
            label: module.label || DASHBOARD_MODULE_COPY[module.id].label,
            labelAr: module.labelAr || DASHBOARD_MODULE_COPY[module.id].labelAr,
          },
        ]),
      ) as Record<string, { label: string; labelAr: string }>,
    [formData.sidebarModules],
  );
  const quickActionRows = useMemo(() => {
    const active = formData.quickActions;
    const inactive = Object.keys(DASHBOARD_QUICK_ACTION_COPY).filter(
      (id) => !active.includes(id as DashboardQuickActionId),
    ) as DashboardQuickActionId[];
    return [...active, ...inactive];
  }, [formData.quickActions]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSelectChange = <K extends keyof DashboardSettings>(key: K, value: DashboardSettings[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleModuleFieldChange = (moduleId: DashboardSettings['sidebarModules'][number]['id'], field: 'label' | 'labelAr', value: string) => {
    setFormData((current) => ({
      ...current,
      sidebarModules: current.sidebarModules.map((module) =>
        module.id === moduleId ? { ...module, [field]: value } : module,
      ),
    }));
  };

  const handleModuleEnabledChange = (moduleId: DashboardSettings['sidebarModules'][number]['id'], enabled: boolean) => {
    setFormData((current) => ({
      ...current,
      sidebarModules: current.sidebarModules.map((module) =>
        module.id === moduleId ? { ...module, enabled } : module,
      ),
    }));
  };

  const handleModuleMove = (index: number, direction: -1 | 1) => {
    setFormData((current) => ({
      ...current,
      sidebarModules: moveItem(current.sidebarModules, index, direction),
    }));
  };

  const handleWidgetToggle = (widgetId: DashboardWidgetId) => {
    setFormData((current) => ({
      ...current,
      overviewWidgets: toggleOrderedItem(current.overviewWidgets, widgetId),
    }));
  };

  const handleWidgetMove = (widgetId: DashboardWidgetId, direction: -1 | 1) => {
    setFormData((current) => {
      const index = current.overviewWidgets.indexOf(widgetId);
      if (index === -1) {
        return current;
      }

      return {
        ...current,
        overviewWidgets: moveItem(current.overviewWidgets, index, direction),
      };
    });
  };

  const handleQuickActionToggle = (actionId: DashboardQuickActionId) => {
    setFormData((current) => ({
      ...current,
      quickActions: toggleOrderedItem(current.quickActions, actionId),
    }));
  };

  const handleQuickActionMove = (actionId: DashboardQuickActionId, direction: -1 | 1) => {
    setFormData((current) => {
      const index = current.quickActions.indexOf(actionId);
      if (index === -1) {
        return current;
      }

      return {
        ...current,
        quickActions: moveItem(current.quickActions, index, direction),
      };
    });
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
      title={t('dashboardControl.title')}
      description={t('dashboardControl.description')}
      isSaving={isSaving}
      saveLabel={t('dashboardSettings.saveChanges')}
      savingLabel={t('dashboardSettings.saving')}
      onSave={handleSave}
    >
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <SettingsCard title={t('dashboardControl.branding')} description={t('dashboardControl.brandingHint')}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dashboardName">{t('dashboardControl.dashboardName')}</Label>
                <Input id="dashboardName" name="dashboardName" value={formData.dashboardName} onChange={handleTextChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dashboardNameAr">{t('dashboardControl.dashboardNameAr')}</Label>
                <Input id="dashboardNameAr" name="dashboardNameAr" value={formData.dashboardNameAr} onChange={handleTextChange} dir="rtl" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subtitle">{t('dashboardControl.subtitle')}</Label>
                <Textarea id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleTextChange} className="min-h-[110px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitleAr">{t('dashboardControl.subtitleAr')}</Label>
                <Textarea id="subtitleAr" name="subtitleAr" value={formData.subtitleAr} onChange={handleTextChange} dir="rtl" className="min-h-[110px]" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="introTitle">{t('dashboardControl.introTitle')}</Label>
                <Input id="introTitle" name="introTitle" value={formData.introTitle} onChange={handleTextChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="introTitleAr">{t('dashboardControl.introTitleAr')}</Label>
                <Input id="introTitleAr" name="introTitleAr" value={formData.introTitleAr} onChange={handleTextChange} dir="rtl" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="introBody">{t('dashboardControl.introBody')}</Label>
                <Textarea id="introBody" name="introBody" value={formData.introBody} onChange={handleTextChange} className="min-h-[130px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="introBodyAr">{t('dashboardControl.introBodyAr')}</Label>
                <Textarea id="introBodyAr" name="introBodyAr" value={formData.introBodyAr} onChange={handleTextChange} dir="rtl" className="min-h-[130px]" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="iconUrl">{t('dashboardControl.iconUrl')}</Label>
                <Input id="iconUrl" name="iconUrl" value={formData.iconUrl} onChange={handleTextChange} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">{t('dashboardControl.avatarUrl')}</Label>
                <Input id="avatarUrl" name="avatarUrl" value={formData.avatarUrl} onChange={handleTextChange} placeholder="https://..." />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardControl.sidebar')} description={t('dashboardControl.sidebarHint')}>
            <div className="space-y-4">
              {moduleRows.map((module, index) => (
                <div key={module.id} className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{DASHBOARD_MODULE_COPY[module.id].label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{DASHBOARD_ROUTE_PATHS[module.id]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon-sm" onClick={() => handleModuleMove(index, -1)} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleModuleMove(index, 1)}
                        disabled={index === moduleRows.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`module-label-${module.id}`}>{t('dashboardControl.label')}</Label>
                      <Input
                        id={`module-label-${module.id}`}
                        value={module.label}
                        onChange={(event) => handleModuleFieldChange(module.id, 'label', event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`module-label-ar-${module.id}`}>{t('dashboardControl.labelAr')}</Label>
                      <Input
                        id={`module-label-ar-${module.id}`}
                        value={module.labelAr}
                        onChange={(event) => handleModuleFieldChange(module.id, 'labelAr', event.target.value)}
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <label className="mt-4 flex items-center justify-between rounded-[1.25rem] border border-border/60 bg-card/70 px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{t('dashboardControl.showInSidebar')}</span>
                    <input
                      type="checkbox"
                      checked={module.enabled}
                      onChange={(event) => handleModuleEnabledChange(module.id, event.target.checked)}
                      className="h-5 w-5"
                    />
                  </label>
                </div>
              ))}
            </div>
          </SettingsCard>
        </div>

        <div className="space-y-6">
          <SettingsCard title={t('dashboardControl.visualPreset')} description={t('dashboardControl.visualPresetHint')}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accent">{t('dashboardControl.accent')}</Label>
                <select
                  id="accent"
                  className={SELECT_CLASS}
                  value={formData.accent}
                  onChange={(event) => handleSelectChange('accent', event.target.value as DashboardSettings['accent'])}
                >
                  <option value="teal">{t('dashboardTheme.accents.teal')}</option>
                  <option value="cyan">{t('dashboardTheme.accents.cyan')}</option>
                  <option value="blue">{t('dashboardTheme.accents.blue')}</option>
                  <option value="indigo">{t('dashboardTheme.accents.indigo')}</option>
                  <option value="rose">{t('dashboardTheme.accents.rose')}</option>
                  <option value="amber">{t('dashboardTheme.accents.amber')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="surfaceStyle">{t('dashboardControl.surfaceStyle')}</Label>
                <select
                  id="surfaceStyle"
                  className={SELECT_CLASS}
                  value={formData.surfaceStyle}
                  onChange={(event) => handleSelectChange('surfaceStyle', event.target.value as DashboardSettings['surfaceStyle'])}
                >
                  <option value="glass">{t('dashboardTheme.surfaceStyles.glass')}</option>
                  <option value="solid">{t('dashboardTheme.surfaceStyles.solid')}</option>
                  <option value="outline">{t('dashboardTheme.surfaceStyles.outline')}</option>
                </select>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardControl.overviewWidgets')} description={t('dashboardControl.overviewWidgetsHint')}>
            <div className="space-y-3">
              {widgetRows.map((widgetId) => {
                const widget = DASHBOARD_WIDGET_COPY[widgetId];
                const enabled = formData.overviewWidgets.includes(widgetId);
                const orderIndex = formData.overviewWidgets.indexOf(widgetId);

                return (
                  <div key={widgetId} className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-foreground">{isArabicPreview ? widget.labelAr : widget.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{t(`dashboardControl.widgetGroups.${widget.group}`)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleWidgetMove(widgetId, -1)}
                          disabled={!enabled || orderIndex <= 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleWidgetMove(widgetId, 1)}
                          disabled={!enabled || orderIndex === -1 || orderIndex >= formData.overviewWidgets.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <label className="mt-4 flex items-center justify-between rounded-[1.25rem] border border-border/60 bg-card/70 px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{t('dashboardControl.showOnOverview')}</span>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleWidgetToggle(widgetId)}
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardControl.quickActions')} description={t('dashboardControl.quickActionsHint')}>
            <div className="space-y-3">
              {quickActionRows.map((actionId) => {
                const action = moduleLabelById[actionId] ?? DASHBOARD_QUICK_ACTION_COPY[actionId];
                const enabled = formData.quickActions.includes(actionId);
                const orderIndex = formData.quickActions.indexOf(actionId);

                return (
                  <div key={actionId} className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-foreground">{isArabicPreview ? action.labelAr : action.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{DASHBOARD_ROUTE_PATHS[actionId]}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleQuickActionMove(actionId, -1)}
                          disabled={!enabled || orderIndex <= 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleQuickActionMove(actionId, 1)}
                          disabled={!enabled || orderIndex === -1 || orderIndex >= formData.quickActions.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <label className="mt-4 flex items-center justify-between rounded-[1.25rem] border border-border/60 bg-card/70 px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{t('dashboardControl.showAsQuickAction')}</span>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleQuickActionToggle(actionId)}
                        className="h-5 w-5"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardControl.preview')} description={t('dashboardControl.previewHint')}>
            <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-background/70">
              <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {formData.iconUrl ? (
                    <img src={formData.iconUrl} alt={formData.dashboardName} className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    <LayoutDashboard className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-heading text-lg font-bold text-foreground">
                    {isArabicPreview ? formData.dashboardNameAr || formData.dashboardName : formData.dashboardName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isArabicPreview ? formData.subtitleAr || formData.subtitle : formData.subtitle}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="rounded-[1.5rem] border border-border/60 bg-card/70 p-4">
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <p className="text-sm font-semibold">{isArabicPreview ? formData.introTitleAr || formData.introTitle : formData.introTitle}</p>
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {isArabicPreview ? formData.introBodyAr || formData.introBody : formData.introBody}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-border/60 bg-card/70 p-4">
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <PanelsTopLeft className="h-4 w-4" />
                    <p className="text-sm font-semibold">{t('dashboardControl.sidebarPreview')}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.sidebarModules
                      .filter((module) => module.enabled)
                      .slice(0, 6)
                      .map((module) => (
                        <span key={module.id} className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground">
                          {isArabicPreview ? module.labelAr || module.label : module.label}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border/60 bg-card/70 p-4">
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <Palette className="h-4 w-4" />
                    <p className="text-sm font-semibold">{t('dashboardControl.quickActionPreview')}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.quickActions.slice(0, 4).map((actionId) => (
                      <span key={actionId} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        {isArabicPreview
                          ? (moduleLabelById[actionId]?.labelAr ?? DASHBOARD_QUICK_ACTION_COPY[actionId].labelAr)
                          : (moduleLabelById[actionId]?.label ?? DASHBOARD_QUICK_ACTION_COPY[actionId].label)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>
    </SettingsShell>
  );
};
