"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Calendar, Users, Activity, Clock, FileText, Pill, Image as ImageIcon,
  Stethoscope, Plus, ChevronRight, Save, Send, Edit3, Eye,
  TrendingUp, Award, Heart, Brain
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { Button, Field, TextInput, TextArea, SelectInput } from "../Form";
import { Modal } from "../Modal";
import { cn, formatINR, formatDate, uid, todayISO } from "@/lib/utils";
import { toast } from "sonner";

interface SessionNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  painBefore: number;
  painAfter: number;
  treatment: string;
  notes: string;
  nextPlan: string;
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  advice: string;
  followUp: string;
}

const initialSessionNotes: SessionNote[] = [
  {
    id: "sn1",
    patientId: "pt1",
    patientName: "Arjun Sharma",
    date: "2026-06-26",
    painBefore: 7,
    painAfter: 4,
    treatment: "Cervical traction + soft tissue mobilization",
    notes: "Patient reported stiffness in morning. Range of motion improved after traction. Tenderness over upper trapezius.",
    nextPlan: "Continue traction, add thoracic mobility drills next session.",
  },
  {
    id: "sn2",
    patientId: "pt2",
    patientName: "Priya Reddy",
    date: "2026-06-26",
    painBefore: 6,
    painAfter: 3,
    treatment: "Dry needling + posture correction",
    notes: "Trigger points in levator scapulae. Needling tolerated well. Patient education on ergonomics.",
    nextPlan: "Reassess trigger points, introduce scapular stabilization.",
  },
];

const initialPrescriptions: Prescription[] = [
  {
    id: "rx1",
    patientId: "pt1",
    patientName: "Arjun Sharma",
    date: "2026-06-26",
    medications: [
      { name: "Ibuprofen", dosage: "400mg", frequency: "Twice daily", duration: "5 days" },
      { name: "Muscle Relaxant (Thiocolchicoside)", dosage: "8mg", frequency: "Twice daily", duration: "5 days" },
    ],
    advice: "Avoid heavy lifting. Use cold packs for 10 min, 3x/day. Maintain neutral posture while working.",
    followUp: "Review after 5 days. Continue physiotherapy sessions.",
  },
];

export function PhysioDashboardView() {
  const { patients, appointments, openPatient, setView, currentRole } = useAppStore();
  const [tab, setTab] = useState<"schedule" | "notes" | "prescriptions" | "patients">("schedule");
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>(initialSessionNotes);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showRxModal, setShowRxModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const todayAppts = appointments.filter(a => a.date === appointments[0]?.date).slice(0, 8);
  const myPatients = patients.slice(0, 12);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1117] via-[#16161F] to-[#1A1B2E] p-6 md:p-8 premium-shadow-lg"
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#D6F04C]/20 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-[#B79AFB]/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6F04C] animate-pulse" />
              <span className="text-[11px] font-medium text-white/70">Physiotherapist Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Welcome back, Dr. Ananya
            </h1>
            <p className="mt-1.5 text-sm text-white/50 max-w-lg">
              You have {todayAppts.length} sessions scheduled today. {todayAppts.filter(a => a.status === "waiting").length} patients are waiting.
            </p>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">My Patients</div>
              <div className="mt-1 text-2xl font-semibold text-[#D6F04C]">
                <AnimatedCounter value={42} />
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Sessions Today</div>
              <div className="mt-1 text-2xl font-semibold text-[#B79AFB]">
                <AnimatedCounter value={9} />
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Rating</div>
              <div className="mt-1 text-2xl font-semibold text-white">4.9★</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Today's Sessions", value: 9, icon: Calendar, color: "#D6F04C" },
          { label: "Active Patients", value: 42, icon: Users, color: "#B79AFB" },
          { label: "Notes Pending", value: 3, icon: FileText, color: "#FBBF24" },
          { label: "Prescriptions Issued", value: 18, icon: Pill, color: "#34D399" },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card p-4 ring-1 ring-border"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-9 w-9 flex items-center justify-center rounded-xl" style={{ background: `${k.color}15`, color: k.color }}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-bold">
                <AnimatedCounter value={k.value} />
              </div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">{k.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-card p-1 ring-1 ring-border overflow-x-auto no-scrollbar">
        {[
          { key: "schedule", label: "Today's Schedule", icon: Calendar },
          { key: "notes", label: "Session Notes", icon: FileText },
          { key: "prescriptions", label: "Prescriptions", icon: Pill },
          { key: "patients", label: "My Patients", icon: Users },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                tab === t.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Schedule tab */}
      {tab === "schedule" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Today's Sessions · {todayAppts.length}</h3>
            <Button variant="lime" size="sm" onClick={() => setView("appointments")}>
              <Plus className="h-3.5 w-3.5" /> Book appointment
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayAppts.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-card ring-1 ring-border p-4 hover:ring-foreground/20 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xs font-bold ring-1 ring-border">
                      {a.time}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.type.replace("_", " ")}</div>
                      <div className="text-xs text-muted-foreground">{a.duration} min</div>
                    </div>
                  </div>
                  <StatusBadge status={a.status} size="sm" />
                </div>
                <button onClick={() => openPatient(a.patientId)} className="block w-full text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={a.patientName} color="#D6F04C" size="sm" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{a.patientName}</div>
                      <div className="text-[11px] text-muted-foreground">with you</div>
                    </div>
                  </div>
                </button>
                <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                  <Button size="sm" variant="outline" onClick={() => { setSelectedNote(null); setShowNoteModal(true); }}>
                    <FileText className="h-3 w-3" /> Add Note
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openPatient(a.patientId)}>
                    <Eye className="h-3 w-3" /> View
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Session notes tab */}
      {tab === "notes" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Session Notes · {sessionNotes.length}</h3>
            <Button variant="lime" size="sm" onClick={() => { setSelectedNote(null); setShowNoteModal(true); }}>
              <Plus className="h-3.5 w-3.5" /> New Note
            </Button>
          </div>
          <div className="space-y-3">
            {sessionNotes.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-card ring-1 ring-border p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={note.patientName} color="#D6F04C" size="md" />
                    <div>
                      <div className="text-sm font-semibold">{note.patientName}</div>
                      <div className="text-[11px] text-muted-foreground">{formatDate(note.date, { withTime: false })}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedNote(note); setShowNoteModal(true); }}
                    className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="rounded-xl bg-muted/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pain Before</div>
                    <div className="text-lg font-bold text-rose-500">{note.painBefore}/10</div>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pain After</div>
                    <div className="text-lg font-bold text-emerald-500">{note.painAfter}/10</div>
                  </div>
                </div>
                <div className="text-xs">
                  <div className="font-semibold mb-1">Treatment:</div>
                  <p className="text-muted-foreground mb-2">{note.treatment}</p>
                  <div className="font-semibold mb-1">Notes:</div>
                  <p className="text-muted-foreground mb-2">{note.notes}</p>
                  <div className="font-semibold mb-1">Next Plan:</div>
                  <p className="text-muted-foreground">{note.nextPlan}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Prescriptions tab */}
      {tab === "prescriptions" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Digital Prescriptions · {prescriptions.length}</h3>
            <Button variant="lime" size="sm" onClick={() => { setSelectedRx(null); setShowRxModal(true); }}>
              <Plus className="h-3.5 w-3.5" /> New Prescription
            </Button>
          </div>
          <div className="space-y-3">
            {prescriptions.map((rx, i) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-card ring-1 ring-border p-4"
              >
                <div className="flex items-start justify-between mb-3 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#D6F04C]/15 flex items-center justify-center text-[#8FA61E]">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{rx.patientName}</div>
                      <div className="text-[11px] text-muted-foreground">{formatDate(rx.date, { withTime: false })} · Rx #{rx.id.toUpperCase()}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedRx(rx); setShowRxModal(true); }}
                    className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {rx.medications.map((m, idx) => (
                    <div key={idx} className="rounded-xl bg-muted/40 p-3 text-xs">
                      <div className="font-semibold text-sm">{m.name} {m.dosage}</div>
                      <div className="text-muted-foreground mt-0.5">{m.frequency} · {m.duration}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs">
                  <div className="font-semibold mb-1">Advice:</div>
                  <p className="text-muted-foreground">{rx.advice}</p>
                  <div className="font-semibold mb-1 mt-2">Follow-up:</div>
                  <p className="text-muted-foreground">{rx.followUp}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Patients tab */}
      {tab === "patients" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">My Patients · {myPatients.length}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {myPatients.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => openPatient(p.id)}
                className="text-left rounded-2xl bg-card ring-1 ring-border p-4 hover:ring-foreground/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={p.name} color={p.avatarColor} size="md" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{p.currentTreatment}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#D6F04C] to-[#A3C128]" style={{ width: `${p.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span>{p.completedSessions}/{p.totalSessions} sessions</span>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <SessionNoteModal
        open={showNoteModal}
        onOpenChange={setShowNoteModal}
        existing={selectedNote}
        onSave={(note) => {
          if (selectedNote) {
            setSessionNotes(arr => arr.map(n => n.id === note.id ? note : n));
            toast.success("Session note updated");
          } else {
            setSessionNotes(arr => [note, ...arr]);
            toast.success("Session note saved");
          }
          setShowNoteModal(false);
        }}
      />

      <PrescriptionModal
        open={showRxModal}
        onOpenChange={setShowRxModal}
        existing={selectedRx}
        onSave={(rx) => {
          if (selectedRx) {
            setPrescriptions(arr => arr.map(r => r.id === rx.id ? rx : r));
            toast.success("Prescription updated");
          } else {
            setPrescriptions(arr => [rx, ...arr]);
            toast.success("Prescription issued");
          }
          setShowRxModal(false);
        }}
      />
    </div>
  );
}

function SessionNoteModal({ open, onOpenChange, existing, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing: SessionNote | null;
  onSave: (note: SessionNote) => void;
}) {
  const { patients } = useAppStore();
  const [form, setForm] = useState<SessionNote>(
    existing || {
      id: uid("sn"),
      patientId: patients[0]?.id || "",
      patientName: patients[0]?.name || "",
      date: todayISO(),
      painBefore: 5,
      painAfter: 3,
      treatment: "",
      notes: "",
      nextPlan: "",
    }
  );

  // Reset form when modal opens with different existing note
  useState(() => {
    if (open && existing) setForm(existing);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={existing ? "Edit Session Note" : "New Session Note"}
      description="Document the treatment session with pain scores & notes"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="lime" onClick={() => onSave(form)}>
            <Save className="h-4 w-4" /> Save Note
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Patient" required className="sm:col-span-2">
          <SelectInput
            value={form.patientId}
            onValueChange={(v) => {
              const p = patients.find(p => p.id === v);
              setForm(f => ({ ...f, patientId: v, patientName: p?.name || "" }));
            }}
            options={patients.map(p => ({ value: p.id, label: `${p.name} (${p.patientId})` }))}
          />
        </Field>
        <Field label="Date">
          <TextInput type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        </Field>
        <Field label={`Pain Before: ${form.painBefore}/10`}>
          <input
            type="range"
            min={0}
            max={10}
            value={form.painBefore}
            onChange={e => setForm(f => ({ ...f, painBefore: Number(e.target.value) }))}
            className="w-full accent-rose-500"
          />
        </Field>
        <Field label={`Pain After: ${form.painAfter}/10`}>
          <input
            type="range"
            min={0}
            max={10}
            value={form.painAfter}
            onChange={e => setForm(f => ({ ...f, painAfter: Number(e.target.value) }))}
            className="w-full accent-emerald-500"
          />
        </Field>
        <Field label="Treatment Provided" required className="sm:col-span-2">
          <TextArea
            value={form.treatment}
            onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))}
            placeholder="e.g. Cervical traction, soft tissue mobilization, dry needling…"
          />
        </Field>
        <Field label="Clinical Notes" className="sm:col-span-2">
          <TextArea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Observations, patient response, modifications…"
          />
        </Field>
        <Field label="Plan for Next Session" className="sm:col-span-2">
          <TextArea
            value={form.nextPlan}
            onChange={e => setForm(f => ({ ...f, nextPlan: e.target.value }))}
            placeholder="Next steps, progression plan, exercises to add…"
          />
        </Field>
      </div>
    </Modal>
  );
}

function PrescriptionModal({ open, onOpenChange, existing, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing: Prescription | null;
  onSave: (rx: Prescription) => void;
}) {
  const { patients } = useAppStore();
  const [form, setForm] = useState<Prescription>(
    existing || {
      id: uid("rx"),
      patientId: patients[0]?.id || "",
      patientName: patients[0]?.name || "",
      date: todayISO(),
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      advice: "",
      followUp: "",
    }
  );

  function updateMed(idx: number, patch: Partial<Prescription["medications"][0]>) {
    setForm(f => ({
      ...f,
      medications: f.medications.map((m, i) => i === idx ? { ...m, ...patch } : m),
    }));
  }
  function addMed() {
    setForm(f => ({ ...f, medications: [...f.medications, { name: "", dosage: "", frequency: "", duration: "" }] }));
  }
  function removeMed(idx: number) {
    setForm(f => ({ ...f, medications: f.medications.filter((_, i) => i !== idx) }));
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={existing ? "Edit Prescription" : "Issue Digital Prescription"}
      description="Prescribe medications with dosage, frequency & advice"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="lime" onClick={() => onSave(form)}>
            <Send className="h-4 w-4" /> Issue Prescription
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Patient" required>
            <SelectInput
              value={form.patientId}
              onValueChange={(v) => {
                const p = patients.find(p => p.id === v);
                setForm(f => ({ ...f, patientId: v, patientName: p?.name || "" }));
              }}
              options={patients.map(p => ({ value: p.id, label: `${p.name} (${p.patientId})` }))}
            />
          </Field>
          <Field label="Date">
            <TextInput type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium">Medications</label>
            <Button variant="outline" size="sm" onClick={addMed}>
              <Plus className="h-3.5 w-3.5" /> Add Medication
            </Button>
          </div>
          <div className="space-y-2">
            {form.medications.map((m, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-muted/40 ring-1 ring-border">
                <input
                  value={m.name}
                  onChange={e => updateMed(i, { name: e.target.value })}
                  placeholder="Medicine name"
                  className="col-span-12 sm:col-span-5 h-9 px-2 rounded-md bg-card ring-1 ring-border text-sm focus:ring-2 focus:ring-foreground/20 outline-none"
                />
                <input
                  value={m.dosage}
                  onChange={e => updateMed(i, { dosage: e.target.value })}
                  placeholder="500mg"
                  className="col-span-4 sm:col-span-2 h-9 px-2 rounded-md bg-card ring-1 ring-border text-sm focus:ring-2 focus:ring-foreground/20 outline-none"
                />
                <input
                  value={m.frequency}
                  onChange={e => updateMed(i, { frequency: e.target.value })}
                  placeholder="Twice daily"
                  className="col-span-4 sm:col-span-2 h-9 px-2 rounded-md bg-card ring-1 ring-border text-sm focus:ring-2 focus:ring-foreground/20 outline-none"
                />
                <input
                  value={m.duration}
                  onChange={e => updateMed(i, { duration: e.target.value })}
                  placeholder="5 days"
                  className="col-span-3 sm:col-span-2 h-9 px-2 rounded-md bg-card ring-1 ring-border text-sm focus:ring-2 focus:ring-foreground/20 outline-none"
                />
                <button
                  onClick={() => removeMed(i)}
                  className="col-span-1 h-8 w-8 flex items-center justify-center rounded-md hover:bg-rose-500/10 text-rose-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <Field label="Advice to Patient">
          <TextArea
            value={form.advice}
            onChange={e => setForm(f => ({ ...f, advice: e.target.value }))}
            placeholder="Lifestyle modifications, precautions, exercises…"
          />
        </Field>
        <Field label="Follow-up Plan">
          <TextArea
            value={form.followUp}
            onChange={e => setForm(f => ({ ...f, followUp: e.target.value }))}
            placeholder="When to review, what to monitor, red flags…"
          />
        </Field>
      </div>
    </Modal>
  );
}
