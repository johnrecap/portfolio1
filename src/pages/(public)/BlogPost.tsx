import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Clock, Calendar, Share, Bookmark, ThumbsUp, MessageCircle, Link as LinkIcon, ArrowRight, Twitter, Linkedin, Github } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from 'react-i18next';

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const { profile } = useProfile();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setReadingProgress(Number(scroll));
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'blogs'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docData = { id: querySnapshot.docs[0].id, ...(querySnapshot.docs[0].data() as any) };
          setPost(docData);
          
          // Fetch related
          const relQ = query(
            collection(db, 'blogs'), 
            where('category', '==', docData.category),
            orderBy('createdAt', 'desc'),
            limit(4)
          );
          const relSnap = await getDocs(relQ);
          const fetchedRelated = relSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(d => d.id !== docData.id)
            .slice(0, 3);
          setRelated(fetchedRelated);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">{t('blogPost.loading')}</div>;
  }

  if (!post) {
    return <div className="min-h-[50vh] flex flex-col gap-4 items-center justify-center text-muted-foreground text-center">
      <h1 className="text-3xl font-heading font-bold text-foreground">{t('blogPost.notFound')}</h1>
      <Link to="/blog" className="text-primary hover:underline">{t('blogPost.return')}</Link>
    </div>;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - {profile?.displayName || 'Blog'}</title>
        <meta name="description" content={post.excerpt || post.content?.slice(0, 150) || 'Blog Post'} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.content?.slice(0, 150) || 'Blog Post'} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
      </Helmet>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[60] shrink-0">
        <div className="h-full bg-primary" style={{ width: `${readingProgress * 100}%` }}></div>
      </div>

      <div className="flex flex-col gap-12 pt-12 lg:pt-20 pb-20 relative">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto text-center px-6 mb-8 w-full">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-heading text-xs font-bold uppercase tracking-widest mb-6">
            {post.category || 'Article'}
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]"
          >
            {post.title}
          </motion.h1>
          <div className="flex items-center justify-center gap-6 text-muted-foreground font-medium text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t('blogPost.readTime')}
            </div>
            <div className="w-1 h-1 bg-border rounded-full"></div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : t('blogPost.recently')}
            </div>
          </div>
        </header>

        {/* Author Block */}
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-8 border-y border-border mb-8 w-full">
          <div className="flex items-center gap-4">
            <img 
              src={profile.profileImage || undefined}
              alt={profile.displayName} 
              className="w-12 h-12 rounded-full object-cover grayscale"
            />
            <div>
              <p className="font-heading font-bold text-foreground">{profile.displayName}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{profile.title}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Share className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Bookmark className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Hero Image */}
        {post.image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-7xl mx-auto px-6 mb-16 w-full"
          >
            <div className="relative rounded-[2rem] overflow-hidden h-[400px] md:h-[520px] shadow-2xl bg-muted border border-border">
              <img 
                src={post.image || undefined} 
                alt={post.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-6 left-6 rtl:right-6 rtl:left-auto">
                <span className="bg-primary/90 backdrop-blur-md text-primary-foreground px-5 py-2 rounded-full font-bold text-sm tracking-wide shadow-lg">
                  {t('blogPost.featured')}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3-Column Layout */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 relative w-full">
          {/* Left: Sticky Share Rail */}
          <aside className="hidden lg:block w-16 shrink-0">
            <div className="sticky top-32 flex flex-col gap-6">
              <button className="group flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border shadow-sm hover:scale-105 transition-all text-muted-foreground hover:text-primary">
                  <ThumbsUp className="w-5 h-5" />
                </div>
              </button>
              <button className="group flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border shadow-sm hover:scale-105 transition-all text-muted-foreground hover:text-primary">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </button>
              <div className="w-full h-px bg-border/50 my-2"></div>
              <button className="group flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border shadow-sm hover:scale-105 transition-all text-muted-foreground hover:text-primary">
                  <LinkIcon className="w-5 h-5" />
                </div>
              </button>
            </div>
          </aside>

          {/* Middle: Content */}
          <article className="flex-1 max-w-[760px] mx-auto lg:mx-0 w-full prose prose-slate dark:prose-invert md:prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-medium !mt-0">
              {post.excerpt}
            </p>
            {post.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            ) : null}
          </article>

          {/* Right: Connect CTA */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>
                <div className="relative z-10">
                  <h5 className="font-heading font-bold mb-3 text-lg text-foreground">Scale your idea</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">Need a custom architecture built for speed and precision?</p>
                  <Link to="/contact" className="w-full bg-primary text-primary-foreground py-3 rounded-full font-bold text-sm hover:scale-95 transition-transform flex items-center justify-center gap-2 shadow-md">
                    Work with me
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Author Bio */}
        <section className="max-w-4xl mx-auto px-6 mt-20 mb-10 w-full">
          <div className="bg-muted/30 p-10 rounded-[2rem] flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left border border-border">
            <img 
              src={profile.profileImage || undefined}
              alt={profile.displayName} 
              className="w-32 h-32 rounded-full object-cover grayscale border-4 border-background shadow-xl shrink-0" 
            />
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Written by {profile.displayName}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg whitespace-pre-wrap">
                {profile.bio}
              </p>
              <div className="flex justify-center md:justify-start gap-6">
                {profile.websiteUrl && <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline flex items-center gap-2"><LinkIcon className="w-4 h-4"/> Website</a>}
                {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline flex items-center gap-2"><Linkedin className="w-4 h-4"/> LinkedIn</a>}
                {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline flex items-center gap-2"><Github className="w-4 h-4"/> GitHub</a>}
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mt-16 w-full">
            <div className="flex items-end justify-between mb-12">
              <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">{t('blogPost.relatedTitle')}</h2>
              <Link to="/blog" className="text-primary font-bold flex items-center gap-2 group hidden md:flex">
                {t('blogPost.allArticles')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((article) => (
                <Link key={article.id} to={`/blog/${article.slug}`} className="group relative outline-none flex flex-col h-full">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-muted border border-border">
                    {article.image ? (
                      <img src={article.image || undefined} alt={article.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-muted/50 flex justify-center items-center">
                         <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-teal-500 tracking-widest uppercase mb-3 block">{article.category}</span>
                  <h4 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">{article.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  );
};
