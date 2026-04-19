import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Zap, 
  FileText, 
  Mail, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from 'react-i18next';

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { name: t('dashboardLayout.overview'), path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: t('dashboardLayout.projects'), path: '/dashboard/projects', icon: Briefcase },
    { name: t('dashboardLayout.skills'), path: '/dashboard/skills', icon: Zap },
    { name: t('dashboardLayout.blog'), path: '/dashboard/blog', icon: FileText },
    { name: t('dashboardLayout.messages'), path: '/dashboard/messages', icon: Mail, badge: 3 },
    { name: t('dashboardLayout.settings'), path: '/dashboard/settings', icon: Settings },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface">{t('dashboardLayout.loading')}</div>;
  }

  if (!user || user.email !== 'mohamedsaied.m20@gmail.com') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className={`flex bg-surface min-h-screen antialiased text-foreground ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* SideNavBar */}
      <nav className={`fixed inset-y-0 ${i18n.language === 'ar' ? 'right-0 border-l border-slate-800' : 'left-0 border-r border-slate-800'} w-[280px] bg-slate-900 flex flex-col py-8 z-50 shadow-2xl transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : (i18n.language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        
        {/* Mobile Close Button */}
        <button 
          className={`absolute top-4 ${i18n.language === 'ar' ? 'left-4' : 'right-4'} text-slate-400 hover:text-white md:hidden`}
          onClick={toggleMobileMenu}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="px-6 mb-10 flex flex-col gap-4">
          <div className="text-lg font-black text-white tracking-widest uppercase font-heading">
            {t('dashboardLayout.admin')}
          </div>
          <div className="flex items-center gap-3">
            <img 
              alt={profile.displayName} 
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 bg-background" 
              src={profile.profileImage || undefined} 
            />
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-white font-heading tracking-wide truncate">{profile.displayName}</div>
              <div className={`text-xs text-teal-400 font-label tracking-wide truncate`}>{profile.title}</div>
            </div>
          </div>
        </div>

        <ul className="flex-1 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-6 py-4 transition-colors font-label font-medium relative group ${isActive ? 'text-teal-400 bg-slate-800/50' : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isActive && <div className={`absolute ${i18n.language === 'ar' ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'} top-0 bottom-0 w-1 bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]`} />}
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? '' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={`absolute ${i18n.language === 'ar' ? 'left-6' : 'right-6'} bg-teal-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto px-6 pt-4">
          <button onClick={handleLogout} className="w-full flex items-center justify-start gap-3 text-slate-400 py-4 hover:text-white transition-colors font-label font-medium group">
            <LogOut className={`w-5 h-5 ${i18n.language === 'ar' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'} transition-transform shrink-0`} />
            <span>{t('dashboardLayout.logout')}</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className={`flex-1 ${i18n.language === 'ar' ? 'md:mr-[280px]' : 'md:ml-[280px]'} min-h-screen flex flex-col relative w-full`}>
        
        {/* TopNavBar */}
        <header className={`fixed top-0 ${i18n.language === 'ar' ? 'left-0 md:right-[280px]' : 'right-0 md:left-[280px]'} z-30 bg-background/50 backdrop-blur-xl border-b border-border shadow-sm flex justify-between items-center px-6 h-16 transition-all duration-300`}>
          
          <div className="flex items-center gap-4 w-full">
            {/* Mobile Hamburger */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors flex-shrink-0"
              onClick={toggleMobileMenu}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search */}
            <div className="relative w-full max-w-md hidden sm:block group">
              <Search className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors`} />
              <input 
                type="text" 
                placeholder={t('dashboardLayout.quickSearch')}
                className={`w-full bg-muted/50 border-none rounded-full py-2.5 ${i18n.language === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm font-label focus:ring-2 focus:ring-primary focus:bg-muted outline-none transition-all placeholder:text-muted-foreground text-foreground`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-background"></span>
            </button>
            <button className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden ml-1 sm:ml-2 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
              <img 
                alt="Admin Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMoli9aIMRG13UqbUJ7vWczcMadK1TNOrrhKt4cSh4gOIGr4vpxGccCSqMKF4bI4jp8Rys85kZqlaRzM_NK6MY4_SR012NiInd93ZlCcqd435jsh_bclDhg_R98nrRp_Exb6SRBFn2jdp94rCZU2vMU5_coHQcxajilHfzPH6axV-CkA71EgMCzCa1eWAw77vp5eCN-w-SeKE70HEZEH53qw9z0BICGPgxnv1MQbysH9E1V7dt-7D7TbQ9iUBKu8PH8pr6A8ANQbA8" 
              />
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 flex flex-col w-full">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};
