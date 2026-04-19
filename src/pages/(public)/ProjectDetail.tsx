import { motion } from 'motion/react';
import { 
  ChevronRight, 
  ExternalLink, 
  Code, 
  Cpu,
  Monitor
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/useFirestore';
import { useTranslation } from 'react-i18next';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: projects, loading } = useCollection<any>('projects');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const project = projects?.find((p: any) => p.slug === slug);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 max-w-7xl mx-auto w-full font-mono text-slate-500">
        $ Fetching project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-4xl font-heading font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg hover:text-primary">The requested project could not be located in the database.</p>
        <Link to="/projects">
           <Button>Return to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow pt-12 pb-24 relative max-w-[1200px] mx-auto w-full px-4 sm:px-6">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono mb-12 relative z-10 uppercase tracking-widest bg-[#0D1117] p-3 rounded-lg border border-slate-800 w-fit">
        <Link to="/" className="hover:text-primary transition-colors">~</Link>
        <span className="opacity-50">/</span>
        <Link to="/projects" className="hover:text-primary transition-colors">projects</Link>
        <span className="opacity-50">/</span>
        <span className="text-primary font-bold">{project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}</span>
      </div>

      {/* Hero Section */}
      <section className="mb-20 relative z-10 w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto text-center items-center">
          <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1,y:0}} className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-mono text-xs md:text-sm border border-primary/20 shadow-sm">
            {project.category}
          </motion.div>
          
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} className="text-4xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.1] text-foreground tracking-tight">
            {project.title}
          </motion.h1>
          
          <motion.p initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
            {project.description}
          </motion.p>
          
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center justify-center gap-4 pt-4 w-full sm:w-auto font-mono">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 rounded-md text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all gap-3 bg-primary hover:bg-primary-hover text-white">
                  Live Preview <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 rounded-md text-sm font-bold bg-[#21262D] hover:bg-[#30363D] border-slate-700 hover:border-slate-600 text-slate-200 transition-colors gap-3">
                  Source Code <Code className="w-4 h-4" />
                </Button>
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Visual / Details Split */}
      <section className="relative z-10 w-full mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        {/* Left Side: Mockup Preview */}
        <motion.div 
          initial={{opacity:0, scale: 0.95}} 
          animate={{opacity:1, scale: 1}} 
          transition={{delay: 0.3}}
          className="lg:col-span-8 w-full bg-[#0D1117] rounded-xl border border-slate-800 shadow-2xl p-2 sm:p-4"
        >
          {/* Browser Bar */}
          <div className="h-10 bg-[#161B22] rounded-t-lg border border-slate-800 flex items-center px-4 gap-2 mb-[-1px] relative z-10 shrink-0" dir="ltr">
             <div className="flex gap-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
             </div>
             <div className="flex-1 flex justify-center">
                 <div className="bg-[#0D1117] text-slate-400 text-[10px] sm:text-xs rounded border border-slate-700/50 px-4 py-1 flex items-center gap-2 max-w-sm w-full font-mono truncate">
                    <Monitor className="w-3 h-3 shrink-0" />
                    <span className="truncate">https://{project.slug || 'localhost:3000'}</span>
                 </div>
             </div>
             <div className="w-16"></div>
          </div>
          
          <div className="bg-[#0A0D12] overflow-hidden rounded-b-lg border border-slate-800 relative aspect-[16/10] sm:aspect-video w-full flex items-center justify-center">
            {project.image ? (
               <img 
                 src={project.image} 
                 alt={project.title} 
                 className="w-full h-full object-cover object-top"
                 referrerPolicy="no-referrer"
               />
            ) : (
               <div className="text-slate-600 font-mono flex flex-col items-center gap-4">
                 <Monitor className="w-16 h-16 opacity-50" />
                 no-preview-available.jpg
               </div>
            )}
          </div>
        </motion.div>

        {/* Right Side: Technical Specs */}
        <motion.div 
          initial={{opacity:0, x: 20}} 
          animate={{opacity:1, x: 0}} 
          transition={{delay: 0.4}}
          className="lg:col-span-4 w-full space-y-8" 
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="bg-[#0D1117] rounded-xl border border-slate-800 p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
               <Cpu className="text-primary w-6 h-6" />
               <h3 className="text-xl font-heading font-bold">Tech Stack</h3>
             </div>

             <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3" dir="ltr">Technologies</h4>
                  <div className="flex flex-wrap gap-2" dir="ltr">
                    {project.tags && project.tags.length > 0 ? project.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1.5 rounded-md bg-[#161B22] text-slate-300 font-mono text-xs border border-slate-700/50 shadow-sm">
                        {tag}
                      </span>
                    )) : (
                       <span className="text-slate-500 text-sm">Not specified</span>
                    )}
                  </div>
                </div>
                
                <div>
                   <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Status</h4>
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500/10 text-green-400 font-mono text-xs border border-green-500/20">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                     </span>
                     Deployed
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

      </section>
    </div>
  );
};
