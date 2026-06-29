"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Calendar, Clock, Plus, ChevronLeft, ChevronRight,
  Users, Phone, MoreHorizontal, Search, List, Grid3x3,
  Trash2, CheckCircle2, XCircle, PlayCircle, FileText, FileSpreadsheet, Download, ChevronDown
} from "lucide-react";
import { patients, therapists, branches } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { Button } from "../Form";
import { AppointmentModal } from "../modals/AppointmentModal";
import { cn, formatDate, formatINR, exportToCSV, exportToExcel, exportToHTMLPDF, mapAppointment } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { useAppointments, useDeleteAppointment, useUpdateAppointment } from "@/hooks/use-supabase-query";
import { toast } from "sonner";
import type { AppointmentStatus } from "@/lib/types";

type ViewMode = "list" | "day" | "week";

export function AppointmentsView() {
  const { openPatient, currentBranchId } = useAppStore();
  const { data: rawAppointments = [], isLoading } = useAppointments(currentBranchId);
  const deleteApptMutation = useDeleteAppointment();
  const updateApptMutation = useUpdateAppointment();
  
  const appointments = useMemo(() => {
    return rawAppointments.map(mapAppointment);
  }, [rawAppointments]);

  const [mode, setMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      if (currentBranchId !== "all" && a.branchId !== currentBranchId) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.patientName.toLowerCase().includes(q) && !a.therapistName.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [appointments, search, statusFilter, currentBranchId]);

  const groupedByDate = useMemo(() => {
    return filtered.reduce((acc, a) => {
      (acc[a.date] = acc[a.date] || []).push(a);
      return acc;
    }, {} as Record<string, typeof filtered>);
  }, [filtered]);

  function setStatus(id: string, status: AppointmentStatus) {
    updateApptMutation.mutate({ id, updates: { status } });
  }

  function handleDelete(id: string) {
    deleteApptMutation.mutate(id);
  }

  function handleExportCSV() {
    const rows = filtered.map(a => ({
      id: a.id,
      patient: a.patientName,
      therapist: a.therapistName,
      branch: branches.find(b => b.id === a.branchId)?.name || "",
      date: a.date,
      time: a.time,
      duration: a.duration,
      type: a.type,
      status: a.status,
      notes: a.notes || "",
    }));
    exportToCSV(`appointments_${Date.now()}.csv`, rows);
    toast.success("CSV exported");
    setShowExport(false);
  }
  function handleExportExcel() {
    const rows = filtered.map(a => ({
      patient: a.patientName, therapist: a.therapistName,
      branch: branches.find(b => b.id === a.branchId)?.name || "",
      date: a.date, time: a.time, duration: a.duration,
      type: a.type, status: a.status,
    }));
    exportToExcel({
      filename: `appointments_${Date.now()}.xls`,
      sheetName: "Appointments",
      columns: [
        { key: "patient", label: "Patient" },
        { key: "therapist", label: "Therapist" },
        { key: "branch", label: "Branch" },
        { key: "date", label: "Date" },
        { key: "time", label: "Time" },
        { key: "duration", label: "Duration (min)" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
      ],
      rows,
    });
    toast.success("Excel exported");
    setShowExport(false);
  }
  function handleExportPDF() {
    const rows = filtered.map(a => ({
      patient: a.patientName,
      therapist: a.therapistName,
      branch: branches.find(b => b.id === a.branchId)?.name || "",
      date: formatDate(a.date),
      time: a.time,
      duration: `${a.duration} min`,
      type: a.type,
      status: a.status,
    }));
    exportToHTMLPDF({
      filename: `appointments_${Date.now()}.html`,
      title: "Appointments Schedule",
      subtitle: `${filtered.length} appointment(s)`,
      meta: [
        { label: "Total", value: String(filtered.length) },
        { label: "Branch", value: currentBranchId === "all" ? "All Branches" : branches.find(b => b.id === currentBranchId)?.name || "—" },
        { label: "Generated", value: new Date().toLocaleString("en-IN") },
      ],
      columns: [
        { key: "patient", label: "Patient" },
        { key: "therapist", label: "Therapist" },
        { key: "branch", label: "Branch" },
        { key: "date", label: "Date" },
        { key: "time", label: "Time" },
        { key: "duration", label: "Duration" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
      ],
      rows,
      summary: [
        { label: "Total", value: String(filtered.length), accent: "lime" },
        { label: "Completed", value: String(filtered.filter(a => a.status === "completed").length), accent: "emerald" },
        { label: "Scheduled", value: String(filtered.filter(a => a.status === "scheduled").length), accent: "blue" },
        { label: "Cancelled", value: String(filtered.filter(a => a.status === "cancelled").length), accent: "rose" },
      ],
    });
    toast.success("PDF opened — print to save");
    setShowExport(false);
  }

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "scheduled", label: "Scheduled" },
    { value: "waiting", label: "Waiting" },
    { value: "consultation", label: "In Consultation" },
    { value: "therapy", label: "In Therapy" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "no_show", label: "No Show" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Appointments"
        description={`${filtered.length} appointments · ${filtered.filter(a => a.status === "scheduled").length} upcoming`}
        icon={<Calendar className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Popover.Root open={showExport} onOpenChange={setShowExport}>
              <Popover.Trigger asChild>
                <Button variant="outline" size="default">
                  <Download className="h-4 w-4" /> Export
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content align="end" sideOffset={8} className="z-50 w-56 rounded-2xl bg-popover p-2 premium-shadow-lg ring-1 ring-border">
                  <button onClick={handleExportCSV} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted">
                    <FileText className="h-4 w-4 text-emerald-500" /> CSV
                  </button>
                  <button onClick={handleExportExcel} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Excel
                  </button>
                  <button onClick={handleExportPDF} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted">
                    <FileText className="h-4 w-4 text-rose-500" /> PDF
                  </button>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            <Button variant="lime" onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" /> New Appointment
            </Button>
          </div>
        }
      />

      {/* Filters & View Mode */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patient, therapist…"
            className="h-10 w-full rounded-xl bg-card pl-9 pr-3 text-sm ring-1 ring-border focus:ring-2 focus:ring-foreground/20 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl bg-card px-3 text-sm ring-1 ring-border focus:ring-2 focus:ring-foreground/20 outline-none"
        >
          {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="flex items-center gap-1 rounded-xl bg-card p-1 ring-1 ring-border">
          {([
            { key: "list", icon: List, label: "List" },
            { key: "day", icon: Clock, label: "Day" },
            { key: "week", icon: Grid3x3, label: "Week" },
          ] as const).map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-all",
                mode === m.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <m.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List view */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D6F04C] border-t-transparent" />
            <p className="mt-4 text-sm">Loading appointments from database...</p>
          </div>
        ) : mode === "list" ? (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, appts]) => (
            <div key={date}>
              <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#D6F04C]" />
                <h3 className="text-sm font-semibold">{formatDate(date)}</h3>
                <span className="text-xs text-muted-foreground">· {appts.length} appointment(s)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {appts.map((a, i) => (
                  <AppointmentCard
                    key={a.id}
                    appointment={a}
                    index={i}
                    onOpenPatient={() => openPatient(a.patientId)}
                    onStatus={(s) => setStatus(a.id, s)}
                    onDelete={() => handleDelete(a.id)}
                  />
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No appointments found</p>
              <Button variant="lime" size="sm" className="mt-3" onClick={() => setShowModal(true)}>
                <Plus className="h-3.5 w-3.5" /> Schedule one
              </Button>
            </div>
          )}
        </div>
      ) : null}

      {/* Day view */}
      {mode === "day" && (
        <DayView
          appointments={filtered.filter(a => a.date === selectedDate)}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onOpenPatient={openPatient}
          onStatus={setStatus}
        />
      )}

      {/* Week view */}
      {mode === "week" && (
        <WeekView
          appointments={filtered}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onOpenPatient={openPatient}
        />
      )}

      <AppointmentModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}

function AppointmentCard({
  appointment, index, onOpenPatient, onStatus, onDelete,
}: {
  appointment: any;
  index: number;
  onOpenPatient: () => void;
  onStatus: (s: AppointmentStatus) => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const branch = branches.find(b => b.id === appointment.branchId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group rounded-2xl bg-card ring-1 ring-border p-4 hover:ring-foreground/20 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-xs font-bold ring-1 ring-border">
            {appointment.time}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{appointment.type.replace("_", " ")}</div>
            <div className="text-xs text-muted-foreground">{appointment.duration} min</div>
          </div>
        </div>
        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Popover.Trigger asChild>
            <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={4} className="z-50 w-48 rounded-xl bg-popover p-1.5 premium-shadow-lg ring-1 ring-border">
              <button onClick={() => { onStatus("waiting"); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-muted">
                <Clock className="h-3.5 w-3.5" /> Mark Waiting
              </button>
              <button onClick={() => { onStatus("consultation"); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-muted">
                <PlayCircle className="h-3.5 w-3.5" /> Start Consultation
              </button>
              <button onClick={() => { onStatus("completed"); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Mark Completed
              </button>
              <button onClick={() => { onStatus("cancelled"); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-muted text-rose-500">
                <XCircle className="h-3.5 w-3.5" /> Cancel
              </button>
              <div className="my-1 h-px bg-border" />
              <button onClick={() => { onDelete(); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-rose-500/10 text-rose-500">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <button onClick={onOpenPatient} className="block w-full text-left">
        <div className="flex items-center gap-2 mb-2">
          <Avatar name={appointment.patientName} color="#D6F04C" size="sm" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground truncate">{appointment.patientName}</div>
            <div className="text-[11px] text-muted-foreground truncate">{appointment.therapistName}</div>
          </div>
        </div>
      </button>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
          {branch?.name}
        </span>
        <StatusBadge status={appointment.status} size="sm" />
      </div>
      {appointment.notes && (
        <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2 italic">"{appointment.notes}"</p>
      )}
    </motion.div>
  );
}

function DayView({ appointments, selectedDate, setSelectedDate, onOpenPatient, onStatus }: {
  appointments: any[];
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  onOpenPatient: (id: string) => void;
  onStatus: (id: string, s: AppointmentStatus) => void;
}) {
  const hours = Array.from({ length: 12 }).map((_, i) => 8 + i); // 8 AM to 7 PM

  function shiftDate(days: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  }

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => shiftDate(-1)}><ChevronLeft className="h-4 w-4" /></Button>
          <h3 className="text-sm font-semibold">{formatDate(selectedDate, { withTime: false })}</h3>
          <Button variant="ghost" size="icon" onClick={() => shiftDate(1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}>Today</Button>
      </div>
      <div className="divide-y divide-border/40">
        {hours.map(h => {
          const hourAppts = appointments.filter(a => parseInt(a.time.split(":")[0]) === h);
          const ampm = h >= 12 ? "PM" : "AM";
          const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
          return (
            <div key={h} className="flex gap-3 p-3 min-h-[60px]">
              <div className="w-16 shrink-0 text-xs font-semibold text-muted-foreground pt-1">
                {hour12}:00 {ampm}
              </div>
              <div className="flex-1 space-y-2">
                {hourAppts.map(a => (
                  <div
                    key={a.id}
                    onClick={() => onOpenPatient(a.patientId)}
                    className="cursor-pointer rounded-xl bg-gradient-to-r from-[#D6F04C]/15 to-[#D6F04C]/5 p-3 ring-1 ring-[#D6F04C]/30 hover:ring-[#D6F04C]/60 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold">{a.patientName}</div>
                        <div className="text-[11px] text-muted-foreground">{a.time} · {a.therapistName}</div>
                      </div>
                      <StatusBadge status={a.status} size="sm" />
                    </div>
                  </div>
                ))}
                {hourAppts.length === 0 && (
                  <div className="text-[11px] text-muted-foreground/40 italic">No appointments</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ appointments, selectedDate, setSelectedDate, onOpenPatient }: {
  appointments: any[];
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  onOpenPatient: (id: string) => void;
}) {
  const startOfWeek = new Date(selectedDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/60 flex-wrap gap-2">
        <h3 className="text-sm font-semibold">Week of {formatDate(days[0])}</h3>
        <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}>This Week</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-7 divide-x divide-border/40">
        {days.map((d, i) => {
          const dayAppts = appointments.filter(a => a.date === d);
          const isToday = d === new Date().toISOString().split("T")[0];
          return (
            <div key={d} className={cn("p-3 min-h-[200px] sm:min-h-[400px]", i === 0 && "border-t border-border/40 sm:border-t-0")}>
              <div className={cn(
                "text-xs font-semibold mb-2 pb-2 border-b border-border/40",
                isToday && "text-[#8FA61E]"
              )}>
                {new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })}
              </div>
              <div className="space-y-1.5">
                {dayAppts.map(a => (
                  <div
                    key={a.id}
                    onClick={() => onOpenPatient(a.patientId)}
                    className="cursor-pointer rounded-lg bg-muted/60 hover:bg-muted p-2 text-[10px] transition-all"
                  >
                    <div className="font-semibold text-foreground text-xs">{a.time}</div>
                    <div className="truncate text-muted-foreground">{a.patientName}</div>
                  </div>
                ))}
                {dayAppts.length === 0 && <div className="text-[10px] text-muted-foreground/40">—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
