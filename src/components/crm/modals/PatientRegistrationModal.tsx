"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Heart, Activity, FileText, Check, ChevronRight,
  ChevronLeft, Sparkles, Phone, Mail, MapPin
} from "lucide-react";
import { Modal } from "../Modal";
import { Field, TextInput, TextArea, SelectInput, Button } from "../Form";
import { useAppStore } from "@/lib/store";
import { branches, therapists } from "@/lib/data";
import { cn, uid, todayISO } from "@/lib/utils";
import { toast } from "sonner";
import type { Patient } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { key: "personal", label: "Personal", icon: User },
  { key: "contact", label: "Contact", icon: Phone },
  { key: "medical", label: "Medical", icon: Activity },
  { key: "treatment", label: "Treatment", icon: Heart },
  { key: "review", label: "Review", icon: FileText },
];

const avatarColors = ["#D6F04C", "#B79AFB", "#5EEAD4", "#FBBF24", "#F472B6", "#60A5FA", "#34D399", "#FB923C"];

interface FormData {
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  branchId: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  previousTreatments: string;
  currentTreatment: string;
  therapistId: string;
  totalSessions: string;
  tags: string;
}

const initial: FormData = {
  name: "", age: "", gender: "Male", dob: "", phone: "", email: "",
  address: "", emergencyContact: "", branchId: branches[0].id, bloodGroup: "O+",
  allergies: "", conditions: "", previousTreatments: "", currentTreatment: "",
  therapistId: therapists[0].id, totalSessions: "12", tags: "Regular",
};

export function PatientRegistrationModal({ open, onOpenChange }: Props) {
  const { addPatient, addNotification } = useAppStore();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData(d => ({ ...d, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validateStep(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!data.name.trim()) e.name = "Name is required";
      if (!data.age.trim()) e.age = "Age is required";
      else if (isNaN(Number(data.age)) || Number(data.age) < 0 || Number(data.age) > 120) e.age = "Enter a valid age (1-120)";
      if (!data.dob) e.dob = "Date of birth is required";
    }
    if (step === 1) {
      if (!data.phone.trim()) e.phone = "Phone is required";
      else if (!/^\+?[\d\s-]{10,}$/.test(data.phone)) e.phone = "Enter a valid phone";
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email";
      if (!data.address.trim()) e.address = "Address is required";
      if (!data.emergencyContact.trim()) e.emergencyContact = "Emergency contact is required";
    }
    if (step === 2) {
      if (!data.conditions.trim()) e.conditions = "Please describe the patient's condition";
    }
    if (step === 3) {
      if (!data.currentTreatment.trim()) e.currentTreatment = "Treatment plan is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep()) {
      toast.error("Please fix the errors before continuing");
      return;
    }
    if (step < steps.length - 1) setStep(s => s + 1);
  }

  function prev() {
    if (step > 0) setStep(s => s - 1);
  }

  function handleSubmit() {
    if (!validateStep()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    const patient: Patient = {
      id: uid("pt"),
      patientId: `SPC-${String(2024000 + Math.floor(Math.random() * 9999))}`,
      name: data.name.trim(),
      age: Number(data.age),
      gender: data.gender,
      dob: data.dob,
      phone: data.phone.trim(),
      email: data.email.trim() || `${data.name.toLowerCase().replace(/\s/g, ".")}@email.com`,
      address: data.address.trim(),
      emergencyContact: data.emergencyContact.trim(),
      branchId: data.branchId,
      bloodGroup: data.bloodGroup,
      allergies: data.allergies.trim() ? data.allergies.split(",").map(a => a.trim()) : ["None"],
      conditions: data.conditions.split(",").map(c => c.trim()).filter(Boolean),
      previousTreatments: data.previousTreatments.trim() ? data.previousTreatments.split(",").map(t => t.trim()) : [],
      currentTreatment: data.currentTreatment.trim(),
      status: "in_consultation",
      therapistId: data.therapistId,
      tags: data.tags.split(",").map(t => t.trim()).filter(Boolean),
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      registeredOn: todayISO(),
      lastVisit: todayISO(),
      nextAppointment: undefined,
      progress: 0,
      totalSessions: Number(data.totalSessions) || 12,
      completedSessions: 0,
      balance: 0,
    };
    addPatient(patient);
    addNotification({
      id: uid("n"),
      type: "registration",
      title: "New patient registered",
      message: `${patient.name} registered at ${branches.find(b => b.id === patient.branchId)?.name}`,
      time: "Just now",
      read: false,
      priority: "medium",
    });
    toast.success(`${patient.name} registered successfully!`, {
      description: `Patient ID: ${patient.patientId}`,
    });
    setStep(0);
    setData(initial);
    onOpenChange(false);
  }

  function handleClose(open: boolean) {
    if (!open) {
      setTimeout(() => {
        setStep(0);
        setData(initial);
        setErrors({});
      }, 200);
    }
    onOpenChange(open);
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      size="xl"
      title="Register New Patient"
      description="Complete the multi-step form to add a new patient to the CRM"
    >
      {/* Stepper */}
      <div className="mb-6 -mt-2">
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isComplete = i < step;
            return (
              <div key={s.key} className="flex items-center flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-2 sm:px-3 py-1.5 transition-all",
                    isActive && "bg-foreground text-background",
                    isComplete && "bg-[#D6F04C]/20 text-[#8FA61E]",
                    !isActive && !isComplete && "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    isActive ? "bg-background text-foreground" : isComplete ? "bg-[#D6F04C] text-[#0F1117]" : "bg-muted"
                  )}>
                    {isComplete ? <Check className="h-3 w-3" /> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 mx-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-[#D6F04C]" />
                <h4 className="text-sm font-semibold">Personal Information</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" required error={errors.name} className="sm:col-span-2">
                  <TextInput
                    value={data.name}
                    onChange={e => update("name", e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    invalid={!!errors.name}
                  />
                </Field>
                <Field label="Age" required error={errors.age}>
                  <TextInput
                    type="number"
                    value={data.age}
                    onChange={e => update("age", e.target.value)}
                    placeholder="e.g. 32"
                    invalid={!!errors.age}
                  />
                </Field>
                <Field label="Gender" required>
                  <SelectInput
                    value={data.gender}
                    onValueChange={(v) => update("gender", v as FormData["gender"])}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </Field>
                <Field label="Date of Birth" required error={errors.dob}>
                  <TextInput
                    type="date"
                    value={data.dob}
                    onChange={e => update("dob", e.target.value)}
                    invalid={!!errors.dob}
                  />
                </Field>
                <Field label="Blood Group">
                  <SelectInput
                    value={data.bloodGroup}
                    onValueChange={(v) => update("bloodGroup", v)}
                    options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(b => ({ value: b, label: b }))}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-[#D6F04C]" />
                <h4 className="text-sm font-semibold">Contact Information</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone Number" required error={errors.phone}>
                  <TextInput
                    value={data.phone}
                    onChange={e => update("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    invalid={!!errors.phone}
                  />
                </Field>
                <Field label="Email Address" error={errors.email}>
                  <TextInput
                    type="email"
                    value={data.email}
                    onChange={e => update("email", e.target.value)}
                    placeholder="patient@email.com"
                    invalid={!!errors.email}
                  />
                </Field>
                <Field label="Address" required error={errors.address} className="sm:col-span-2">
                  <TextArea
                    value={data.address}
                    onChange={e => update("address", e.target.value)}
                    placeholder="House no, Street, Area, City"
                    invalid={!!errors.address}
                  />
                </Field>
                <Field label="Emergency Contact" required error={errors.emergencyContact}>
                  <TextInput
                    value={data.emergencyContact}
                    onChange={e => update("emergencyContact", e.target.value)}
                    placeholder="+91 98765 43210"
                    invalid={!!errors.emergencyContact}
                  />
                </Field>
                <Field label="Preferred Branch" required>
                  <SelectInput
                    value={data.branchId}
                    onValueChange={(v) => update("branchId", v)}
                    options={branches.map(b => ({ value: b.id, label: `${b.name} — ${b.location}` }))}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-[#D6F04C]" />
                <h4 className="text-sm font-semibold">Medical History</h4>
              </div>
              <Field label="Current Conditions / Complaints" required error={errors.conditions} hint="Comma-separated, e.g. Lower Back Pain, Sciatica">
                <TextArea
                  value={data.conditions}
                  onChange={e => update("conditions", e.target.value)}
                  placeholder="e.g. Lower Back Pain, Sciatica"
                  invalid={!!errors.conditions}
                />
              </Field>
              <Field label="Known Allergies" hint="Comma-separated, or leave blank if none">
                <TextInput
                  value={data.allergies}
                  onChange={e => update("allergies", e.target.value)}
                  placeholder="e.g. Penicillin, Latex"
                />
              </Field>
              <Field label="Previous Treatments" hint="Comma-separated treatments undertaken">
                <TextInput
                  value={data.previousTreatments}
                  onChange={e => update("previousTreatments", e.target.value)}
                  placeholder="e.g. Manual Therapy, Dry Needling"
                />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-[#D6F04C]" />
                <h4 className="text-sm font-semibold">Treatment Plan</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Assigned Therapist" required>
                  <SelectInput
                    value={data.therapistId}
                    onValueChange={(v) => update("therapistId", v)}
                    options={therapists.map(t => ({ value: t.id, label: `${t.name} — ${t.specialization}` }))}
                  />
                </Field>
                <Field label="Total Sessions Planned" required>
                  <TextInput
                    type="number"
                    value={data.totalSessions}
                    onChange={e => update("totalSessions", e.target.value)}
                    placeholder="e.g. 12"
                  />
                </Field>
                <Field label="Current Treatment" required error={errors.currentTreatment} className="sm:col-span-2">
                  <TextArea
                    value={data.currentTreatment}
                    onChange={e => update("currentTreatment", e.target.value)}
                    placeholder="e.g. Manual Therapy + Cervical Traction, 3x/week"
                    invalid={!!errors.currentTreatment}
                  />
                </Field>
                <Field label="Tags" hint="Comma-separated: VIP, Sports, Post-Surgery, Regular">
                  <TextInput
                    value={data.tags}
                    onChange={e => update("tags", e.target.value)}
                    placeholder="Regular"
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-[#D6F04C]" />
                <h4 className="text-sm font-semibold">Review & Confirm</h4>
              </div>
              <div className="rounded-2xl bg-muted/40 p-4 ring-1 ring-border space-y-3 max-h-[40vh] overflow-y-auto scrollbar-premium">
                <ReviewRow label="Name" value={data.name} />
                <ReviewRow label="Age / Gender" value={`${data.age}y · ${data.gender}`} />
                <ReviewRow label="Date of Birth" value={data.dob} />
                <ReviewRow label="Phone" value={data.phone} />
                <ReviewRow label="Email" value={data.email || "—"} />
                <ReviewRow label="Address" value={data.address} />
                <ReviewRow label="Emergency Contact" value={data.emergencyContact} />
                <ReviewRow label="Branch" value={branches.find(b => b.id === data.branchId)?.name || "—"} />
                <ReviewRow label="Blood Group" value={data.bloodGroup} />
                <ReviewRow label="Allergies" value={data.allergies || "None"} />
                <ReviewRow label="Conditions" value={data.conditions} />
                <ReviewRow label="Previous Treatments" value={data.previousTreatments || "—"} />
                <ReviewRow label="Therapist" value={therapists.find(t => t.id === data.therapistId)?.name || "—"} />
                <ReviewRow label="Total Sessions" value={data.totalSessions} />
                <ReviewRow label="Current Treatment" value={data.currentTreatment} />
                <ReviewRow label="Tags" value={data.tags} />
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#D6F04C]/10 ring-1 ring-[#D6F04C]/30">
                <Sparkles className="h-4 w-4 text-[#8FA61E] shrink-0 mt-0.5" />
                <p className="text-xs text-foreground">
                  A unique Patient ID will be auto-generated. The patient will be marked as <span className="font-semibold">In Consultation</span> status with 0% progress.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-border/60">
        <Button variant="ghost" onClick={prev} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Step {step + 1} of {steps.length}
        </div>
        {step < steps.length - 1 ? (
          <Button variant="lime" onClick={next}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="lime" onClick={handleSubmit}>
            <Check className="h-4 w-4" /> Register Patient
          </Button>
        )}
      </div>
    </Modal>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium text-foreground text-right max-w-[60%] break-words">{value || "—"}</span>
    </div>
  );
}
