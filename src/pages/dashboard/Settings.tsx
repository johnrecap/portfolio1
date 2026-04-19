import { useState, useEffect } from 'react';
import { 
  Save, 
  Trash2, 
  BadgeCheck, 
  Link as LinkIcon,
  Code,
  Briefcase,
  Globe,
  FileText,
  Image as ImageIcon,
  Edit2,
  Eye,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocument } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const DashboardSettings = () => {
  const { data: profile, loading, setDocument } = useDocument('settings', 'profile');
  const [isSaving, setIsSaving] = useState(false);
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (profile) {
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
        profileImage: (profile as any).profileImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEpMS7bpnt68tnkqp2_cxoeyhdbNW2Lw1xH-CJeYb54crTGf7O5C62aNhBOGRSTadCUJpH-pn3dXLnPmifpdQz-MYuOXQ1MQr2L_9mwz182oeztwNSS551GOzV4BwQ8Wo45Ipps2kpfiBu-UwhegVRWsQdjKu7nf0s_lxwoJnISIWW5ApFuzIiXi2D2KwlfHJjfUt9DSqWklyXgRtdiAo-71h1gp8V-g6wigCUbt0PV90cv_1eEO51D_xHeEwL953DpHW1Q0GI8Rk2',
        heroImage: (profile as any).heroImage || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDocument(formData);
      toast.success(t('dashboardSettings.saveSuccess'));
    } catch (e) {
      toast.error(t('dashboardSettings.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 flex-1 flex items-center justify-center">{t('dashboardSettings.loading')}</div>;

  return (
    <div className="flex-1 overflow-y-auto pt-10 px-6 xl:px-12 max-w-screen-2xl mx-auto min-h-screen pb-20 w-full">
      
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl lg:text-[3.5rem] leading-none font-heading font-bold tracking-tight text-foreground">{t('dashboardSettings.profileSettings')}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-label text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full inline-flex border border-border">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span>{t('dashboardSettings.manageGlobal')}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-6 py-6 rounded-2xl font-label font-medium transition-all duration-300 bg-gradient-to-br from-primary to-primary-container shadow-md flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? t('dashboardSettings.saving') : t('dashboardSettings.saveChanges')}
          </Button>
        </div>
      </div>

      {/* Asymmetric Form Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (Main Data) */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          
          {/* Section: Public Identity */}
          <section className="bg-card rounded-[2rem] p-8 md:p-10 shadow-sm border border-border hover:shadow-lg transition-all duration-500 group relative">
            <div className={`absolute top-0 ${i18n.language === 'ar' ? 'right-0 rounded-r-[2rem]' : 'left-0 rounded-l-[2rem]'} w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors`}></div>
            
            <div className="flex items-center gap-3 mb-8">
              <BadgeCheck className="text-primary w-7 h-7" />
              <h3 className="text-2xl font-heading font-semibold text-foreground">{t('dashboardSettings.publicIdentity')}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className={`text-sm font-label font-medium text-muted-foreground ${i18n.language === 'ar' ? 'pr-1' : 'pl-1'}`}>{t('dashboardSettings.displayName')}</label>
                <Input 
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="bg-muted/50 focus-visible:bg-muted border-b-2 border-x-0 border-t-0 border-b-transparent focus-visible:border-b-primary rounded-t-xl rounded-b-none px-4 py-6 text-foreground font-body text-base shadow-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-label font-medium text-muted-foreground ${i18n.language === 'ar' ? 'pr-1' : 'pl-1'}`}>{t('dashboardSettings.displayName') + ' (AR)'}</label>
                <Input 
                  name="displayNameAr"
                  value={formData.displayNameAr || ''}
                  onChange={handleChange}
                  dir="rtl"
                  className="bg-muted/50 focus-visible:bg-muted border-b-2 border-x-0 border-t-0 border-b-transparent focus-visible:border-b-primary rounded-t-xl rounded-b-none px-4 py-6 text-foreground font-body text-base shadow-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-label font-medium text-muted-foreground ${i18n.language === 'ar' ? 'pr-1' : 'pl-1'}`}>{t('dashboardSettings.professionalTitle')}</label>
                <Input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-muted/50 focus-visible:bg-muted border-b-2 border-x-0 border-t-0 border-b-transparent focus-visible:border-b-primary rounded-t-xl rounded-b-none px-4 py-6 text-foreground font-body text-base shadow-none transition-all" 
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-8">
              <label className={`text-sm font-label font-medium text-muted-foreground ${i18n.language === 'ar' ? 'pr-1' : 'pl-1'}`}>{t('dashboardSettings.shortBio')}</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-muted/50 focus-within:bg-muted border-b-2 border-x-0 border-t-0 border-b-transparent focus-within:border-b-primary rounded-t-xl rounded-b-none px-4 py-4 text-foreground font-body text-base shadow-none transition-all outline-none resize-none min-h-[120px]" 
              ></textarea>
              <p className={`text-xs text-muted-foreground ${i18n.language === 'ar' ? 'text-left pl-2' : 'text-right pr-2'}`}>{t('dashboardSettings.characters', { count: formData.bio.length })}</p>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-xl border border-border">
              <div>
                <h4 className="font-label font-semibold text-foreground mb-1">{t('dashboardSettings.availStatus')}</h4>
                <p className="text-sm font-body text-muted-foreground">{t('dashboardSettings.showRecruiters')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer scale-110">
                <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleCheckboxChange} className="sr-only peer" />
                <div className={`w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:bg-teal-500 after:content-[''] after:absolute after:top-[2px] ${i18n.language === 'ar' ? 'after:right-[2px] peer-checked:after:-translate-x-full' : 'after:left-[2px] peer-checked:after:translate-x-full'} after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>
          </section>

          {/* Section: Social Links */}
          <section className="bg-card rounded-[2rem] p-8 md:p-10 shadow-sm border border-border hover:shadow-lg transition-all duration-500">
            <div className="flex items-center gap-3 mb-8">
              <LinkIcon className="text-primary w-6 h-6" />
              <h3 className="text-2xl font-heading font-semibold text-foreground">{t('dashboardSettings.socialConnectivity')}</h3>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <Code className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5`} />
                <Input 
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  className={`${i18n.language === 'ar' ? 'pr-12' : 'pl-12'} bg-muted/50 focus-visible:bg-muted border-b-2 border-x-0 border-t-0 border-b-transparent focus-visible:border-b-primary rounded-t-xl rounded-b-none py-6 text-foreground font-body text-base shadow-none transition-all`} 
                />
              </div>
              <div className="relative group">
                <Briefcase className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5`} />
                <Input 
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className={`${i18n.language === 'ar' ? 'pr-12' : 'pl-12'} bg-muted/50 focus-visible:bg-muted border-b-2 border-x-0 border-t-0 border-b-transparent focus-visible:border-b-primary rounded-t-xl rounded-b-none py-6 text-foreground font-body text-base shadow-none transition-all`} 
                />
              </div>
              <div className="relative group">
                <Globe className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5`} />
                <Input 
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  className={`${i18n.language === 'ar' ? 'pr-12' : 'pl-12'} bg-muted/50 focus-visible:bg-muted border-b-2 border-x-0 border-t-0 border-b-transparent focus-visible:border-b-primary rounded-t-xl rounded-b-none py-6 text-foreground font-body text-base shadow-none transition-all`} 
                  placeholder={t('dashboardSettings.websitePlaceholder')} 
                />
              </div>
            </div>
          </section>

            {/* Section: File Uploads */}
          <section className="bg-card rounded-[2rem] p-8 md:p-10 shadow-sm border border-border hover:shadow-lg transition-all duration-500">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="text-primary w-6 h-6" />
              <h3 className="text-2xl font-heading font-semibold text-foreground">{t('dashboardSettings.assetManagement')}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer group min-h-[220px]">
                <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <FileText className="text-primary w-6 h-6" />
                </div>
                <h4 className="font-label font-bold text-foreground mb-2 text-lg">{t('dashboardSettings.resumeCv')}</h4>
                <p className="text-sm text-muted-foreground">{t('dashboardSettings.pdfMax')}</p>
              </div>
              
              <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer group min-h-[220px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2vwHcS8ohloQ3217Zt8FFQV0241TsmVPHOrkKrK6B-FlKQjZNnCqYtfdKuKJvcts26K4IKN_7bY7NezAzWqyDRPpzuV7Iqn4ok2oenhy0BRgVQ3GEu8GZ7LxkVkRPjBnGgHS5hf3OiNLl2cBjMJmMe5C2kukM8wYDtZlC24GKkfHJcJJsG4GfTMIAvvXX91mSvbJw_2Zm5o00tDngTaGxASkPn-0rksJfn3jWUh1VkfY01hdIX5MACr8ManJMfLSoVWoLBz_-O42L')" }}></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <ImageIcon className="text-primary w-6 h-6" />
                  </div>
                  <h4 className="font-label font-bold text-foreground mb-2 text-lg">{t('dashboardSettings.heroBanner')}</h4>
                  <p className="text-sm text-muted-foreground">{t('dashboardSettings.heroRec')}</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN (Visuals & Meta) */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          
          {/* Section: Profile Photo */}
          <section className="bg-card rounded-[2rem] p-8 md:p-10 shadow-sm border border-border hover:shadow-lg transition-all duration-500 flex flex-col items-center text-center">
            <h3 className={`text-xl font-heading font-semibold mb-8 self-start w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} text-foreground`}>{t('dashboardSettings.profileImage')}</h3>
            
            <div className="relative mb-10 group">
              <div className="w-48 h-48 rounded-full overflow-hidden border-[6px] border-background shadow-xl relative z-10 bg-card">
                <img 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  src={formData.profileImage || undefined} 
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl -z-10 scale-125 group-hover:scale-[1.35] transition-transform duration-500"></div>
              
              <button 
                onClick={() => {
                  const url = prompt(t('dashboardSettings.newImageUrl'));
                  if (url) setFormData(prev => ({ ...prev, profileImage: url }));
                }}
                className={`absolute bottom-0 ${i18n.language === 'ar' ? 'left-2' : 'right-2'} w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg border-4 border-background hover:scale-110 transition-transform z-20`}
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground px-4 leading-relaxed">
              {t('dashboardSettings.imageInstructions')}
            </p>
          </section>

          {/* Section: Public Preview */}
          <section className="bg-card rounded-[2rem] p-1.5 shadow-sm border border-border relative overflow-hidden group">
            <div className="bg-background w-full h-full rounded-[1.75rem] p-6 relative">
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-label text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span> {t('dashboardSettings.livePreview')}
                </span>
                <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              
              {/* Mini Mockup */}
              <div className="border border-border/80 rounded-[1rem] overflow-hidden bg-card shadow-sm">
                <div className="h-20 bg-cover bg-center" style={{ backgroundImage: `url(${formData.heroImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJaEuvBBmwKxUKGVwoiZTK0m00vj-pNffWoBVkPZUadlsanQYDtFFSpbqFkLuBAadfPesnuaIKVGXsq2PiFXgzBWzkZSV8C1H10FVC1_-y7uv5MYRXXwltggsh69sO5fJ8dhBZWoz06vRTkVTYOq250lynOf5PQ_VWvQb-_jZnzZwH7RpE7YPchiySSoutOYVRWJeLzjUyjRh3fsRVGqBhht5g2VFPMZNGKJGPPcuaLFmdhgAcPPMxa4T9phvv0xWpIehBz2NrzhmT'})` }}></div>
                <div className="px-4 pb-5 relative">
                  <div className="w-14 h-14 rounded-full border-[3px] border-card bg-card overflow-hidden absolute -top-7 shadow-sm">
                    <img 
                      alt="Thumb" 
                      className="w-full h-full object-cover" 
                      src={formData.profileImage || undefined} 
                    />
                  </div>
                  <div className={`pt-10 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h5 className="font-heading font-bold text-base text-foreground mb-0.5">{formData.displayName || t('dashboardSettings.displayName')}</h5>
                    <p className="text-xs text-muted-foreground mb-3">{formData.title || t('dashboardSettings.professionalTitle')}</p>
                    {formData.isAvailable && (
                      <div className="inline-flex px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] rounded-full font-bold uppercase tracking-wider">
                        {t('dashboardSettings.availableForWork')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          </section>

          {/* Section: SEO Identity */}
          <section className="bg-card rounded-[2rem] p-8 md:p-10 shadow-sm border border-border hover:shadow-lg transition-all duration-500">
            <div className="flex items-center gap-3 mb-8">
              <Search className="text-muted-foreground w-6 h-6" />
              <h3 className="text-xl font-heading font-semibold text-foreground">{t('dashboardSettings.seo')}</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={`text-sm font-label font-medium text-muted-foreground ${i18n.language === 'ar' ? 'pr-1' : 'pl-1'}`}>{t('dashboardSettings.metaTitle')}</label>
                <Input 
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="bg-muted focus-visible:bg-background border-border rounded-xl px-4 py-5 text-foreground font-body text-sm transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-label font-medium text-muted-foreground ${i18n.language === 'ar' ? 'pr-1' : 'pl-1'}`}>{t('dashboardSettings.metaDesc')}</label>
                <textarea 
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className="w-full bg-muted focus-within:bg-background border border-border rounded-xl px-4 py-4 text-foreground font-body text-sm transition-all outline-none resize-none" 
                  rows={4}
                ></textarea>
              </div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
};
