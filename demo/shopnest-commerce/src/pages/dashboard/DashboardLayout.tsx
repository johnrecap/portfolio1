import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, ArrowLeft, Settings, Ticket } from 'lucide-react';
import { cn } from '../../lib/utils';

export function DashboardLayout() {
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: ShoppingCart },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Promo Codes', href: '/dashboard/coupons', icon: Ticket },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed inset-y-0 z-10">
        <div className="flex h-16 items-center px-6 border-b border-slate-200 bg-white">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4 text-slate-500" />
            <span className="text-lg font-bold tracking-tighter text-slate-900">Storefront</span>
          </Link>
        </div>
        
        <div className="px-4 py-6 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Admin Panel
            </h2>
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="px-2 mt-auto">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Developer</span>
              <span className="text-sm font-bold text-slate-900">Made by Mohamed Saied</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-64 flex flex-col min-h-0">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
