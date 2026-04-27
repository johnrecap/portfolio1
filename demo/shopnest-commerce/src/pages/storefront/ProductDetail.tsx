import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store';
import { formatCurrency, calculateDiscountPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = useStore(state => state.products.find(p => p.id === id));
  const addToCart = useStore(state => state.addToCart);
  
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Product not found</h2>
        <Button onClick={() => navigate('/products')} className="mt-4">
          Back to products
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Images */}
        <div className="flex-1 w-full relative rounded-[24px] overflow-hidden bg-slate-100 border border-slate-100">
          {product.discountPercentage && product.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
              {product.discountPercentage}% OFF
            </div>
          )}
          <div className="aspect-square lg:aspect-auto lg:h-[600px] w-full">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col pt-4">
          <h1 className="text-6xl font-extrabold leading-[0.9] tracking-tighter text-slate-900">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <div className="flex items-center gap-3">
                <p className="text-2xl tracking-tighter text-rose-600 font-bold">
                  {formatCurrency(calculateDiscountPrice(product.price, product.discountPercentage))}
                </p>
                <p className="text-lg text-slate-400 line-through">
                  {formatCurrency(product.price)}
                </p>
              </div>
            ) : (
              <p className="text-2xl tracking-tighter text-slate-900 font-bold">
                {formatCurrency(product.price)}
              </p>
            )}
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center">
              <div className="flex items-center text-amber-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="ml-1 text-sm font-medium text-slate-900">{product.rating}</span>
              </div>
              <span className="ml-2 text-sm text-slate-500 hover:text-emerald-600 hover:underline cursor-pointer">
                See all {product.reviews} reviews
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <p className="text-base text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-8 flex flex-col gap-4">
            <Button size="lg" className="w-full text-lg" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            {product.stock > 0 ? (
              <p className="text-sm font-medium text-green-600 flex justify-center">
                In stock and ready to ship
              </p>
            ) : (
              <p className="text-sm font-medium text-red-600 flex justify-center">
                Out of stock
              </p>
            )}
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center text-slate-500">
              <Truck className="h-5 w-5 mr-3 shrink-0" />
              <span className="text-sm">Free shipping to mainland on orders over $100</span>
            </div>
            <div className="flex items-center text-slate-500">
              <ShieldCheck className="h-5 w-5 mr-3 shrink-0" />
              <span className="text-sm">1-year extended warranty included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
