import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { SettingsCard } from '@/components/dashboard/forms/settings-card';
import { SettingsShell } from '@/components/dashboard/forms/settings-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFooterSettings } from '@/hooks/usePlatformSettings';
import type { FooterSettings } from '@/lib/admin/types';

export const DashboardFooterSettings = () => {
  const { t } = useTranslation();
  const { footerSettings, loading, setDocument } = useFooterSettings();
  const [formData, setFormData] = useState<FooterSettings>(footerSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(footerSettings);
  }, [footerSettings]);

  const addFooterLink = () => {
    const nextIndex = formData.links.length + 1;
    setFormData((current) => ({
      ...current,
      links: [
        ...current.links,
        { id: `footer-link-${nextIndex}`, label: `Link ${nextIndex}`, labelAr: `رابط ${nextIndex}`, href: '/' },
      ],
    }));
  };

  const addSocialLink = () => {
    const nextIndex = formData.socialLinks.length + 1;
    setFormData((current) => ({
      ...current,
      socialLinks: [
        ...current.socialLinks,
        { id: `social-${nextIndex}`, label: `Social ${nextIndex}`, href: 'https://' },
      ],
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
      title={t('dashboardFooter.title')}
      description={t('dashboardFooter.description')}
      isSaving={isSaving}
      saveLabel={t('dashboardSettings.saveChanges')}
      savingLabel={t('dashboardSettings.saving')}
      onSave={handleSave}
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SettingsCard title={t('dashboardFooter.footerCopy')}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('dashboardFooter.tagline')}</Label>
                <Textarea
                  value={formData.tagline}
                  onChange={(event) => setFormData((current) => ({ ...current, tagline: event.target.value }))}
                  className="min-h-[140px]"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('dashboardFooter.taglineAr')}</Label>
                <Textarea
                  dir="rtl"
                  value={formData.taglineAr}
                  onChange={(event) => setFormData((current) => ({ ...current, taglineAr: event.target.value }))}
                  className="min-h-[140px]"
                />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardFooter.footerCta')}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('dashboardFooter.ctaLabel')}</Label>
                <Input value={formData.ctaLabel} onChange={(event) => setFormData((current) => ({ ...current, ctaLabel: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t('dashboardFooter.ctaLabelAr')}</Label>
                <Input dir="rtl" value={formData.ctaLabelAr} onChange={(event) => setFormData((current) => ({ ...current, ctaLabelAr: event.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('dashboardFooter.ctaHref')}</Label>
              <Input value={formData.ctaHref} onChange={(event) => setFormData((current) => ({ ...current, ctaHref: event.target.value }))} />
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardFooter.statusStrip')}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('dashboardFooter.statusStrip')}</Label>
                <Textarea
                  value={formData.statusStrip}
                  onChange={(event) => setFormData((current) => ({ ...current, statusStrip: event.target.value }))}
                  className="min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('dashboardFooter.statusStripAr')}</Label>
                <Textarea
                  dir="rtl"
                  value={formData.statusStripAr}
                  onChange={(event) => setFormData((current) => ({ ...current, statusStripAr: event.target.value }))}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </SettingsCard>
        </div>

        <div className="space-y-6">
          <SettingsCard title={t('dashboardFooter.quickLinks')}>
            <div className="space-y-4">
              {formData.links.map((item, index) => (
                <div key={item.id} className="space-y-3 rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{item.id}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          links: current.links.filter((link) => link.id !== item.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        links: current.links.map((link, itemIndex) =>
                          itemIndex === index ? { ...link, label: event.target.value } : link,
                        ),
                      }))
                    }
                    placeholder={t('dashboardNavigation.label')}
                  />
                  <Input
                    dir="rtl"
                    value={item.labelAr}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        links: current.links.map((link, itemIndex) =>
                          itemIndex === index ? { ...link, labelAr: event.target.value } : link,
                        ),
                      }))
                    }
                    placeholder={t('dashboardNavigation.labelAr')}
                  />
                  <Input
                    value={item.href}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        links: current.links.map((link, itemIndex) =>
                          itemIndex === index ? { ...link, href: event.target.value } : link,
                        ),
                      }))
                    }
                    placeholder={t('dashboardNavigation.href')}
                  />
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" className="gap-2" onClick={addFooterLink}>
              <Plus className="h-4 w-4" />
              {t('dashboardFooter.addLink')}
            </Button>
          </SettingsCard>

          <SettingsCard title={t('dashboardFooter.socialLinks')}>
            <div className="space-y-4">
              {formData.socialLinks.map((item, index) => (
                <div key={item.id} className="space-y-3 rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{item.id}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          socialLinks: current.socialLinks.filter((link) => link.id !== item.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        socialLinks: current.socialLinks.map((link, itemIndex) =>
                          itemIndex === index ? { ...link, label: event.target.value } : link,
                        ),
                      }))
                    }
                    placeholder={t('dashboardFooter.socialLabel')}
                  />
                  <Input
                    value={item.href}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        socialLinks: current.socialLinks.map((link, itemIndex) =>
                          itemIndex === index ? { ...link, href: event.target.value } : link,
                        ),
                      }))
                    }
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" className="gap-2" onClick={addSocialLink}>
              <Plus className="h-4 w-4" />
              {t('dashboardFooter.addSocialLink')}
            </Button>
          </SettingsCard>
        </div>
      </div>
    </SettingsShell>
  );
};
