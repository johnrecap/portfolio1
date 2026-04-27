import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '../store/inventoryStore';

export function Settings() {
  const { t } = useTranslation();
  const { settings, resetToInitialData } = useInventoryStore();

  const handleReset = () => {
    if (window.confirm(t('settings.resetConfirm'))) {
      resetToInitialData();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-on-surface">{t('settings.title')}</h1>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-on-surface mb-4">{t('settings.dangerZone')}</h2>
          <div className="p-4 bg-error-container/30 border border-error/20 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-error flex items-center gap-2">
                {t('settings.resetData')}
              </p>
              <p className="text-sm text-on-surface-variant mt-1">
                {t('settings.resetDataDesc')}
              </p>
            </div>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-error text-on-error rounded-md text-sm font-medium hover:bg-error/90"
            >
              {t('settings.resetAction')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
