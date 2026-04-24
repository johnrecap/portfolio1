import { PageSeo } from '@/components/shared/PageSeo';
import { PublicPageComposer } from '@/components/public/page-composer';
import { usePageConfig } from '@/hooks/usePageConfig';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { pageConfig, loading: pageLoading } = usePageConfig('home');
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const seoTitle = isArabic
    ? pageConfig.seo.titleAr || pageConfig.titleAr || t('nav.home')
    : pageConfig.seo.title || pageConfig.title || t('nav.home');
  const seoDescription = isArabic
    ? pageConfig.seo.descriptionAr || t('hero.subheadline')
    : pageConfig.seo.description || t('hero.subheadline');

  return (
    <>
      <PageSeo title={seoTitle} description={seoDescription} image={pageConfig.seo.image} />
      <PublicPageComposer pageId="home" pageConfig={pageConfig} loading={pageLoading} />
    </>
  );
}
