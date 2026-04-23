import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmptyState, SkeletonBlocks } from '@/components/shared/PageState';
import { usePublicCollection, usePublicMediaLibrary } from '@/hooks/public-firestore';
import { readComposerText } from '@/lib/admin/page-content';
import {
  getFeaturedTestimonials,
  getLocalizedValue,
  resolveMediaField,
  type TestimonialRecord,
} from '@/lib/content-hub';

type TestimonialsSectionProps = {
  variant?: 'card' | 'minimal';
  content?: Record<string, unknown>;
};

export const TestimonialsSection = ({ variant = 'card', content = {} }: TestimonialsSectionProps) => {
  const { t, i18n } = useTranslation();
  const { data, loading } = usePublicCollection<TestimonialRecord>('testimonials');
  const { assets } = usePublicMediaLibrary();
  const isArabic = i18n.language === 'ar';

  const fallbackTestimonials = [
    {
      id: 'fallback-1',
      quote: t('testimonials.quote1'),
      author: t('testimonials.author1'),
      role: t('testimonials.role1'),
      avatar: 'https://picsum.photos/seed/sarah/100/100',
    },
    {
      id: 'fallback-2',
      quote: t('testimonials.quote2'),
      author: t('testimonials.author2'),
      role: t('testimonials.role2'),
      avatar: 'https://picsum.photos/seed/david/100/100',
    },
  ] as const;
  const title = readComposerText(content, 'title', t('testimonials.title'), isArabic);
  const subtitle = readComposerText(content, 'subtitle', t('testimonials.subtitle'), isArabic);
  const testimonials = getFeaturedTestimonials(data, 4);

  if (loading) {
    return (
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-black tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <SkeletonBlocks count={2} className="md:grid-cols-2" />
        </div>
      </section>
    );
  }

  const cards =
    testimonials.length > 0
      ? testimonials.map((item) => {
          const avatar = resolveMediaField({ url: item.avatarUrl, assetId: item.avatarAssetId }, assets);
          const logo = resolveMediaField({ url: item.logoUrl, assetId: item.logoAssetId }, assets);

          return {
            id: item.id,
            quote: getLocalizedValue(item.quote, item.quoteAr, isArabic) || item.quote,
            author: getLocalizedValue(item.name, item.nameAr, isArabic) || item.name,
            role: [getLocalizedValue(item.role, item.roleAr, isArabic), getLocalizedValue(item.company, item.companyAr, isArabic)]
              .filter(Boolean)
              .join(' / '),
            outcome: getLocalizedValue(item.outcome, item.outcomeAr, isArabic),
            avatar: avatar.url,
            logo: logo.url,
          };
        })
      : fallbackTestimonials;

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-foreground md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {cards.length === 0 ? (
          <EmptyState title={t('testimonials.title')} description={t('testimonials.subtitle')} className="py-10" />
        ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`relative flex h-full flex-col rounded-[1.75rem] border p-8 shadow-sm ${
                variant === 'minimal'
                  ? 'border-primary/10 bg-background/40'
                  : 'border-border/60 bg-card/70'
              }`}
            >
              <Quote className="absolute end-6 top-6 h-10 w-10 text-primary/10" />
              <p className="relative z-10 flex-1 text-base leading-8 text-foreground">"{item.quote}"</p>
              {'outcome' in item && item.outcome ? (
                <p className="mt-4 rounded-[1rem] border border-border/60 bg-background/50 px-4 py-3 text-sm leading-7 text-muted-foreground">
                  {item.outcome}
                </p>
              ) : null}
              <div className="mt-8 flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.author}
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-full border border-border object-cover"
                />
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{item.author}</h3>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
                {'logo' in item && item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.author}
                    referrerPolicy="no-referrer"
                    className="ms-auto h-8 max-w-[92px] object-contain opacity-80"
                  />
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};
