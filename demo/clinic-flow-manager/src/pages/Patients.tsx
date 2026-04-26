import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useClinicStore } from "@/store/clinicStore";
import { Patient } from "@/store/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Drawer } from "@/components/ui/Drawer";
import { PatientForm } from "@/components/forms/PatientForm";
import { Plus, Search, MapPin, Phone } from "lucide-react";

export default function Patients() {
  const { t } = useTranslation();
  const patients = useClinicStore((s) => s.patients);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | undefined>(undefined);

  const openAddDrawer = () => {
    setPatientToEdit(undefined);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsDrawerOpen(true);
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.phone.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('patients')}</h2>
          <p className="text-on-surface-variant">{t('managePatients')}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-outline" />
              <Input 
                placeholder={t('searchPatients')} 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
          <Button className="shrink-0 gap-2" onClick={openAddDrawer}>
            <Plus className="w-4 h-4" />
            {t('addPatient')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map(patient => (
          <Card key={patient.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => openEditDrawer(patient)}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-lg">{patient.name}</h3>
                  <p className="text-sm text-on-surface-variant">{patient.age} {t('yearsOld')}</p>
                </div>
                <Badge variant={
                  patient.status === 'new' ? 'success' : 
                  patient.status === 'stable' ? 'default' :
                  patient.status === 'followUp' ? 'warning' : 'secondary'
                }>
                  {t(patient.status)}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-outline" />
                  {patient.phone}
                </div>
                {patient.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-outline" />
                    {patient.address}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between text-sm">
                <div>
                  <span className="block text-xs text-outline">{t('lastVisit')}</span>
                  <span className="font-medium text-on-surface">{patient.lastVisit}</span>
                </div>
                {patient.nextAppointment && (
                  <div className="text-right">
                    <span className="block text-xs text-outline">{t('nextAppt')}</span>
                    <span className="font-medium text-primary">{patient.nextAppointment}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={patientToEdit ? t('forms.editPatient') : t('addPatient')}>
        <PatientForm key={patientToEdit?.id || 'new'} onClose={() => setIsDrawerOpen(false)} patientToEdit={patientToEdit} />
      </Drawer>
    </div>
  );
}
