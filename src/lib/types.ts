// Core types for Stability Physio Care CRM

export type Role = "master_admin" | "branch_admin" | "receptionist" | "physiotherapist";

export type ViewKey =
  | "dashboard"
  | "patients"
  | "patient_detail"
  | "appointments"
  | "calendar"
  | "therapists"
  | "employees"
  | "attendance"
  | "billing"
  | "reports"
  | "analytics"
  | "leads"
  | "notifications"
  | "settings"
  | "profile";

export type AppointmentStatus =
  | "scheduled"
  | "waiting"
  | "consultation"
  | "therapy"
  | "completed"
  | "cancelled"
  | "no_show";

export type LeadStage = "new" | "contacted" | "consultation" | "converted" | "lost";

export type LeadSource = "walk_in" | "whatsapp" | "instagram" | "doctor_referral" | "website" | "phone";

export type PaymentMethod = "cash" | "upi" | "card" | "insurance";
export type InvoiceStatus = "paid" | "pending" | "partial" | "refunded";

export type AttendanceStatus = "present" | "absent" | "late" | "leave";

export interface Branch {
  id: string;
  name: string;
  location: string;
  city: string;
  phone: string;
  revenue: number;
  patients: number;
  staff: number;
  growth: number;
  color: string;
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  dob: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  branchId: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  previousTreatments: string[];
  currentTreatment: string;
  status: "active" | "in_consultation" | "in_therapy" | "follow_up" | "discharged";
  therapistId: string;
  tags: string[];
  avatarColor: string;
  registeredOn: string;
  lastVisit: string;
  nextAppointment?: string;
  progress: number;
  totalSessions: number;
  completedSessions: number;
  balance: number;
}

export interface Therapist {
  id: string;
  name: string;
  specialization: string;
  branchId: string;
  patients: number;
  rating: number;
  experience: number;
  sessionsToday: number;
  revenue: number;
  avatarColor: string;
  status: "available" | "busy" | "off";
  certifications: string[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  branchId: string;
  phone: string;
  email: string;
  status: "active" | "on_leave" | "inactive";
  shift: string;
  joinedOn: string;
  avatarColor: string;
  salary: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  therapistName: string;
  branchId: string;
  date: string;
  time: string;
  duration: number;
  type: "consultation" | "therapy" | "follow_up" | "assessment";
  status: AppointmentStatus;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  patientId: string;
  patientName: string;
  branchId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paid: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
}

export interface InvoiceItem {
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  stage: LeadStage;
  branchId: string;
  interest: string;
  value: number;
  createdAt: string;
  notes: string;
  avatarColor: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  method: "qr" | "gps" | "manual";
  branchId: string;
}

export interface NotificationItem {
  id: string;
  type: "appointment" | "payment" | "follow_up" | "registration" | "attendance" | "report" | "leave";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

export interface TimelineEvent {
  id: string;
  type: "registration" | "consultation" | "report" | "treatment" | "payment" | "prescription" | "note" | "follow_up" | "appointment";
  title: string;
  description: string;
  date: string;
  actor: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  name: string;
  type: "pdf" | "xray" | "mri" | "ct" | "blood_report" | "lab_report" | "document";
  size: string;
  uploadedOn: string;
  uploadedBy: string;
  version: number;
}

export interface KPIData {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: string;
  accent: "lime" | "purple" | "blue" | "amber" | "rose" | "emerald";
}
