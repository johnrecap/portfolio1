import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Globe } from 'lucide-react';
import { useTheme } from '@/components/shared/theme-provider';
import { Button, buttonVariants } from '@/components/ui/button';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="rounded-full shrink-0"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => i18n.changeLanguage(i18n.resolvedLanguage === 'ar' ? 'en' : 'ar')}
      className="font-medium flex items-center gap-2 rounded-full px-3 shrink-0"
    >
      <Globe className="h-4 w-4" />
      <span>{i18n.resolvedLanguage === 'ar' ? 'EN' : 'عربي'}</span>
    </Button>
  );
};

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/skills', label: t('nav.skills') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1344px] mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading font-bold text-xl tracking-tight text-primary">
            {i18n.language === 'ar' 
              ? (profile.displayNameAr || profile.displayName)
              : profile.displayName.split(' ').map((n: string) => n.charAt(0)).join('')}.
          </span>
        </Link>
        <nav className="hidden md:flex flex-1 justify-center items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <LanguageToggle />
          <div className="h-4 w-px bg-border mx-1" />
          <ThemeToggle />
          <Link to="/contact" dir="ltr" className="ml-2 bg-primary hover:bg-primary-hover text-primary-foreground font-mono font-bold text-xs px-4 py-2 rounded transition-colors inline-flex items-center gap-1">
            <span className="opacity-70">./</span>{i18n.language === 'ar' ? 'hire-me' : t('hero.hireMe').replace(/\s+/g, '')}.sh
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="rounded-full">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="flex flex-col px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium p-2 rounded-md ${
                    isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/contact" className={buttonVariants({ className: "w-full rounded-full mt-2" })} onClick={() => setIsOpen(false)}>{t('hero.hireMe')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const PublicFooter = () => {
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();

  return (
    <footer className="w-full mt-auto relative z-10 overflow-hidden bg-[#0A0A0B] border-t border-white/5">
      {/* Soft Purple Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] opacity-20 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse at top, #9d4edd 0%, transparent 70%)' }}></div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      {/* Terminal/Status Strip At The Top */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-0 pb-12">
        <div className="relative border-x border-b border-white/5 bg-white/[0.02] rounded-b-xl backdrop-blur-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-purple-900/5">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-mono whitespace-nowrap" dir="ltr">
              <span className="text-purple-400">visitor@web</span>
              <span className="text-slate-500">:</span>
              <span className="text-slate-500">~</span>
              <span className="text-slate-500">$</span>
              <span className="font-semibold text-slate-200">contact --status</span>
              <span className="w-1.5 h-4 bg-purple-500 animate-pulse inline-block ml-1"></span>
            </div>
            <p className="text-slate-400 text-sm mt-1 sm:mt-0 text-left" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              {i18n.language === 'ar' ? 'متاح للعمل الحر وفرص العمل عن بعد.' : 'Available for freelance work and remote opportunities.'}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <Link to="/contact" className={buttonVariants({ variant: "outline", size: "sm", className: "w-full sm:w-auto border-white/10 text-white hover:bg-white/5 hover:text-white" })}>
              {i18n.language === 'ar' ? 'تواصل معي' : 'Contact Me'}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-8">
        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-16">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="font-heading font-bold text-2xl tracking-tight text-white hover:text-purple-400 transition-colors w-fit">
              {i18n.language === 'ar' ? 'محمد سعيد' : 'Mohamed Saied'}
              <span className="text-purple-500">_</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {i18n.language === 'ar' 
                ? 'مطوّر برمجيات متكامل متخصص في تطوير الويب الحديث وتطبيقات الهواتف.' 
                : 'Full-stack software developer specializing in modern web and mobile applications.'}
            </p>
          </div>

          {/* Quick Links Col */}
          <div className="flex flex-col gap-4">
             <h4 className="font-heading font-semibold text-slate-100 uppercase tracking-wider text-sm">{i18n.language === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
             <ul className="flex flex-col gap-3 text-sm text-slate-400">
               <li><Link to="/" className="hover:text-purple-400 transition-colors">{i18n.language === 'ar' ? 'الرئيسية' : 'Home'}</Link></li>
               <li><Link to="/about" className="hover:text-purple-400 transition-colors">{i18n.language === 'ar' ? 'نبذة عني' : 'About'}</Link></li>
               <li><Link to="/projects" className="hover:text-purple-400 transition-colors">{i18n.language === 'ar' ? 'مشاريعي' : 'Projects'}</Link></li>
               <li><Link to="/skills" className="hover:text-purple-400 transition-colors">{i18n.language === 'ar' ? 'المهارات' : 'Skills'}</Link></li>
               <li><Link to="/blog" className="hover:text-purple-400 transition-colors">{i18n.language === 'ar' ? 'المدونة' : 'Blog'}</Link></li>
               <li><Link to="/contact" className="hover:text-purple-400 transition-colors">{i18n.language === 'ar' ? 'تواصل معي' : 'Contact'}</Link></li>
             </ul>
          </div>

          {/* Connect Col */}
          <div className="flex flex-col gap-4">
             <h4 className="font-heading font-semibold text-slate-100 uppercase tracking-wider text-sm">{i18n.language === 'ar' ? 'تواصل' : 'Connect'}</h4>
             <ul className="flex flex-col gap-3 text-sm text-slate-400">
               {profile.githubUrl && <li><a href={profile.githubUrl} target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">GitHub</a></li>}
               {profile.linkedinUrl && <li><a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">LinkedIn</a></li>}
               <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Email</Link></li>
               <li><Link to="/contact" className="hover:text-purple-400 transition-colors">WhatsApp</Link></li>
             </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4 text-xs font-mono text-slate-500 justify-between items-center text-center md:text-left">
          <p>
            {i18n.language === 'ar' 
              ? '© 2026 محمد سعيد — تم البناء بتقنيات الويب الحديثة.'
              : '© 2026 Mohamed Saied — Built with modern web technologies.'}
          </p>
           <Link to="/login" className="hover:text-slate-300 transition-colors">{t('nav.adminLogin', 'Admin')}</Link>
        </div>
      </div>
    </footer>
  );
};
