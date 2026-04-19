import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Layers, Wrench, Cloud, Search, PenTool, Braces, Blocks, Rocket } from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';
import { useTranslation } from 'react-i18next';

export const Skills = () => {
  const { data: skills, loading } = useCollection('skills');
  const { t } = useTranslation();

  // Group skills by category
  const groupedSkills = skills.reduce((acc: any, skill: any) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'languages': return <Code className="text-primary w-6 h-6" />;
      case 'frameworks': return <Blocks className="text-teal-500 w-6 h-6" />;
      case 'infrastructure': return <Cloud className="text-blue-500 w-6 h-6" />;
      case 'tools': return <Wrench className="text-purple-500 w-6 h-6" />;
      default: return <Layers className="text-primary w-6 h-6" />;
    }
  };

  const getColorForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'languages': return 'bg-primary/10';
      case 'frameworks': return 'bg-teal-500/10';
      case 'infrastructure': return 'bg-blue-500/10';
      case 'tools': return 'bg-purple-500/10';
      default: return 'bg-primary/10';
    }
  };

  return (
    <div className="flex flex-col gap-16 relative overflow-hidden pb-12 md:pb-20">
      {/* Header Section */}
      <header className="mb-8 max-w-3xl">
        <motion.h2 initial={{opacity:0, y:20}} whileInView={{opacity:1,y:0}} viewport={{once: true}} className="text-3xl md:text-5xl font-heading font-extrabold text-primary mb-6 leading-[1.1] tracking-tight">
          {t('skills.title')}<br />{t('skills.production')}
        </motion.h2>
        <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1,y:0}} viewport={{once: true}} transition={{delay:0.1}} className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
          {t('skills.subtitle')}
        </motion.p>
        <div className="flex gap-4 md:gap-6 items-center">
          <div className="bg-slate-900/50 px-6 py-4 rounded-2xl border border-slate-800">
            <span className="block text-3xl font-heading font-bold text-teal-500">{skills.length}</span>
            <span className="text-sm font-medium text-slate-400">{t('skills.coreTech')}</span>
          </div>
          <div className="bg-slate-900/50 px-6 py-4 rounded-2xl border border-slate-800">
            <span className="block text-3xl font-heading font-bold text-teal-500">{t('stats.valYearsExp', { defaultValue: '10+' })}</span>
            <span className="text-sm font-medium text-slate-400">{t('skills.yearsExp')}</span>
          </div>
        </div>
      </header>

      {/* Category Grid */}
      <section className="mb-12">
        {loading ? (
             <div className="text-center text-muted-foreground py-20">{t('skills.loading')}</div>
        ) : Object.keys(groupedSkills).length === 0 ? (
             <div className="text-center text-muted-foreground py-20">{t('skills.noSkills')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(groupedSkills).map((category, i) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50"
              >
                <div className={`w-12 h-12 ${getColorForCategory(category)} rounded-full flex items-center justify-center mb-6`}>
                  {getIconForCategory(category)}
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 capitalize">{category}</h3>
                <div className="flex flex-col gap-4 mt-6">
                  {groupedSkills[category].map((skill: any) => (
                    <div key={skill.id} className="w-full">
                      <div className="flex justify-between items-center mb-1.5 text-sm font-medium">
                        <span dir="ltr">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rtl:origin-right" style={{ width: `${skill.proficiency}%` }}></div>
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
