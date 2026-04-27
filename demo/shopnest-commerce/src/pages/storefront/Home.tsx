import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../../store';
import { formatCurrency, calculateDiscountPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

export function Home() {
  const products = useStore((state) => state.products).slice(0, 3); // Featured products

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-32 border-b border-slate-100">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616423640778-28d1b53229bdbc?q=80&w=2400')] bg-cover bg-center opacity-[0.03]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Summer Sale 2024</span>
              <span className="text-slate-400 text-sm">/</span>
              <span className="text-slate-400 text-sm italic">Featured Collection</span>
            </div>
            <h1 className="text-7xl font-extrabold leading-[0.9] tracking-tighter text-slate-900">
              Elevate your lifestyle with <span className="text-emerald-600 block">premium essentials.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-xl">
              Discover our carefully curated collection of high-quality products designed to bring style and function to your everyday life.
            </p>
            <div className="mt-10 flex gap-4">
              <Button asChild size="lg">
                <Link to="/products">Shop Collection</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products?category=Electronics">View Electronics</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-[24px] shadow-sm border border-slate-100">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Free Shipping</h3>
              <p className="mt-2 text-slate-500 text-sm">On all orders over $100. Fast and reliable delivery to your door.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-[24px] shadow-sm border border-slate-100">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Secure Payments</h3>
              <p className="mt-2 text-slate-500 text-sm">Your payment information is processed securely with end-to-end encryption.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-[24px] shadow-sm border border-slate-100">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Premium Quality</h3>
              <p className="mt-2 text-slate-500 text-sm">We carefully source and test all our products to ensure superior quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-6xl font-extrabold leading-[0.9] tracking-tighter text-slate-900">Featured Products</h2>
              <p className="mt-2 text-slate-500">Our most popular picks for you.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center text-emerald-600 hover:text-emerald-700 font-medium font-sm group transition-all">
              See all
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
               <Link key={product.id} to={`/products/${product.id}`} className="group relative block overflow-hidden rounded-[24px] bg-slate-100 transition-all hover:shadow-md border border-slate-100">
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200 relative">
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 bg-white">
                  <h3 className="text-lg font-medium text-slate-900 line-clamp-1">{product.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                  <div className="mt-3">
                    {product.discountPercentage && product.discountPercentage > 0 ? (
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-rose-600">{formatCurrency(calculateDiscountPrice(product.price, product.discountPercentage))}</p>
                        <p className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</p>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
