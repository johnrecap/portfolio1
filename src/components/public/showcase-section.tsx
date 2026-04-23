import { motion } from 'motion/react';
import { FolderKanban, Languages, LayoutDashboard, Layers3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePublicCollection } from '@/hooks/public-firestore';
import { SkeletonBlocks } from '@/components/shared/PageState';
import { readComposerText } from '@/lib/admin/page-content';

type ShowcaseSectionProps = {
  variant?: 'grid' | 'spotlight';
  content?: Record<string, unknown>;
};

export const ShowcaseSection = ({ variant = 'grid', content = {} }: ShowcaseSectionProps) => {
  const { data: projects, loading: projectsLoading } = usePublicCollection<any>('projects');
  const { data: blogs, loading: blogsLoading } = usePublicCollection<any>('blogs');
  const { data: skills, loading: skillsLoading } = usePublicCollection<any>('skills');
  const { t, i18n } = useTranslation();

  const loading = projectsLoading || blogsLoading || skillsLoading;
  const isArabic = i18n.language === 'ar';
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
  const eyebrow = readComposerText(content, 'eyebrow', t('showcase.eyebrow'), isArabic);
  const title = readComposerText(content, 'title', t('showcase.title'), isArabic);
  const subtitle = readComposerText(content, 'subtitle', t('showcase.subtitle'), isArabic);

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className={`mb-10 ${variant === 'spotlight' ? 'max-w-4xl' : 'max-w-3xl'}`}>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        </div>

        {loading ? (
          <SkeletonBlocks count={4} className="md:grid-cols-2 xl:grid-cols-4" />
        ) : (
          <div className={`grid gap-5 md:grid-cols-2 ${variant === 'spotlight' ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}>
            {stats.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`rounded-[1.75rem] border border-border/60 bg-card/60 p-6 shadow-sm ${
                  variant === 'spotlight' && index === 0 ? 'md:col-span-2 xl:col-span-1' : ''
                }`}
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
