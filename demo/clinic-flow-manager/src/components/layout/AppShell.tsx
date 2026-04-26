import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  LayoutDashboard, Calendar, Users, Stethoscope, 
  CreditCard, PieChart, Settings, HelpCircle,
  Menu, Bell, Moon, Sun, Globe, X
} from "lucide-react";
import { useClinicStore } from "@/store/clinicStore";

export function AppShell() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const theme = useClinicStore((s) => s.settings.theme);
  const setTheme = useClinicStore((s) => s.setTheme);
  const setLanguage = useClinicStore((s) => s.setLanguage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  React.useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const navItems = [
    { href: "/", label: t('dashboard'), icon: LayoutDashboard },
    { href: "/appointments", label: t('appointments'), icon: Calendar },
    { href: "/patients", label: t('patients'), icon: Users },
    { href: "/doctors", label: t('doctors'), icon: Stethoscope },
    { href: "/billing", label: t('billing'), icon: CreditCard },
    { href: "/reports", label: t('reports'), icon: PieChart },
    { href: "/settings", label: t('settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 start-0 w-[260px] bg-surface-container-lowest border-e border-outline-variant z-50 transform transition-transform duration-300 md:translate-x-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : (i18n.language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant">
          <h1 className="text-xl font-bold text-primary font-heading">ClinicFlow</h1>
          <button className="md:hidden text-on-surface-variant p-2 -me-2" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ms-[260px]">
        <header className="h-16 bg-surface-container-lowest/80 backdrop-blur border-b border-outline-variant sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
            <button className="md:hidden p-2 text-on-surface-variant me-2" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="w-64 bg-surface-container-low border border-outline-variant rounded-full text-sm ps-10 pe-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg className="w-4 h-4 text-outline absolute start-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant">
              <Globe className="w-5 h-5" />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/settings" className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold ms-2 hover:opacity-90 transition-opacity">
              JD
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
