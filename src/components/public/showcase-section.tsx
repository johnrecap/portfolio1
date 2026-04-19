import { motion } from 'motion/react';
import { FolderKanban, Languages, LayoutDashboard, Layers3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCollection } from '@/hooks/useFirestore';
import { SkeletonBlocks } from '@/components/shared/PageState';

export const ShowcaseSection = () => {
  const { data: projects, loading: projectsLoading } = useCollection<any>('projects');
  const { data: blogs, loading: blogsLoading } = useCollection<any>('blogs');
  const { data: skills, loading: skillsLoading } = useCollection<any>('skills');
  const { t } = useTranslation();

  const loading = projectsLoading || blogsLoading || skillsLoading;
  const stats = [
    {
      icon: FolderKanban,
      title: t('showcase.publicTitle'),
      description: t('showcase.publicDescription'),
      value: `${projects.length}`,
    },
    {
      icon: LayoutDashboard,
      title: t('showcase.adminTitle'),
      description: t('showcase.adminDescription'),
      value: '5',
    },
    {
      icon: Layers3,
      title: t('showcase.crudTitle'),
      description: t('showcase.crudDescription'),
      value: `${projects.length + blogs.length + skills.length}`,
    },
    {
      icon: Languages,
      title: t('showcase.i18nTitle'),
      description: t('showcase.i18nDescription'),
      value: '2',
    },
  ];

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {t('showcase.eyebrow')}
          </p>
          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground md:text-5xl">
            {t('showcase.title')}
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            {t('showcase.subtitle')}
          </p>
        </div>

        {loading ? (
          <SkeletonBlocks count={4} className="md:grid-cols-2 xl:grid-cols-4" />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[1.75rem] border border-border/60 bg-card/60 p-6 shadow-sm"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t('showcase.metricLabel')}
                </p>
                <p className="mt-3 font-heading text-4xl font-black text-foreground">{item.value}</p>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
