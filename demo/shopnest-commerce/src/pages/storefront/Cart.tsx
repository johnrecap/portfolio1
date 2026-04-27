import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../store';
import { formatCurrency, calculateDiscountPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

export function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, taxSettings } = useStore();

  const subtotal = cart.reduce((sum, item) => {
    const price = calculateDiscountPrice(item.product.price, item.product.discountPercentage);
    return sum + price * item.quantity;
  }, 0);
  const tax = taxSettings.enabled ? subtotal * (taxSettings.rate / 100) : 0;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tighter">Your cart is empty</h2>
        <p className="mt-4 text-slate-500 text-lg max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Let's get you started!
        </p>
        <Button onClick={() => navigate('/products')} className="mt-8">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-extrabold leading-[0.9] tracking-tighter tracking-tighter text-slate-900 mb-8 border-b border-slate-200 pb-4">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
        <div className="lg:col-span-8">
          <ul className="-my-6 divide-y divide-slate-200 border-t border-b border-slate-200">
            {cart.map((item) => (
              <li key={item.product.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-slate-900">
                      <h3 className="line-clamp-2 pr-4">{item.product.name}</h3>
                      <div className="ml-4 text-right">
                        {item.product.discountPercentage && item.product.discountPercentage > 0 ? (
                          <>
                            <p className="text-rose-600 font-bold">{formatCurrency(calculateDiscountPrice(item.product.price, item.product.discountPercentage))}</p>
                            <p className="text-xs text-slate-400 line-through">{formatCurrency(item.product.price)}</p>
                          </>
                        ) : (
                          <p>{formatCurrency(item.product.price)}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.product.category}</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center gap-2 mt-4">
                      <label htmlFor={`quantity-${item.product.id}`} className="font-medium text-slate-700">Qty</label>
                      <select
                        id={`quantity-${item.product.id}`}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                        className="rounded-xl border border-slate-300 py-1.5 px-3 text-base font-medium text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-medium text-slate-900 mb-6">Order Summary</h2>
            
            <div className="flow-root">
              <dl className="-my-4 divide-y divide-slate-100 text-sm">
                <div className="flex items-center justify-between py-4">
                  <dt className="text-slate-600">Subtotal</dt>
                  <dd className="font-medium text-slate-900">{formatCurrency(subtotal)}</dd>
                </div>
                {taxSettings.enabled && (
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-slate-600">Tax estimate ({taxSettings.rate}%)</dt>
                    <dd className="font-medium text-slate-900">{formatCurrency(tax)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between py-4">
                  <dt className="text-base font-bold text-slate-900">Total</dt>
                  <dd className="text-base font-bold text-slate-900">{formatCurrency(total)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 space-y-4">
              <Button size="lg" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
