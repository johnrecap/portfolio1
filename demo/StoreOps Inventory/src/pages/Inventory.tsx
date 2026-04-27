import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '../store/inventoryStore';
import { formatDateTime } from '../utils/dates';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Search, Plus } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { Select } from '../components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const adjustmentSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  type: z.enum(['stockIn', 'stockOut', 'adjustment', 'return']),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().min(2, 'Reason is required'),
  note: z.string().optional(),
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

export function Inventory() {
  const { t } = useTranslation();
  const { products, inventoryMovements, applyInventoryAdjustment, settings } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
  });

  const filteredMovements = inventoryMovements.filter(m => 
    m.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    reset({
      productId: '',
      type: 'adjustment',
      quantity: 1,
      reason: '',
      note: ''
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: AdjustmentFormData) => {
    const product = products.find(p => p.id === data.productId);
    if (!product) return;

    let signedQuantity = data.quantity;
    if (data.type === 'stockOut') signedQuantity = -data.quantity;
    if (data.type === 'adjustment') {
      // For this simple demo, 'adjustment' means we are setting a relative diff, but let's assume UI sets the diff explicitly.
      // Wait, we can't easily sign it from UI without negative, so let's keep it positive/negative in logic if needed.
      // For simplicity, we'll allow negative quantities for adjustment? 
      // Zod schema doesn't allow negative currently. Let's assume adjustment can be stockIn/Out by sign if we change schema.
      // Actually, let's keep adjustment as positive for "adding stock" and users can use stockOut for reduction.
      // Or we can add a sign selector? Let's just use type to determine sign.
      // stockIn, return => +, stockOut => -. adjustment => + unless we change it. Let's make adjustment positive too.
    }

    applyInventoryAdjustment({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      type: data.type,
      quantity: data.quantity,
      signedQuantity: data.type === 'stockOut' ? -data.quantity : data.quantity,
      unit: product.unit,
      reason: data.reason,
      note: data.note
    });

    setIsModalOpen(false);
  };

  const getMovementTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'stockIn': return 'success';
      case 'stockOut': return 'danger';
      case 'return': return 'primary';
      case 'adjustment': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <h1 className="text-2xl font-bold text-on-surface">{t('inventory.movements')}</h1>
        <Button onClick={openAddModal} leftIcon={<Plus className="h-4 w-4" />}>
          {t('inventory.adjustStock')}
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
                <TableHead>{t('inventory.date')}</TableHead>
                <TableHead>{t('inventory.product')}</TableHead>
                <TableHead>{t('inventory.type')}</TableHead>
                <TableHead className="text-right">{t('inventory.quantity')}</TableHead>
                <TableHead>{t('inventory.reason')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDateTime(movement.createdAt, settings.language)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{movement.productName}</div>
                    <div className="text-xs text-on-surface-variant">{movement.sku}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getMovementTypeBadgeVariant(movement.type)}>
                      {t(`inventory.${movement.type}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={movement.signedQuantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {movement.signedQuantity > 0 ? '+' : ''}{movement.signedQuantity} {movement.unit}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>{movement.reason}</div>
                    {movement.note && <div className="text-xs text-on-surface-variant line-clamp-1" title={movement.note}>{movement.note}</div>}
                  </TableCell>
                </TableRow>
              ))}
              {filteredMovements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-on-surface-variant">
                    {t('inventory.noMovements')}
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
        title={t('inventory.adjustStock')}
        description={t('inventory.adjustStockDesc')}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label={`${t('inventory.product')} *`} error={errors.productId?.message}>
            <Select 
              {...register('productId')}
              options={[
                { label: t('inventory.selectProduct'), value: '' },
                ...products.map(p => ({ label: `${p.name} (${p.sku}) - ${t('products.stock')}: ${p.stock}`, value: p.id }))
              ]}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label={`${t('inventory.type')} *`} error={errors.type?.message}>
              <Select 
                {...register('type')}
                options={[
                  { label: t('inventory.stockIn'), value: 'stockIn' },
                  { label: t('inventory.stockOut'), value: 'stockOut' },
                  { label: t('inventory.adjustment'), value: 'adjustment' },
                  { label: t('inventory.return'), value: 'return' },
                ]}
              />
            </FormField>
            <FormField label={`${t('inventory.quantity')} *`} error={errors.quantity?.message}>
              <Input type="number" min="1" {...register('quantity', { valueAsNumber: true })} />
            </FormField>
          </div>

          <FormField label={`${t('inventory.reason')} *`} error={errors.reason?.message}>
            <Input {...register('reason')} placeholder="e.g. Audit correction" />
          </FormField>

          <FormField label={t('inventory.note')} error={errors.note?.message}>
            <Input {...register('note')} placeholder="Optional notes" />
          </FormField>

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
