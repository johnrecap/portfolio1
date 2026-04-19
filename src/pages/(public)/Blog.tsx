import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, FileText, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCollection } from '@/hooks/useFirestore';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from 'react-i18next';

export const Blog = () => {
  const { data: articles, loading } = useCollection('blogs');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const { profile } = useProfile();
  const { t } = useTranslation();

  const categories = ['All', ...Array.from(new Set(articles.map((a: any) => a.category)))];

  const filteredArticles = articles.filter((a: any) => 
    activeCategory === 'All' ? true : a.category === activeCategory
  );

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-16 relative overflow-hidden py-8">
      {/* Decorative Blob */}
      <div className="absolute top-[10%] rtl:right-[-10%] ltr:left-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] opacity-50 pointer-events-none -z-10"></div>
      
      {/* Header section */}
      <header className="flex flex-col gap-8 pb-8 border-b border-border relative z-10 max-w-4xl">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-label text-sm uppercase tracking-wider text-primary">{t('blog.writingAndThoughts')}</span>
        </motion.div>
        
        <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-[1.1]">
          {t('blog.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">{t('blog.engineering')}</span> {t('blog.andDesign')}
        </motion.h1>
        
        <motion.p initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="text-xl text-muted-foreground leading-relaxed">
          {t('blog.subtitle')}
        </motion.p>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
        
        {/* Left Sidebar - Categories & Search */}
        <aside className="lg:col-span-1 flex flex-col gap-8 order-2 lg:order-1">
          <div className="sticky top-24 flex flex-col gap-8">
            {/* Search */}
            <div>
              <h3 className="font-heading font-bold text-lg mb-4">{t('blog.searchLabel')}</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder={t('blog.search')} className="rtl:pr-10 ltr:pl-10 bg-surface/50 border-border" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-heading font-bold text-lg mb-4">{t('blog.categories')}</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat, i) => (
                  <button 
                    key={i}
                    onClick={() => { setActiveCategory(cat as string); setVisibleCount(6); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${activeCategory === cat ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-surface border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  >
                    <span>{cat === 'All' ? t('blog.allCategories', { defaultValue: 'All Categories' }) : cat as string}</span>
                    {activeCategory === cat && <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content - Articles Grid */}
        <div className="lg:col-span-3 flex flex-col gap-10 order-1 lg:order-2">
          {loading ? (
             <div className="text-center text-muted-foreground py-20">{t('blog.loading')}</div>
          ) : visibleArticles.length === 0 ? (
             <div className="text-center text-muted-foreground py-20">{t('blog.noArticles')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {visibleArticles.map((article: any, i: number) => (
                  <motion.div
                    layout
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link to={`/blog/${article.slug}`} className="group h-full flex">
                      <article className="bg-card rounded-[2rem] p-8 md:p-10 flex flex-col items-start gap-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-500 w-full relative overflow-hidden isolate">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium w-full">
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> 
                             {article.createdAt ? new Date(article.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                          </span>
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {t('blog.readTime')}</span>
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-4">
                          <h2 className="text-2xl font-heading font-extrabold text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug">
                            {article.title}
                          </h2>
                          <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                            {article.excerpt}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between w-full mt-auto pt-6 border-t border-border/50">
                          <div className="flex items-center gap-3">
                            <img src={profile.profileImage || undefined} alt={profile.displayName} className="w-8 h-8 rounded-full border border-border/50 object-cover" />
                            <span className="text-sm font-semibold text-foreground">{profile.displayName}</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <ArrowRight className="w-5 h-5 rtl:rotate-[135deg] ltr:-rotate-45 rtl:group-hover:rotate-180 ltr:group-hover:rotate-0 transition-transform duration-300" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {visibleCount < filteredArticles.length && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full border-border/50 bg-surface hover:bg-muted"
                onClick={() => setVisibleCount(prev => prev + 6)}
              >
                {t('blog.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
