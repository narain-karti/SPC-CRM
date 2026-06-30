"use client";

import { useState, useEffect } from "react";
import { Modal } from "../Modal";
import { Field, TextInput, TextArea, SelectInput, Button } from "../Form";
import { todayISO, cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  usePatients,
  useAppointments,
  useBranches,
  useTherapists,
  useCreateAppointment,
  useCreateNotification,
} from "@/hooks/use-supabase-query";
import { useAppStore } from "@/lib/store";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetPatientId?: string;
}

export function AppointmentModal({ open, onOpenChange, presetPatientId }: Props) {
  const { currentBranchId } = useAppStore();
  const { data: rawPatients = [] } = usePatients(currentBranchId);
  const { data: rawAppointments = [] } = useAppointments(currentBranchId);
  const { data: branches = [] } = useBranches();
  const { data: therapists = [] } = useTherapists(currentBranchId);

  const createAppointment = useCreateAppointment();
  const createNotification = useCreateNotification();

  const [form, setForm] = useState({
    patientId: presetPatientId || (rawPatients[0]?.id || ""),
    therapistId: therapists[0]?.id || "",
    branchId: branches.find(b => b.id === currentBranchId)?.id || branches[0]?.id || "",
    date: todayISO(),
    time: "10:00",
    duration: "30",
    type: "consultation",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(f => ({
      ...f,
      patientId: f.patientId || presetPatientId || (rawPatients[0]?.id || ""),
      therapistId: f.therapistId || (therapists[0]?.id || ""),
      branchId: f.branchId || (branches.find(b => b.id === currentBranchId)?.id || branches[0]?.id || ""),
    }));
  }, [rawPatients, therapists, branches, currentBranchId, presetPatientId]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: "" }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.patientId) e.patientId = "Patient is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    if (!form.therapistId) e.therapistId = "Therapist is required";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fill all required fields");
      return;
    }
    const patient = rawPatients.find(p => p.id === form.patientId);
    const therapist = therapists.find(t => t.id === form.therapistId);
    if (!patient || !therapist) {
      toast.error("Invalid patient or therapist");
      return;
    }
    // Check conflict
    const conflict = rawAppointments.find(a =>
      a.therapist_id === form.therapistId &&
      a.date === form.date &&
      a.time.startsWith(form.time) &&
      a.status !== "cancelled"
    );
    if (conflict) {
      toast.error("Time slot conflict — therapist already booked");
      return;
    }

    const payload = {
      patient_id: patient.id,
      therapist_id: therapist.id,
      branch_id: form.branchId,
      date: form.date,
      time: `${form.time}:00`,
      duration: Number(form.duration),
      type: form.type as any,
      status: "scheduled",
      notes: form.notes.trim() || null,
    };

    createAppointment.mutate(payload, {
      onSuccess: () => {
        createNotification.mutate({
          type: "appointment",
          title: "New appointment booked",
          message: `${patient.name} booked ${form.type} at ${form.time} with ${therapist.name}`,
          priority: "high"
        });
        
        toast.success("Appointment scheduled!", {
          description: `${patient.name} · ${form.date} at ${form.time}`,
        });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error("Failed to schedule appointment", { description: error.message });
      }
    });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Book New Appointment"
      description="Schedule a consultation, therapy session, or follow-up"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="lime" onClick={submit} disabled={createAppointment.isPending}>
            {createAppointment.isPending ? "Scheduling..." : "Schedule Appointment"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Patient" required error={errors.patientId} className="sm:col-span-2">
          <SelectInput
            value={form.patientId}
            onValueChange={(v) => update("patientId", v)}
            options={rawPatients.map(p => ({ value: p.id, label: `${p.name} (${p.patient_id_code})` }))}
            invalid={!!errors.patientId}
          />
        </Field>
        <Field label="Therapist" required>
          <SelectInput
            value={form.therapistId}
            onValueChange={(v) => update("therapistId", v)}
            options={therapists.map(t => ({ value: t.id, label: t.name }))}
          />
        </Field>
        <Field label="Branch" required>
          <SelectInput
            value={form.branchId}
            onValueChange={(v) => update("branchId", v)}
            options={branches.map(b => ({ value: b.id, label: b.name }))}
          />
        </Field>
        <Field label="Date" required error={errors.date}>
          <TextInput type="date" value={form.date} onChange={e => update("date", e.target.value)} invalid={!!errors.date} />
        </Field>
        <Field label="Time" required error={errors.time}>
          <TextInput type="time" value={form.time} onChange={e => update("time", e.target.value)} invalid={!!errors.time} />
        </Field>
        <Field label="Duration (minutes)">
          <SelectInput
            value={form.duration}
            onValueChange={(v) => update("duration", v)}
            options={[
              { value: "15", label: "15 mins" },
              { value: "30", label: "30 mins" },
              { value: "45", label: "45 mins" },
              { value: "60", label: "1 hour" },
              { value: "90", label: "1.5 hours" },
            ]}
          />
        </Field>
        <Field label="Type">
          <SelectInput
            value={form.type}
            onValueChange={(v) => update("type", v as any)}
            options={[
              { value: "consultation", label: "Consultation" },
              { value: "therapy", label: "Therapy Session" },
              { value: "follow_up", label: "Follow-up" },
              { value: "assessment", label: "Assessment" },
            ]}
          />
        </Field>
        <Field label="Notes (Optional)" className="sm:col-span-2">
          <TextArea
            value={form.notes}
            onChange={e => update("notes", e.target.value)}
            placeholder="Add any specific requirements or notes for the therapist..."
            className="min-h-[80px]"
          />
        </Field>
      </div>
    </Modal>
  );
}
