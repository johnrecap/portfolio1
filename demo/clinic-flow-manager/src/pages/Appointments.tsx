import React from "react";
import { useTranslation } from "react-i18next";
import { useClinicStore } from "@/store/clinicStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Calendar, Plus, XCircle, CheckCircle2 } from "lucide-react";
import { AppointmentStatus } from "@/store/types";

export default function Appointments() {
  const { t } = useTranslation();
  const appointments = useClinicStore((s) => s.appointments);
  const cancelAppointment = useClinicStore((s) => s.cancelAppointment);
  const updateAppointment = useClinicStore((s) => s.updateAppointment);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  
  const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch(status) {
      case "confirmed": return "default";
      case "completed": return "success";
      case "cancelled": return "destructive";
      case "pending": return "warning";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('appointments')}</h2>
          <p className="text-on-surface-variant">{t('manageAppointments')}</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={() => setIsDrawerOpen(true)}>
          <Plus className="w-4 h-4" />
          {t('newAppointment')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('table.patient')}</th>
                  <th className="px-6 py-4 font-medium">{t('table.doctor')}</th>
                  <th className="px-6 py-4 font-medium">{t('table.dateTime')}</th>
                  <th className="px-6 py-4 font-medium">{t('table.status')}</th>
                  <th className="px-6 py-4 font-medium text-right">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-on-surface">{app.patientName}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {app.doctorName}
                      <div className="text-xs">{app.specialty}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-outline" />
                        <span>{app.date}</span>
                      </div>
                      <div className="text-xs text-on-surface-variant mt-1">{app.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(app.status)}>
                        {t(app.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-1">
                       {app.status === 'pending' || app.status === 'confirmed' ? (
                         <>
                           <Button variant="ghost" size="icon" title={t('markCompleted')} onClick={() => updateAppointment(app.id, { status: 'completed' })}>
                             <CheckCircle2 className="w-4 h-4 text-green-500" />
                           </Button>
                           <Button variant="ghost" size="icon" title={t('cancelAppt')} onClick={() => cancelAppointment(app.id)}>
                             <XCircle className="w-4 h-4 text-error" />
                           </Button>
                         </>
                       ) : <div className="w-8 h-8" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={t('newAppointment')}>
        <AppointmentForm onClose={() => setIsDrawerOpen(false)} />
      </Drawer>
    </div>
  );
}
