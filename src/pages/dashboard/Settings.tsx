import { useEffect, useState } from 'react';
import { Eye, Image as ImageIcon, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocument } from '@/hooks/useFirestore';

type SettingsForm = {
  displayName: string;
  displayNameAr: string;
  title: string;
  titleAr: string;
  bio: string;
  bioAr: string;
  isAvailable: boolean;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  metaTitle: string;
  metaTitleAr: string;
  metaDescription: string;
  metaDescriptionAr: string;
  profileImage: string;
  heroImage: string;
};

const initialForm: SettingsForm = {
  displayName: '',
  displayNameAr: '',
  title: '',
  titleAr: '',
  bio: '',
  bioAr: '',
  isAvailable: true,
  githubUrl: '',
  linkedinUrl: '',
  websiteUrl: '',
  metaTitle: '',
  metaTitleAr: '',
  metaDescription: '',
  metaDescriptionAr: '',
  profileImage: '',
  heroImage: '',
};

export const DashboardSettings = () => {
  const { data: profile, loading, setDocument } = useDocument('settings', 'profile');
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<SettingsForm>(initialForm);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormData({
      displayName: (profile as any).displayName || '',
      displayNameAr: (profile as any).displayNameAr || '',
      title: (profile as any).title || '',
      titleAr: (profile as any).titleAr || '',
      bio: (profile as any).bio || '',
      bioAr: (profile as any).bioAr || '',
      isAvailable: (profile as any).isAvailable ?? true,
      githubUrl: (profile as any).githubUrl || '',
      linkedinUrl: (profile as any).linkedinUrl || '',
      websiteUrl: (profile as any).websiteUrl || '',
      metaTitle: (profile as any).metaTitle || '',
      metaTitleAr: (profile as any).metaTitleAr || '',
      metaDescription: (profile as any).metaDescription || '',
      metaDescriptionAr: (profile as any).metaDescriptionAr || '',
      profileImage: (profile as any).profileImage || '',
      heroImage: (profile as any).heroImage || '',
    });
  }, [profile]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormData((current) => ({ ...current, isAvailable: checked }));
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
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 pt-10 pb-20">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
            {t('dashboardSettings.profileSettings')}
          </h1>
          <p className="mt-2 text-muted-foreground">{t('dashboardSettings.manageGlobal')}</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? t('dashboardSettings.saving') : t('dashboardSettings.saveChanges')}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {t('dashboardSettings.publicIdentity')}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.displayName')}
              </label>
              <Input name="displayName" value={formData.displayName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.displayNameAr')}
              </label>
              <Input
                name="displayNameAr"
                value={formData.displayNameAr}
                onChange={handleChange}
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.professionalTitle')}
              </label>
              <Input name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.professionalTitleAr')}
              </label>
              <Input name="titleAr" value={formData.titleAr} onChange={handleChange} dir="rtl" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.shortBio')}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="min-h-[140px] w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.shortBioAr')}
              </label>
              <textarea
                name="bioAr"
                value={formData.bioAr}
                onChange={handleChange}
                dir="rtl"
                className="min-h-[140px] w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>

          <label className="flex items-center justify-between rounded-[1.5rem] border border-border/60 bg-background/70 px-5 py-4">
            <div>
              <p className="font-semibold text-foreground">{t('dashboardSettings.availStatus')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('dashboardSettings.showRecruiters')}</p>
            </div>
            <input type="checkbox" checked={formData.isAvailable} onChange={handleCheckboxChange} className="h-5 w-5" />
          </label>

          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">
              {t('dashboardSettings.socialConnectivity')}
            </h3>
            <Input
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
            <Input
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
            <Input
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder={t('dashboardSettings.websitePlaceholder')}
            />
          </div>
        </section>

        <div className="space-y-6">
          <section className="space-y-5 rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {t('dashboardSettings.visualAssets')}
              </h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.profileImage')}
              </label>
              <Input name="profileImage" value={formData.profileImage} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.heroImage')}
              </label>
              <Input name="heroImage" value={formData.heroImage} onChange={handleChange} />
            </div>

            <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Eye className="h-4 w-4" />
                <p className="text-sm font-semibold">{t('dashboardSettings.livePreview')}</p>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card">
                <div
                  className="h-24 bg-cover bg-center"
                  style={{ backgroundImage: formData.heroImage ? `url(${formData.heroImage})` : undefined }}
                />
                <div className="relative px-5 pb-5">
                  <div className="-mt-10 h-20 w-20 overflow-hidden rounded-full border-4 border-card bg-muted">
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                    {formData.displayName || t('dashboardSettings.displayName')}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formData.title || t('dashboardSettings.professionalTitle')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5 rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-foreground">{t('dashboardSettings.seo')}</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.metaTitle')}
              </label>
              <Input name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.metaTitleAr')}
              </label>
              <Input name="metaTitleAr" value={formData.metaTitleAr} onChange={handleChange} dir="rtl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.metaDesc')}
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                className="min-h-[120px] w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('dashboardSettings.metaDescAr')}
              </label>
              <textarea
                name="metaDescriptionAr"
                value={formData.metaDescriptionAr}
                onChange={handleChange}
                dir="rtl"
                className="min-h-[120px] w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
