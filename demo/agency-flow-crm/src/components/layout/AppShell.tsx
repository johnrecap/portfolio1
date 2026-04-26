import { Outlet, useLocation, NavLink } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { LayoutDashboard, UserPlus, KanbanSquare, Building2, CheckSquare } from "lucide-react";
import { cn } from "../../utils/cn";

export default function AppShell() {
  const location = useLocation();
  const title = location.pathname.split("/")[1] || "Dashboard";

  return (
    <div className="bg-background text-on-background antialiased flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ltr:md:ml-[264px] rtl:md:mr-[264px] h-[100dvh] overflow-hidden relative">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto w-full relative pb-16 md:pb-0">
          <Outlet />
        </main>
        
        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-[#E2E8F0] flex justify-around items-center h-16 z-30 pb-safe">
          <NavLink to="/dashboard" className={({ isActive }) => cn("flex flex-col items-center justify-center w-full h-full", isActive ? "text-primary" : "text-slate-500")}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </NavLink>
          <NavLink to="/leads" className={({ isActive }) => cn("flex flex-col items-center justify-center w-full h-full", isActive ? "text-primary" : "text-slate-500")}>
            <UserPlus className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Leads</span>
          </NavLink>
          <NavLink to="/deals" className={({ isActive }) => cn("flex flex-col items-center justify-center w-full h-full", isActive ? "text-primary" : "text-slate-500")}>
            <KanbanSquare className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Deals</span>
          </NavLink>
          <NavLink to="/clients" className={({ isActive }) => cn("flex flex-col items-center justify-center w-full h-full", isActive ? "text-primary" : "text-slate-500")}>
            <Building2 className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Clients</span>
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => cn("flex flex-col items-center justify-center w-full h-full", isActive ? "text-primary" : "text-slate-500")}>
            <CheckSquare className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Tasks</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
