"use client";

import { useState } from "react";
import { Modal } from "../Modal";
import { Field, TextInput, TextArea, SelectInput, Button } from "../Form";
import { useAppStore } from "@/lib/store";
import { branches } from "@/lib/data";
import { uid, todayISO } from "@/lib/utils";
import { toast } from "sonner";
import type { Lead } from "@/lib/types";

const avatarColors = ["#D6F04C", "#B79AFB", "#5EEAD4", "#FBBF24", "#F472B6", "#60A5FA", "#34D399", "#FB923C"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadModal({ open, onOpenChange }: Props) {
  const { addLead, addNotification } = useAppStore();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "walk_in" as Lead["source"],
    stage: "new" as Lead["stage"],
    branchId: branches[0].id,
    interest: "",
    value: "",
    notes: "",
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
    if (!form.interest.trim()) e.interest = "Interest is required";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fill all required fields");
      return;
    }
    const lead: Lead = {
      id: uid("ld"),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      source: form.source,
      stage: form.stage,
      branchId: form.branchId,
      interest: form.interest.trim(),
      value: Number(form.value) || 0,
      createdAt: todayISO(),
      notes: form.notes.trim(),
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
    };
    addLead(lead);
    addNotification({
      id: uid("n"),
      type: "registration",
      title: "New lead added",
      message: `${lead.name} added as new lead (${lead.source})`,
      time: "Just now",
      read: false,
      priority: "medium",
    });
    toast.success("Lead added to pipeline!", {
      description: `${lead.name} · ${branches.find(b => b.id === lead.branchId)?.name}`,
    });
    onOpenChange(false);
    setForm({
      name: "", phone: "", email: "", source: "walk_in", stage: "new",
      branchId: branches[0].id, interest: "", value: "", notes: "",
    });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Add New Lead"
      description="Capture a new prospect into the sales pipeline"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="lime" onClick={submit}>Add Lead</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required error={errors.name}>
          <TextInput value={form.name} onChange={e => update("name", e.target.value)} placeholder="Lead name" invalid={!!errors.name} />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <TextInput value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" invalid={!!errors.phone} />
        </Field>
        <Field label="Email">
          <TextInput type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="lead@email.com" />
        </Field>
        <Field label="Source">
          <SelectInput
            value={form.source}
            onValueChange={(v) => update("source", v as Lead["source"])}
            options={[
              { value: "walk_in", label: "Walk-in" },
              { value: "whatsapp", label: "WhatsApp" },
              { value: "instagram", label: "Instagram" },
              { value: "doctor_referral", label: "Doctor Referral" },
              { value: "website", label: "Website" },
              { value: "phone", label: "Phone" },
            ]}
          />
        </Field>
        <Field label="Stage">
          <SelectInput
            value={form.stage}
            onValueChange={(v) => update("stage", v as Lead["stage"])}
            options={[
              { value: "new", label: "New" },
              { value: "contacted", label: "Contacted" },
              { value: "consultation", label: "Consultation" },
              { value: "converted", label: "Converted" },
              { value: "lost", label: "Lost" },
            ]}
          />
        </Field>
        <Field label="Branch">
          <SelectInput
            value={form.branchId}
            onValueChange={(v) => update("branchId", v)}
            options={branches.map(b => ({ value: b.id, label: b.name }))}
          />
        </Field>
        <Field label="Interest" required error={errors.interest} className="sm:col-span-2">
          <TextInput value={form.interest} onChange={e => update("interest", e.target.value)} placeholder="e.g. Knee Pain Consultation, Sports Rehab Package" invalid={!!errors.interest} />
        </Field>
        <Field label="Estimated Value (₹)">
          <TextInput type="number" value={form.value} onChange={e => update("value", e.target.value)} placeholder="e.g. 4500" />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <TextArea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Conversation summary, follow-up notes, etc." />
        </Field>
      </div>
    </Modal>
  );
}
