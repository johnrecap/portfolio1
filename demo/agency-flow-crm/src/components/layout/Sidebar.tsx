import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import {
  LayoutDashboard,
  UserPlus,
  KanbanSquare,
  Building2,
  CheckSquare,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

export function Sidebar() {
  const { t } = useTranslation();
  
  const mainNavItems = [
    { name: t('sidebar.dashboard'), path: "/dashboard", icon: LayoutDashboard },
    { name: t('sidebar.leads'), path: "/leads", icon: UserPlus },
    { name: t('sidebar.deals'), path: "/deals", icon: KanbanSquare },
    { name: t('sidebar.clients'), path: "/clients", icon: Building2 },
    { name: t('sidebar.tasks'), path: "/tasks", icon: CheckSquare },
    { name: t('sidebar.reports'), path: "/reports", icon: BarChart3 },
  ];

  return (
    <aside className="fixed rtl:right-0 ltr:left-0 top-0 h-screen w-[264px] border-e border-[#E2E8F0] bg-white flex-col py-6 px-4 z-20 hidden md:flex">
      <div className="flex items-center gap-3 mb-8 px-4">
        <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold">
          AF
        </div>
        <div>
          <div className="text-lg font-black tracking-tight text-slate-900">AgencyFlow</div>
          <div className="text-[12px] text-slate-500 font-medium">CRM Platform</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 font-sans text-[14px] font-medium rounded-lg transition-all duration-200 scale-100 hover:scale-[1.02] active:scale-[0.98]",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50"
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-[#E2E8F0] bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
            MS
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Built by</p>
            <p className="truncate text-sm font-bold text-slate-900">Mohamed Saied</p>
          </div>
        </div>
      </div>

      <div className="space-y-1 pt-4 border-t border-[#E2E8F0]">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-2 font-sans text-[14px] font-medium rounded-lg transition-all duration-200 scale-100 hover:scale-[1.02] active:scale-[0.98]",
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-50"
            )
          }
        >
          <Settings className="w-5 h-5 shrink-0" /> {t('sidebar.settings')}
        </NavLink>
        <NavLink
          to="/support"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-2 font-sans text-[14px] font-medium rounded-lg transition-all duration-200 scale-100 hover:scale-[1.02] active:scale-[0.98]",
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-50"
            )
          }
        >
          <HelpCircle className="w-5 h-5 shrink-0" /> {t('sidebar.support')}
        </NavLink>
      </div>
    </aside>
  );
}
