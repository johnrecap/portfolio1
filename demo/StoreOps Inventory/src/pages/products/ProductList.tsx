import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '../../store/inventoryStore';
import { Product } from '../../types/inventory';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Select } from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateId } from '../../utils/ids';
import { deriveProductStatus } from '../../utils/stock';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  sku: z.string().min(2, 'SKU is required'),
  categoryId: z.string().min(1, 'Category is required'),
  supplierId: z.string().min(1, 'Supplier is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  reorderLevel: z.number().min(0, 'Reorder level cannot be negative'),
  unitCost: z.number().min(0, 'Unit cost cannot be negative'),
  sellingPrice: z.number().min(0, 'Selling price cannot be negative'),
  unit: z.enum(['pcs', 'boxes', 'packs', 'rolls', 'bottles']),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductList() {
  const { t } = useTranslation();
  const { products, categories, suppliers, addProduct, updateProduct, deleteProduct } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    reset({
      name: '',
      sku: '',
      categoryId: '',
      supplierId: '',
      stock: 0,
      reorderLevel: 10,
      unitCost: 0,
      sellingPrice: 0,
      unit: 'pcs',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      supplierId: product.supplierId,
      stock: product.stock,
      reorderLevel: product.reorderLevel,
      unitCost: product.unitCost,
      sellingPrice: product.sellingPrice,
      unit: product.unit as any,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: ProductFormData) => {
    const categoryName = categories.find(c => c.id === data.categoryId)?.name || '';
    const supplierName = suppliers.find(s => s.id === data.supplierId)?.name || '';
    
    // Explicitly casting the status to the specific union type it expects
    const status = deriveProductStatus(data.stock, data.reorderLevel, editingProduct?.status || 'inStock') as 'inStock' | 'lowStock' | 'outOfStock' | 'discontinued';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...data,
        categoryName,
        supplierName,
        status,
      });
    } else {
      addProduct({
        ...data,
        id: generateId(),
        categoryName,
        supplierName,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setIsModalOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'inStock': return 'success';
      case 'lowStock': return 'warning';
      case 'outOfStock': return 'danger';
      case 'discontinued': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <h1 className="text-2xl font-bold text-on-surface">{t('products.allProducts')}</h1>
        <Button onClick={openAddModal} leftIcon={<Plus className="h-4 w-4" />}>
          {t('products.addProduct')}
        </Button>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="w-full max-w-sm">
          <Input 
            placeholder={t('app.search')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="sticky top-0 bg-surface-container z-10 shadow-sm">
              <TableRow>
                <TableHead>{t('products.sku')}</TableHead>
                <TableHead>{t('products.name')}</TableHead>
                <TableHead>{t('products.category')}</TableHead>
                <TableHead className="text-right">{t('products.stock')}</TableHead>
                <TableHead className="text-right">{t('products.price')}</TableHead>
                <TableHead>{t('products.status')}</TableHead>
                <TableHead className="text-right">{t('products.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell className="text-right">{product.stock} {product.unit}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.sellingPrice)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(product.status)}>
                      {t(`products.${product.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-on-surface-variant">
                    {t('products.noProductsFound')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? t('products.editProduct') : t('products.addProduct')}
        description="Fill in the details for the product. All fields marked with * are required."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Product Name *" error={errors.name?.message}>
              <Input {...register('name')} placeholder="e.g. Wireless Mouse" />
            </FormField>
            <FormField label="SKU *" error={errors.sku?.message}>
              <Input {...register('sku')} placeholder="e.g. WM-001" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category *" error={errors.categoryId?.message}>
              <Select 
                {...register('categoryId')}
                options={[
                  { label: 'Select Category', value: '' },
                  ...categories.map(c => ({ label: c.name, value: c.id }))
                ]}
              />
            </FormField>
            <FormField label="Supplier *" error={errors.supplierId?.message}>
              <Select 
                {...register('supplierId')}
                options={[
                  { label: 'Select Supplier', value: '' },
                  ...suppliers.map(s => ({ label: s.name, value: s.id }))
                ]}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Current Stock *" error={errors.stock?.message}>
              <Input type="number" {...register('stock', { valueAsNumber: true })} />
            </FormField>
            <FormField label="Reorder Level *" error={errors.reorderLevel?.message}>
              <Input type="number" {...register('reorderLevel', { valueAsNumber: true })} />
            </FormField>
            <FormField label="Unit *" error={errors.unit?.message}>
              <Select 
                {...register('unit')}
                options={[
                  { label: 'Pieces (pcs)', value: 'pcs' },
                  { label: 'Boxes', value: 'boxes' },
                  { label: 'Packs', value: 'packs' },
                  { label: 'Rolls', value: 'rolls' },
                  { label: 'Bottles', value: 'bottles' },
                ]}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Unit Cost *" error={errors.unitCost?.message}>
              <Input type="number" step="0.01" {...register('unitCost', { valueAsNumber: true })} />
            </FormField>
            <FormField label="Selling Price *" error={errors.sellingPrice?.message}>
              <Input type="number" step="0.01" {...register('sellingPrice', { valueAsNumber: true })} />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
