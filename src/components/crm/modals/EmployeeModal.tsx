"use client";

import { useState } from "react";
import { Modal } from "../Modal";
import { Field, TextInput, SelectInput, Button } from "../Form";
import { useAppStore } from "@/lib/store";
import { todayISO } from "@/lib/utils";
import { toast } from "sonner";
import {
  useBranches,
  useCreateEmployee,
  useCreateTherapist,
  useCreateNotification,
} from "@/hooks/use-supabase-query";
import type { Employee, Therapist } from "@/lib/types";

const avatarColors = ["#D6F04C", "#B79AFB", "#5EEAD4", "#FBBF24", "#F472B6", "#60A5FA", "#34D399", "#FB923C"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "employee" | "therapist";
}

export function EmployeeModal({ open, onOpenChange, type = "employee" }: Props) {
  const { currentBranchId } = useAppStore();
  const { data: branches = [] } = useBranches();
  
  const createEmployee = useCreateEmployee();
  const createTherapist = useCreateTherapist();
  const createNotification = useCreateNotification();

  const [form, setForm] = useState({
    name: "",
    role: type === "therapist" ? "Physiotherapist" : "Receptionist",
    department: type === "therapist" ? "Clinical" : "Front Office",
    branchId: branches.find(b => b.id === currentBranchId)?.id || branches[0]?.id || "",
    phone: "",
    email: "",
    shift: "9:00 AM - 6:00 PM",
    salary: "",
    specialization: "",
    experience: "",
    certifications: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: "" }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.salary.trim()) e.salary = "Salary is required";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fill all required fields");
      return;
    }

    if (type === "therapist") {
      const payload = {
        name: form.name.trim().startsWith("Dr.") ? form.name.trim() : `Dr. ${form.name.trim()}`,
        specialization: form.specialization || "General Physiotherapy",
        branch_id: form.branchId,
        patients: 0,
        rating: 5.0,
        experience: Number(form.experience) || 1,
        sessions_today: 0,
        revenue: 0,
        avatar_color: avatarColors[Math.floor(Math.random() * avatarColors.length)],
        status: "available",
        certifications: form.certifications.trim() ? form.certifications.split(",").map(c => c.trim()) : [],
      };
      
      createTherapist.mutate(payload as any, {
        onSuccess: () => {
          createNotification.mutate({
            type: "registration",
            title: "New therapist added",
            message: `${payload.name} joined ${branches.find(b => b.id === payload.branch_id)?.name}`,
            priority: "medium",
          });
          toast.success("Therapist added!", { description: payload.name });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error("Failed to add therapist", { description: error.message });
        }
      });
    } else {
      const payload = {
        name: form.name.trim(),
        role: form.role,
        department: form.department,
        branch_id: form.branchId,
        phone: form.phone.trim(),
        email: form.email.trim(),
        status: "active",
        shift: form.shift,
        joined_on: todayISO(),
        avatar_color: avatarColors[Math.floor(Math.random() * avatarColors.length)],
        salary: Number(form.salary) || 0,
      };
      
      createEmployee.mutate(payload as any, {
        onSuccess: () => {
          createNotification.mutate({
            type: "registration",
            title: "New employee added",
            message: `${payload.name} joined as ${payload.role}`,
            priority: "low",
          });
          toast.success("Employee added!", { description: `${payload.name} · ${payload.role}` });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error("Failed to add employee", { description: error.message });
        }
      });
    }
  }

  const isPending = createEmployee.isPending || createTherapist.isPending;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={type === "therapist" ? "Add New Therapist" : "Add New Employee"}
      description={type === "therapist" ? "Onboard a new physiotherapist" : "Onboard a new staff member"}
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="lime" onClick={submit} disabled={isPending}>
            {isPending ? "Adding..." : "Add Member"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required error={errors.name}>
          <TextInput value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Sarah Smith" invalid={!!errors.name} />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <TextInput value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" invalid={!!errors.phone} />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="sarah@example.com" invalid={!!errors.email} />
        </Field>
        
        {type === "employee" && (
          <Field label="Role">
            <SelectInput
              value={form.role}
              onValueChange={(v) => update("role", v)}
              options={[
                { value: "Receptionist", label: "Receptionist" },
                { value: "Branch Admin", label: "Branch Admin" },
                { value: "Cleaner", label: "Cleaner" },
                { value: "Accountant", label: "Accountant" },
              ]}
            />
          </Field>
        )}
        
        <Field label="Branch">
          <SelectInput
            value={form.branchId}
            onValueChange={(v) => update("branchId", v)}
            options={branches.map(b => ({ value: b.id, label: b.name }))}
          />
        </Field>

        {type === "therapist" ? (
          <>
            <Field label="Experience (years)">
              <TextInput type="number" value={form.experience} onChange={e => update("experience", e.target.value)} placeholder="e.g. 5" />
            </Field>
            <Field label="Certifications" hint="Comma-separated" className="sm:col-span-2">
              <TextInput value={form.certifications} onChange={e => update("certifications", e.target.value)} placeholder="MPT Ortho, Dry Needling, IASTM" />
            </Field>
          </>
        ) : (
          <>
            <Field label="Role" required>
              <SelectInput
                value={form.role}
                onValueChange={(v) => update("role", v)}
                options={[
                  { value: "Branch Manager", label: "Branch Manager" },
                  { value: "Receptionist", label: "Receptionist" },
                  { value: "Accounts Executive", label: "Accounts Executive" },
                  { value: "Marketing Lead", label: "Marketing Lead" },
                  { value: "HR Coordinator", label: "HR Coordinator" },
                  { value: "Operations Executive", label: "Operations Executive" },
                ]}
              />
            </Field>
            <Field label="Department">
              <SelectInput
                value={form.department}
                onValueChange={(v) => update("department", v)}
                options={[
                  { value: "Operations", label: "Operations" },
                  { value: "Front Office", label: "Front Office" },
                  { value: "Finance", label: "Finance" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "Human Resources", label: "Human Resources" },
                ]}
              />
            </Field>
          </>
        )}
        <Field label="Branch" required>
          <SelectInput
            value={form.branchId}
            onValueChange={(v) => update("branchId", v)}
            options={branches.map(b => ({ value: b.id, label: b.name }))}
          />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <TextInput value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" invalid={!!errors.phone} />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="name@stabilityphysio.com" invalid={!!errors.email} />
        </Field>
        <Field label="Shift">
          <SelectInput
            value={form.shift}
            onValueChange={(v) => update("shift", v)}
            options={[
              { value: "8:00 AM - 4:00 PM", label: "8 AM - 4 PM" },
              { value: "9:00 AM - 6:00 PM", label: "9 AM - 6 PM" },
              { value: "10:00 AM - 7:00 PM", label: "10 AM - 7 PM" },
              { value: "12:00 PM - 9:00 PM", label: "12 PM - 9 PM" },
            ]}
          />
        </Field>
        <Field label="Salary (₹/month)" required error={errors.salary}>
          <TextInput type="number" value={form.salary} onChange={e => update("salary", e.target.value)} placeholder="e.g. 35000" invalid={!!errors.salary} />
        </Field>
      </div>
    </Modal>
  );
}
