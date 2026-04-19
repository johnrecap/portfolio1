import { HeroSection } from '@/components/public/hero-section';
import { FeaturedProjectsGrid } from '@/components/public/featured-projects';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import { CTASection } from '@/components/public/cta-section';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 lg:gap-20 w-full overflow-hidden">
      <HeroSection />
      <FeaturedProjectsGrid />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
