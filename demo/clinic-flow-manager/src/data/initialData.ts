import { Appointment, Patient, Doctor, Invoice, ActivityItem } from "../store/types";
import { format, subDays, addDays } from "date-fns";

const today = new Date();

export const INITIAL_PATIENTS: Patient[] = [
  { id: "p1", name: "Sara Hassan", phone: "01001234567", email: "sara@example.com", age: 34, status: "followUp", lastVisit: format(subDays(today, 30), 'yyyy-MM-dd'), nextAppointment: format(addDays(today, 2), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), address: "Maadi, Cairo" },
  { id: "p2", name: "Ahmed Samir", phone: "01109876543", age: 45, status: "stable", lastVisit: format(subDays(today, 15), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p3", name: "Laila Mahmoud", phone: "01201122334", age: 28, status: "new", lastVisit: format(today, 'yyyy-MM-dd'), nextAppointment: format(today, 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p4", name: "Omar Tarek", phone: "01509988776", email: "omar.tarek@example.com", age: 52, status: "inactive", lastVisit: format(subDays(today, 120), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p5", name: "Nour Ibrahim", phone: "01004455667", age: 19, status: "stable", lastVisit: format(subDays(today, 5), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p6", name: "Hisham Fawzy", phone: "01103344556", age: 60, status: "followUp", lastVisit: format(subDays(today, 60), 'yyyy-MM-dd'), nextAppointment: format(addDays(today, 1), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p7", name: "Mona Zaki", phone: "01207788990", age: 39, status: "new", lastVisit: format(addDays(today, 1), 'yyyy-MM-dd'), nextAppointment: format(addDays(today, 1), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p8", name: "Karim Nabil", phone: "01506677889", age: 25, status: "stable", lastVisit: format(subDays(today, 10), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p9", name: "Youssef Ali", phone: "01002233445", email: "youssef@example.com", age: 41, status: "new", lastVisit: format(today, 'yyyy-MM-dd'), nextAppointment: format(today, 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p10", name: "Amina Salah", phone: "01105566778", age: 31, status: "inactive", lastVisit: format(subDays(today, 200), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const INITIAL_DOCTORS: Doctor[] = [
  { id: "d1", name: "Dr. Ahmed Ali", specialty: "Cardiology", status: "available", appointmentsToday: 6, visitsThisMonth: 120, nextAppointmentTime: "10:30 AM" },
  { id: "d2", name: "Dr. Mona Zaki", specialty: "Pediatrics", status: "busy", appointmentsToday: 8, visitsThisMonth: 154, nextAppointmentTime: "11:00 AM" },
  { id: "d3", name: "Dr. Karim Nabil", specialty: "Neurology", status: "off", appointmentsToday: 0, visitsThisMonth: 45 },
  { id: "d4", name: "Dr. Laila Farouk", specialty: "Dermatology", status: "available", appointmentsToday: 5, visitsThisMonth: 90, nextAppointmentTime: "01:00 PM" },
  { id: "d5", name: "Dr. Youssef Ahmed", specialty: "General Practice", status: "busy", appointmentsToday: 12, visitsThisMonth: 210, nextAppointmentTime: "09:45 AM" },
  { id: "d6", name: "Dr. Sarah Hassan", specialty: "Orthopedics", status: "available", appointmentsToday: 4, visitsThisMonth: 78, nextAppointmentTime: "12:30 PM" },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: "a1", patientId: "p1", patientName: "Sara Hassan", doctorId: "d1", doctorName: "Dr. Ahmed Ali", specialty: "Cardiology", date: format(today, 'yyyy-MM-dd'), time: "09:30 AM", status: "completed", fee: 500, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a2", patientId: "p3", patientName: "Laila Mahmoud", doctorId: "d4", doctorName: "Dr. Laila Farouk", specialty: "Dermatology", date: format(today, 'yyyy-MM-dd'), time: "11:00 AM", status: "confirmed", fee: 400, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a3", patientId: "p9", patientName: "Youssef Ali", doctorId: "d5", doctorName: "Dr. Youssef Ahmed", specialty: "General Practice", date: format(today, 'yyyy-MM-dd'), time: "12:15 PM", status: "pending", fee: 300, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a4", patientId: "p6", patientName: "Hisham Fawzy", doctorId: "d6", doctorName: "Dr. Sarah Hassan", specialty: "Orthopedics", date: format(subDays(today, 1), 'yyyy-MM-dd'), time: "02:00 PM", status: "cancelled", fee: 600, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a5", patientId: "p2", patientName: "Ahmed Samir", doctorId: "d1", doctorName: "Dr. Ahmed Ali", specialty: "Cardiology", date: format(addDays(today, 1), 'yyyy-MM-dd'), time: "10:00 AM", status: "confirmed", fee: 500, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a6", patientId: "p5", patientName: "Nour Ibrahim", doctorId: "d2", doctorName: "Dr. Mona Zaki", specialty: "Pediatrics", date: format(subDays(today, 2), 'yyyy-MM-dd'), time: "04:30 PM", status: "completed", fee: 350, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a7", patientId: "p7", patientName: "Mona Zaki", doctorId: "d5", doctorName: "Dr. Youssef Ahmed", specialty: "General Practice", date: format(addDays(today, 2), 'yyyy-MM-dd'), time: "09:00 AM", status: "confirmed", fee: 300, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a8", patientId: "p8", patientName: "Karim Nabil", doctorId: "d4", doctorName: "Dr. Laila Farouk", specialty: "Dermatology", date: format(subDays(today, 5), 'yyyy-MM-dd'), time: "11:45 AM", status: "completed", fee: 400, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a9", patientId: "p1", patientName: "Sara Hassan", doctorId: "d1", doctorName: "Dr. Ahmed Ali", specialty: "Cardiology", date: format(addDays(today, 7), 'yyyy-MM-dd'), time: "10:30 AM", status: "pending", fee: 500, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a10", patientId: "p10", patientName: "Amina Salah", doctorId: "d2", doctorName: "Dr. Mona Zaki", specialty: "Pediatrics", date: format(subDays(today, 15), 'yyyy-MM-dd'), time: "01:15 PM", status: "completed", fee: 350, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a11", patientId: "p4", patientName: "Omar Tarek", doctorId: "d3", doctorName: "Dr. Karim Nabil", specialty: "Neurology", date: format(subDays(today, 20), 'yyyy-MM-dd'), time: "03:00 PM", status: "completed", fee: 700, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "a12", patientId: "p3", patientName: "Laila Mahmoud", doctorId: "d6", doctorName: "Dr. Sarah Hassan", specialty: "Orthopedics", date: format(addDays(today, 3), 'yyyy-MM-dd'), time: "11:30 AM", status: "confirmed", fee: 600, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: "i1", invoiceNumber: "INV-1001", patientId: "p1", patientName: "Sara Hassan", appointmentId: "a1", service: "Cardiology Consultation", amount: 500, amountPaid: 500, status: "paid", issueDate: format(today, 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "i2", invoiceNumber: "INV-1002", patientId: "p5", patientName: "Nour Ibrahim", appointmentId: "a6", service: "Pediatrics Follow-up", amount: 350, amountPaid: 0, status: "unpaid", issueDate: format(subDays(today, 2), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "i3", invoiceNumber: "INV-1003", patientId: "p8", patientName: "Karim Nabil", appointmentId: "a8", service: "Dermatology Session", amount: 400, amountPaid: 200, status: "partial", issueDate: format(subDays(today, 5), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "i4", invoiceNumber: "INV-1004", patientId: "p10", patientName: "Amina Salah", appointmentId: "a10", service: "Pediatrics Assessment", amount: 350, amountPaid: 350, status: "paid", issueDate: format(subDays(today, 15), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "i5", invoiceNumber: "INV-1005", patientId: "p4", patientName: "Omar Tarek", appointmentId: "a11", service: "Neurology Exam", amount: 700, amountPaid: 700, status: "paid", issueDate: format(subDays(today, 20), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "i6", invoiceNumber: "INV-1006", patientId: "p6", patientName: "Hisham Fawzy", service: "Lab Results", amount: 150, amountPaid: 0, status: "unpaid", issueDate: format(today, 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "i7", invoiceNumber: "INV-1007", patientId: "p2", patientName: "Ahmed Samir", service: "ECG Test", amount: 250, amountPaid: 250, status: "paid", issueDate: format(subDays(today, 10), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "i8", invoiceNumber: "INV-1008", patientId: "p3", patientName: "Laila Mahmoud", service: "Dermatology Procedure", amount: 1200, amountPaid: 600, status: "partial", issueDate: format(subDays(today, 30), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "i9", invoiceNumber: "INV-1009", patientId: "p9", patientName: "Youssef Ali", service: "General Checkup", amount: 300, amountPaid: 300, status: "paid", issueDate: format(subDays(today, 40), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "i10", invoiceNumber: "INV-1010", patientId: "p7", patientName: "Mona Zaki", service: "Vaccination", amount: 200, amountPaid: 200, status: "paid", issueDate: format(subDays(today, 50), 'yyyy-MM-dd'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: "act1", type: "appointment", message: "New appointment scheduled for Youssef Ali.", timestamp: new Date().toISOString() },
  { id: "act2", type: "billing", message: "Payment of EGP 500 received from Sara Hassan.", timestamp: subDays(new Date(), 0.1).toISOString() },
  { id: "act3", type: "patient", message: "Lab results uploaded for Nour Ibrahim.", timestamp: subDays(new Date(), 0.5).toISOString() },
  { id: "act4", type: "appointment", message: "Appointment cancelled by Hisham Fawzy.", timestamp: subDays(new Date(), 1).toISOString() },
];
