import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store';
import { formatCurrency, calculateDiscountPrice } from '../../lib/utils';
import { Badge } from 'lucide-react'; 

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const products = useStore((state) => state.products);
  
  const filteredProducts = useMemo(() => {
    if (!categoryFilter) return products;
    return products.filter(p => p.category === categoryFilter);
  }, [products, categoryFilter]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    const list = ['Electronics', 'Clothing', 'Home', 'Accessories'];
    cats.forEach(c => {
      if (!list.includes(c)) list.push(c);
    });
    return ['All', ...list];
  }, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-6xl font-extrabold leading-[0.9] tracking-tighter text-slate-900">
            {categoryFilter || 'All Products'}
          </h1>
          <p className="mt-2 text-slate-500">
            Showing {filteredProducts.length} results
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                if (category === 'All') {
                  searchParams.delete('category');
                } else {
                  searchParams.set('category', category);
                }
                setSearchParams(searchParams);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                (category === 'All' && !categoryFilter) || category === categoryFilter
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-slate-500 text-lg">No products found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="group relative block overflow-hidden rounded-[24px] bg-white transition-all hover:shadow-lg border border-slate-100">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Only {product.stock} left
                  </div>
                )}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discountPercentage}% OFF
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 line-clamp-1">{product.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {product.discountPercentage && product.discountPercentage > 0 ? (
                      <>
                        <p className="text-lg font-bold text-rose-600">{formatCurrency(calculateDiscountPrice(product.price, product.discountPercentage))}</p>
                        <p className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
