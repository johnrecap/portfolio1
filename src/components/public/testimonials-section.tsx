import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      quote: t('testimonials.quote1'),
      author: t('testimonials.author1'),
      role: t('testimonials.role1'),
      avatar: 'https://picsum.photos/seed/sarah/100/100',
    },
    {
      id: 2,
      quote: t('testimonials.quote2'),
      author: t('testimonials.author2'),
      role: t('testimonials.role2'),
      avatar: 'https://picsum.photos/seed/david/100/100',
    },
  ];

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-foreground md:text-5xl">
            {t('testimonials.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative flex h-full flex-col rounded-[1.75rem] border border-border/60 bg-card/70 p-8 shadow-sm"
            >
              <Quote className="absolute end-6 top-6 h-10 w-10 text-primary/10" />
              <p className="relative z-10 flex-1 text-base leading-8 text-foreground">"{item.quote}"</p>
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
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
