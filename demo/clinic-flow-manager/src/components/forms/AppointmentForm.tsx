import React from 'react';
import { useTranslation } from "react-i18next";
import { useClinicStore } from '@/store/clinicStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AppointmentForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const addAppointment = useClinicStore((state) => state.addAppointment);
  const doctors = useClinicStore((state) => state.doctors);
  const patients = useClinicStore((state) => state.patients);

  const [formData, setFormData] = React.useState({
    patientId: '',
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientName = patients.find((p) => p.id === formData.patientId)?.name || formData.patientId;
    const doctor = doctors.find((d) => d.id === formData.doctorId);
    const doctorName = doctor?.name || formData.doctorId;
    const specialty = doctor?.specialty || 'General Practice';

    addAppointment({
      patientId: formData.patientId,
      patientName,
      doctorId: formData.doctorId,
      doctorName,
      specialty,
      date: formData.date,
      time: formData.time,
      status: 'pending',
      fee: 0,
      notes: formData.notes,
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
        <label className="text-sm font-medium">{t('forms.doctor')}</label>
        <select
          required
          value={formData.doctorId}
          onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
          className="flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">{t('forms.selectDoctor')}</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.date')}</label>
          <Input 
            required 
            type="date" 
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('forms.time')}</label>
          <Input 
            required 
            type="time" 
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t('forms.notes')}</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="flex min-h-[80px] w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={t('forms.reasonForVisit')}
        />
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>{t('forms.cancel')}</Button>
        <Button type="submit">{t('forms.scheduleAppt')}</Button>
      </div>
    </form>
  );
}
