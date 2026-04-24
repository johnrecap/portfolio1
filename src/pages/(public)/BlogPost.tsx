import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock, Copy, Github, Link as LinkIcon, Linkedin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { EmptyState, SkeletonBlocks } from '@/components/shared/PageState';
import { PageSeo } from '@/components/shared/PageSeo';
import { usePublicMediaLibrary } from '@/hooks/public-firestore';
import { useProfile } from '@/hooks/useProfile';
import { sortByCreatedAtDesc } from '@/hooks/useFirestore';
import { db } from '@/lib/firebase';
import { getLocalizedValue, resolveEntitySeo, resolveMediaField } from '@/lib/content-hub';

type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  excerpt?: string;
  excerptAr?: string;
  content?: string;
  contentAr?: string;
  category?: string;
  image?: string;
  imageAssetId?: string;
  coverImage?: string;
  coverImageAssetId?: string;
  readTime?: string;
  featured?: boolean;
  seo?: {
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    image?: string;
    imageAssetId?: string;
  };
  createdAt?: { seconds?: number };
};

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostRecord | null>(null);
  const [related, setRelated] = useState<BlogPostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const { assets } = usePublicMediaLibrary();
  const { profile } = useProfile();
  const { i18n, t } = useTranslation();

  const displayName = i18n.language === 'ar' ? profile.displayNameAr || profile.displayName : profile.displayName;
  const title = i18n.language === 'ar' ? profile.titleAr || profile.title : profile.title;
  const bio = i18n.language === 'ar' ? profile.bioAr || profile.bio : profile.bio;

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? totalScroll / windowHeight : 0;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      try {
        const postQuery = query(collection(db, 'blogs'), where('slug', '==', slug));
        const querySnapshot = await getDocs(postQuery);

        if (querySnapshot.empty) {
          setPost(null);
          setRelated([]);
          return;
        }

        const record = { id: querySnapshot.docs[0].id, ...(querySnapshot.docs[0].data() as Omit<BlogPostRecord, 'id'>) };
        setPost(record);

        if (!record.category) {
          setRelated([]);
          return;
        }

        const relatedQuery = query(collection(db, 'blogs'), where('category', '==', record.category));
        const relatedSnapshot = await getDocs(relatedQuery);

        const relatedArticles = sortByCreatedAtDesc(
          relatedSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<BlogPostRecord, 'id'>) })),
        )
          .filter((article) => article.id !== record.id)
          .slice(0, 3);

        setRelated(relatedArticles);
      } catch (error) {
        console.error('Error fetching post:', error);
        setPost(null);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      void fetchPost();
    }
  }, [slug]);

  const formatDate = (seconds?: number) => {
    if (!seconds) {
      return t('blogPost.recently');
    }

    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(seconds * 1000));
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success(t('blogPost.shareLinkCopied'));
  };

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-8 py-12">
        <SkeletonBlocks count={1} />
        <SkeletonBlocks count={3} className="lg:grid-cols-[1fr_320px]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex w-full flex-col items-center gap-6 py-16">
        <EmptyState title={t('blogPost.notFound')} description={t('blogPost.return')} className="w-full max-w-3xl" />
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          {t('blogPost.allArticles')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  const localizedTitle = getLocalizedValue(post.title, post.titleAr, i18n.language === 'ar') || post.title;
  const localizedExcerpt = getLocalizedValue(post.excerpt, post.excerptAr, i18n.language === 'ar') || post.excerpt;
  const localizedContent = getLocalizedValue(post.content, post.contentAr, i18n.language === 'ar') || post.content;
  const seo = resolveEntitySeo(
    {
      title: post.title,
      titleAr: post.titleAr,
      description: post.excerpt || post.content?.slice(0, 160),
      descriptionAr: post.excerptAr || post.contentAr?.slice(0, 160),
      seo: post.seo,
    },
    assets,
    i18n.language === 'ar',
  );
  const heroImage = resolveMediaField(
    {
      url: post.coverImage || post.image,
      assetId: post.coverImageAssetId || post.imageAssetId,
    },
    assets,
  );

  return (
    <div className="relative flex w-full flex-col gap-12 pb-20 pt-12 lg:pt-20">
      <PageSeo title={seo.title || localizedTitle} description={seo.description || localizedExcerpt || t('blog.subtitle')} image={seo.image || heroImage.url} />

      <div className="fixed top-0 left-0 z-[60] h-1 w-full shrink-0 bg-transparent">
        <div className="h-full bg-primary" style={{ width: `${readingProgress * 100}%` }} />
      </div>

      <header className="mx-auto mb-8 flex w-full max-w-4xl flex-col items-center px-6 text-center">
        <span className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-widest text-primary">
          {post.category || t('blogPost.article')}
        </span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
        >
          {localizedTitle}
        </motion.h1>
        <div className="flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {post.readTime || t('blogPost.readTime')}
          </div>
          <div className="h-1 w-1 rounded-full bg-border" />
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(post.createdAt?.seconds)}
          </div>
        </div>
      </header>

      <div className="mx-auto mb-8 flex w-full max-w-4xl items-center justify-between border-y border-border px-6 py-8">
        <div className="flex items-center gap-4">
          <img
            src={profile.profileImage || undefined}
            alt={displayName}
            className="h-12 w-12 rounded-full object-cover grayscale"
          />
          <div>
            <p className="font-heading font-bold text-foreground">{displayName}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleCopyLink()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
          aria-label={t('blogPost.share')}
        >
          <Copy className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {heroImage.url ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mb-16 w-full max-w-7xl px-6"
        >
          <div className="relative h-[400px] overflow-hidden rounded-[2rem] border border-border bg-muted shadow-2xl md:h-[520px]">
            <img
              src={heroImage.url}
              alt={localizedTitle}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-6 rtl:right-6 ltr:left-6">
              <span className="rounded-full bg-primary/90 px-5 py-2 text-sm font-bold tracking-wide text-primary-foreground shadow-lg backdrop-blur-md">
                {post.featured ? t('blogPost.featured') : t('blogPost.article')}
              </span>
            </div>
          </div>
        </motion.div>
      ) : null}

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:gap-16">
        <article className="prose prose-slate max-w-none flex-1 md:prose-lg prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl dark:prose-invert">
          <p className="!mt-0 mb-12 text-xl font-medium leading-relaxed text-muted-foreground md:text-2xl">
            {localizedExcerpt}
          </p>
          {localizedContent ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{localizedContent}</ReactMarkdown> : null}
        </article>

        <aside className="w-full shrink-0 lg:w-72">
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative z-10">
                <h2 className="mb-3 font-heading text-lg font-bold text-foreground">{t('blogPost.connectTitle')}</h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{t('blogPost.connectDescription')}</p>
                <Link
                  to="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-[0.98]"
                >
                  {t('blogPost.connectCta')}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mx-auto mt-20 mb-10 w-full max-w-4xl px-6">
        <div className="flex flex-col items-center gap-10 rounded-[2rem] border border-border bg-muted/30 p-10 text-center md:flex-row md:items-start md:text-left">
          <img
            src={profile.profileImage || undefined}
            alt={displayName}
            className="h-32 w-32 shrink-0 rounded-full border-4 border-background object-cover grayscale shadow-xl"
          />
          <div>
            <h3 className="mb-2 font-heading text-2xl font-bold text-foreground">
              {t('blogPost.writtenBy', { name: displayName })}
            </h3>
            <p className="mb-6 whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">{bio}</p>
            <div className="flex justify-center gap-6 md:justify-start">
              {profile.websiteUrl ? (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-bold text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {t('blogPost.website')}
                </a>
              ) : null}
              {profile.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-bold text-primary hover:underline"
                >
                  <Linkedin className="h-4 w-4" />
                  {t('blogPost.linkedin')}
                </a>
              ) : null}
              {profile.githubUrl ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-bold text-primary hover:underline"
                >
                  <Github className="h-4 w-4" />
                  {t('blogPost.github')}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mx-auto mt-16 w-full max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              {t('blogPost.relatedTitle')}
            </h2>
            <Link to="/blog" className="group hidden items-center gap-2 font-bold text-primary md:flex">
              {t('blogPost.allArticles')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((article) => {
              const relatedTitle = getLocalizedValue(article.title, article.titleAr, i18n.language === 'ar') || article.title;
              const relatedImage = resolveMediaField(
                {
                  url: article.coverImage || article.image,
                  assetId: article.coverImageAssetId || article.imageAssetId,
                },
                assets,
              );

              return (
                <Link key={article.id} to={`/blog/${article.slug}`} className="group relative flex h-full flex-col outline-none">
                  <div className="mb-6 aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
                    {relatedImage.url ? (
                      <img
                        src={relatedImage.url}
                        alt={relatedTitle}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted/50">
                        <span className="text-muted-foreground">{t('blogPost.noImage')}</span>
                      </div>
                    )}
                  </div>
                  <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-teal-500">
                    {article.category || t('blogPost.article')}
                  </span>
                  <h3 className="font-heading text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
                    {relatedTitle}
                  </h3>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
};
