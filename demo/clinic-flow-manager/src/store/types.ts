export type AppointmentStatus = "confirmed" | "pending" | "cancelled" | "completed";
export type PatientStatus = "new" | "stable" | "followUp" | "inactive";
export type DoctorStatus = "available" | "busy" | "off";
export type InvoiceStatus = "paid" | "unpaid" | "partial";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  fee: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  gender?: "male" | "female" | "other";
  status: PatientStatus;
  lastVisit: string;
  nextAppointment?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  status: DoctorStatus;
  appointmentsToday: number;
  visitsThisMonth: number;
  nextAppointmentTime?: string;
  availableFrom?: string;
  availableTo?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  service: string;
  amount: number;
  amountPaid: number;
  status: InvoiceStatus;
  issueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  type: "appointment" | "patient" | "billing" | "doctor";
  messageKey?: string;
  message?: string;
  timestamp: string;
  entityId?: string;
}

export interface AppSettings {
  language: "en" | "ar";
  direction: "ltr" | "rtl";
  theme: "light" | "dark";
  lastResetAt?: string;
}
