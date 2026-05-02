import { Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { Navigate, createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './components/shared/theme-provider';
import { PublicNavbar } from './components/public/layout-components';
import { FloatingWhatsAppButton } from './components/public/floating-whatsapp-button';
import { ScrollToTop } from './components/shared/ScrollToTop';
import { DevBackground } from './components/shared/DevBackground';
import { SkeletonBlocks } from '@/components/shared/PageState';
import { PublicDataProvider } from '@/contexts/PublicDataProvider';
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
const TerminalEasterEgg = lazy(() =>
  import('./components/shared/TerminalEasterEgg').then((module) => ({ default: module.TerminalEasterEgg })),
);
const NotFound = lazy(() =>
  import('./pages/(public)/NotFound').then((module) => ({ default: module.NotFound })),
);
const PublicFooter = lazy(() =>
  import('./components/public/public-footer').then((module) => ({ default: module.PublicFooter })),
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
const Toaster = lazy(() => import('@/components/ui/sonner').then((module) => ({ default: module.Toaster })));

const RouteLoader = ({ dashboard = false }: { dashboard?: boolean }) => (
  <div className="w-full py-10">
    <SkeletonBlocks count={dashboard ? 4 : 3} className={dashboard ? 'md:grid-cols-2 xl:grid-cols-4' : ''} />
  </div>
);

const withSuspense = (node: ReactNode, dashboard = false) => (
  <Suspense fallback={dashboard ? <RouteLoader dashboard /> : <div className="min-h-[70vh] w-full" aria-hidden="true" />}>
    {node}
  </Suspense>
);

const TerminalEasterEggLoader = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';

      if (event.key === '`' && !isTypingTarget) {
        event.preventDefault();
        setEnabled(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <TerminalEasterEgg initialOpen />
    </Suspense>
  );
};

const InteractionToaster = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      return;
    }

    const enable = () => setEnabled(true);
    const events = ['pointerdown', 'keydown', 'focusin'] as const;
    events.forEach((eventName) => window.addEventListener(eventName, enable, { once: true, passive: true }));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, enable));
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Toaster position="top-right" richColors />
    </Suspense>
  );
};

const DeferredPublicFooter = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      return;
    }

    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (browserWindow.requestIdleCallback) {
      const handle = browserWindow.requestIdleCallback(() => setEnabled(true), { timeout: 2200 });
      return () => browserWindow.cancelIdleCallback?.(handle);
    }

    const handle = window.setTimeout(() => setEnabled(true), 1400);
    return () => window.clearTimeout(handle);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <PublicFooter />
    </Suspense>
  );
};

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
      <PublicDataProvider>
        <DevBackground />
        <TerminalEasterEggLoader />
        <ScrollToTop />
        <FloatingWhatsAppButton />
        <div className="flex min-h-screen flex-col">
          <PublicNavbar themeMode={themeSettings.mode} />
          <main className="relative z-10 mx-auto flex w-full max-w-[1344px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </main>
          <DeferredPublicFooter />
        </div>
      </PublicDataProvider>
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
      <InteractionToaster />
    </ThemeProvider>
  );
}
