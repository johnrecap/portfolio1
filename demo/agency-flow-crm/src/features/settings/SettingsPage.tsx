import { useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { useCRMStore } from "../../store/crmStore";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const resetDemoData = useCRMStore((state) => state.resetDemoData);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleResetDemo = () => {
    resetDemoData();
    setIsResetOpen(false);
  };

  return (
    <div className="p-container-padding max-w-[1440px] mx-auto w-full space-y-stack-lg h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="font-page-title text-page-title text-primary">{t('settings.title')}</h1>
          <p className="font-body-main text-on-surface-variant mt-1">{t('settings.description')}</p>
        </div>
        <Button className="mt-4 sm:mt-0">{t('settings.save')}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h3 className="font-section-title text-primary">{t('settings.profile')}</h3>
          <p className="font-body-sm text-on-surface-variant">{t('settings.profileDesc')}</p>
        </div>
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label={t('settings.firstName')} defaultValue="Mohamed" />
              <Input label={t('settings.lastName')} defaultValue="Saied" />
            </div>
            <Input label={t('settings.email')} type="email" defaultValue="mohamedsaied.m20@gmail.com" />
            <Input label={t('settings.role')} defaultValue="Admin" disabled />
          </CardContent>
        </Card>
      </div>

      <div className="h-px bg-[#E2E8F0] my-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h3 className="font-section-title text-primary">{t('settings.language')}</h3>
          <p className="font-body-sm text-on-surface-variant">{t('settings.languageDesc')}</p>
        </div>
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="p-6">
            <Select 
              label={t('settings.language')} 
              value={i18n.language} 
              onChange={handleLanguageChange}
              options={[
                { label: "English", value: "en" },
                { label: "العربية", value: "ar" }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="h-px bg-[#E2E8F0] my-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h3 className="font-section-title text-primary">{t('settings.demoSession')}</h3>
          <p className="font-body-sm text-on-surface-variant">{t('settings.demoSessionDesc')}</p>
        </div>
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-body-main text-primary">{t('settings.privateSession')}</p>
              <p className="font-body-sm text-on-surface-variant mt-1">{t('settings.privateSessionDesc')}</p>
            </div>
            <Button variant="danger" onClick={() => setIsResetOpen(true)}>
              {t('settings.resetDemo')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        title={t('settings.resetDemoTitle')}
      >
        <div className="space-y-6">
          <p className="font-body-main text-on-surface-variant">
            {t('settings.resetDemoBody')}
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setIsResetOpen(false)}>
              {t('settings.keepChanges')}
            </Button>
            <Button variant="danger" onClick={handleResetDemo}>
              {t('settings.confirmReset')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
