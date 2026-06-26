"use client";

import { create } from "zustand";
import type {
  Role, ViewKey, Patient, Therapist, Employee, Appointment,
  Invoice, Lead, NotificationItem
} from "./types";
import {
  patients as seedPatients,
  therapists as seedTherapists,
  employees as seedEmployees,
  appointments as seedAppointments,
  invoices as seedInvoices,
  leads as seedLeads,
  notifications as seedNotifications,
} from "./data";

interface AppState {
  // Role & auth
  currentRole: Role;
  setRole: (role: Role) => void;

  // Current branch (global filter)
  currentBranchId: string;
  setBranch: (id: string) => void;

  // Navigation
  currentView: ViewKey;
  selectedPatientId: string | null;
  setView: (view: ViewKey) => void;
  openPatient: (id: string) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Command palette / quick add
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;

  // Notifications panel
  notifPanelOpen: boolean;
  setNotifPanelOpen: (open: boolean) => void;

  // Data: patients
  patients: Patient[];
  addPatient: (p: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Data: therapists
  therapists: Therapist[];
  addTherapist: (t: Therapist) => void;
  updateTherapist: (id: string, updates: Partial<Therapist>) => void;
  deleteTherapist: (id: string) => void;

  // Data: employees
  employees: Employee[];
  addEmployee: (e: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Data: appointments
  appointments: Appointment[];
  addAppointment: (a: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  // Data: invoices
  invoices: Invoice[];
  addInvoice: (i: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // Data: leads
  leads: Lead[];
  addLead: (l: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: NotificationItem) => void;
}

let idCounter = 1000;
export const genId = (prefix: string = "id") => `${prefix}_${Date.now()}_${++idCounter}`;

export const useAppStore = create<AppState>((set) => ({
  currentRole: "master_admin",
  setRole: (role) => set({ currentRole: role, currentView: "dashboard" }),

  currentBranchId: "all",
  setBranch: (id) => set({ currentBranchId: id }),

  currentView: "dashboard",
  selectedPatientId: null,
  setView: (view) => set({ currentView: view, selectedPatientId: view === "patients" ? null : undefined }),
  openPatient: (id) => set({ currentView: "patient_detail", selectedPatientId: id }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  theme: "light",
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),

  notifPanelOpen: false,
  setNotifPanelOpen: (open) => set({ notifPanelOpen: open }),

  patients: seedPatients,
  addPatient: (p) => set((s) => ({ patients: [p, ...s.patients] })),
  updatePatient: (id, updates) =>
    set((s) => ({ patients: s.patients.map(p => p.id === id ? { ...p, ...updates } : p) })),
  deletePatient: (id) => set((s) => ({ patients: s.patients.filter(p => p.id !== id) })),

  therapists: seedTherapists,
  addTherapist: (t) => set((s) => ({ therapists: [t, ...s.therapists] })),
  updateTherapist: (id, updates) =>
    set((s) => ({ therapists: s.therapists.map(t => t.id === id ? { ...t, ...updates } : t) })),
  deleteTherapist: (id) => set((s) => ({ therapists: s.therapists.filter(t => t.id !== id) })),

  employees: seedEmployees,
  addEmployee: (e) => set((s) => ({ employees: [e, ...s.employees] })),
  updateEmployee: (id, updates) =>
    set((s) => ({ employees: s.employees.map(e => e.id === id ? { ...e, ...updates } : e) })),
  deleteEmployee: (id) => set((s) => ({ employees: s.employees.filter(e => e.id !== id) })),

  appointments: seedAppointments,
  addAppointment: (a) => set((s) => ({ appointments: [a, ...s.appointments] })),
  updateAppointment: (id, updates) =>
    set((s) => ({ appointments: s.appointments.map(a => a.id === id ? { ...a, ...updates } : a) })),
  deleteAppointment: (id) => set((s) => ({ appointments: s.appointments.filter(a => a.id !== id) })),

  invoices: seedInvoices,
  addInvoice: (i) => set((s) => ({ invoices: [i, ...s.invoices] })),
  updateInvoice: (id, updates) =>
    set((s) => ({ invoices: s.invoices.map(i => i.id === id ? { ...i, ...updates } : i) })),
  deleteInvoice: (id) => set((s) => ({ invoices: s.invoices.filter(i => i.id !== id) })),

  leads: seedLeads,
  addLead: (l) => set((s) => ({ leads: [l, ...s.leads] })),
  updateLead: (id, updates) =>
    set((s) => ({ leads: s.leads.map(l => l.id === id ? { ...l, ...updates } : l) })),
  deleteLead: (id) => set((s) => ({ leads: s.leads.filter(l => l.id !== id) })),

  notifications: seedNotifications,
  markNotificationRead: (id) =>
    set((s) => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
  markAllNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
}));
