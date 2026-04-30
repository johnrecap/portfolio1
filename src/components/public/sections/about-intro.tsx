import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SkeletonLine, SkeletonMedia } from '@/components/shared/PageState';
import { buttonVariants } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { usePublicCollection, usePublicMediaLibrary } from '@/hooks/public-firestore';
import { resolveMediaField, type ProjectRecord } from '@/lib/content-hub';
import { mergePublicProjects } from '@/lib/public-projects';
import { buildProfileImageStyle } from '@/lib/profile-image';
import type { AdminPageSection } from '@/lib/admin/types';
import { getSurfaceTone, readSectionText } from './section-utils';

function AboutIntroSection({ section }: { section: AdminPageSection }) {
  const { profile, loading: profileLoading } = useProfile();
  const { assets, loading: mediaLoading } = usePublicMediaLibrary();
  const { data: projects } = usePublicCollection<ProjectRecord>('projects');
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const bio = isArabic ? profile.bioAr || profile.bio : profile.bio;
  const title = readSectionText(section, 'title', t('about.subtitle'), isArabic);
  const intro = readSectionText(section, 'intro', t('about.intro'), isArabic);
  const eyebrow = readSectionText(section, 'eyebrow', t('about.title'), isArabic);
  const centered = section.variant === 'centered';
  const minimal = section.variant === 'minimal';
  const displayName = isArabic ? profile.displayNameAr || profile.displayName : profile.displayName;
  const profileMediaLoading = profileLoading || mediaLoading;
  const totalProjectCount = mergePublicProjects(projects).length;
  const profileImage = profileMediaLoading
    ? null
    : resolveMediaField(
        {
          url: profile.profileImage,
          assetId: profile.profileImageAssetId,
        },
        assets,
      );
  const profileImageStyle = buildProfileImageStyle(profile);

  return (
    <section className="py-6 md:py-8">
      <div className={`space-y-8 ${centered ? 'mx-auto max-w-4xl text-center' : 'max-w-5xl'}`}>
        <div
          className={
            centered || minimal || !profileImage?.url
              ? 'space-y-6'
              : 'grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'
          }
        >
          <div className={`space-y-4 ${centered ? 'mx-auto max-w-3xl' : ''}`}>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
            <h1 className="font-heading text-4xl font-black tracking-tight text-foreground md:text-6xl">
              {title}
            </h1>
            <p className={`text-base leading-8 text-muted-foreground md:text-lg ${centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}>
              {intro}
            </p>
            {profileLoading ? (
              <div className={`space-y-3 ${centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`} aria-hidden="true">
                <SkeletonLine className="h-4 w-full" />
                <SkeletonLine className="h-4 w-5/6" />
                <SkeletonLine className="h-4 w-3/4" />
              </div>
            ) : bio ? (
              <p className={`text-base leading-8 text-muted-foreground ${centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}>
                {bio}
              </p>
            ) : null}
          </div>

          {profileMediaLoading ? (
            <div className={`${centered || minimal ? 'mx-auto w-full max-w-sm' : 'w-full'} overflow-hidden rounded-[1.5rem] border border-border/60 bg-muted/30 shadow-sm`}>
              <SkeletonMedia className="aspect-[4/5] w-full rounded-none" />
            </div>
          ) : profileImage?.url ? (
            <div className={`${centered || minimal ? 'mx-auto w-full max-w-sm' : 'w-full'} overflow-hidden rounded-[1.5rem] border border-border/60 bg-muted shadow-sm`}>
              <img
                src={profileImage.url}
                alt={profileImage.alt || displayName}
                referrerPolicy="no-referrer"
                className="aspect-[4/5] w-full bg-muted"
                style={profileImageStyle}
              />
            </div>
          ) : null}
        </div>

        {!minimal ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t('about.statProjects')}
              </p>
              <p className="mt-3 font-heading text-4xl font-black text-foreground">{totalProjectCount}</p>
            </div>
            <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t('about.statAvailability')}
              </p>
              <div className="mt-3 font-heading text-xl font-bold text-foreground">
                {profileLoading ? (
                  <SkeletonLine className="h-7 w-32" />
                ) : (
                  t(profile.isAvailable ? 'about.availableNow' : 'about.unavailableNow')
                )}
              </div>
            </div>
            <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t('about.statDisciplines')}
              </p>
              <p className="mt-3 font-heading text-4xl font-black text-foreground">3</p>
            </div>
          </div>
        ) : null}

        <div className={`flex flex-wrap gap-4 ${centered ? 'justify-center' : ''}`}>
          <Link
            to="/projects"
            className={buttonVariants({
              size: 'lg',
              className: 'h-12 gap-2 px-7 text-sm font-bold',
            })}
          >
            {t('about.viewProjects')}
            <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
          </Link>
          <Link
            to="/contact"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: 'h-12 border-border/70 bg-card/60 px-7 text-sm font-bold',
            })}
          >
            {t('about.contactCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export { AboutIntroSection };
