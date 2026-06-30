"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Heart, Activity, FileText, Check, ChevronRight,
  ChevronLeft, Sparkles, Phone
} from "lucide-react";
import { Modal } from "../Modal";
import { Field, TextInput, TextArea, SelectInput, Button } from "../Form";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCreatePatient, useCreateNotification, useBranches, useTherapists } from "@/hooks/use-supabase-query";

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
  address: "", emergencyContact: "", branchId: "", bloodGroup: "O+",
  allergies: "", conditions: "", previousTreatments: "", currentTreatment: "",
  therapistId: "", totalSessions: "12", tags: "Regular",
};

export function PatientRegistrationModal({ open, onOpenChange }: Props) {
  const { currentBranchId } = useAppStore();
  const { data: branches = [] } = useBranches();
  const { data: therapists = [] } = useTherapists(currentBranchId);
  
  const createPatient = useCreatePatient();
  const createNotification = useCreateNotification();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    setData(d => ({
      ...d,
      branchId: d.branchId || (branches.find(b => b.id === currentBranchId)?.id || branches[0]?.id || ""),
      therapistId: d.therapistId || (therapists[0]?.id || ""),
    }));
  }, [branches, therapists, currentBranchId]);

  // Initialize form with fetched data
  useEffect(() => {
    if (open) {
      setData(prev => ({
        ...prev,
        branchId: branches.find(b => b.id === currentBranchId)?.id || branches[0]?.id || "",
        therapistId: therapists[0]?.id || "",
      }));
    }
  }, [open, branches, therapists, currentBranchId]);

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
    const patientPayload = {
      patient_id_code: `SPC-${String(2024000 + Math.floor(Math.random() * 9999))}`,
      name: data.name.trim(),
      age: Number(data.age),
      gender: data.gender,
      phone: data.phone.trim(),
      email: data.email.trim() || null,
      branch_id: data.branchId,
      status: "active",
      therapist_id: data.therapistId,
      tags: data.tags.split(",").map(t => t.trim()).filter(Boolean).concat(data.conditions.split(",").map(c => c.trim()).filter(Boolean)),
      balance_due: 0,
      progress: 0,
    };
    
    createPatient.mutate(patientPayload as any, {
      onSuccess: (resData) => {
        createNotification.mutate({
          type: "registration",
          title: "New patient registered",
          message: `${resData.name} registered at ${branches.find(b => b.id === resData.branch_id)?.name}`,
          priority: "medium"
        });
        
        toast.success(`${resData.name} registered successfully!`, {
          description: `Patient ID: ${resData.patient_id_code}`,
        });
        
        setStep(0);
        setData(initial);
        onOpenChange(false);
      }
    });
  }

  function handleClose(open: boolean) {
    if (!open) {
      setStep(0);
      setData(initial);
    }
    onOpenChange(open);
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      size="4xl"
      title=""
      className="p-0 overflow-hidden bg-background"
    >
      <div className="flex flex-col md:flex-row h-[85vh] md:h-[650px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 bg-muted/30 border-b md:border-b-0 md:border-r border-border p-6 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-600 to-lime-400 dark:from-lime-400 dark:to-lime-200">
              New Patient
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Complete the registration process</p>
          </div>
          
          <div className="flex-1 space-y-1">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === i;
              const isPast = step > i;
              return (
                <div 
                  key={s.key}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all relative overflow-hidden",
                    isActive ? "bg-background shadow-sm ring-1 ring-border text-foreground" : 
                    isPast ? "text-muted-foreground hover:bg-muted/50 cursor-pointer" : "text-muted-foreground/50"
                  )}
                  onClick={() => isPast && setStep(i)}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeStep" 
                      className="absolute inset-0 bg-lime-500/5 dark:bg-lime-500/10 pointer-events-none" 
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors z-10",
                    isActive ? "bg-lime-500/10 text-lime-600 dark:text-lime-400" :
                    isPast ? "bg-muted text-muted-foreground" : "bg-transparent"
                  )}>
                    {isPast ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="z-10">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-background relative">
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="max-w-xl"
              >
                {step === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-lime-500" />
                        Personal Information
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Basic details of the patient.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Full Name" required error={errors.name} className="sm:col-span-2">
                        <TextInput autoFocus value={data.name} onChange={e => update("name", e.target.value)} placeholder="e.g. John Doe" invalid={!!errors.name} />
                      </Field>
                      <Field label="Age" required error={errors.age}>
                        <TextInput type="number" value={data.age} onChange={e => update("age", e.target.value)} placeholder="e.g. 35" invalid={!!errors.age} />
                      </Field>
                      <Field label="Gender" required>
                        <SelectInput
                          value={data.gender}
                          onValueChange={(v) => update("gender", v as "Male" | "Female" | "Other")}
                          options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" },
                          ]}
                        />
                      </Field>
                      <Field label="Date of Birth" required error={errors.dob} className="sm:col-span-2">
                        <TextInput type="date" value={data.dob} onChange={e => update("dob", e.target.value)} invalid={!!errors.dob} />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Phone className="h-5 w-5 text-lime-500" />
                        Contact Details
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">How can we reach the patient?</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Phone Number" required error={errors.phone}>
                          <TextInput autoFocus value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" invalid={!!errors.phone} />
                        </Field>
                        <Field label="Email Address" error={errors.email}>
                          <TextInput type="email" value={data.email} onChange={e => update("email", e.target.value)} placeholder="john@example.com" invalid={!!errors.email} />
                        </Field>
                      </div>
                      <Field label="Residential Address" required error={errors.address}>
                        <TextArea value={data.address} onChange={e => update("address", e.target.value)} placeholder="Full street address, city, state" invalid={!!errors.address} />
                      </Field>
                      <Field label="Emergency Contact (Name & Number)" required error={errors.emergencyContact}>
                        <TextInput value={data.emergencyContact} onChange={e => update("emergencyContact", e.target.value)} placeholder="e.g. Jane Doe - +91 98765 12345" invalid={!!errors.emergencyContact} />
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
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-lime-500" />
                        Medical History
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Important clinical information.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-5">
                      <Field label="Blood Group">
                        <SelectInput
                          value={data.bloodGroup}
                          onValueChange={(v) => update("bloodGroup", v)}
                          options={[
                            { value: "O+", label: "O+" }, { value: "O-", label: "O-" },
                            { value: "A+", label: "A+" }, { value: "A-", label: "A-" },
                            { value: "B+", label: "B+" }, { value: "B-", label: "B-" },
                            { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" },
                          ]}
                        />
                      </Field>
                      <Field label="Primary Condition / Complaint" required error={errors.conditions}>
                        <TextInput autoFocus value={data.conditions} onChange={e => update("conditions", e.target.value)} placeholder="e.g. Lower Back Pain, Post-Op ACL" invalid={!!errors.conditions} />
                      </Field>
                      <Field label="Known Allergies (if any)">
                        <TextInput value={data.allergies} onChange={e => update("allergies", e.target.value)} placeholder="e.g. Latex, Penicillin" />
                      </Field>
                      <Field label="Previous Treatments / Surgeries">
                        <TextArea value={data.previousTreatments} onChange={e => update("previousTreatments", e.target.value)} placeholder="Brief history of relevant past treatments..." />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Heart className="h-5 w-5 text-lime-500" />
                        Treatment Plan
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Assign therapist and set goals.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-5">
                      <Field label="Assigned Therapist" required>
                        <SelectInput
                          value={data.therapistId}
                          onValueChange={(v) => update("therapistId", v)}
                          options={therapists.map(t => ({ value: t.id, label: t.name }))}
                        />
                      </Field>
                      <Field label="Initial Treatment Plan" required error={errors.currentTreatment}>
                        <TextArea autoFocus value={data.currentTreatment} onChange={e => update("currentTreatment", e.target.value)} placeholder="e.g. 12 sessions of core strengthening, manual therapy..." invalid={!!errors.currentTreatment} />
                      </Field>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Recommended Sessions">
                          <TextInput type="number" value={data.totalSessions} onChange={e => update("totalSessions", e.target.value)} />
                        </Field>
                        <Field label="Tags (Comma separated)">
                          <TextInput value={data.tags} onChange={e => update("tags", e.target.value)} placeholder="e.g. VIP, Sports Rehab, Elderly" />
                        </Field>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Check className="h-5 w-5 text-lime-500" />
                        Review Details
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Please verify the information before finalizing.</p>
                    </div>
                    
                    <div className="space-y-4 text-sm bg-muted/30 p-5 rounded-2xl ring-1 ring-border/50">
                      <div className="grid grid-cols-2 gap-y-3">
                        <ReviewRow label="Name" value={data.name} />
                        <ReviewRow label="Age/Gender" value={`${data.age} yrs, ${data.gender}`} />
                        <ReviewRow label="Phone" value={data.phone} />
                        <ReviewRow label="Condition" value={data.conditions} />
                        <ReviewRow label="Branch" value={branches.find(b => b.id === data.branchId)?.name || "—"} />
                        <ReviewRow label="Therapist" value={therapists.find(t => t.id === data.therapistId)?.name || "—"} />
                      </div>
                      <div className="pt-4 mt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 text-lime-600 dark:text-lime-400 font-medium">
                          <Sparkles className="h-4 w-4" />
                          Ready to onboard!
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="border-t border-border p-4 md:p-6 bg-muted/10 flex items-center justify-between shrink-0">
            <Button
              variant="ghost"
              onClick={prev}
              disabled={step === 0}
              className={step === 0 ? "opacity-0 pointer-events-none" : ""}
            >
              <ChevronLeft className="h-4 w-4 mr-1.5" /> Back
            </Button>
            
            {step < steps.length - 1 ? (
              <Button variant="lime" onClick={next} className="px-6">
                Next <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button variant="lime" onClick={handleSubmit} disabled={createPatient.isPending} className="px-6">
                {createPatient.isPending ? "Registering..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ReviewRow({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="font-medium truncate pr-4">{value || "—"}</div>
    </div>
  );
}
