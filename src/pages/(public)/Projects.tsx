import { useState } from "react";
import { motion } from "motion/react";
import { Search, Terminal, ArrowRight, Image as ImageIcon, Github, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useCollection } from "@/hooks/useFirestore";
import { useTranslation } from "react-i18next";

export const Projects = () => {
  const { data: projects, loading } = useCollection<any>("projects");
  const [search, setSearch] = useState("");
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === 'ar';

  const filteredProjects = projects.filter(
    (p: any) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col relative w-full pt-12 pb-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-4 tracking-tight flex items-center gap-4"
          >
            <span className="text-primary font-mono text-3xl md:text-5xl opacity-40 select-none">~/</span>
            {t("projects.title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg lg:text-xl font-mono"
            dir="ltr"
          >
             <span className={`${isRTL ? 'text-right block w-full rtl' : ''}`}>{t("projects.subtitle")}</span>
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-[350px] shrink-0 font-mono"
          dir="ltr"
        >
          <div className="bg-[#0D1117] border border-slate-800 rounded-lg flex items-center px-4 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
            <Search className="text-slate-500 w-4 h-4 mr-3 shrink-0" />
            <Input
              placeholder={`$ grep -i "projects"...`}
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-slate-300 placeholder:text-slate-600 w-full h-8 px-0 text-sm font-mono"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              spellCheck="false"
            />
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center font-mono text-slate-500 animate-pulse text-sm">
            $ executing query...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full py-20 text-center font-mono text-slate-500 text-sm">
            $ echo "No matching projects found."
          </div>
        ) : (
          filteredProjects.map((project: any, i: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col bg-[#0D1117] border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Window Header */}
              <div className="px-4 py-3 bg-[#161B22] border-b border-slate-800 flex items-center justify-between shrink-0" dir="ltr">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-[#ff5f56] transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-[#ffbd2e] transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-[#27c93f] transition-colors"></div>
                </div>
                <div className="text-slate-500 text-[10px] sm:text-xs font-mono flex items-center gap-2 truncate px-2 border border-slate-800/50 bg-[#0D1117] rounded-full py-0.5">
                   <Terminal className="w-3 h-3" />
                   <span className="truncate">{project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}.ts</span>
                </div>
                <div className="w-12"></div> {/* spacer */}
              </div>

              {/* Image Preview */}
              <Link to={`/projects/${project.slug}`} className="relative w-full aspect-video bg-[#0A0D12] overflow-hidden block shrink-0 border-b border-slate-800">
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors z-10 duration-500" />
                {project.image ? (
                   <img
                     src={project.image}
                     alt={project.title}
                     className="w-full h-full object-cover object-top transform transition-transform duration-700 ease-out group-hover:scale-105"
                     referrerPolicy="no-referrer"
                   />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-700" />
                  </div>
                )}
                
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur border border-white/10 rounded font-mono text-[10px] text-primary uppercase font-bold tracking-wider shadow-lg">
                    {project.category}
                  </span>
                </div>
              </Link>

              {/* Content Box */}
              <div className="p-6 flex flex-col flex-1">
                <Link to={`/projects/${project.slug}`} className="block mb-3">
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-100 group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                    {project.title}
                  </h3>
                </Link>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="mt-auto">
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6" dir="ltr">
                      {project.tags.slice(0, 4).map((tag: string) => (
                        <span key={tag} className="text-[10px] sm:text-xs font-mono text-slate-300 bg-slate-800/80 border border-slate-700/50 px-2.5 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-[10px] sm:text-xs font-mono text-slate-500 px-1 py-0.5 mt-0.5">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-5 border-t border-slate-800/50">
                    <Link 
                      to={`/projects/${project.slug}`} 
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-colors text-xs font-semibold font-sans border border-slate-700 hover:border-slate-500 text-slate-200 ${!project.demoUrl ? 'bg-primary hover:bg-primary-hover border-transparent hover:border-transparent text-primary-foreground' : 'hover:bg-slate-800'}`}
                    >
                      {i18n.language === 'ar' ? 'التفاصيل' : 'Details'} <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                    
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-colors text-xs font-semibold font-sans bg-primary hover:bg-primary-hover text-white shadow-sm"
                        title="Live Demo"
                      >
                         <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline-block">{i18n.language === 'ar' ? 'معاينة المشروع' : 'Live Demo'}</span>
                      </a>
                    )}
                    
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center py-2.5 px-4 rounded-md transition-colors text-xs font-semibold font-sans bg-[#21262D] border border-slate-700 hover:bg-[#30363D] hover:border-slate-600 text-slate-200 shadow-sm"
                        title="Source Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
