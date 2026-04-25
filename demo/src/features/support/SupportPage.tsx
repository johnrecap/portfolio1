import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SupportPage() {
  const { t } = useTranslation();

  return (
    <div className="p-container-padding max-w-[1440px] mx-auto w-full space-y-stack-lg h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="font-page-title text-page-title text-primary">{t('support.title')}</h1>
          <p className="font-body-main text-on-surface-variant mt-1">{t('support.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center text-center space-y-4 hover:border-primary transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-primary">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-label-bold text-primary mb-1">{t('support.knowledgeBase')}</h3>
            <p className="font-body-sm text-on-surface-variant">{t('support.knowledgeBaseDesc')}</p>
          </div>
          <Button variant="secondary" className="w-full mt-auto">{t('support.browseArticles')}</Button>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center space-y-4 hover:border-primary transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-primary">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-label-bold text-primary mb-1">{t('support.liveChat')}</h3>
            <p className="font-body-sm text-on-surface-variant">{t('support.liveChatDesc')}</p>
          </div>
          <Button variant="secondary" className="w-full mt-auto">{t('support.startChat')}</Button>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center space-y-4 hover:border-primary transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-primary">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-label-bold text-primary mb-1">{t('support.emailSupport')}</h3>
            <p className="font-body-sm text-on-surface-variant">{t('support.emailSupportDesc')}</p>
          </div>
          <Button variant="secondary" className="w-full mt-auto">{t('support.sendEmail')}</Button>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="font-section-title text-primary mb-4">{t('support.faq')}</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-label-bold text-primary mb-2">{t('support.faq1Q')}</h4>
              <p className="font-body-sm text-on-surface-variant">{t('support.faq1A')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h4 className="font-label-bold text-primary mb-2">{t('support.faq2Q')}</h4>
              <p className="font-body-sm text-on-surface-variant">{t('support.faq2A')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
