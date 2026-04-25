import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Calendar, ChevronRight, Clock, FileText, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState, SkeletonBlocks, SkeletonMedia } from '@/components/shared/PageState';
import { PageSeo } from '@/components/shared/PageSeo';
import { usePublicCollection, usePublicMediaLibrary } from '@/hooks/public-firestore';
import { useProfile } from '@/hooks/useProfile';
import { usePageConfig } from '@/hooks/usePageConfig';
import { readComposerText } from '@/lib/admin/page-content';
import { ALL_BLOG_CATEGORY, buildBlogCategories, filterBlogsByCategory } from '@/lib/content-utils';
import { getLocalizedValue, resolveMediaField, type BlogRecord } from '@/lib/content-hub';

export const Blog = () => {
  const { data: articles, loading } = usePublicCollection<BlogRecord>('blogs');
  const { assets, loading: mediaLoading } = usePublicMediaLibrary();
  const { pageConfig } = usePageConfig('blog');
  const [activeCategory, setActiveCategory] = useState(ALL_BLOG_CATEGORY);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const { profile, loading: profileLoading } = useProfile();
  const { i18n, t } = useTranslation();

  const displayName = i18n.language === 'ar' ? profile.displayNameAr || profile.displayName : profile.displayName;
  const isArabic = i18n.language === 'ar';
  const heroSection = pageConfig.sections.find((section) => section.type === 'blogHero');
  const listingSection = pageConfig.sections.find((section) => section.type === 'blogListing');
  const seoTitle = isArabic
    ? pageConfig.seo.titleAr || pageConfig.titleAr || t('nav.blog')
    : pageConfig.seo.title || pageConfig.title || t('nav.blog');
  const seoDescription = isArabic
    ? pageConfig.seo.descriptionAr || t('blog.subtitle')
    : pageConfig.seo.description || t('blog.subtitle');
  const eyebrow = heroSection
    ? readComposerText(heroSection.content, 'eyebrow', t('blog.writingAndThoughts'), isArabic)
    : t('blog.writingAndThoughts');
  const title = heroSection
    ? readComposerText(
        heroSection.content,
        'title',
        `${t('blog.title')} ${t('blog.engineering')} ${t('blog.andDesign')}`,
        isArabic,
      )
    : `${t('blog.title')} ${t('blog.engineering')} ${t('blog.andDesign')}`;
  const subtitle = heroSection
    ? readComposerText(heroSection.content, 'subtitle', t('blog.subtitle'), isArabic)
    : t('blog.subtitle');
  const listingTitle = listingSection ? readComposerText(listingSection.content, 'title', '', isArabic) : '';
  const listingSubtitle = listingSection
    ? readComposerText(listingSection.content, 'subtitle', '', isArabic)
    : '';
  const categories = useMemo(() => buildBlogCategories(articles), [articles]);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    return filterBlogsByCategory(articles, activeCategory).filter((article) => {
      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        article.title,
        article.titleAr,
        article.excerpt,
        article.excerptAr,
        article.category,
        ...(article.tags ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activeCategory, articles, normalizedQuery]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  const formatDate = (seconds?: number) => {
    if (!seconds) {
      return t('blog.justNow');
    }

    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(seconds * 1000));
  };

  return (
    <div className="relative flex flex-col gap-16 overflow-hidden py-8">
      <PageSeo title={seoTitle} description={seoDescription} image={pageConfig.seo.image} />

      <div className="pointer-events-none absolute top-[10%] h-[600px] w-[600px] rounded-full bg-teal-500/10 blur-[120px] rtl:right-[-10%] ltr:left-[-10%]" />

      <header className="relative z-10 flex max-w-4xl flex-col gap-8 border-b border-border pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-label text-sm uppercase tracking-wider text-primary">{eyebrow}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading text-4xl font-black leading-[1.1] tracking-tight md:text-5xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl leading-relaxed text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      </header>

      <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-4">
        <aside className="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-8">
            <div>
              <h3 className="mb-4 font-heading text-lg font-bold">{t('blog.searchLabel')}</h3>
              <div className="relative">
                <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:right-3 ltr:left-3" />
                <Input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setVisibleCount(6);
                  }}
                  placeholder={t('blog.search')}
                  className="border-border bg-surface/50 rtl:pr-10 ltr:pl-10"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-heading text-lg font-bold">{t('blog.categories')}</h3>
              <div className="flex flex-col gap-2">
                {categories.map((category) => {
                  const isActive = activeCategory === category;
                  const label = category === ALL_BLOG_CATEGORY ? t('blog.allCategories') : category;

                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setVisibleCount(6);
                      }}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground shadow-md'
                          : 'border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span>{label}</span>
                      {isActive ? <ChevronRight className="h-4 w-4 rtl:rotate-180" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <div className="order-1 flex flex-col gap-10 lg:order-2 lg:col-span-3">
          {listingTitle || listingSubtitle ? (
            <div className="max-w-3xl space-y-3">
              {listingTitle ? <h2 className="font-heading text-2xl font-bold text-foreground">{listingTitle}</h2> : null}
              {listingSubtitle ? <p className="text-sm leading-7 text-muted-foreground">{listingSubtitle}</p> : null}
            </div>
          ) : null}
          {loading ? (
            <SkeletonBlocks count={6} className="md:grid-cols-2" />
          ) : visibleArticles.length === 0 ? (
            <EmptyState title={t('blog.noArticles')} description={t('blog.noArticlesDescription')} className="py-20" />
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {visibleArticles.map((article, index) => {
                  const cover = resolveMediaField(
                    {
                      url: article.coverImage || article.image,
                      assetId: article.coverImageAssetId || article.imageAssetId,
                    },
                    assets,
                  );
                  const articleTitle = getLocalizedValue(article.title, article.titleAr, isArabic) || article.title;
                  const articleExcerpt = getLocalizedValue(article.excerpt, article.excerptAr, isArabic) || article.excerpt;

                  return (
                    <motion.div
                      layout
                      key={article.id}
                      initial={{ opacity: 0, scale: 0.95, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link to={`/blog/${article.slug}`} className="group flex h-full">
                        <article className="relative isolate flex w-full flex-col items-start gap-6 overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl md:p-10">
                          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                          {mediaLoading ? (
                            <div className="-mx-8 -mt-8 mb-2 aspect-[16/9] w-[calc(100%+4rem)] overflow-hidden border-b border-border md:-mx-10 md:-mt-10 md:w-[calc(100%+5rem)]">
                              <SkeletonMedia className="h-full w-full rounded-none" />
                            </div>
                          ) : cover.url ? (
                            <div className="-mx-8 -mt-8 mb-2 aspect-[16/9] w-[calc(100%+4rem)] overflow-hidden border-b border-border md:-mx-10 md:-mt-10 md:w-[calc(100%+5rem)]">
                              <img src={cover.url} alt={articleTitle} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                          ) : null}

                          <div className="flex w-full items-center gap-4 text-sm font-medium text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {formatDate(article.createdAt?.seconds)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {article.readTime || t('blog.readTime')}
                            </span>
                            {article.featured ? (
                              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                {t('blog.featured')}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex flex-1 flex-col gap-4">
                            <h2 className="font-heading text-2xl font-extrabold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                              {articleTitle}
                            </h2>
                            <p className="mb-2 line-clamp-3 leading-relaxed text-muted-foreground">{articleExcerpt}</p>
                            {(article.tags ?? []).length > 0 ? (
                              <div className="flex flex-wrap gap-2" dir="ltr">
                                {(article.tags ?? []).slice(0, 3).map((tag) => (
                                  <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-auto flex w-full items-center justify-between border-t border-border/50 pt-6">
                            <div className="flex items-center gap-3">
                              {profileLoading ? (
                                <>
                                  <SkeletonLine className="h-8 w-8 rounded-full" />
                                  <SkeletonLine className="h-4 w-28" />
                                </>
                              ) : (
                                <>
                                  {profile.profileImage ? (
                                    <img
                                      src={profile.profileImage}
                                      alt={displayName}
                                      className="h-8 w-8 rounded-full border border-border/50 object-cover"
                                    />
                                  ) : null}
                                  <span className="text-sm font-semibold text-foreground">{displayName}</span>
                                </>
                              )}
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                              <ArrowRight className="h-5 w-5 transition-transform duration-300 rtl:rotate-[135deg] rtl:group-hover:rotate-180 ltr:-rotate-45 ltr:group-hover:rotate-0" />
                            </div>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {visibleCount < filteredArticles.length ? (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-border/50 bg-surface hover:bg-muted"
                onClick={() => setVisibleCount((previous) => previous + 6)}
              >
                {t('blog.loadMore')}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
