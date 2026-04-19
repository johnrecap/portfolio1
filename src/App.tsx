import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ThemeProvider } from './components/shared/theme-provider';
import { PublicNavbar, PublicFooter } from './components/public/layout-components';
import { DashboardLayout } from './components/dashboard/layout';
import Home from './pages/(public)/Home';
import { ContactForm } from './pages/(public)/Contact';
import Login from './pages/(auth)/Login';
import { DashboardOverview } from './pages/dashboard/Overview';
import { DashboardProjects } from './pages/dashboard/Projects';
import { DashboardSkills } from './pages/dashboard/Skills';
import { DashboardBlog } from './pages/dashboard/Blog';
import { DashboardMessages } from './pages/dashboard/Messages';
import { DashboardSettings } from './pages/dashboard/Settings';
import { Toaster } from '@/components/ui/sonner';

import { About } from './pages/(public)/About';
import { Projects } from './pages/(public)/Projects';
import { Skills } from './pages/(public)/Skills';
import { Blog } from './pages/(public)/Blog';
import { BlogPost } from './pages/(public)/BlogPost';
import { ProjectDetail } from './pages/(public)/ProjectDetail';
import { NotFound } from './pages/(public)/NotFound';
import { ScrollToTop } from './components/shared/ScrollToTop';
import { DevBackground } from './components/shared/DevBackground';
import { TerminalEasterEgg } from './components/shared/TerminalEasterEgg';
import { useEffect } from 'react';
import { useProfile } from './hooks/useProfile';

import { useTranslation } from 'react-i18next';

const PublicLayout = () => {
  const { profile } = useProfile();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (profile) {
      document.title = profile.metaTitle || `${profile.displayName} - Portfolio`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', profile.metaDescription || profile.bio);
    }
  }, [profile]);

  return (
    <div className={`min-h-screen flex flex-col selection:bg-primary/20 ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <DevBackground />
      <TerminalEasterEgg />
      <ScrollToTop />
      <PublicNavbar />
      <main className="flex-1 w-full max-w-[1344px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

const AuthLayout = () => {
  const { i18n } = useTranslation();
  return (
    <div className={`min-h-screen flex items-center justify-center bg-surface-2 p-4 ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'skills', element: <Skills /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'contact', element: <ContactForm /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: 'projects', element: <DashboardProjects /> },
      { path: 'skills', element: <DashboardSkills /> },
      { path: 'blog', element: <DashboardBlog /> },
      { path: 'messages', element: <DashboardMessages /> },
      { path: 'settings', element: <DashboardSettings /> },
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
