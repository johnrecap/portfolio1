import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  Package, 
  ArrowLeftRight, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings,
  Languages,
  Moon,
  Sun,
  Menu
} from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import { formatRelativeTime } from '../utils/dates';
import { Button } from './ui/Button';

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useInventoryStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const toggleLanguage = () => {
    const newLang = settings.language === 'en' ? 'ar' : 'en';
    const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
    i18n.changeLanguage(newLang);
    updateSettings({ language: newLang, direction: newDir });
    document.documentElement.dir = newDir;
    document.documentElement.lang = newLang;
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { icon: BarChart3, label: t('app.dashboard'), path: '/' },
    { icon: Package, label: t('app.products'), path: '/products' },
    { icon: ArrowLeftRight, label: t('app.inventory'), path: '/inventory' },
    { icon: ShoppingCart, label: t('app.salesOrders'), path: '/orders' },
    { icon: Users, label: t('app.suppliers'), path: '/suppliers' },
    { icon: FileText, label: t('app.reports'), path: '/reports' },
    { icon: Settings, label: t('app.settings'), path: '/settings' },
  ];

  return (
    <div className={`min-h-screen bg-background text-on-background flex flex-col lg:flex-row ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 start-0 z-50 flex flex-col w-64 bg-surface border-e border-outline-variant transition-transform duration-300 lg:static lg:!translate-x-0 ${
        isSidebarOpen 
          ? 'translate-x-0' 
          : '-translate-x-full rtl:translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant shrink-0">
          <span className="text-xl font-bold text-primary">{t('app.name')}</span>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            &times;
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-secondary-container text-on-secondary-container' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">
              MS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Mohamed Saied</p>
              <p className="text-xs text-on-surface-variant truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            {/* Contextual search or breadcrumbs could go here */}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {settings.theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleLanguage} title={settings.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}>
              <Languages className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
