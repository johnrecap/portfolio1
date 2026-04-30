import { Suspense, lazy, useMemo } from 'react';

import { CTASection } from '@/components/public/cta-section';
import { FeaturedProjectsGrid } from '@/components/public/featured-projects';
import { HeroSection } from '@/components/public/hero-section';
import { ShowcaseSection } from '@/components/public/showcase-section';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import { SkeletonBlocks } from '@/components/shared/PageState';
import type { AdminPageConfig, AdminPageSection, PlatformPageId } from '@/lib/admin/types';
import { AboutIntroSection } from './sections/about-intro';
import { AvailabilitySection } from './sections/availability';
import { ContactIntroSection } from './sections/contact-intro';
import { ContactMethodsSection } from './sections/contact-methods';
import { EditorCardSection } from './sections/editor-card';
import { StrengthsSection } from './sections/strengths';

const ContactFormSection = lazy(() =>
  import('./sections/contact-form').then((module) => ({ default: module.ContactFormSection })),
);

type PublicPageComposerProps = {
  pageId: PlatformPageId;
  pageConfig: AdminPageConfig;
  loading?: boolean;
};

function renderSection(pageId: PlatformPageId, section: AdminPageSection) {
  switch (section.type) {
    case 'hero':
      return <HeroSection key={section.id} variant={section.variant as 'split' | 'centered' | 'minimal'} content={section.content} />;
    case 'showcase':
      return <ShowcaseSection key={section.id} variant={section.variant as 'grid' | 'spotlight'} content={section.content} />;
    case 'featuredProjects':
      return (
        <FeaturedProjectsGrid
          key={section.id}
          variant={section.variant as 'spotlight' | 'grid' | 'carousel'}
          content={section.content}
        />
      );
    case 'testimonials':
      return <TestimonialsSection key={section.id} variant={section.variant as 'card' | 'minimal'} content={section.content} />;
    case 'cta':
      return <CTASection key={section.id} variant={section.variant as 'banner' | 'card' | 'terminal-strip'} content={section.content} />;
    case 'aboutIntro':
      return <AboutIntroSection key={section.id} section={section} />;
    case 'strengths':
      return <StrengthsSection key={section.id} section={section} />;
    case 'editorCard':
      return <EditorCardSection key={section.id} section={section} />;
    case 'contactIntro':
      return <ContactIntroSection key={section.id} section={section} />;
    case 'contactForm':
      return (
        <Suspense key={section.id} fallback={<SkeletonBlocks count={1} />}>
          <ContactFormSection section={section} />
        </Suspense>
      );
    case 'contactMethods':
      return <ContactMethodsSection key={section.id} section={section} />;
    case 'availability':
      return <AvailabilitySection key={section.id} section={section} />;
    default:
      return null;
  }
}

export function PublicPageComposer({ pageId, pageConfig, loading = false }: PublicPageComposerProps) {
  const enabledSections = useMemo(
    () => pageConfig.sections.filter((section) => section.enabled),
    [pageConfig.sections],
  );

  const pageClass =
    pageId === 'home'
      ? 'flex w-full flex-col gap-10 overflow-hidden lg:gap-16'
      : pageId === 'contact'
        ? 'relative flex w-full flex-col gap-8 py-2'
        : 'flex w-full flex-col gap-8 pt-2 pb-10';

  if (loading && enabledSections.length === 0) {
    return (
      <div className={pageClass}>
        <SkeletonBlocks count={pageId === 'home' ? 4 : 3} />
      </div>
    );
  }

  return <div className={pageClass}>{enabledSections.map((section) => renderSection(pageId, section))}</div>;
}
