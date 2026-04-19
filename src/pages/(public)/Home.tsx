import { CTASection } from '@/components/public/cta-section';
import { FeaturedProjectsGrid } from '@/components/public/featured-projects';
import { HeroSection } from '@/components/public/hero-section';
import { ShowcaseSection } from '@/components/public/showcase-section';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import { PageSeo } from '@/components/shared/PageSeo';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-10 overflow-hidden lg:gap-16">
      <PageSeo title={t('nav.home')} description={t('hero.subheadline')} />
      <HeroSection />
      <ShowcaseSection />
      <FeaturedProjectsGrid />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
