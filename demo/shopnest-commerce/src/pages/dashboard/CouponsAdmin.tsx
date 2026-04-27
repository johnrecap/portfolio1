import { useState } from 'react';
import { useStore } from '../../store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Edit2, Ticket, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Coupon } from '../../types';

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  discountPercentage: z.coerce.number().min(1, 'Min 1%').max(100, 'Max 100%'),
  active: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponSchema>;
type CouponFormInput = z.input<typeof couponSchema>;

export function CouponsAdmin() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CouponFormInput, unknown, CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      active: true,
      discountPercentage: 10,
    }
  });

  const onSubmit = (data: CouponFormValues) => {
    if (editingCode) {
      updateCoupon(editingCode, data);
    } else {
      // Check if code exists
      if (coupons.some(c => c.code.toUpperCase() === data.code.toUpperCase())) {
        alert('This coupon code already exists!');
        return;
      }
      addCoupon(data);
    }
    closeModal();
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCode(coupon.code);
    reset({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      active: coupon.active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCode(null);
    reset({
      code: '',
      discountPercentage: 10,
      active: true,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-slate-900">Promo Codes</h2>
          <p className="text-slate-500 mt-1">Manage global discount coupons for your store.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700 font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Code</th>
                <th scope="col" className="px-6 py-3 font-medium">Discount</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-emerald-500" />
                      <span className="font-bold text-slate-900 font-mono tracking-wider">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {coupon.discountPercentage}% OFF
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      coupon.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(coupon)}
                        className="p-2 text-slate-400 hover:text-emerald-600 transition-colors bg-white rounded-lg border border-slate-200 hover:border-emerald-200 shadow-sm"
                        title="Edit Coupon"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this coupon?')) {
                            deleteCoupon(coupon.code);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white rounded-lg border border-slate-200 hover:border-red-200 shadow-sm"
                        title="Delete Coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No promo codes found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                {editingCode ? 'Edit Coupon' : 'Add New Coupon'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-500 transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code (e.g. SUMMER10)</label>
                <Input 
                  {...register('code')} 
                  error={!!errors.code} 
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    register('code').onChange(e);
                  }}
                  disabled={!!editingCode}
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
                {editingCode && <p className="mt-1 text-xs text-slate-500">Code cannot be changed during edit.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Discount Percentage (%)</label>
                <Input type="number" {...register('discountPercentage')} error={!!errors.discountPercentage} />
                {errors.discountPercentage && <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="active"
                  {...register('active')}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-slate-700">
                  Coupon is active
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCode ? 'Save Changes' : 'Create Coupon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
