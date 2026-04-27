import React from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '../utils/cn';

export const Settings = () => {
  const { theme, language, setTheme, setLanguage } = useStore();
  const { t } = useTranslation();

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title', 'Settings')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('settings.description', 'Manage your preferences and application settings.')}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-muted-foreground" />
            {t('settings.theme', 'Theme')}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-colors",
                theme === 'light' 
                  ? "bg-primary-50 border-primary-500 text-primary-700" 
                  : "bg-background border-border text-foreground hover:bg-muted"
              )}
            >
              <Sun className="w-4 h-4" />
              {t('settings.light', 'Light')}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-colors",
                theme === 'dark' 
                  ? "bg-primary-900/30 border-primary-500 text-primary-400" 
                  : "bg-background border-border text-foreground hover:bg-muted"
              )}
            >
              <Moon className="w-4 h-4" />
              {t('settings.dark', 'Dark')}
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-muted-foreground" />
            {t('settings.language', 'Language')}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "flex px-4 py-2 rounded-lg border font-medium text-sm transition-colors",
                language === 'en' 
                  ? "bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400" 
                  : "bg-background border-border text-foreground hover:bg-muted"
              )}
            >
              {t('settings.english', 'English')}
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={cn(
                "flex px-4 py-2 rounded-lg border font-medium text-sm transition-colors",
                language === 'ar' 
                  ? "bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400" 
                  : "bg-background border-border text-foreground hover:bg-muted"
              )}
            >
              {t('settings.arabic', 'Arabic')}
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-center">
          <p className="text-sm text-muted-foreground">
            {t('sidebar.builtBy', 'Built by')} <span className="font-semibold text-foreground">Mohamed Saied</span>
          </p>
        </div>
      </div>
    </div>
  );
};
