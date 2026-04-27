import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import { useStore } from '../../store';

export function StoreLayout() {
  const cartItemCount = useStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rotate-45"></div>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">ShopNest</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/products" className="hover:text-emerald-600 transition-colors">All Products</Link>
              <Link to="/products?category=Electronics" className="hover:text-emerald-600 transition-colors">Electronics</Link>
              <Link to="/products?category=Clothing" className="hover:text-emerald-600 transition-colors">Clothing</Link>
              <Link to="/dashboard" className="text-slate-400 hover:text-slate-900 transition-colors">Admin Dashboard</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 border-r pr-6 border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Built by Mohamed Saied</span>
            </div>
            <Link 
              to="/cart" 
              className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full bg-slate-50">
        <Outlet />
      </main>

      <footer className="p-6 bg-slate-900 text-slate-500 flex flex-col md:flex-row justify-between items-center text-xs border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-4">
          <span>&copy; {new Date().getFullYear()} ShopNest Commerce</span>
          <span className="h-4 w-[1px] bg-slate-700"></span>
          <span>Demo App</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>System Status: Fully Operational</span>
          </div>
          <span className="ml-4 font-bold text-white tracking-widest uppercase">Made by Mohamed Saied</span>
          <Link to="/dashboard" className="ml-4 font-bold text-white tracking-widest uppercase hover:text-emerald-400 transition-colors">
            Admin Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
