import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '../store/inventoryStore';
import { SalesOrder } from '../types/inventory';
import { formatCurrency } from '../utils/formatters';
import { formatDate } from '../utils/dates';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { Select } from '../components/ui/Select';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateId } from '../utils/ids';

const statusSchema = z.object({
  status: z.enum(['draft', 'confirmed', 'fulfilled', 'cancelled'])
});
type StatusFormData = z.infer<typeof statusSchema>;

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1')
  })).min(1, 'At least one item is required')
});
type CreateOrderFormData = z.infer<typeof createOrderSchema>;

export function Orders() {
  const { t } = useTranslation();
  const { salesOrders, products, createSalesOrder, updateSalesOrderStatus, settings } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { register: registerStatus, handleSubmit: handleStatusSubmit, reset: resetStatus } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
  });

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { items: [{ productId: '', quantity: 1 }] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchItems = watch("items");

  const filteredOrders = salesOrders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openStatusModal = (order: SalesOrder) => {
    setEditingOrder(order);
    resetStatus({
      status: order.status
    });
    setIsStatusModalOpen(true);
  };

  const onStatusSubmit = (data: StatusFormData) => {
    if (editingOrder) {
      updateSalesOrderStatus(editingOrder.id, data.status);
    }
    setIsStatusModalOpen(false);
  };

  const openCreateModal = () => {
    reset({ customerName: '', items: [{ productId: '', quantity: 1 }] });
    setIsCreateModalOpen(true);
  };

  const onCreateSubmit = (data: CreateOrderFormData) => {
    const orderItems = data.items.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: p ? p.sellingPrice : 0,
        totalPrice: p ? (p.sellingPrice * item.quantity) : 0
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);

    const estimatedProfit = orderItems.reduce((sum, item) => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        return sum + ((item.unitPrice - p.unitCost) * item.quantity);
      }
      return sum;
    }, 0);

    createSalesOrder({
      id: generateId(),
      orderNumber: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      customerName: data.customerName,
      status: 'draft',
      items: orderItems,
      subtotal,
      tax: 0,
      total: subtotal,
      estimatedProfit,
      stockApplied: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setIsCreateModalOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'confirmed': return 'primary';
      case 'fulfilled': return 'success';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const calculateTotal = () => {
    return watchItems.reduce((sum, item) => {
      const p = products.find(prod => prod.id === item.productId);
      return sum + ((p?.sellingPrice || 0) * (item.quantity || 0));
    }, 0);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <h1 className="text-2xl font-bold text-on-surface">{t('orders.allOrders')}</h1>
        <Button onClick={openCreateModal} leftIcon={<Plus className="h-4 w-4" />}>
          {t('orders.createOrder')}
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
                <TableHead>{t('orders.orderNumber')}</TableHead>
                <TableHead>{t('orders.date')}</TableHead>
                <TableHead>{t('orders.customer')}</TableHead>
                <TableHead className="text-right">{t('orders.items')}</TableHead>
                <TableHead className="text-right">{t('orders.total')}</TableHead>
                <TableHead>{t('orders.status')}</TableHead>
                <TableHead className="text-right">{t('orders.manageStatus')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-primary">{order.orderNumber}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(order.createdAt, settings.language)}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="text-right">{order.items.reduce((s, i) => s + i.quantity, 0)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.subtotal)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {t(`orders.${order.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm" onClick={() => openStatusModal(order)}>
                      {t('orders.changeStatus')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-on-surface-variant">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={t('orders.updateStatus')}
        description={t('orders.updateStatusDesc').replace('{{orderNumber}}', editingOrder?.orderNumber || '')}
      >
        <form onSubmit={handleStatusSubmit(onStatusSubmit)} className="space-y-4">
          <FormField label={t('orders.status')}>
            <Select 
              {...registerStatus('status')}
              options={[
                { label: t('orders.draft'), value: 'draft' },
                { label: t('orders.confirmed'), value: 'confirmed' },
                { label: t('orders.fulfilled'), value: 'fulfilled' },
                { label: t('orders.cancelled'), value: 'cancelled' },
              ]}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <Button type="button" variant="ghost" onClick={() => setIsStatusModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('orders.createOrder')}
        description={t('orders.addOrderDesc')}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
          <FormField label={t('orders.customer')} error={errors.customerName?.message}>
            <Input {...register('customerName')} placeholder="Customer Name" />
          </FormField>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-on-surface">{t('orders.items')}</label>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: '', quantity: 1 })}>
                <Plus className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {t('orders.addLineItem')}
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormField label="" error={errors.items?.[index]?.productId?.message}>
                    <Select 
                      {...register(`items.${index}.productId` as const)}
                      options={[
                        { label: t('orders.selectProduct'), value: '' },
                        ...products.map(p => ({ label: `${p.name} - ${formatCurrency(p.sellingPrice)}`, value: p.id }))
                      ]}
                    />
                  </FormField>
                </div>
                <div className="w-24">
                  <FormField label="" error={errors.items?.[index]?.quantity?.message}>
                    <Input type="number" min="1" {...register(`items.${index}.quantity` as const, { valueAsNumber: true })} />
                  </FormField>
                </div>
                <div className="pt-1">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-error" />
                  </Button>
                </div>
              </div>
            ))}
            {errors.items?.root?.message && (
              <p className="text-sm text-error">{errors.items.root.message}</p>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
            <span className="font-bold text-lg">{t('orders.total')}: {formatCurrency(calculateTotal())}</span>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('orders.createOrder')}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
