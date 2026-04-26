import React from 'react';
import { useTranslation } from "react-i18next";
import { useClinicStore } from '@/store/clinicStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Doctor } from '@/store/types';

export const DoctorForm: React.FC<{ onClose: () => void, doctorToEdit?: Doctor }> = ({ onClose, doctorToEdit }) => {
  const { t } = useTranslation();
  const addDoctor = useClinicStore((state) => state.addDoctor);
  const updateDoctor = useClinicStore((state) => state.updateDoctor);

  const [formData, setFormData] = React.useState({
    name: doctorToEdit?.name || '',
    specialty: doctorToEdit?.specialty || '',
    status: doctorToEdit?.status || 'available',
    availableFrom: doctorToEdit?.availableFrom || '',
    availableTo: doctorToEdit?.availableTo || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctorToEdit) {
      updateDoctor(doctorToEdit.id, {
        name: formData.name,
        specialty: formData.specialty,
        status: formData.status as any,
        availableFrom: formData.availableFrom,
        availableTo: formData.availableTo,
      });
    } else {
      addDoctor({
        name: formData.name,
        specialty: formData.specialty,
        status: formData.status as any,
        appointmentsToday: 0,
        visitsThisMonth: 0,
        availableFrom: formData.availableFrom,
        availableTo: formData.availableTo,
      });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('forms.doctorName')}</label>
        <Input 
          required 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Dr. John Smith"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t('forms.specialty')}</label>
        <Input 
          required 
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
          placeholder="e.g. Cardiologist"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t('table.status')}</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="available">{t('available')}</option>
          <option value="busy">{t('busy')}</option>
          <option value="off">{t('offDuty')}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.availableFrom')}</label>
          <Input 
            type="time" 
            value={formData.availableFrom}
            onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.availableTo')}</label>
          <Input 
            type="time" 
            value={formData.availableTo}
            onChange={(e) => setFormData({ ...formData, availableTo: e.target.value })}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>{t('forms.cancel')}</Button>
        <Button type="submit">{doctorToEdit ? t('forms.saveChanges') : t('addDoctorBtn')}</Button>
      </div>
    </form>
  );
}
