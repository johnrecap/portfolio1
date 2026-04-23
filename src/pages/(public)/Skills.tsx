import { motion } from 'motion/react';
import { Blocks, Cloud, Code, Layers, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmptyState, SkeletonBlocks } from '@/components/shared/PageState';
import { PageSeo } from '@/components/shared/PageSeo';
import { usePublicCollection, usePublicMediaLibrary } from '@/hooks/public-firestore';
import {
  getLocalizedValue,
  groupSkillsByCategory,
  resolveMediaField,
  type SkillRecord,
} from '@/lib/content-hub';


export const Skills = () => {
  const { data: skills, loading } = usePublicCollection<SkillRecord>('skills');
  const { assets } = usePublicMediaLibrary();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const groupedSkills = groupSkillsByCategory(skills).map((group) => ({
    ...group,
    label: group.label?.trim() || t('skills.otherCategory'),
  }));

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
            {groupedSkills.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-border/50 bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full ${getColorForCategory(group.id)}`}>
                  {getIconForCategory(group.id)}
                </div>
                <h3 className="mb-4 font-heading text-2xl font-bold capitalize">{group.label}</h3>
                <div className="mt-6 flex flex-col gap-4">
                  {group.items.map((skill) => {
                    const icon = resolveMediaField({ url: skill.icon, assetId: skill.iconAssetId }, assets);
                    const name = getLocalizedValue(skill.name, skill.nameAr, isArabic) || skill.name;
                    const description = getLocalizedValue(skill.description, skill.descriptionAr, isArabic);

                    return (
                      <div key={skill.id} className="w-full">
                        <div className="mb-1.5 flex items-center justify-between gap-3 text-sm font-medium">
                          <span className="flex min-w-0 items-center gap-2">
                            {icon.url ? (
                              <img src={icon.url} alt={name} className="h-5 w-5 rounded object-cover" />
                            ) : null}
                            <span dir="ltr" className="truncate">
                              {name}
                            </span>
                          </span>
                          <span className="text-muted-foreground">{skill.proficiency}%</span>
                        </div>
                        {description ? (
                          <p className="mb-2 text-xs leading-6 text-muted-foreground">{description}</p>
                        ) : null}
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-primary rtl:origin-right" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
