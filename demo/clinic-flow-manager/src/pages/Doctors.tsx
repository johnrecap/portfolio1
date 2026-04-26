import React from "react";
import { useTranslation } from "react-i18next";
import { useClinicStore } from "@/store/clinicStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { DoctorForm } from "@/components/forms/DoctorForm";
import { Stethoscope, Clock, Users, Plus, Edit2 } from "lucide-react";
import { Doctor } from "@/store/types";

export default function Doctors() {
  const { t } = useTranslation();
  const doctors = useClinicStore((s) => s.doctors);
  const updateDoctorStatus = useClinicStore((s) => s.updateDoctorStatus);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [doctorToEdit, setDoctorToEdit] = React.useState<Doctor | undefined>();

  const openEditDrawer = (doctor: Doctor) => {
    setDoctorToEdit(doctor);
    setIsDrawerOpen(true);
  };

  const openAddDrawer = () => {
    setDoctorToEdit(undefined);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('doctors')}</h2>
          <p className="text-on-surface-variant">{t('manageDoctors')}</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={openAddDrawer}>
          <Plus className="w-4 h-4" />
          {t('addDoctorBtn')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map(doctor => (
          <Card key={doctor.id} className="relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-1 h-full ${
               doctor.status === 'available' ? 'bg-green-500' :
               doctor.status === 'busy' ? 'bg-error' : 'bg-outline'
             }`} />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-sm text-primary">{doctor.specialty}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEditDrawer(doctor)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>

              {(doctor.availableFrom || doctor.availableTo) && (
                <div className="mb-2 text-sm text-on-surface-variant font-medium">
                  {t('hours')} {doctor.availableFrom || t('na')} - {doctor.availableTo || t('na')}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">{t('today')}</span>
                  </div>
                  <div className="text-xl font-bold">{doctor.appointmentsToday}</div>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">{t('thisMonth')}</span>
                  </div>
                  <div className="text-xl font-bold">{doctor.visitsThisMonth}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline-variant flex items-center justify-between">
                  <select 
                    value={doctor.status}
                    onChange={(e) => updateDoctorStatus(doctor.id, e.target.value as any)}
                    className={`text-xs font-semibold px-2 py-1 rounded-full outline-none border-r-4 border-transparent ${
                      doctor.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      doctor.status === 'busy' ? 'bg-error text-on-error' : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    <option value="available">{t('available')}</option>
                    <option value="busy">{t('busy')}</option>
                    <option value="off">{t('offDuty')}</option>
                  </select>
                  {doctor.nextAppointmentTime && (
                    <span className="text-sm text-on-surface-variant">
                      {t('next')} {doctor.nextAppointmentTime}
                    </span>
                  )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={doctorToEdit ? t('forms.editDoctor') : t('addDoctorBtn')}>
        <DoctorForm key={doctorToEdit?.id || 'new'} onClose={() => setIsDrawerOpen(false)} doctorToEdit={doctorToEdit} />
      </Drawer>
    </div>
  );
}
