import { motion } from 'motion/react';
import { Layers, Rocket, Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ServicesSection = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: <Code2 className="h-10 w-10 text-primary" />,
      title: t('services.frontend', { defaultValue: 'Clean Architecture' }),
      description: t('services.frontendDesc', { defaultValue: 'Producing scalable, maintainable, and well-documented code following modern best practices and design patterns.' })
    },
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: t('services.mobile', { defaultValue: 'High Performance' }),
      description: t('services.mobileDesc', { defaultValue: 'Optimizing for speed and seamless UX. Fast load times, smooth animations, and solid SEO fundamentals.' })
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: t('services.consulting', { defaultValue: 'End-to-End Solutions' }),
      description: t('services.consultingDesc', { defaultValue: 'Taking ideas from zero to production. Covering concept, database design, API integration, and deployment.' })
    }
  ];

  return (
    <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
        <div className="flex-1 md:pr-12 rtl:md:pr-0 rtl:md:pl-12">
          <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-foreground">
            {t('services.title', { defaultValue: 'Why choose me?' })}
          </h2>
          <p className="text-lg text-muted-foreground w-full max-w-md">
            {t('services.description', { defaultValue: 'I prioritize building highly performant applications that offer great user experiences and maintainable codebases.' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative h-full bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors flex flex-col items-start gap-6">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                {service.icon}
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
