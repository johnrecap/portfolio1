import { useTranslation } from 'react-i18next';

import { PublicPageComposer } from '@/components/public/page-composer';
import { PageSeo } from '@/components/shared/PageSeo';
import { usePageConfig } from '@/hooks/usePageConfig';

export const ContactForm = () => {
  const { pageConfig } = usePageConfig('contact');
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const seoTitle = isArabic
    ? pageConfig.seo.titleAr || pageConfig.titleAr || t('nav.contact')
    : pageConfig.seo.title || pageConfig.title || t('nav.contact');
  const seoDescription = isArabic
    ? pageConfig.seo.descriptionAr || t('contact.subtitle')
    : pageConfig.seo.description || t('contact.subtitle');

  return (
    <>
      <PageSeo title={seoTitle} description={seoDescription} image={pageConfig.seo.image} />
      <PublicPageComposer pageId="contact" pageConfig={pageConfig} />
    </>
  );
};
