import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Code2, GitCommit, Users, Zap } from 'lucide-react';

export const StatsStrip = () => {
  const { t } = useTranslation();
  
  const stats = [
    { 
      label: t('stats.yearsExp'), 
      value: t('stats.valYearsExp', { defaultValue: '+3' }), 
      icon: Zap
    },
    { 
      label: t('stats.projectsDelivered'), 
      value: t('stats.valProjects', { defaultValue: '+20' }), 
      icon: Code2
    },
    { 
      label: t('stats.happyClients'), 
      value: t('stats.valClients', { defaultValue: '+10' }), 
      icon: Users
    },
    { 
      label: t('stats.linesOfCode'), 
      value: t('stats.valCode', { defaultValue: '95%' }),
      subtitle: t('stats.clientSatisfaction', { defaultValue: 'Success Rate' }),
      icon: GitCommit
    },
  ];

  return (
    <section className="py-4 md:py-8 border-y border-border/50 bg-muted/20">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 divide-x divide-border/50 rtl:divide-x-reverse">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center text-center p-2 group"
              >
                <div className="mb-3 p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl md:text-3xl font-heading font-black text-foreground tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.subtitle || stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
