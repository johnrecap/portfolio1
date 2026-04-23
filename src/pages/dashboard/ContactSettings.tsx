import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { SettingsCard } from '@/components/dashboard/forms/settings-card';
import { SettingsShell } from '@/components/dashboard/forms/settings-shell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContactSettings } from '@/hooks/usePlatformSettings';
import type { ContactSettings } from '@/lib/admin/types';

export const DashboardContactSettings = () => {
  const { t } = useTranslation();
  const { contactSettings, loading, setDocument } = useContactSettings();
  const [formData, setFormData] = useState<ContactSettings>(contactSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(contactSettings);
  }, [contactSettings]);

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
      title={t('dashboardContact.title')}
      description={t('dashboardContact.description')}
      isSaving={isSaving}
      saveLabel={t('dashboardSettings.saveChanges')}
      savingLabel={t('dashboardSettings.saving')}
      onSave={handleSave}
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SettingsCard title={t('dashboardContact.directChannels')}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('dashboardContact.email')}</Label>
              <Input value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboardContact.whatsapp')}</Label>
              <Input value={formData.whatsapp} onChange={(event) => setFormData((current) => ({ ...current, whatsapp: event.target.value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('dashboardContact.location')}</Label>
                <Input value={formData.location} onChange={(event) => setFormData((current) => ({ ...current, location: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t('dashboardContact.locationAr')}</Label>
                <Input dir="rtl" value={formData.locationAr} onChange={(event) => setFormData((current) => ({ ...current, locationAr: event.target.value }))} />
              </div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title={t('dashboardContact.availability')}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('dashboardContact.availabilityLabel')}</Label>
              <Textarea
                value={formData.availabilityLabel}
                onChange={(event) => setFormData((current) => ({ ...current, availabilityLabel: event.target.value }))}
                className="min-h-[140px]"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboardContact.availabilityLabelAr')}</Label>
              <Textarea
                dir="rtl"
                value={formData.availabilityLabelAr}
                onChange={(event) => setFormData((current) => ({ ...current, availabilityLabelAr: event.target.value }))}
                className="min-h-[140px]"
              />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('dashboardContact.responseTime')}</Label>
              <Input value={formData.responseTime} onChange={(event) => setFormData((current) => ({ ...current, responseTime: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboardContact.responseTimeAr')}</Label>
              <Input dir="rtl" value={formData.responseTimeAr} onChange={(event) => setFormData((current) => ({ ...current, responseTimeAr: event.target.value }))} />
            </div>
          </div>
        </SettingsCard>
      </div>
    </SettingsShell>
  );
};
