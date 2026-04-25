import { Suspense, lazy, type ReactNode } from 'react';
import { Navigate, createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './components/shared/theme-provider';
import { PublicFooter, PublicNavbar } from './components/public/layout-components';
import { Toaster } from '@/components/ui/sonner';
import { PageSeo } from '@/components/shared/PageSeo';
import { ScrollToTop } from './components/shared/ScrollToTop';
import { DevBackground } from './components/shared/DevBackground';
import { TerminalEasterEgg } from './components/shared/TerminalEasterEgg';
import { SkeletonBlocks } from '@/components/shared/PageState';
import { buildPublicThemeStyle } from '@/lib/admin/settings';
import { useTheme } from '@/components/shared/theme-provider';
import { useThemeSettings } from '@/hooks/usePlatformSettings';

const Home = lazy(() => import('./pages/(public)/Home'));
const Login = lazy(() => import('./pages/(auth)/Login'));
const About = lazy(() => import('./pages/(public)/About').then((module) => ({ default: module.About })));
const Projects = lazy(() =>
  import('./pages/(public)/Projects').then((module) => ({ default: module.Projects })),
);
const Skills = lazy(() => import('./pages/(public)/Skills').then((module) => ({ default: module.Skills })));
const Blog = lazy(() => import('./pages/(public)/Blog').then((module) => ({ default: module.Blog })));
const BlogPost = lazy(() =>
  import('./pages/(public)/BlogPost').then((module) => ({ default: module.BlogPost })),
);
const ContactForm = lazy(() =>
  import('./pages/(public)/Contact').then((module) => ({ default: module.ContactForm })),
);
const ProjectDetail = lazy(() =>
  import('./pages/(public)/ProjectDetail').then((module) => ({ default: module.ProjectDetail })),
);
const NotFound = lazy(() =>
  import('./pages/(public)/NotFound').then((module) => ({ default: module.NotFound })),
);
const DashboardLayout = lazy(() =>
  import('./components/dashboard/layout').then((module) => ({ default: module.DashboardLayout })),
);
const DashboardOverview = lazy(() =>
  import('./pages/dashboard/Overview').then((module) => ({ default: module.DashboardOverview })),
);
const DashboardProjects = lazy(() =>
  import('./pages/dashboard/Projects').then((module) => ({ default: module.DashboardProjects })),
);
const DashboardSkills = lazy(() =>
  import('./pages/dashboard/Skills').then((module) => ({ default: module.DashboardSkills })),
);
const DashboardBlog = lazy(() =>
  import('./pages/dashboard/Blog').then((module) => ({ default: module.DashboardBlog })),
);
const DashboardTestimonials = lazy(() =>
  import('./pages/dashboard/Testimonials').then((module) => ({ default: module.DashboardTestimonials })),
);
const DashboardMediaLibrary = lazy(() =>
  import('./pages/dashboard/MediaLibrary').then((module) => ({ default: module.DashboardMediaLibrary })),
);
const DashboardMessages = lazy(() =>
  import('./pages/dashboard/Messages').then((module) => ({ default: module.DashboardMessages })),
);
const DashboardSiteSettings = lazy(() =>
  import('./pages/dashboard/SiteSettings').then((module) => ({ default: module.DashboardSiteSettings })),
);
const DashboardThemeSettings = lazy(() =>
  import('./pages/dashboard/ThemeSettings').then((module) => ({ default: module.DashboardThemeSettings })),
);
const DashboardNavigationSettings = lazy(() =>
  import('./pages/dashboard/NavigationSettings').then((module) => ({ default: module.DashboardNavigationSettings })),
);
const DashboardFooterSettings = lazy(() =>
  import('./pages/dashboard/FooterSettings').then((module) => ({ default: module.DashboardFooterSettings })),
);
const DashboardContactSettings = lazy(() =>
  import('./pages/dashboard/ContactSettings').then((module) => ({ default: module.DashboardContactSettings })),
);
const DashboardSeoSettings = lazy(() =>
  import('./pages/dashboard/SeoSettings').then((module) => ({ default: module.DashboardSeoSettings })),
);
const DashboardPageComposer = lazy(() =>
  import('./pages/dashboard/PageComposer').then((module) => ({ default: module.DashboardPageComposer })),
);
const DashboardSettingsPage = lazy(() =>
  import('./pages/dashboard/DashboardSettings').then((module) => ({ default: module.DashboardSettingsPage })),
);

const RouteLoader = ({ dashboard = false }: { dashboard?: boolean }) => (
  <div className="w-full py-10">
    <SkeletonBlocks count={dashboard ? 4 : 3} className={dashboard ? 'md:grid-cols-2 xl:grid-cols-4' : ''} />
  </div>
);

const withSuspense = (node: ReactNode, dashboard = false) => (
  <Suspense fallback={<RouteLoader dashboard={dashboard} />}>{node}</Suspense>
);

const PublicLayout = () => {
  const { i18n } = useTranslation();
  const { themeSettings } = useThemeSettings({ publicRead: true });
  const { resolvedTheme } = useTheme();
  const siteResolvedTheme = themeSettings.mode === 'system' ? resolvedTheme : themeSettings.mode;

  return (
    <div
      className={`min-h-screen selection:bg-primary/20 ${siteResolvedTheme === 'dark' ? 'dark' : ''} ${
        i18n.language === 'ar' ? 'rtl' : 'ltr'
      }`}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      style={buildPublicThemeStyle(themeSettings, siteResolvedTheme === 'dark')}
    >
      <PageSeo />
      <DevBackground />
      <TerminalEasterEgg />
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <PublicNavbar />
        <main className="relative z-10 mx-auto flex w-full max-w-[1344px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <PublicFooter />
      </div>
    </div>
  );
};

const AuthLayout = () => {
  const { i18n } = useTranslation();

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-surface-2 p-4 ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: 'about', element: withSuspense(<About />) },
      { path: 'projects', element: withSuspense(<Projects />) },
      { path: 'projects/:slug', element: withSuspense(<ProjectDetail />) },
      { path: 'skills', element: withSuspense(<Skills />) },
      { path: 'blog', element: withSuspense(<Blog />) },
      { path: 'blog/:slug', element: withSuspense(<BlogPost />) },
      { path: 'contact', element: withSuspense(<ContactForm />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: withSuspense(<Login />) }],
  },
  {
    path: '/dashboard',
    element: withSuspense(<DashboardLayout />, true),
    children: [
      { index: true, element: withSuspense(<DashboardOverview />, true) },
      { path: 'site', element: withSuspense(<DashboardSiteSettings />, true) },
      { path: 'theme', element: withSuspense(<DashboardThemeSettings />, true) },
      { path: 'navigation', element: withSuspense(<DashboardNavigationSettings />, true) },
      { path: 'footer', element: withSuspense(<DashboardFooterSettings />, true) },
      { path: 'contact', element: withSuspense(<DashboardContactSettings />, true) },
      { path: 'seo', element: withSuspense(<DashboardSeoSettings />, true) },
      { path: 'pages', element: withSuspense(<DashboardPageComposer />, true) },
      { path: 'projects', element: withSuspense(<DashboardProjects />, true) },
      { path: 'skills', element: withSuspense(<DashboardSkills />, true) },
      { path: 'blog', element: withSuspense(<DashboardBlog />, true) },
      { path: 'testimonials', element: withSuspense(<DashboardTestimonials />, true) },
      { path: 'media', element: withSuspense(<DashboardMediaLibrary />, true) },
      { path: 'messages', element: withSuspense(<DashboardMessages />, true) },
      { path: 'dashboard-settings', element: withSuspense(<DashboardSettingsPage />, true) },
      { path: 'settings', element: <Navigate to="/dashboard/site" replace /> },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
