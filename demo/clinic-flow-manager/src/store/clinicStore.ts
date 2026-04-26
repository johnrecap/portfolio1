import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Appointment, Patient, Doctor, Invoice, ActivityItem, AppSettings, AppointmentStatus } from './types';
import { INITIAL_APPOINTMENTS, INITIAL_ACTIVITY, INITIAL_DOCTORS, INITIAL_INVOICES, INITIAL_PATIENTS } from '../data/initialData';

interface ClinicState {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  invoices: Invoice[];
  activity: ActivityItem[];
  settings: AppSettings;
  
  // Actions
  addAppointment: (app: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  
  addPatient: (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  addDoctor: (doctor: Omit<Doctor, "id" | "createdAt" | "updatedAt">) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  updateDoctorStatus: (id: string, status: Doctor["status"]) => void;
  
  createInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber" | "createdAt" | "updatedAt">) => void;
  updateInvoiceStatus: (id: string, status: Invoice["status"], amountPaid?: number) => void;
  
  setLanguage: (lang: "en" | "ar") => void;
  setTheme: (theme: "light" | "dark") => void;
  resetDemoData: () => void;
}

export const useClinicStore = create<ClinicState>()(
  persist(
    (set, get) => ({
      appointments: INITIAL_APPOINTMENTS,
      patients: INITIAL_PATIENTS,
      doctors: INITIAL_DOCTORS,
      invoices: INITIAL_INVOICES,
      activity: INITIAL_ACTIVITY,
      settings: {
        language: "en",
        direction: "ltr",
        theme: "light",
      },

      addAppointment: (app) => set((state) => {
        const newApp: Appointment = {
          ...app,
          id: `a${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return {
          appointments: [newApp, ...state.appointments],
          activity: [{ id: `act${Date.now()}`, type: 'appointment', message: `New appointment scheduled for ${app.patientName}.`, timestamp: new Date().toISOString() }, ...state.activity]
        };
      }),

      updateAppointment: (id, updates) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)
      })),

      cancelAppointment: (id) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, status: 'cancelled', updatedAt: new Date().toISOString() } : a)
      })),

      addPatient: (patient) => set((state) => ({
        patients: [{
          ...patient,
          id: `p${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, ...state.patients]
      })),

      updatePatient: (id, updates) => set((state) => ({
        patients: state.patients.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
      })),

      deletePatient: (id) => set((state) => ({
        patients: state.patients.filter(p => p.id !== id)
      })),

      addDoctor: (doctor) => set((state) => ({
        doctors: [{
          ...doctor,
          id: `d${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, ...state.doctors]
      })),

      updateDoctor: (id, updates) => set((state) => ({
        doctors: state.doctors.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d)
      })),

      updateDoctorStatus: (id, status) => set((state) => ({
        doctors: state.doctors.map(d => d.id === id ? { ...d, status } : d)
      })),

      createInvoice: (inv) => set((state) => ({
        invoices: [{
          ...inv,
          id: `i${Date.now()}`,
          invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, ...state.invoices]
      })),

      updateInvoiceStatus: (id, status, amountPaid) => set((state) => ({
        invoices: state.invoices.map(i => {
          if (i.id === id) {
            let newAmountPaid = amountPaid !== undefined ? amountPaid : i.amountPaid;
            if (status === 'paid') newAmountPaid = i.amount;
            if (status === 'unpaid') newAmountPaid = 0;
            return { ...i, status, amountPaid: newAmountPaid, updatedAt: new Date().toISOString() };
          }
          return i;
        })
      })),

      setLanguage: (lang) => set((state) => ({
        settings: { ...state.settings, language: lang, direction: lang === 'ar' ? 'rtl' : 'ltr' }
      })),

      setTheme: (theme) => set((state) => ({
        settings: { ...state.settings, theme }
      })),

      resetDemoData: () => set((state) => ({
        appointments: INITIAL_APPOINTMENTS,
        patients: INITIAL_PATIENTS,
        doctors: INITIAL_DOCTORS,
        invoices: INITIAL_INVOICES,
        activity: INITIAL_ACTIVITY,
        settings: {
          ...state.settings,
          lastResetAt: new Date().toISOString()
        }
      }))
    }),
    {
      name: 'clinicflow-manager-session',
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);
