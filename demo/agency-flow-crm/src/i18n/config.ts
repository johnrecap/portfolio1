import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const DEMO_LANGUAGE_KEY = 'agency-flow-crm:language';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    ar: { translation: arTranslations }
  },
  lng: sessionStorage.getItem(DEMO_LANGUAGE_KEY) || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

// Sync direction on load
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  sessionStorage.setItem(DEMO_LANGUAGE_KEY, lng);
});

export default i18n;
