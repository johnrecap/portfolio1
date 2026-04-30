import { useTranslation } from 'react-i18next';

import type { AdminPageSection } from '@/lib/admin/types';
import { readSectionText } from './section-utils';

function ContactIntroSection({ section }: { section: AdminPageSection }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const eyebrow = readSectionText(section, 'eyebrow', t('contact.eyebrow'), isArabic);
  const title = readSectionText(section, 'title', t('contact.title'), isArabic);
  const highlight = readSectionText(section, 'highlight', t('contact.usefulTogether'), isArabic);
  const subtitle = readSectionText(section, 'subtitle', t('contact.subtitle'), isArabic);
  const centered = section.variant === 'centered';

  return (
    <section className="py-6 md:py-8">
      <header className={`${centered ? 'mx-auto max-w-4xl text-center' : 'max-w-3xl'} space-y-5`}>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        <h1 className="font-heading text-4xl font-black tracking-tight text-foreground md:text-6xl">
          {title} <span className="text-primary">{highlight}</span>
        </h1>
        <p className="text-base leading-8 text-muted-foreground md:text-lg">{subtitle}</p>
      </header>
    </section>
  );
}

export { ContactIntroSection };
