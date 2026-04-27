import { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2, Search, X, Upload } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Category } from '../../types';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description is too short'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  customCategory: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  discountPercentage: z.coerce.number().int().min(0).max(100).optional(),
}).refine(data => {
  if (data.category === 'new') {
    return !!data.customCategory && data.customCategory.trim().length > 0;
  }
  return true;
}, {
  message: "New category name is required",
  path: ["customCategory"]
});

type ProductFormValues = z.infer<typeof productSchema>;
type ProductFormInput = z.input<typeof productSchema>;

export function ProductsAdmin() {
  const { products, deleteProduct, addProduct, updateProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80');

  const categoriesList = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    const list = ['Electronics', 'Clothing', 'Home', 'Accessories'];
    cats.forEach(c => {
      if (!list.includes(c)) list.push(c);
    });
    return list;
  }, [products]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: 'Electronics',
      stock: 0,
      price: 0,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    }
  });

  const selectedCategory = watch('category');

  const onSubmit = (data: ProductFormValues) => {
    const finalCategory = data.category === 'new' ? (data.customCategory as string) : data.category;
    const { customCategory, ...rest } = data;
    
    if (editingProductId) {
      updateProduct(editingProductId, {
        ...rest,
        category: finalCategory,
      });
    } else {
      addProduct({
        ...rest,
        category: finalCategory,
        rating: 0, // Default rating for new product
        reviews: 0, // Default reviews
      });
    }
    closeModal();
  };

  const openAddModal = () => {
    setEditingProductId(null);
    reset({
      category: 'Electronics',
      customCategory: '',
      stock: 0,
      price: 0,
      discountPercentage: 0,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    });
    setPreviewImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProductId(product.id);
    const categoryExists = categoriesList.includes(product.category);
    
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      category: categoryExists ? product.category : 'new',
      customCategory: categoryExists ? '' : product.category,
      discountPercentage: product.discountPercentage || 0,
    });
    setPreviewImage(product.image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    reset({
      category: 'Electronics',
      customCategory: '',
      stock: 0,
      price: 0,
      discountPercentage: 0,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    });
    setPreviewImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue('image', base64String, { shouldValidate: true });
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-slate-900">Products</h2>
          <p className="text-slate-500 mt-1">Manage your store's product inventory.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[20px] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Product</th>
                <th scope="col" className="px-6 py-3 font-medium">Category</th>
                <th scope="col" className="px-6 py-3 font-medium">Price</th>
                <th scope="col" className="px-6 py-3 font-medium">Discount</th>
                <th scope="col" className="px-6 py-3 font-medium">Stock</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="h-10 w-10 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <div className="font-medium text-slate-900">{product.name}</div>
                        <div className="text-xs text-slate-400">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    {product.discountPercentage ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {product.discountPercentage}%
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 20 ? 'bg-green-100 text-green-800' :
                      product.stock > 0 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500 hover:text-red-600"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No products found matching "{searchTerm}"
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
              <h3 className="text-xl font-bold tracking-tight text-slate-900">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <Input {...register('name')} error={!!errors.name} placeholder="e.g. Wireless Mouse" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  {...register('category')}
                  className={`flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="new">+ Add New Category</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}

                {selectedCategory === 'new' && (
                  <div className="mt-2">
                    <Input {...register('customCategory')} error={!!errors.customCategory} placeholder="Enter new category name" />
                    {errors.customCategory && <p className="mt-1 text-sm text-red-600">{errors.customCategory.message}</p>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                  <Input type="number" step="0.01" {...register('price')} error={!!errors.price} />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Discount (%)</label>
                  <Input type="number" {...register('discountPercentage')} error={!!errors.discountPercentage} defaultValue={0} />
                  {errors.discountPercentage && <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <Input type="number" {...register('stock')} error={!!errors.stock} />
                  {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-4">
                    {previewImage ? (
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-20 w-20 shrink-0 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                        <Upload className="h-6 w-6" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col gap-2">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border file:border-slate-200 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-50 cursor-pointer h-10 pt-1.5"
                      />
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-xs text-slate-500">
                          URL:
                        </div>
                        <Input 
                          {...register('image')} 
                          className="pl-10"
                          error={!!errors.image} 
                          placeholder="Paste image URL here..." 
                          onChange={(e) => {
                            register('image').onChange(e);
                            setPreviewImage(e.target.value);
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                  {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className={`flex w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter product description here..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProductId ? 'Save Changes' : 'Save Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
