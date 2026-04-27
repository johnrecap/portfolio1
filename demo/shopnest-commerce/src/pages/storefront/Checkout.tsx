import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, CreditCard, Store } from 'lucide-react';
import { useStore } from '../../store';
import { formatCurrency, calculateDiscountPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Delivery address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP Code is required'),
  cardNumber: z.string().min(16, 'Invalid card number').max(19),
  expDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Format MM/YY'),
  cvc: z.string().min(3, 'Invalid CVC').max(4),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function Checkout() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  
  const { cart, coupons, placeOrder, taxSettings } = useStore();

  const subtotal = cart.reduce((sum, item) => {
    const price = calculateDiscountPrice(item.product.price, item.product.discountPercentage);
    return sum + price * item.quantity;
  }, 0);
  const discountAmount = subtotal * (discount / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = taxSettings.enabled ? subtotalAfterDiscount * (taxSettings.rate / 100) : 0;
  const total = subtotalAfterDiscount + tax;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema)
  });

  const onSubmit = (data: CheckoutFormValues) => {
    placeOrder({
      customerName: `${data.firstName} ${data.lastName}`,
      customerEmail: data.email,
      shippingAddress: `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
    }, discount);
    
    setIsSuccess(true);
  };

  const applyCoupon = () => {
    setCouponError('');
    const coupon = coupons.find(c => c.code === couponInput.toUpperCase());
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }
    if (!coupon.active) {
      setCouponError('This coupon is expired');
      return;
    }
    setDiscount(coupon.discountPercentage);
    setCouponError('');
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="text-6xl font-extrabold leading-[0.9] text-slate-900 tracking-tighter">Order Confirmed!</h1>
        <p className="mt-4 text-xl text-slate-500">
          Thank you for your order. We've received it and will start processing it shortly.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
          <Button variant="outline" asChild>
            <a href="/demos/shopnest-commerce/dashboard/orders">View on Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
        <Button onClick={() => navigate('/products')} className="mt-4">Back to products</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-extrabold leading-[0.9] tracking-tighter tracking-tighter text-slate-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm">
              <h2 className="text-lg font-medium text-slate-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <Input {...register('firstName')} error={!!errors.firstName} />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <Input {...register('lastName')} error={!!errors.lastName} />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <Input type="email" {...register('email')} error={!!errors.email} />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm">
              <h2 className="text-lg font-medium text-slate-900 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                  <Input {...register('address')} error={!!errors.address} />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <Input {...register('city')} error={!!errors.city} />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">State / Province</label>
                  <Input {...register('state')} error={!!errors.state} />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">ZIP / Postal</label>
                  <Input {...register('zip')} error={!!errors.zip} />
                  {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip.message}</p>}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm">
              <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-slate-400" />
                Payment Details
              </h2>
              <p className="text-sm text-amber-600 mb-4 font-medium flex items-center">
                <Store className="h-4 w-4 mr-1" />
                Demo Site: Any number will pass validation structurally.
              </p>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                  <Input placeholder="0000 0000 0000 0000" {...register('cardNumber')} error={!!errors.cardNumber} />
                  {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiration</label>
                  <Input placeholder="MM/YY" {...register('expDate')} error={!!errors.expDate} />
                  {errors.expDate && <p className="mt-1 text-sm text-red-600">{errors.expDate.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                  <Input placeholder="123" {...register('cvc')} error={!!errors.cvc} />
                  {errors.cvc && <p className="mt-1 text-sm text-red-600">{errors.cvc.message}</p>}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Order Summary</h2>
            
            <ul className="divide-y divide-slate-200 border-b border-slate-200 mb-4">
              {cart.map((item) => {
                const itemPrice = calculateDiscountPrice(item.product.price, item.product.discountPercentage);
                return (
                  <li key={item.product.id} className="py-4 flex gap-4">
                    <img src={item.product.image} alt="" className="h-16 w-16 rounded-xl object-cover border border-slate-100" />
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-medium text-slate-900 line-clamp-2">{item.product.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{formatCurrency(itemPrice * item.quantity)}</p>
                  </li>
                );
              })}
            </ul>

            <div className="py-4 border-b border-slate-200 mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Discount Code</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="EX: WELCOME10" 
                  value={couponInput} 
                  onChange={(e) => setCouponInput(e.target.value)} 
                />
                <Button type="button" onClick={applyCoupon} variant="secondary">Apply</Button>
              </div>
              {couponError && <p className="mt-1 text-sm text-red-600">{couponError}</p>}
              {discount > 0 && <p className="mt-1 text-sm text-green-600">Coupon applied! {discount}% off.</p>}
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <dt>Discount</dt>
                  <dd>-{formatCurrency(discountAmount)}</dd>
                </div>
              )}
              {taxSettings.enabled && (
                <div className="flex justify-between text-slate-600">
                  <dt>Tax ({taxSettings.rate}%)</dt>
                  <dd>{formatCurrency(tax)}</dd>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                <dt>Total</dt>
                <dd>{formatCurrency(total)}</dd>
              </div>
            </dl>

            <Button type="submit" form="checkout-form" size="lg" className="w-full mt-6">
              Confirm Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
