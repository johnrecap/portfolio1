import { Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SkeletonLine } from '@/components/shared/PageState';
import { useContactSettings } from '@/hooks/usePlatformSettings';
import type { AdminPageSection } from '@/lib/admin/types';
import { getSurfaceTone, readSectionText } from './section-utils';

function AvailabilitySection({ section }: { section: AdminPageSection }) {
  const { contactSettings, loading: contactLoading } = useContactSettings({ publicRead: true });
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const title = readSectionText(section, 'title', t('contact.availableForWork'), isArabic);
  const subtitle = readSectionText(
    section,
    'subtitle',
    isArabic
      ? contactSettings.availabilityLabelAr || t('contact.availableDesc')
      : contactSettings.availabilityLabel || t('contact.availableDesc'),
    isArabic,
  );
  const responseValue = isArabic
    ? contactSettings.responseTimeAr || t('contact.responseValue')
    : contactSettings.responseTime || t('contact.responseValue');
  const locationValue = isArabic
    ? contactSettings.locationAr || t('contact.remote')
    : contactSettings.location || t('contact.remote');

  return (
    <section className="py-4 md:py-6">
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
            <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
          </div>
          {contactLoading ? (
            <div className="mt-4 space-y-3" aria-hidden="true">
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-4/5" />
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
            <div className="flex items-center gap-3 text-primary">
              <Clock className="h-5 w-5" />
              <p className="font-semibold text-foreground">{t('contact.responseTitle')}</p>
            </div>
            {contactLoading ? (
              <SkeletonLine className="mt-4 h-4 w-40" />
            ) : (
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{responseValue}</p>
            )}
          </div>
          <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
            <div className="flex items-center gap-3 text-primary">
              <MapPin className="h-5 w-5" />
              <p className="font-semibold text-foreground">{t('contact.location')}</p>
            </div>
            {contactLoading ? (
              <SkeletonLine className="mt-4 h-4 w-32" />
            ) : (
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{locationValue}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { AvailabilitySection };
