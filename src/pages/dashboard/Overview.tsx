import { motion } from 'motion/react';
import { ArrowRight, Briefcase, FileText, Inbox, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { EmptyState, SkeletonBlocks } from '@/components/shared/PageState';
import { useCollection } from '@/hooks/useFirestore';
import { useDashboardSettings } from '@/hooks/usePlatformSettings';
import { countUnreadMessages } from '@/lib/content-utils';
import { DASHBOARD_ROUTE_PATHS, DASHBOARD_WIDGET_COPY } from '@/lib/admin/dashboard-config';
import { sortProjects, type ProjectRecord } from '@/lib/project-utils';

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  dateValue: number;
};

export const DashboardOverview = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === 'ar';
  const { dashboardSettings, loading: dashboardLoading } = useDashboardSettings();
  const { data: projects, loading: projectsLoading } = useCollection<ProjectRecord>('projects');
  const { data: blogs, loading: blogsLoading } = useCollection<any>('blogs');
  const { data: messages, loading: messagesLoading } = useCollection<any>('messages');

  const loading = dashboardLoading || projectsLoading || blogsLoading || messagesLoading;
  const featuredCount = projects.filter((project) => project.featured).length;
  const unreadMessages = countUnreadMessages(messages as Array<{ read?: boolean }>);
  const newestProjects = sortProjects(projects, 'newest').slice(0, 3);
  const newestBlogs = blogs.slice(0, 3);
  const newestMessages = messages.slice(0, 3);
  const dashboardName = isArabic
    ? dashboardSettings.dashboardNameAr || dashboardSettings.dashboardName
    : dashboardSettings.dashboardName;
  const introTitle = isArabic
    ? dashboardSettings.introTitleAr || dashboardSettings.introTitle
    : dashboardSettings.introTitle;
  const introBody = isArabic
    ? dashboardSettings.introBodyAr || dashboardSettings.introBody
    : dashboardSettings.introBody;

  const activity: ActivityItem[] = [
    ...newestProjects.map((project) => ({
      id: `project-${project.id}`,
      title: t('dashboardOverview.projectUpdated', { name: project.title }),
      description: project.description,
      dateValue: typeof project.createdAt?.seconds === 'number' ? project.createdAt.seconds : 0,
    })),
    ...newestBlogs.map((blog: any) => ({
      id: `blog-${blog.id}`,
      title: t('dashboardOverview.blogPublished', { name: blog.title }),
      description: blog.excerpt || blog.content?.slice(0, 110) || '',
      dateValue: typeof blog.createdAt?.seconds === 'number' ? blog.createdAt.seconds : 0,
    })),
    ...newestMessages.map((message: any) => ({
      id: `message-${message.id}`,
      title: t('dashboardOverview.messageReceived', { name: message.name || message.email }),
      description: message.message || '',
      dateValue: typeof message.createdAt?.seconds === 'number' ? message.createdAt.seconds : 0,
    })),
  ]
    .sort((left, right) => right.dateValue - left.dateValue)
    .slice(0, 6);

  const moduleLabelById = Object.fromEntries(
    dashboardSettings.sidebarModules.map((module) => [
      module.id,
      isArabic ? module.labelAr || module.label : module.label,
    ]),
  ) as Record<string, string>;

  const metricCards = dashboardSettings.overviewWidgets
    .filter((widgetId) => DASHBOARD_WIDGET_COPY[widgetId].group === 'metric')
    .map((widgetId) => {
      switch (widgetId) {
        case 'totalProjects':
          return {
            id: widgetId,
            title: t('dashboardOverview.totalProjects'),
            value: `${projects.length}`,
            subtitle: t('dashboardOverview.totalProjectsHint'),
            icon: Briefcase,
          };
        case 'featuredProjects':
          return {
            id: widgetId,
            title: t('dashboardOverview.featuredProjects'),
            value: `${featuredCount}`,
            subtitle: t('dashboardOverview.featuredProjectsHint'),
            icon: Sparkles,
          };
        case 'blogPosts':
          return {
            id: widgetId,
            title: t('dashboardOverview.blogPosts'),
            value: `${blogs.length}`,
            subtitle: t('dashboardOverview.blogPostsHint'),
            icon: FileText,
          };
        case 'unreadMessages':
          return {
            id: widgetId,
            title: t('dashboardOverview.unreadMessages'),
            value: `${unreadMessages}`,
            subtitle: t('dashboardOverview.unreadMessagesHint'),
            icon: Inbox,
          };
        default:
          return null;
      }
    })
    .filter((card): card is NonNullable<typeof card> => card !== null);

  const quickActions = dashboardSettings.quickActions.map((actionId) => ({
    id: actionId,
    label: moduleLabelById[actionId] ?? t(`dashboardLayout.${actionId}`),
    path: DASHBOARD_ROUTE_PATHS[actionId],
  }));

  const showRecentActivity = dashboardSettings.overviewWidgets.includes('recentActivity');
  const showWorkspaceSnapshot = dashboardSettings.overviewWidgets.includes('workspaceSnapshot');

  return (
    <div className="flex w-full flex-1 flex-col px-6 pt-10 pb-20">
      <div className="mb-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
            {dashboardName}
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground">
            {introTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground">{introBody}</p>
        </div>

        <div className="rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-primary">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em]">
              {t('dashboardOverview.quickActions')}
            </p>
          </div>

          {quickActions.length === 0 ? (
            <EmptyState
              title={t('dashboardOverview.quickActionsEmptyTitle')}
              description={t('dashboardOverview.quickActionsEmptyDescription')}
              className="py-8"
            />
          ) : (
            <div className="mt-5 flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <Link key={action.id} to={action.path}>
                  <Button className="gap-2">
                    {action.label}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonBlocks count={4} className="md:grid-cols-2 xl:grid-cols-4" />
      ) : (
        <>
          {metricCards.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((card, index) => (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[1.75rem] border border-border/60 bg-card/70 p-6 shadow-sm"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="mt-3 font-heading text-4xl font-black text-foreground">{card.value}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{card.subtitle}</p>
                </motion.article>
              ))}
            </div>
          ) : null}

          {showRecentActivity || showWorkspaceSnapshot ? (
            <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              {showRecentActivity ? (
                <section className="rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-foreground">
                        {t('dashboardOverview.recentActivity')}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t('dashboardOverview.recentActivityHint')}
                      </p>
                    </div>
                    <Link to={DASHBOARD_ROUTE_PATHS.projects}>
                      <Button variant="ghost" className="gap-2">
                        {moduleLabelById.projects ?? t('dashboardOverview.viewProjects')}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {activity.length === 0 ? (
                    <EmptyState
                      title={t('dashboardOverview.emptyTitle')}
                      description={t('dashboardOverview.emptyDescription')}
                      className="py-10"
                    />
                  ) : (
                    <div className="space-y-4">
                      {activity.map((item) => (
                        <div key={item.id} className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ) : null}

              {showWorkspaceSnapshot ? (
                <section className="rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm">
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    {t('dashboardOverview.workspaceSnapshot')}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('dashboardOverview.workspaceSnapshotHint')}
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
                      <h3 className="font-semibold text-foreground">{t('dashboardOverview.latestProjects')}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {newestProjects.map((project) => project.title).join(', ') || t('dashboardOverview.emptyInline')}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
                      <h3 className="font-semibold text-foreground">{t('dashboardOverview.latestBlogs')}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {newestBlogs.map((blog: any) => blog.title).join(', ') || t('dashboardOverview.emptyInline')}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-5">
                      <h3 className="font-semibold text-foreground">{t('dashboardOverview.latestMessages')}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {newestMessages.map((message: any) => message.name || message.email).join(', ') ||
                          t('dashboardOverview.emptyInline')}
                      </p>
                    </div>
                  </div>
                </section>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
