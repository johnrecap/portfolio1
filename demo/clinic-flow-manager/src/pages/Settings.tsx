import React from "react";
import { useTranslation } from "react-i18next";
import { useClinicStore } from "@/store/clinicStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const theme = useClinicStore((s) => s.settings.theme);
  const setTheme = useClinicStore((s) => s.setTheme);
  const setLanguage = useClinicStore((s) => s.setLanguage);
  const resetDemoData = useClinicStore((s) => s.resetDemoData);

  const handleLanguageChange = (lang: "en" | "ar") => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('settingsPage.title')}</h2>
        <p className="text-on-surface-variant">{t('settingsPage.subtitle')}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settingsPage.appearance')}</CardTitle>
            <CardDescription>{t('settingsPage.customizeApp')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t('settingsPage.darkMode')}</div>
                <div className="text-sm text-on-surface-variant">{t('settingsPage.toggleDarkMode')}</div>
              </div>
              <div className="flex bg-surface-container-low rounded-lg p-1">
                 <button 
                  onClick={() => handleThemeChange('light')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'light' ? 'bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}
                 >
                   {t('settingsPage.light')}
                 </button>
                 <button 
                  onClick={() => handleThemeChange('dark')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant'}`}
                 >
                   {t('settingsPage.dark')}
                 </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
              <div>
                <div className="font-medium">{t('settingsPage.language')}</div>
                <div className="text-sm text-on-surface-variant">{t('settingsPage.chooseLang')}</div>
              </div>
              <div className="flex bg-surface-container-low rounded-lg p-1">
                 <button 
                  onClick={() => handleLanguageChange('en')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${i18n.language === 'en' ? 'bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}
                 >
                   {t('settingsPage.english')}
                 </button>
                 <button 
                  onClick={() => handleLanguageChange('ar')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${i18n.language === 'ar' ? 'bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}
                 >
                   {t('settingsPage.arabic')}
                 </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-error/20 bg-error-container/10">
          <CardHeader>
             <CardTitle className="text-error">{t('settingsPage.demoData')}</CardTitle>
             <CardDescription>{t('settingsPage.resetDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={resetDemoData}>
              {t('actions.reset')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
