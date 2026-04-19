import { motion } from 'motion/react';
import { Blocks, Cloud, Code, Layers, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmptyState, SkeletonBlocks } from '@/components/shared/PageState';
import { PageSeo } from '@/components/shared/PageSeo';
import { useCollection } from '@/hooks/useFirestore';

type SkillRecord = {
  id: string;
  name: string;
  category?: string;
  proficiency: number;
};

export const Skills = () => {
  const { data: skills, loading } = useCollection<SkillRecord>('skills');
  const { t } = useTranslation();

  const groupedSkills = skills.reduce<Record<string, SkillRecord[]>>((accumulator, skill) => {
    const category = skill.category?.trim() || t('skills.otherCategory');
    accumulator[category] ??= [];
    accumulator[category].push(skill);
    return accumulator;
  }, {});

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'languages':
        return <Code className="h-6 w-6 text-primary" />;
      case 'frameworks':
        return <Blocks className="h-6 w-6 text-teal-500" />;
      case 'infrastructure':
        return <Cloud className="h-6 w-6 text-blue-500" />;
      case 'tools':
        return <Wrench className="h-6 w-6 text-amber-500" />;
      default:
        return <Layers className="h-6 w-6 text-primary" />;
    }
  };

  const getColorForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'languages':
        return 'bg-primary/10';
      case 'frameworks':
        return 'bg-teal-500/10';
      case 'infrastructure':
        return 'bg-blue-500/10';
      case 'tools':
        return 'bg-amber-500/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <div className="relative flex flex-col gap-16 overflow-hidden pb-12 md:pb-20">
      <PageSeo title={t('nav.skills')} description={t('skills.subtitle')} />

      <header className="mb-8 max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 font-heading text-3xl font-extrabold leading-[1.1] tracking-tight text-primary md:text-5xl"
        >
          {t('skills.title')}
          <br />
          {t('skills.production')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground"
        >
          {t('skills.subtitle')}
        </motion.p>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-4">
            <span className="block font-heading text-3xl font-bold text-teal-500">{skills.length}</span>
            <span className="text-sm font-medium text-slate-400">{t('skills.coreTech')}</span>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-4">
            <span className="block font-heading text-3xl font-bold text-teal-500">{t('stats.valYearsExp')}</span>
            <span className="text-sm font-medium text-slate-400">{t('skills.yearsExp')}</span>
          </div>
        </div>
      </header>

      <section className="mb-12">
        {loading ? (
          <SkeletonBlocks count={6} className="md:grid-cols-2 lg:grid-cols-3" />
        ) : Object.keys(groupedSkills).length === 0 ? (
          <EmptyState title={t('skills.noSkills')} className="py-20" />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-border/50 bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full ${getColorForCategory(category)}`}>
                  {getIconForCategory(category)}
                </div>
                <h3 className="mb-4 font-heading text-2xl font-bold capitalize">{category}</h3>
                <div className="mt-6 flex flex-col gap-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="w-full">
                      <div className="mb-1.5 flex items-center justify-between text-sm font-medium">
                        <span dir="ltr">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary rtl:origin-right" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
