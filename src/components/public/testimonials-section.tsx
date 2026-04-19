import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      quote: t('testimonials.quote1', { defaultValue: "An absolute professional. Delivered high-quality code on time and went above and beyond to ensure everything was perfect. Highly recommended for any complex frontend work." }),
      author: t('testimonials.author1', { defaultValue: "Sarah Jenkins" }),
      role: t('testimonials.role1', { defaultValue: "Product Manager at TechFlow" }),
      avatar: "https://picsum.photos/seed/sarah/100/100"
    },
    {
      id: 2,
      quote: t('testimonials.quote2', { defaultValue: "Transformed our slow, outdated application into a lightning-fast modern SPA. The attention to detail in both UI and core logic is unmatched." }),
      author: t('testimonials.author2', { defaultValue: "David Chen" }),
      role: t('testimonials.role2', { defaultValue: "CTO at RetailPro" }),
      avatar: "https://picsum.photos/seed/david/100/100"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight text-center">
            {t('testimonials.title', { defaultValue: 'Client Feedback' })}
          </h2>
          <div className="w-20 h-1 bg-primary/50 mb-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((tItem, i) => (
            <motion.div
              key={tItem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="h-full bg-slate-900/40 hover:bg-slate-900/80 transition-colors border border-slate-800 rounded-2xl p-8 relative flex flex-col">
                <Quote className="h-10 w-10 text-primary/10 absolute top-6 rtl:left-6 ltr:right-6" />
                <p className="text-slate-300 leading-relaxed mb-8 flex-1 relative z-10 text-lg">
                  "{tItem.quote}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img
                    src={tItem.avatar}
                    alt={tItem.author}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-slate-200">{tItem.author}</h4>
                    <p className="text-sm text-primary/80">{tItem.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
