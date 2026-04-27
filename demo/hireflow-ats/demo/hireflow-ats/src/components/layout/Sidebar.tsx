import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Layout, Calendar, FileText, BarChart, Settings, X, Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';
import { useTranslation } from 'react-i18next';

export const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useStore();
  const { t } = useTranslation();

  const navigation = [
    { name: t('sidebar.dashboard', 'Dashboard'), to: '/', icon: LayoutDashboard },
    { name: t('sidebar.jobs', 'Jobs'), to: '/jobs', icon: Briefcase },
    { name: t('sidebar.candidates', 'Candidates'), to: '/candidates', icon: Users },
    { name: t('sidebar.pipeline', 'Pipeline'), to: '/pipeline', icon: Layout },
    { name: t('sidebar.interviews', 'Interviews'), to: '/interviews', icon: Calendar },
    { name: t('sidebar.evaluations', 'Evaluations'), to: '/evaluations', icon: FileText },
    { name: t('sidebar.reports', 'Reports'), to: '/reports', icon: BarChart },
    { name: t('sidebar.settings', 'Settings'), to: '/settings', icon: Settings },
  ];

  return (
    <>
      <div className={cn("fixed inset-0 z-40 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border p-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 font-bold text-xl text-primary-600">
              <Briefcase className="w-6 h-6" />
              HireFlow ATS
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-muted rounded-md text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-primary-50 text-primary-600" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              {t('sidebar.builtBy', 'Built by')} <span className="font-semibold text-foreground">Mohamed Saied</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-border bg-sidebar pt-5 pb-4">
          <div className="flex items-center gap-2 px-6 mb-8 font-bold text-xl text-primary-600">
            <Briefcase className="w-6 h-6" />
            HireFlow ATS
          </div>
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-primary-50 text-primary-600" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="px-3 mt-auto pt-4 border-t border-border mx-3">
            <div className="text-xs text-muted-foreground text-center">
              {t('sidebar.builtBy', 'Built by')} <span className="font-semibold text-foreground">Mohamed Saied</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
