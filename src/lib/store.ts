"use client";

import { create } from "zustand";
import type { Role, ViewKey } from "./types";

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

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Command palette / quick add
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;

  // Notifications panel
  notifPanelOpen: boolean;
  setNotifPanelOpen: (open: boolean) => void;
}

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

  theme: "light",
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),

  notifPanelOpen: false,
  setNotifPanelOpen: (open) => set({ notifPanelOpen: open }),
}));
