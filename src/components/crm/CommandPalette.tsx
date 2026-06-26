"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Search, Users, Calendar, Receipt, FileText, Plus, ArrowRight,
  LayoutDashboard, Stethoscope, UserCog, Clock, BarChart3, Zap, Settings,
  User, CalendarDays, Bell, CornerDownLeft
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { patients, invoices } from "@/lib/data";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  shortcut?: string;
  action: () => void;
  group: string;
}

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { setView, openPatient, setCommandOpen } = useAppStore();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const baseCommands: CommandItem[] = [
    { id: "nav-dashboard", label: "Go to Dashboard", icon: LayoutDashboard, iconColor: "#D6F04C", group: "Navigation", action: () => { setView("dashboard"); close(); } },
    { id: "nav-patients", label: "Go to Patients", icon: Users, iconColor: "#B79AFB", group: "Navigation", action: () => { setView("patients"); close(); } },
    { id: "nav-appointments", label: "Go to Appointments", icon: Calendar, iconColor: "#60A5FA", group: "Navigation", action: () => { setView("appointments"); close(); } },
    { id: "nav-calendar", label: "Go to Calendar", icon: CalendarDays, iconColor: "#5EEAD4", group: "Navigation", action: () => { setView("calendar"); close(); } },
    { id: "nav-therapists", label: "Go to Therapists", icon: Stethoscope, iconColor: "#FBBF24", group: "Navigation", action: () => { setView("therapists"); close(); } },
    { id: "nav-employees", label: "Go to Employees", icon: UserCog, iconColor: "#F472B6", group: "Navigation", action: () => { setView("employees"); close(); } },
    { id: "nav-attendance", label: "Go to Attendance", icon: Clock, iconColor: "#34D399", group: "Navigation", action: () => { setView("attendance"); close(); } },
    { id: "nav-billing", label: "Go to Billing", icon: Receipt, iconColor: "#A78BFA", group: "Navigation", action: () => { setView("billing"); close(); } },
    { id: "nav-reports", label: "Go to Reports", icon: BarChart3, iconColor: "#D6F04C", group: "Navigation", action: () => { setView("reports"); close(); } },
    { id: "nav-analytics", label: "Go to Analytics", icon: BarChart3, iconColor: "#B79AFB", group: "Navigation", action: () => { setView("analytics"); close(); } },
    { id: "nav-leads", label: "Go to Leads", icon: Zap, iconColor: "#FBBF24", group: "Navigation", action: () => { setView("leads"); close(); } },
    { id: "nav-notifications", label: "Go to Notifications", icon: Bell, iconColor: "#F87171", group: "Navigation", action: () => { setView("notifications"); close(); } },
    { id: "nav-settings", label: "Go to Settings", icon: Settings, iconColor: "#5EEAD4", group: "Navigation", action: () => { setView("settings"); close(); } },
    { id: "nav-profile", label: "View Profile", icon: User, iconColor: "#60A5FA", group: "Navigation", action: () => { setView("profile"); close(); } },
    { id: "act-new-patient", label: "Register New Patient", description: "Open the multi-step registration form", icon: Plus, iconColor: "#D6F04C", shortcut: "N", group: "Actions", action: () => { setView("patients"); close(); } },
    { id: "act-new-appointment", label: "Book Appointment", icon: Calendar, iconColor: "#B79AFB", shortcut: "B", group: "Actions", action: () => { setView("appointments"); close(); } },
    { id: "act-new-invoice", label: "Create Invoice", icon: Receipt, iconColor: "#34D399", group: "Actions", action: () => { setView("billing"); close(); } },
  ];

  function close() { onOpenChange(false); setQuery(""); setActiveIdx(0); }

  // Patient search results
  const patientResults: CommandItem[] = query.length >= 1
    ? patients.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.patientId.toLowerCase().includes(query.toLowerCase()) ||
        p.phone.includes(query)
      ).slice(0, 5).map(p => ({
        id: `pt-${p.id}`,
        label: p.name,
        description: `${p.patientId} · ${p.phone}`,
        icon: Users,
        iconColor: p.avatarColor,
        group: "Patients",
        action: () => { openPatient(p.id); close(); },
      }))
    : [];

  const invoiceResults: CommandItem[] = query.length >= 1
    ? invoices.filter(i => i.invoiceNo.toLowerCase().includes(query.toLowerCase()) || i.patientName.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map(inv => ({
        id: `inv-${inv.id}`,
        label: inv.invoiceNo,
        description: `${inv.patientName} · ₹${inv.total.toLocaleString("en-IN")}`,
        icon: FileText,
        iconColor: "#34D399",
        group: "Invoices",
        action: () => { setView("billing"); close(); },
      }))
    : [];

  const filteredCommands = query
    ? baseCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.description?.toLowerCase().includes(query.toLowerCase()))
    : baseCommands;

  const allResults = [...filteredCommands, ...patientResults, ...invoiceResults];
  const grouped = allResults.reduce((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  useEffect(() => {
    if (!open) { setQuery(""); setActiveIdx(0); }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(allResults.length - 1, i + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); }
      if (e.key === "Enter") { e.preventDefault(); allResults[activeIdx]?.action(); }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, allResults, activeIdx]);

  let flatIdx = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[12vh] px-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-popover premium-shadow-lg ring-1 ring-border overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
                placeholder="Search patients, invoices, or jump to anything…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-premium p-2">
              {Object.entries(grouped).length === 0 && (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm font-medium">No results found</p>
                  <p className="text-xs text-muted-foreground">Try a different search term</p>
                </div>
              )}

              {Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="mb-2">
                  <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{group}</div>
                  {items.map(item => {
                    flatIdx++;
                    const isActive = flatIdx === activeIdx;
                    const Icon = item.icon;
                    const idx = flatIdx;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIdx(idx)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors",
                          isActive ? "bg-primary/8" : "hover:bg-muted/60"
                        )}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0" style={{ background: `${item.iconColor || "#D6F04C"}15`, color: item.iconColor || "#D6F04C" }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.label}</div>
                          {item.description && <div className="text-[11px] text-muted-foreground truncate">{item.description}</div>}
                        </div>
                        {item.shortcut && (
                          <kbd className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{item.shortcut}</kbd>
                        )}
                        {isActive && <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-muted px-1 py-0.5 font-medium">↑↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-muted px-1 py-0.5 font-medium">↵</kbd> select
                </span>
              </div>
              <span>Stability Physio Care CRM</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
