import { useEffect, useState } from 'react';
import { Eye, Image as ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { SettingsCard } from '@/components/dashboard/forms/settings-card';
import { SettingsShell } from '@/components/dashboard/forms/settings-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDocument } from '@/hooks/useFirestore';
import { isSiteBrandMirroringProfile } from '@/lib/admin/brand';
import { createDefaultProfileSettings, createDefaultSiteSettings } from '@/lib/admin/defaults';
import { normalizeSiteSettings } from '@/lib/admin/settings';

type ProfileSettingsForm = ReturnType<typeof createDefaultProfileSettings>;
type SiteSettingsForm = ReturnType<typeof createDefaultSiteSettings>;

export const DashboardSiteSettings = () => {
  const { t, i18n } = useTranslation();
  const { data: profileData, loading: profileLoading, setDocument: setProfileDocument } = useDocument<Record<string, unknown>>(
    'settings',
    'profile',
  );
  const { data: siteData, loading: siteLoading, setDocument: setSiteDocument } = useDocument<Record<string, unknown>>(
    'settings',
    'site',
  );

  const [profileForm, setProfileForm] = useState<ProfileSettingsForm>(createDefaultProfileSettings());
  const [siteForm, setSiteForm] = useState<SiteSettingsForm>(createDefaultSiteSettings());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!profileData) {
      return;
    }

    const next = createDefaultProfileSettings();
    const updates = Object.fromEntries(
      Object.entries(profileData).filter(
        ([key, value]) => key in next && value !== undefined && value !== null && value !== '',
      ),
    ) as Partial<ProfileSettingsForm>;
    setProfileForm({ ...next, ...updates });
  }, [profileData]);

  useEffect(() => {
    setSiteForm(normalizeSiteSettings(siteData));
  }, [siteData]);

  const loading = profileLoading || siteLoading;
  const isArabicPreview = i18n.resolvedLanguage === 'ar';
  const siteBrandMirrorsProfile = isSiteBrandMirroringProfile(siteForm, profileForm);

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleSiteChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSiteForm((current) => ({ ...current, [name]: value }));
  };

  const handleCtaToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSiteForm((current) => ({ ...current, primaryCtaEnabled: event.target.checked }));
  };

  const handleRestoreCanonicalBrand = () => {
    const canonicalSiteBrand = createDefaultSiteSettings();

    setSiteForm((current) => ({
      ...current,
      siteName: canonicalSiteBrand.siteName,
      siteNameAr: canonicalSiteBrand.siteNameAr,
      siteTagline: canonicalSiteBrand.siteTagline,
      siteTaglineAr: canonicalSiteBrand.siteTaglineAr,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([setProfileDocument(profileForm), setSiteDocument(siteForm)]);
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
      title={t('dashboardSite.title')}
      description={t('dashboardSite.description')}
      isSaving={isSaving}
      saveLabel={t('dashboardSettings.saveChanges')}
      savingLabel={t('dashboardSettings.saving')}
      onSave={handleSave}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SettingsCard title={t('dashboardSite.publicIdentity')}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">{t('dashboardSettings.displayName')}</Label>
                <Input id="displayName" name="displayName" value={profileForm.displayName} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayNameAr">{t('dashboardSettings.displayNameAr')}</Label>
                <Input id="displayNameAr" name="displayNameAr" value={profileForm.displayNameAr} onChange={handleProfileChange} dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">{t('dashboardSettings.professionalTitle')}</Label>
                <Input id="title" name="title" value={profileForm.title} onChange={handleProfileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleAr">{t('dashboardSettings.professionalTitleAr')}</Label>
                <Input id="titleAr" name="titleAr" value={profileForm.titleAr} onChange={handleProfileChange} dir="rtl" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bio">{t('dashboardSettings.shortBio')}</Label>
                <Textarea id="bio" name="bio" value={profileForm.bio} onChange={handleProfileChange} className="min-h-[140px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bioAr">{t('dashboardSettings.shortBioAr')}</Label>
                <Textarea id="bioAr" name="bioAr" value={profileForm.bioAr} onChange={handleProfileChange} dir="rtl" className="min-h-[140px]" />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardSite.siteBranding')}>
            {siteBrandMirrorsProfile ? (
              <div className="rounded-[1.5rem] border border-amber-500/25 bg-amber-500/10 p-4">
                <p className="font-semibold text-foreground">{t('dashboardSite.profileMirrorWarningTitle')}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {t('dashboardSite.profileMirrorWarningBody')}
                </p>
                <Button type="button" variant="outline" className="mt-4" onClick={handleRestoreCanonicalBrand}>
                  {t('dashboardSite.restoreCanonicalBrand')}
                </Button>
              </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">{t('dashboardSite.siteName')}</Label>
                <Input id="siteName" name="siteName" value={siteForm.siteName} onChange={handleSiteChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteNameAr">{t('dashboardSite.siteNameAr')}</Label>
                <Input id="siteNameAr" name="siteNameAr" value={siteForm.siteNameAr} onChange={handleSiteChange} dir="rtl" />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteTagline">{t('dashboardSite.siteTagline')}</Label>
                <Textarea id="siteTagline" name="siteTagline" value={siteForm.siteTagline} onChange={handleSiteChange} className="min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteTaglineAr">{t('dashboardSite.siteTaglineAr')}</Label>
                <Textarea id="siteTaglineAr" name="siteTaglineAr" value={siteForm.siteTaglineAr} onChange={handleSiteChange} dir="rtl" className="min-h-[120px]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">{t('dashboardSite.logoUrl')}</Label>
              <Input id="logoUrl" name="logoUrl" value={siteForm.logoUrl} onChange={handleSiteChange} placeholder="https://..." />
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardSite.ctaSettings')}>
            <label className="flex items-center justify-between rounded-[1.5rem] border border-border/60 bg-background/70 px-5 py-4">
              <div>
                <p className="font-semibold text-foreground">{t('dashboardSite.primaryCtaEnabled')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t('dashboardSite.primaryCtaEnabledHint')}</p>
              </div>
              <input type="checkbox" checked={siteForm.primaryCtaEnabled} onChange={handleCtaToggle} className="h-5 w-5" />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryCtaLabel">{t('dashboardSite.primaryCtaLabel')}</Label>
                <Input id="primaryCtaLabel" name="primaryCtaLabel" value={siteForm.primaryCtaLabel} onChange={handleSiteChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryCtaLabelAr">{t('dashboardSite.primaryCtaLabelAr')}</Label>
                <Input id="primaryCtaLabelAr" name="primaryCtaLabelAr" value={siteForm.primaryCtaLabelAr} onChange={handleSiteChange} dir="rtl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryCtaHref">{t('dashboardSite.primaryCtaHref')}</Label>
              <Input id="primaryCtaHref" name="primaryCtaHref" value={siteForm.primaryCtaHref} onChange={handleSiteChange} placeholder="/projects" />
            </div>
          </SettingsCard>
        </div>

        <div className="space-y-6">
          <SettingsCard title={t('dashboardSite.visualAssets')}>
            <div className="space-y-2">
              <Label htmlFor="profileImage">{t('dashboardSettings.profileImage')}</Label>
              <Input id="profileImage" name="profileImage" value={profileForm.profileImage} onChange={handleProfileChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroImage">{t('dashboardSettings.heroImage')}</Label>
              <Input id="heroImage" name="heroImage" value={profileForm.heroImage} onChange={handleProfileChange} />
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardSite.livePreview')}>
            <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Eye className="h-4 w-4" />
                <p className="text-sm font-semibold">{t('dashboardSite.livePreview')}</p>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card">
                <div
                  className="flex h-24 items-end bg-cover bg-center px-4 pb-3"
                  style={{ backgroundImage: profileForm.heroImage ? `url(${profileForm.heroImage})` : undefined }}
                >
                  {siteForm.logoUrl ? (
                    <img src={siteForm.logoUrl} alt={siteForm.siteName} className="h-10 w-10 rounded-full border border-border/60 bg-background object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background text-primary">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="space-y-3 px-5 py-5">
                  <div>
                    <p className="font-heading text-xl font-bold text-foreground">
                      {isArabicPreview ? siteForm.siteNameAr || siteForm.siteName : siteForm.siteName}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {isArabicPreview
                        ? siteForm.siteTaglineAr || siteForm.siteTagline
                        : siteForm.siteTagline}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
                    {siteForm.primaryCtaEnabled
                      ? isArabicPreview
                        ? siteForm.primaryCtaLabelAr || siteForm.primaryCtaLabel
                        : siteForm.primaryCtaLabel
                      : t('dashboardSite.ctaDisabled')}
                  </div>
                  <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 overflow-hidden rounded-full border border-border/60 bg-muted">
                        {profileForm.profileImage ? (
                          <img src={profileForm.profileImage} alt={profileForm.displayName} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {isArabicPreview ? profileForm.displayNameAr || profileForm.displayName : profileForm.displayName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isArabicPreview ? profileForm.titleAr || profileForm.title : profileForm.title}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {isArabicPreview ? profileForm.bioAr || profileForm.bio : profileForm.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title={t('dashboardSite.brandGuidance')}>
            <div className="rounded-[1.5rem] border border-border/60 bg-primary/5 p-5 text-sm leading-7 text-muted-foreground">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <p className="font-semibold text-foreground">{t('dashboardSite.brandGuidance')}</p>
              </div>
              <p>{t('dashboardSite.brandGuidanceBody')}</p>
            </div>
          </SettingsCard>
        </div>
      </div>
    </SettingsShell>
  );
};
