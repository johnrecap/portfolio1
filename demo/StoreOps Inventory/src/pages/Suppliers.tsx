import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '../store/inventoryStore';
import { Supplier } from '../types/inventory';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { Select } from '../components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateId } from '../utils/ids';

const supplierSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  phone: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  city: z.string().min(2, 'City is required'),
  status: z.enum(['active', 'preferred', 'paused']),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export function Suppliers() {
  const { t } = useTranslation();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingSupplier(null);
    reset({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      city: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    reset({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email || '',
      city: supplier.city,
      status: supplier.status,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: SupplierFormData) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, data);
    } else {
      addSupplier({
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setIsModalOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'preferred': return 'primary';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <h1 className="text-2xl font-bold text-on-surface">{t('suppliers.allSuppliers')}</h1>
        <Button onClick={openAddModal} leftIcon={<Plus className="h-4 w-4" />}>
          {t('suppliers.addSupplier')}
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
                <TableHead>{t('suppliers.supplierName')}</TableHead>
                <TableHead>{t('suppliers.contactPerson')}</TableHead>
                <TableHead>{t('suppliers.phone')} / {t('suppliers.email')}</TableHead>
                <TableHead>{t('suppliers.city')}</TableHead>
                <TableHead>{t('orders.status')}</TableHead>
                <TableHead className="text-right">{t('products.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>
                    <div>{supplier.phone}</div>
                    {supplier.email && <div className="text-sm text-on-surface-variant">{supplier.email}</div>}
                  </TableCell>
                  <TableCell>{supplier.city}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(supplier.status)}>
                      {t(`suppliers.${supplier.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(supplier)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSupplier(supplier.id)}>
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-on-surface-variant">
                    No suppliers found.
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
        title={editingSupplier ? t('suppliers.editSupplier') : t('suppliers.addSupplier')}
        description="Fill in the details for the supplier. All fields marked with * are required."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label={`${t('suppliers.supplierName')} *`} error={errors.name?.message}>
            <Input {...register('name')} placeholder="e.g. Tech Distributors" />
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label={`${t('suppliers.contactPerson')} *`} error={errors.contactPerson?.message}>
              <Input {...register('contactPerson')} placeholder="e.g. Ahmed Hassan" />
            </FormField>
            <FormField label={`${t('suppliers.city')} *`} error={errors.city?.message}>
              <Input {...register('city')} placeholder="e.g. Cairo" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label={`${t('suppliers.phone')} *`} error={errors.phone?.message}>
              <Input {...register('phone')} placeholder="e.g. 01011112222" />
            </FormField>
            <FormField label={t('suppliers.email')} error={errors.email?.message}>
              <Input type="email" {...register('email')} placeholder="e.g. contact@techdist.com" />
            </FormField>
          </div>

          <FormField label={`${t('orders.status')} *`} error={errors.status?.message}>
            <Select 
              {...register('status')}
              options={[
                { label: t('suppliers.active'), value: 'active' },
                { label: t('suppliers.preferred'), value: 'preferred' },
                { label: t('suppliers.paused'), value: 'paused' },
              ]}
            />
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
