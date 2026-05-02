import { useTranslation } from 'react-i18next';
import { Code2, GitCommit, Users, Zap } from 'lucide-react';

export const StatsStrip = () => {
  const { t } = useTranslation();
  
  const stats = [
    { 
      label: t('stats.yearsExp'), 
      value: t('stats.valYearsExp'), 
      icon: Zap
    },
    { 
      label: t('stats.projectsDelivered'), 
      value: t('stats.valProjects'), 
      icon: Code2
    },
    { 
      label: t('stats.happyClients'), 
      value: t('stats.valClients'), 
      icon: Users
    },
    { 
      label: t('stats.linesOfCode'), 
      value: t('stats.valCode'),
      subtitle: t('stats.clientSatisfaction'),
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
              <div
                key={i}
                className="group flex flex-col items-center justify-center p-2 text-center animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${i * 70}ms` }}
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
