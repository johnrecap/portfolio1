import React from 'react';
import { useTranslation } from "react-i18next";
import { useClinicStore } from '@/store/clinicStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Patient } from '@/store/types';

export const PatientForm: React.FC<{ onClose: () => void, patientToEdit?: Patient }> = ({ onClose, patientToEdit }) => {
  const { t } = useTranslation();
  const addPatient = useClinicStore((state) => state.addPatient);
  const updatePatient = useClinicStore((state) => state.updatePatient);
  
  const [formData, setFormData] = React.useState({
    name: patientToEdit?.name || '',
    age: patientToEdit?.age?.toString() || '',
    gender: patientToEdit?.gender || 'other' as 'male' | 'female' | 'other',
    phone: patientToEdit?.phone || '',
    email: patientToEdit?.email || '',
    address: patientToEdit?.address || '',
    status: patientToEdit?.status || 'new',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientToEdit) {
      updatePatient(patientToEdit.id, {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        status: formData.status as any,
      });
    } else {
      addPatient({
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        status: formData.status as any,
        lastVisit: 'Today',
      });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('forms.fullName')}</label>
        <Input 
          required 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Jane Doe"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.age')}</label>
          <Input 
            required 
            type="number" 
            min="0"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.gender')}</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="male">{t('forms.male')}</option>
            <option value="female">{t('forms.female')}</option>
            <option value="other">{t('forms.other')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.phone')}</label>
          <Input 
            required 
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 234 567 890"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.email')}</label>
          <Input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t('forms.address')}</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="flex min-h-[80px] w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="123 Main St..."
        />
      </div>

      {patientToEdit && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('table.status')}</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="new">{t('new')}</option>
            <option value="stable">{t('stable')}</option>
            <option value="followUp">{t('followUp')}</option>
            <option value="inactive">{t('inactive')}</option>
          </select>
        </div>
      )}

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>{t('forms.cancel')}</Button>
        <Button type="submit">{patientToEdit ? t('forms.saveChanges') : t('forms.addPatientBtn')}</Button>
      </div>
    </form>
  );
}
