"use client";

import { useState } from "react";
import { Modal } from "../Modal";
import { Field, TextInput, TextArea, SelectInput, Button } from "../Form";
import { useAppStore } from "@/lib/store";
import { branches, therapists } from "@/lib/data";
import { uid, todayISO, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Appointment } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetPatientId?: string;
}

export function AppointmentModal({ open, onOpenChange, presetPatientId }: Props) {
  const { patients, appointments, addAppointment, addNotification } = useAppStore();
  const [form, setForm] = useState({
    patientId: presetPatientId || patients[0]?.id || "",
    therapistId: therapists[0].id,
    branchId: branches[0].id,
    date: todayISO(),
    time: "10:00",
    duration: "30",
    type: "consultation" as Appointment["type"],
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: "" }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.patientId) e.patientId = "Patient is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fill all required fields");
      return;
    }
    const patient = patients.find(p => p.id === form.patientId);
    const therapist = therapists.find(t => t.id === form.therapistId);
    if (!patient || !therapist) {
      toast.error("Invalid patient or therapist");
      return;
    }
    // Check conflict
    const conflict = appointments.find(a =>
      a.therapistId === form.therapistId &&
      a.date === form.date &&
      a.time === form.time &&
      a.status !== "cancelled"
    );
    if (conflict) {
      toast.error("Time slot conflict — therapist already booked");
      return;
    }

    const appt: Appointment = {
      id: uid("ap"),
      patientId: patient.id,
      patientName: patient.name,
      therapistId: therapist.id,
      therapistName: therapist.name,
      branchId: form.branchId,
      date: form.date,
      time: form.time,
      duration: Number(form.duration),
      type: form.type,
      status: "scheduled",
      notes: form.notes.trim() || undefined,
    };
    addAppointment(appt);
    addNotification({
      id: uid("n"),
      type: "appointment",
      title: "New appointment booked",
      message: `${patient.name} booked ${form.type} at ${form.time} with ${therapist.name}`,
      time: "Just now",
      read: false,
      priority: "high",
    });
    toast.success("Appointment scheduled!", {
      description: `${patient.name} · ${form.date} at ${form.time}`,
    });
    onOpenChange(false);
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
          <Button variant="lime" onClick={submit}>Schedule Appointment</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Patient" required error={errors.patientId} className="sm:col-span-2">
          <SelectInput
            value={form.patientId}
            onValueChange={(v) => update("patientId", v)}
            options={patients.map(p => ({ value: p.id, label: `${p.name} (${p.patientId})` }))}
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
              { value: "30", label: "30 min" },
              { value: "45", label: "45 min" },
              { value: "60", label: "60 min" },
              { value: "90", label: "90 min" },
            ]}
          />
        </Field>
        <Field label="Appointment Type">
          <SelectInput
            value={form.type}
            onValueChange={(v) => update("type", v as Appointment["type"])}
            options={[
              { value: "consultation", label: "Consultation" },
              { value: "therapy", label: "Therapy Session" },
              { value: "follow_up", label: "Follow-up" },
              { value: "assessment", label: "Assessment" },
            ]}
          />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <TextArea
            value={form.notes}
            onChange={e => update("notes", e.target.value)}
            placeholder="Optional notes for the therapist"
          />
        </Field>
      </div>
    </Modal>
  );
}
