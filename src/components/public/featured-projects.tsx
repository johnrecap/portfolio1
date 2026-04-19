import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Github, ExternalLink, Image as ImageIcon, Terminal, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCollection } from '@/hooks/useFirestore';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/components/ui/button';

export const FeaturedProjectsGrid = () => {
  const { data: projects, loading } = useCollection<any>('projects');
  const featured = projects.slice(0, 4); // Take up to 4 projects for the showcase
  const { t, i18n } = useTranslation();
  
  const [activeIndex, setActiveIndex] = useState(0);

  const isRTL = i18n.language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (loading) {
    return (
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
         <p className="text-muted-foreground text-center py-12">{t('featuredProjects.loading')}</p>
      </section>
    );
  }

  if (featured.length === 0) return null;

  const activeProject = featured[activeIndex];

  return (
    <section className="py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mx-auto max-w-2xl mb-16">
        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once: true}}>
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
            {t('featuredProjects.title')}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('featuredProjects.subtitle')}
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{opacity:0, y:30}} 
        whileInView={{opacity:1, y:0}} 
        viewport={{once: true}}
        className="w-full max-w-6xl mx-auto flex flex-col gap-6"
      >
        {/* Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2" dir="ltr">
          {featured.map((p: any, idx: number) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-4 py-2 rounded-md font-mono text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 border ${
                activeIndex === idx 
                  ? 'bg-primary/10 border-primary/30 text-primary shadow-sm' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="opacity-50">$ open</span> {p.slug || p.title.toLowerCase().replace(/\s+/g, '-')}
            </button>
          ))}
        </div>

        {/* The Window Frame */}
        <div className="bg-[#0D1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative shadow-primary/5 flex flex-col">
          
          {/* Top Window Bar */}
          <div className="px-4 py-3 bg-[#161B22] border-b border-slate-800 flex items-center justify-between" dir="ltr">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span>featured-project.ts</span>
            </div>
            <div className="w-16"></div> {/* Spacer to center title */}
          </div>

          {/* Split Layout */}
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* Column 1: Terminal / Properties (40%) */}
            <div className="w-full lg:w-[40%] bg-[#0D1117] p-6 lg:border-r border-slate-800 flex flex-col font-mono" dir="ltr">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="mb-6 flex items-center gap-2 text-primary text-sm font-semibold">
                    <Code2 className="w-4 h-4" />
                    {t('featuredProjects.projectObject')}
                  </div>
                  
                  <div className="space-y-4 text-sm flex-1">
                    <div className="text-slate-300 leading-relaxed">
                      <span className="text-[#c678dd]">const</span> <span className="text-[#e5c07b]">project</span> <span className="text-[#cfcbaf]">=</span> <span className="text-[#cfcbaf]">{`{`}</span>
                      
                      <div className="pl-4 mt-2 space-y-2">
                        <div>
                          <span className="text-[#e06c75]">{t('featuredProjects.name')}:</span> <span className="text-[#98c379]">"{activeProject.title}"</span><span className="text-[#cfcbaf]">,</span>
                        </div>
                        <div>
                          <span className="text-[#e06c75]">{t('featuredProjects.type')}:</span> <span className="text-[#98c379]">"{activeProject.category || 'Web App'}"</span><span className="text-[#cfcbaf]">,</span>
                        </div>
                        <div>
                          <span className="text-[#e06c75]">{t('featuredProjects.status')}:</span> <span className="text-[#98c379]">"Live"</span><span className="text-[#cfcbaf]">,</span>
                        </div>
                        
                        {activeProject.tags && activeProject.tags.length > 0 && (
                          <div className="py-1">
                            <span className="text-[#e06c75]">{t('featuredProjects.stack')}:</span> <span className="text-[#cfcbaf]">[</span>
                            <div className="pl-4 flex flex-wrap gap-1">
                              {activeProject.tags.map((tag: string, i: number) => (
                                <span key={tag} className="text-[#98c379]">
                                  "{tag}"{i < activeProject.tags.length - 1 ? <span className="text-[#cfcbaf]">,</span> : ''}
                                </span>
                              ))}
                            </div>
                            <span className="text-[#cfcbaf]">],</span>
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <span className="text-[#e06c75]">{t('featuredProjects.summary')}:</span> <span className="text-[#98c379] break-words whitespace-pre-wrap">"{activeProject.description}"</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-[#cfcbaf]">{`}`}</div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-8 flex flex-col sm:flex-row gap-3 mt-auto">
                    {activeProject.demoUrl && (
                      <a 
                        href={activeProject.demoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-2.5 px-4 rounded-md transition-colors text-sm font-sans font-medium"
                      >
                       <ExternalLink className="w-4 h-4" /> {t('featuredProjects.liveDemo')}
                      </a>
                    )}
                    {activeProject.githubUrl && (
                      <a 
                         href={activeProject.githubUrl} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex-1 flex items-center justify-center gap-2 bg-[#21262D] hover:bg-[#30363D] border border-slate-700 text-slate-200 py-2.5 px-4 rounded-md transition-colors text-sm font-sans font-medium"
                      >
                        <Github className="w-4 h-4" /> {t('featuredProjects.github')}
                      </a>
                    )}
                    <Link 
                      to={`/projects/${activeProject.slug}`} 
                      className={`flex-1 flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 py-2.5 px-4 rounded-md transition-colors text-sm font-sans font-medium ${!activeProject.demoUrl && !activeProject.githubUrl ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-transparent' : 'text-slate-300'}`}
                    >
                      {t('featuredProjects.details')}
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Column 2: Visual Preview (60%) */}
            <div className="w-full lg:w-[60%] bg-[#0A0D12] relative overflow-hidden flex items-center justify-center p-6 lg:p-12 min-h-[400px]">
              {/* Soft glow behind image */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-[70%] h-[70%] bg-primary/20 blur-[100px] rounded-full" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full relative z-10"
                >
                  {/* Browser Mockup Wrap */}
                  <div className="w-full bg-[#1A1F26] rounded-t-xl rounded-b-xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col group">
                    <div className="h-8 bg-[#161B22] border-b border-slate-700/50 flex items-center px-3 gap-2 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                      <div className="mx-auto flex-1 flex justify-center">
                        <div className="bg-[#0D1117] text-slate-400 text-[10px] sm:text-xs rounded-full px-4 py-0.5 max-w-[200px] truncate border border-slate-800">
                          {activeProject.slug}.com
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative w-full aspect-video bg-[#0D1117] flex items-center justify-center overflow-hidden">
                      {activeProject.image ? (
                        <div className="w-full h-full transform transition-transform duration-1000 ease-out group-hover:scale-105">
                           <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                           <img 
                             src={activeProject.image} 
                             alt={activeProject.title}
                             className="w-full h-full object-cover object-top"
                           />
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-700 p-8 border border-slate-800/50 border-dashed m-4 rounded-xl">
                          <ImageIcon className="w-12 h-12 opacity-50" />
                          <span className="text-sm font-mono opacity-50">no-preview.png</span>
                        </div>
                      )}
                      
                      {/* Floating Badge */}
                      <div className="absolute top-4 right-4 z-20 backdrop-blur-md bg-black/40 border border-white/10 px-3 py-1.5 rounded-md flex items-center gap-2 shadow-xl">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-mono text-slate-200 uppercase tracking-wider font-semibold">{t('featuredProjects.featured')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Link to="/projects" className={buttonVariants({ variant: "ghost", className: "gap-2 hover:bg-slate-900 font-mono text-sm" })}>
            {t('featuredProjects.viewAll')} <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
