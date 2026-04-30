import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { AdminPageSection } from '@/lib/admin/types';
import { getSurfaceTone, readSectionText } from './section-utils';

function StrengthsSection({ section }: { section: AdminPageSection }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const strengths = [
    readSectionText(section, 'strength1', t('about.strength1'), isArabic),
    readSectionText(section, 'strength2', t('about.strength2'), isArabic),
    readSectionText(section, 'strength3', t('about.strength3'), isArabic),
  ];
  const title = readSectionText(section, 'title', '', isArabic);
  const subtitle = readSectionText(section, 'subtitle', '', isArabic);
  const centered = section.variant === 'card';

  return (
    <section className="py-4 md:py-6">
      {title || subtitle ? (
        <div className={`mb-8 ${centered ? 'max-w-3xl text-center mx-auto' : 'max-w-3xl'}`}>
          {title ? <h2 className="font-heading text-3xl font-black text-foreground">{title}</h2> : null}
          {subtitle ? <p className="mt-3 text-base leading-8 text-muted-foreground">{subtitle}</p> : null}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-3">
        {strengths.map((item) => (
          <div
            key={item}
            className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}
          >
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm font-semibold leading-7 text-foreground">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export { StrengthsSection };
