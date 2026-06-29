"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, Droplet, AlertTriangle,
  Stethoscope, Activity, FileText, Receipt, Bell, ClipboardList,
  TrendingUp, Plus, Download, MoreHorizontal, Crown, Clock,
  Pill, Image as ImageIcon, FileCheck2, MessageCircle, Edit, Share2,
  Video, CalendarPlus, Heart, Zap, ChevronRight, CheckCircle2, Star
} from "lucide-react";
import { branches, therapists } from "@/lib/data";
import { usePatient, useAppointments, useInvoices } from "@/hooks/use-supabase-query";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { Button } from "../Form";
import { AppointmentModal } from "../modals/AppointmentModal";
import { InvoiceModal } from "../modals/InvoiceModal";
import { cn, formatINR, formatDate, exportToHTMLPDF, mapPatient } from "@/lib/utils";
import { toast } from "sonner";
import { useState as useLocalState, useMemo } from "react";
import type { Patient, Appointment, Invoice, TimelineEvent, MedicalRecord } from "@/lib/types";

type Tab = "overview" | "timeline" | "records" | "treatment" | "billing" | "notes";

export function PatientDetailView() {
  const { selectedPatientId, setView, currentRole } = useAppStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [showApptModal, setShowApptModal] = useLocalState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useLocalState(false);

  // Fetch patient data from Supabase
  const { data: patientData, isLoading: isLoadingPatient } = usePatient(selectedPatientId);
  const patient = useMemo(() => patientData ? mapPatient(patientData) : null, [patientData]);

  // Fetch related data
  // Using branch="all" because we want all records for this specific patient
  const { data: appointmentsData = [] } = useAppointments("all");
  const { data: invoicesData = [] } = useInvoices("all");
  
  // Dummy data for now until we build hooks for these
  const timelineEvents: TimelineEvent[] = [];
  const medicalRecords: MedicalRecord[] = [];

  if (isLoadingPatient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D6F04C] border-t-transparent" />
        <p className="mt-4 text-sm">Loading patient profile...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Patient not found</p>
        <button onClick={() => setView("patients")} className="mt-3 text-sm text-primary hover:underline">Back to patients</button>
      </div>
    );
  }

  const branch = branches.find(b => b.id === patient.branchId);
  const therapist = therapists.find(t => t.id === patient.therapistId);
  
  // Map Supabase related data
  // Note: Assuming a simple map for now to fit the UI. If appointments and invoices have complex types, we may need mapAppointment/mapInvoice
  const patientInvoices = invoicesData
    .filter((i: any) => i.patient_id === patient.id)
    .map((i: any) => ({ ...i, invoiceNo: i.invoice_no, dueDate: i.due_date, patientId: i.patient_id })) as Invoice[];
    
  const patientAppointments = appointmentsData
    .filter((a: any) => a.patient_id === patient.id)
    .map((a: any) => ({ ...a, patientId: a.patient_id, therapistId: a.therapist_id, patientName: a.patient_name, therapistName: a.therapist_name })) as Appointment[];

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { key: "overview", label: "Overview", icon: ClipboardList },
    { key: "timeline", label: "Timeline", icon: Activity, badge: timelineEvents.length },
    { key: "records", label: "Records", icon: FileText, badge: medicalRecords.filter(m => m.patientId === patient.id).length },
    { key: "treatment", label: "Treatment", icon: Stethoscope },
    { key: "billing", label: "Billing", icon: Receipt, badge: patientInvoices.length },
    { key: "notes", label: "Notes", icon: MessageCircle },
  ];

  return (
    <div className="space-y-5">
      <button
        onClick={() => setView("patients")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </button>

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-card premium-shadow-lg ring-1 ring-border/40"
      >
        {/* Cover gradient */}
        <div className="relative h-32 md:h-40 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: `linear-gradient(120deg, ${patient.avatarColor}40 0%, ${patient.avatarColor}10 40%, transparent 100%)`
          }} />
          <div className="absolute inset-0 grid-bg opacity-[0.04]" />
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl opacity-30" style={{ background: patient.avatarColor }} />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white/20">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-5 md:px-7 pb-5 md:pb-7 -mt-12 md:-mt-14 relative">
          <div className="flex flex-wrap items-end gap-4">
            <div className="relative">
              <Avatar name={patient.name} color={patient.avatarColor} size="xl" className="!h-24 !w-24 !text-3xl ring-4 ring-card" />
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-card">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-8">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{patient.name}</h1>
                {patient.tags.includes("VIP") && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                    <Crown className="h-3 w-3" /> VIP
                  </span>
                )}
                <StatusBadge status={patient.status} size="sm" />
              </div>
              <div className="mt-1.5 flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                <span className="font-mono">{patient.patientId}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                <span>{patient.age}y · {patient.gender}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{branch?.name}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                <span>Registered {patient.registeredOn}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => { navigator.clipboard.writeText(patient.phone); toast.success("Phone copied"); }}
              >
                <Phone className="h-4 w-4" /> Call
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`https://wa.me/${patient.phone.replace(/[^\d]/g, "")}`, "_blank")}
              >
                <MessageCircle className="h-4 w-4 text-[#34D399]" /> WhatsApp
              </Button>
              <Button variant="outline" onClick={() => toast.info("Video call feature coming soon")}>
                <Video className="h-4 w-4 text-[#B79AFB]" /> Video
              </Button>
              <Button variant="lime" onClick={() => setShowApptModal(true)}>
                <CalendarPlus className="h-4 w-4" strokeWidth={2.5} /> Book Appointment
              </Button>
              <Button variant="outline" onClick={() => handleExportPatientPDF()}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickStat
              icon={<TrendingUp className="h-4 w-4" />}
              label="Treatment Progress"
              value={`${patient.progress}%`}
              color="#D6F04C"
              progress={patient.progress}
            />
            <QuickStat
              icon={<Activity className="h-4 w-4" />}
              label="Sessions Completed"
              value={`${patient.completedSessions}/${patient.totalSessions}`}
              color="#B79AFB"
              progress={(patient.completedSessions / patient.totalSessions) * 100}
            />
            <QuickStat
              icon={<Receipt className="h-4 w-4" />}
              label="Outstanding Balance"
              value={patient.balance > 0 ? `₹${patient.balance.toLocaleString("en-IN")}` : "₹0"}
              color={patient.balance > 0 ? "#F87171" : "#34D399"}
            />
            <QuickStat
              icon={<Calendar className="h-4 w-4" />}
              label="Next Appointment"
              value={patient.nextAppointment ? patient.nextAppointment.split("-").reverse().join("/") : "—"}
              color="#60A5FA"
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="sticky top-16 z-10 -mx-1 px-1">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-2xl bg-card p-1.5 premium-shadow ring-1 ring-border/40">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="patient-tab-active"
                    className="absolute inset-0 rounded-xl bg-primary/8"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{t.label}</span>
                {t.badge && (
                  <span className={cn(
                    "relative z-10 rounded-full px-1.5 py-0 text-[10px] font-bold",
                    isActive ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                  )}>
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {tab === "overview" && <OverviewTab patient={patient} branch={branch} therapist={therapist} />}
          {tab === "timeline" && <TimelineTab />}
          {tab === "records" && <RecordsTab patientId={patient.id} />}
          {tab === "treatment" && <TreatmentTab patient={patient} therapist={therapist} />}
          {tab === "billing" && (
            <BillingTab
              invoices={patientInvoices}
              onCreateInvoice={() => setShowInvoiceModal(true)}
            />
          )}
          {tab === "notes" && <NotesTab />}
        </motion.div>
      </AnimatePresence>

      <AppointmentModal open={showApptModal} onOpenChange={setShowApptModal} presetPatientId={patient.id} />
      <InvoiceModal open={showInvoiceModal} onOpenChange={setShowInvoiceModal} presetPatientId={patient.id} />
    </div>
  );

  function handleExportPatientPDF() {
    const rows = [
      { field: "Patient ID", value: patient.patientId },
      { field: "Name", value: patient.name },
      { field: "Age / Gender", value: `${patient.age}y / ${patient.gender}` },
      { field: "Date of Birth", value: patient.dob },
      { field: "Phone", value: patient.phone },
      { field: "Email", value: patient.email },
      { field: "Address", value: patient.address },
      { field: "Emergency Contact", value: patient.emergencyContact },
      { field: "Branch", value: branch?.name || "—" },
      { field: "Blood Group", value: patient.bloodGroup },
      { field: "Allergies", value: patient.allergies.join(", ") },
      { field: "Conditions", value: patient.conditions.join(", ") },
      { field: "Current Treatment", value: patient.currentTreatment },
      { field: "Therapist", value: therapist?.name || "—" },
      { field: "Progress", value: `${patient.progress}%` },
      { field: "Sessions", value: `${patient.completedSessions}/${patient.totalSessions}` },
      { field: "Outstanding Balance", value: formatINR(patient.balance) },
      { field: "Registered On", value: patient.registeredOn },
      { field: "Last Visit", value: patient.lastVisit },
    ];
    exportToHTMLPDF({
      filename: `patient_${patient.patientId}_${Date.now()}.html`,
      title: "Patient Profile",
      subtitle: `${patient.name} · ${patient.patientId}`,
      meta: [
        { label: "Status", value: patient.status.replace("_", " ") },
        { label: "Branch", value: branch?.name || "—" },
        { label: "Therapist", value: therapist?.name || "—" },
        { label: "Generated", value: new Date().toLocaleString("en-IN") },
      ],
      columns: [
        { key: "field", label: "Field" },
        { key: "value", label: "Value" },
      ],
      rows,
    });
    toast.success("Patient profile PDF opened");
  }
}

function QuickStat({
  icon, label, value, color, progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  progress?: number;
}) {
  return (
    <div className="rounded-2xl bg-muted/40 p-3.5 ring-1 ring-border/40">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      </div>
      <div className="mt-2 text-lg font-semibold tabular-nums">{value}</div>
      {progress !== undefined && (
        <div className="mt-1.5 h-1 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ background: color }}
          />
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: color ? `${color}15` : "var(--muted)", color: color || "var(--muted-foreground)" }}>
        {icon}
      </div>
      <span className="text-xs text-muted-foreground w-28">{label}</span>
      <span className="text-sm font-medium flex-1">{value}</span>
    </div>
  );
}

function OverviewTab({ patient, branch, therapist }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Date of Birth" value={patient.dob} color="#60A5FA" />
            <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={patient.phone} color="#34D399" />
            <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={patient.email} color="#B79AFB" />
            <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Address" value={patient.address} color="#FBBF24" />
            <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Emergency" value={patient.emergencyContact} color="#F87171" />
            <InfoRow icon={<Droplet className="h-3.5 w-3.5" />} label="Blood Group" value={patient.bloodGroup} color="#F472B6" />
          </div>
        </div>

        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-3">Medical Information</h3>
          <div className="space-y-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Allergies</div>
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.map((a: string) => (
                  <span key={a} className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                    a === "None" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  )}>
                    {a !== "None" && <AlertTriangle className="h-3 w-3" />}{a}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Medical Conditions</div>
              <div className="flex flex-wrap gap-1.5">
                {patient.conditions.map((c: string) => (
                  <span key={c} className="rounded-full bg-[#B79AFB]/15 px-2.5 py-1 text-xs font-medium text-[#7C5BD9]">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Current Treatment</div>
              <div className="flex items-center gap-2 rounded-2xl bg-[#D6F04C]/10 px-3 py-2 ring-1 ring-[#D6F04C]/30">
                <Activity className="h-4 w-4 text-[#8FA61E]" />
                <span className="text-sm font-medium text-[#8FA61E]">{patient.currentTreatment}</span>
              </div>
            </div>
            {patient.previousTreatments.length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Previous Treatments</div>
                <div className="flex flex-wrap gap-1.5">
                  {patient.previousTreatments.map((t: string) => (
                    <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-3">Assigned Therapist</h3>
          <div className="flex items-center gap-3">
            <Avatar name={therapist?.name} color={therapist?.avatarColor} size="lg" />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{therapist?.name}</div>
              <div className="text-xs text-muted-foreground truncate">{therapist?.specialization}</div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600">
                <Star className="h-3 w-3 fill-current" /> {therapist?.rating} · {therapist?.experience}y exp
              </div>
            </div>
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-muted/60 py-2 text-xs font-medium ring-1 ring-border/60 hover:bg-muted">
            <MessageCircle className="h-3.5 w-3.5" /> Message Therapist
          </button>
        </div>

        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-3">Branch</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${branch?.color}20` }}>
              <MapPin className="h-5 w-5" style={{ color: branch?.color }} />
            </div>
            <div>
              <div className="text-sm font-medium">{branch?.name}</div>
              <div className="text-xs text-muted-foreground">{branch?.location}, {branch?.city}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{branch?.phone}</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#0F1117] to-[#1A1B2E] p-5 premium-shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-[#D6F04C]/20 blur-2xl" />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Recovery Score</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-[#D6F04C]">
                <AnimatedCounter value={patient.progress} />
              </span>
              <span className="text-sm text-white/60">/100</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${patient.progress}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-[#D6F04C] to-[#34D399]"
              />
            </div>
            <p className="mt-3 text-[11px] text-white/50">
              {patient.progress >= 75 ? "Excellent progress! On track for discharge." :
               patient.progress >= 40 ? "Steady improvement. Continue current plan." :
               "Early stages. Closely monitor and adjust as needed."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineTab() {
  const typeConfig = {
    registration: { icon: UserPlus_icon, color: "#60A5FA", bg: "bg-blue-500/10" },
    consultation: { icon: Stethoscope, color: "#B79AFB", bg: "bg-[#B79AFB]/15" },
    report: { icon: FileCheck2, color: "#5EEAD4", bg: "bg-[#5EEAD4]/15" },
    treatment: { icon: Activity, color: "#D6F04C", bg: "bg-[#D6F04C]/15" },
    payment: { icon: Receipt, color: "#34D399", bg: "bg-emerald-500/10" },
    prescription: { icon: Pill, color: "#F472B6", bg: "bg-[#F472B6]/15" },
    note: { icon: MessageCircle, color: "#FBBF24", bg: "bg-amber-500/10" },
    follow_up: { icon: Bell, color: "#FB923C", bg: "bg-orange-500/10" },
    appointment: { icon: Calendar, color: "#A78BFA", bg: "bg-[#A78BFA]/15" },
  };
  return (
    <div className="rounded-3xl bg-card p-6 md:p-8 premium-shadow ring-1 ring-border/40">
      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-border via-border to-transparent" />
        <div className="space-y-6">
          {timelineEvents.map((event, i) => {
            const cfg = typeConfig[event.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="relative flex gap-4"
              >
                <div className={cn("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-4 ring-card", cfg.bg)} style={{ color: cfg.color }}>
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold">{event.title}</h4>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{event.description}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground whitespace-nowrap">{event.date}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                      {event.actor[0]}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{event.actor}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// placeholder import alias to avoid name clash
function UserPlus_icon(props: { className?: string }) {
  return <FileText {...props} />;
}

function RecordsTab({ patientId }: { patientId: string }) {
  const records = medicalRecords.filter(r => r.patientId === patientId);
  const typeIcons: Record<string, React.ReactNode> = {
    pdf: <FileText className="h-5 w-5" />,
    xray: <ImageIcon className="h-5 w-5" />,
    mri: <ImageIcon className="h-5 w-5" />,
    ct: <ImageIcon className="h-5 w-5" />,
    blood_report: <Droplet className="h-5 w-5" />,
    lab_report: <FileCheck2 className="h-5 w-5" />,
    document: <FileText className="h-5 w-5" />,
  };
  const typeColors: Record<string, string> = {
    pdf: "#F87171", xray: "#60A5FA", mri: "#B79AFB", ct: "#5EEAD4",
    blood_report: "#F472B6", lab_report: "#34D399", document: "#FBBF24",
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-8 text-center premium-shadow">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D6F04C]/15 text-[#8FA61E]">
          <Download className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold">Drop files here to upload</h3>
        <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG, DICOM · Up to 50 MB</p>
        <button className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-foreground px-4 py-2 text-xs font-semibold text-background">
          <Plus className="h-3.5 w-3.5" /> Browse Files
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {records.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="group flex items-center gap-3 rounded-2xl bg-card p-4 premium-shadow ring-1 ring-border/40 cursor-pointer"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${typeColors[r.type]}15`, color: typeColors[r.type] }}>
              {typeIcons[r.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{r.name}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {r.size} · {r.uploadedOn} · v{r.version}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
                <FileText className="h-3.5 w-3.5" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TreatmentTab({ patient, therapist }: any) {
  const sessions = Array.from({ length: patient.completedSessions }).slice(0, 8).map((_, i) => ({
    id: i,
    date: `Session ${patient.completedSessions - i}`,
    title: i === 0 ? patient.currentTreatment : ["Manual Therapy", "Dry Needling", "Mobility Drills", "Strength Training"][i % 4],
    painBefore: 7 - Math.min(i, 5),
    painAfter: Math.max(1, 6 - i),
    rom: 40 + i * 6,
    duration: 45 + (i % 3) * 15,
  }));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-4">Treatment Sessions</h3>
          <div className="space-y-2">
            {sessions.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group flex items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-border/40 hover:bg-muted transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D6F04C]/15 text-[#8FA61E] font-bold text-xs">
                  #{patient.completedSessions - i}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{s.title}</div>
                  <div className="text-[11px] text-muted-foreground">{s.duration} min · Pain {s.painBefore}/10 → {s.painAfter}/10</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">ROM</div>
                  <div className="text-sm font-semibold tabular-nums">{s.rom}°</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-3">Pain Progression</h3>
          <div className="space-y-2">
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(level => {
              const reached = level <= 7 && level >= 2;
              return (
                <div key={level} className="flex items-center gap-2">
                  <div className="text-[10px] text-muted-foreground w-4">{level}</div>
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: reached ? "100%" : "0%" }}
                      transition={{ duration: 0.6, delay: level * 0.05 }}
                      className={cn("h-full rounded-full",
                        level >= 7 ? "bg-rose-500" : level >= 4 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Started at 7/10</span>
            <span className="font-semibold text-emerald-600">Now 2/10</span>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-3">Digital Prescription</h3>
          <div className="space-y-2">
            {[
              { name: "Ibuprofen 400mg", freq: "Twice daily", duration: "5 days" },
              { name: "Cervical Traction", freq: "Thrice weekly", duration: "4 weeks" },
              { name: "Posture Exercises", freq: "Daily", duration: "Ongoing" },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl bg-muted/40 p-2.5">
                <Pill className="h-4 w-4 text-[#F472B6] mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">{p.freq} · {p.duration}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-foreground py-2 text-xs font-semibold text-background">
            <Download className="h-3.5 w-3.5" /> Download Prescription
          </button>
        </div>
      </div>
    </div>
  );
}

function BillingTab({ invoices, onCreateInvoice }: { invoices: any[]; onCreateInvoice?: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <Button variant="lime" size="sm" onClick={onCreateInvoice}>
          <Plus className="h-3.5 w-3.5" /> New Invoice
        </Button>
      </div>
      {invoices.length === 0 ? (
        <div className="rounded-3xl bg-card p-12 text-center ring-1 ring-border/40">
          <Receipt className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No invoices yet</p>
          <p className="text-xs text-muted-foreground">Invoices for this patient will appear here</p>
        </div>
      ) : (
        invoices.map((inv, i) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="rounded-2xl bg-card p-4 ring-1 ring-border/40 flex items-center gap-4 flex-wrap"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5">
              <Receipt className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold font-mono">{inv.invoiceNo}</span>
                <StatusBadge status={inv.status} size="sm" />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Issued {inv.date} · Due {inv.dueDate} · {inv.items.length} items
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold tabular-nums">{formatINR(inv.total)}</div>
              {inv.paid < inv.total && inv.status !== "refunded" && (
                <div className="text-[11px] text-rose-600">Due {formatINR(inv.total - inv.paid)}</div>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

function NotesTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
        <textarea
          placeholder="Add a note about this patient…"
          className="w-full min-h-[120px] resize-none rounded-2xl bg-muted/40 p-3 text-sm outline-none ring-1 ring-border/60 focus:ring-foreground/20"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Edit className="h-3 w-3" /> Notes are visible to all staff
          </div>
          <button className="rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background">
            Save Note
          </button>
        </div>
      </div>

      {[
        { author: "Dr. Ananya Krishnan", text: "Patient responding well to manual therapy. Increase intensity next session. Add thoracic mobility drills.", time: "2 hours ago", color: "#D6F04C" },
        { author: "Lakshmi Iyer (Reception)", text: "Patient called to reschedule next appointment to Friday 4 PM.", time: "Yesterday", color: "#B79AFB" },
        { author: "Dr. Vikram Shetty", text: "Reviewed MRI report. No contraindications for continued therapy.", time: "3 days ago", color: "#5EEAD4" },
      ].map((note, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl bg-card p-4 premium-shadow ring-1 ring-border/40"
        >
          <div className="flex items-start gap-3">
            <Avatar name={note.author} color={note.color} size="sm" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{note.author}</span>
                <span className="text-[11px] text-muted-foreground">{note.time}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{note.text}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
