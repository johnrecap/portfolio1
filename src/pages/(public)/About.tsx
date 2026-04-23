import { useTranslation } from 'react-i18next';

import { PublicPageComposer } from '@/components/public/page-composer';
import { PageSeo } from '@/components/shared/PageSeo';
import { usePageConfig } from '@/hooks/usePageConfig';

export const About = () => {
  const { pageConfig } = usePageConfig('about');
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const seoTitle = isArabic
    ? pageConfig.seo.titleAr || pageConfig.titleAr || t('nav.about')
    : pageConfig.seo.title || pageConfig.title || t('nav.about');
  const seoDescription = isArabic
    ? pageConfig.seo.descriptionAr || t('about.subtitle')
    : pageConfig.seo.description || t('about.subtitle');

  return (
    <>
      <PageSeo title={seoTitle} description={seoDescription} image={pageConfig.seo.image} />
      <PublicPageComposer pageId="about" pageConfig={pageConfig} />
    </>
  );
};
