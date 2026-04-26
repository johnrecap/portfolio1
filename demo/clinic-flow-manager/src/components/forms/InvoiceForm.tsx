import React from 'react';
import { useTranslation } from "react-i18next";
import { useClinicStore } from '@/store/clinicStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function InvoiceForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const createInvoice = useClinicStore((state) => state.createInvoice);
  const patients = useClinicStore((state) => state.patients);

  const [formData, setFormData] = React.useState({
    patientId: '',
    service: '',
    amount: '',
    issueDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientName = patients.find((p) => p.id === formData.patientId)?.name || formData.patientId;
    
    createInvoice({
      patientId: formData.patientId,
      patientName,
      service: formData.service,
      amount: parseFloat(formData.amount),
      amountPaid: 0,
      issueDate: formData.issueDate,
      status: 'unpaid',
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('forms.patient')}</label>
        <select
          required
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">{t('forms.selectPatient')}</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t('forms.serviceDesc')}</label>
        <Input 
          required 
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          placeholder="e.g. General Consultation"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.amount')}</label>
          <Input 
            required 
            type="number" 
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="150.00"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.issueDate')}</label>
          <Input 
            required 
            type="date" 
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>{t('forms.cancel')}</Button>
        <Button type="submit">{t('forms.createInvoiceBtn')}</Button>
      </div>
    </form>
  );
}
