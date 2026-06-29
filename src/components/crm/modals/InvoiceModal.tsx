"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "../Modal";
import { Field, TextInput, SelectInput, Button } from "../Form";
import { useAppStore } from "@/lib/store";
import { todayISO, formatINR } from "@/lib/utils";
import { toast } from "sonner";
import {
  usePatients,
  useBranches,
  useTreatmentPackages,
  useCreateInvoice,
  useCreateNotification,
} from "@/hooks/use-supabase-query";
import type { Invoice, InvoiceItem } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetPatientId?: string;
}

export function InvoiceModal({ open, onOpenChange, presetPatientId }: Props) {
  const { currentBranchId } = useAppStore();
  const { data: rawPatients = [] } = usePatients(currentBranchId);
  const { data: branches = [] } = useBranches();
  const { data: treatmentPackages = [] } = useTreatmentPackages();
  
  const createInvoice = useCreateInvoice();
  const createNotification = useCreateNotification();

  const [form, setForm] = useState({
    patientId: presetPatientId || rawPatients[0]?.id || "",
    branchId: branches.find(b => b.id === currentBranchId)?.id || branches[0]?.id || "",
    date: todayISO(),
    dueDate: "",
    paymentMethod: "upi" as Invoice["paymentMethod"],
    discount: "0",
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "Consultation Fee", qty: 1, rate: 600, amount: 600 },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: "" }));
  }

  function updateItem(idx: number, patch: Partial<InvoiceItem>) {
    setItems(arr => arr.map((it, i) => i === idx ? { ...it, ...patch, amount: (patch.qty ?? it.qty) * (patch.rate ?? it.rate) } : it));
  }
  function addItem() {
    setItems(arr => [...arr, { description: "", qty: 1, rate: 0, amount: 0 }]);
  }
  function removeItem(idx: number) {
    setItems(arr => arr.filter((_, i) => i !== idx));
  }

  function applyPackage(pkgId: string) {
    const pkg = treatmentPackages.find(p => p.id === pkgId);
    if (!pkg) return;
    setItems([{ description: pkg.name, qty: pkg.sessions, rate: Math.round(pkg.price / pkg.sessions), amount: pkg.price }]);
  }

  const subtotal = items.reduce((s, it) => s + it.amount, 0);
  const tax = Math.round(subtotal * 0.05);
  const discount = Number(form.discount) || 0;
  const total = subtotal + tax - discount;

  function submit() {
    const e: Record<string, string> = {};
    if (!form.patientId) e.patientId = "Patient is required";
    if (items.length === 0 || items.every(i => !i.description.trim())) e.items = "At least one item is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix errors before creating invoice");
      return;
    }
    const patient = rawPatients.find(p => p.id === form.patientId);
    if (!patient) return;

    const payload = {
      invoice_no: `INV-2026-${String(1000 + Math.floor(Math.random() * 8999))}`,
      patient_id: patient.id,
      branch_id: form.branchId,
      date: form.date,
      due_date: form.dueDate,
      items: items.filter(i => i.description.trim()),
      subtotal,
      tax,
      discount,
      total,
      paid: 0,
      status: "pending",
      payment_method: form.paymentMethod,
    };

    createInvoice.mutate(payload as any, {
      onSuccess: () => {
        createNotification.mutate({
          type: "payment",
          title: "Invoice created",
          message: `${payload.invoice_no} for ${patient.name} — ${formatINR(total)}`,
          priority: "medium",
        });
        toast.success("Invoice created!", {
          description: `${payload.invoice_no} · ${formatINR(total)}`,
        });
        onOpenChange(false);
        setItems([{ description: "Consultation Fee", qty: 1, rate: 600, amount: 600 }]);
      },
      onError: (error: any) => {
        toast.error("Failed to create invoice", { description: error.message });
      }
    });
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title="Create New Invoice"
      description="Generate an invoice with line items, GST (5%), and discounts"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="lime" onClick={submit} disabled={createInvoice.isPending}>
            {createInvoice.isPending ? "Creating..." : `Create Invoice · ${formatINR(total)}`}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Patient" required error={errors.patientId}>
            <SelectInput
              value={form.patientId}
              onValueChange={(v) => update("patientId", v)}
              options={rawPatients.map(p => ({ value: p.id, label: `${p.name} (${p.patient_id_code})` }))}
              invalid={!!errors.patientId}
            />
          </Field>
          <Field label="Branch">
            <SelectInput
              value={form.branchId}
              onValueChange={(v) => update("branchId", v)}
              options={branches.map(b => ({ value: b.id, label: b.name }))}
            />
          </Field>
          <Field label="Invoice Date" required>
            <TextInput type="date" value={form.date} onChange={e => update("date", e.target.value)} />
          </Field>
          <Field label="Due Date" required error={errors.dueDate}>
            <TextInput type="date" value={form.dueDate} onChange={e => update("dueDate", e.target.value)} invalid={!!errors.dueDate} />
          </Field>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
          <div className="p-3 bg-muted border-b border-border flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">Line Items</h4>
            <div className="flex items-center gap-2">
              <SelectInput
                value=""
                onValueChange={applyPackage}
                placeholder="Apply Package..."
                className="w-40 h-8 text-xs bg-background"
                options={treatmentPackages.map(p => ({ value: p.id, label: p.name }))}
              />
              <Button variant="outline" size="sm" onClick={addItem} className="h-8">
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
          </div>
          <div className="p-1 max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-background/50">
                <tr>
                  <th className="px-3 py-2 font-medium">Description</th>
                  <th className="px-3 py-2 font-medium w-20">Qty</th>
                  <th className="px-3 py-2 font-medium w-28">Rate (₹)</th>
                  <th className="px-3 py-2 font-medium w-32 text-right">Amount (₹)</th>
                  <th className="px-2 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {items.map((it, idx) => (
                  <tr key={idx} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2">
                      <TextInput 
                        value={it.description} 
                        onChange={e => updateItem(idx, { description: e.target.value })} 
                        placeholder="Item description" 
                        className="h-8 shadow-none bg-transparent"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <TextInput 
                        type="number" min="1" 
                        value={it.qty.toString()} 
                        onChange={e => updateItem(idx, { qty: Number(e.target.value) || 0 })} 
                        className="h-8 shadow-none bg-transparent text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <TextInput 
                        type="number" min="0" 
                        value={it.rate.toString()} 
                        onChange={e => updateItem(idx, { rate: Number(e.target.value) || 0 })} 
                        className="h-8 shadow-none bg-transparent text-right"
                      />
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatINR(it.amount)}
                    </td>
                    <td className="px-2 py-2">
                      <button 
                        onClick={() => removeItem(idx)}
                        className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-md hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No items added. <button onClick={addItem} className="text-lime-600 font-medium hover:underline">Add an item</button>
              </div>
            )}
            {errors.items && <p className="text-[11px] text-rose-500 px-4 py-2 bg-rose-500/10 font-medium">{errors.items}</p>}
          </div>
          
          <div className="bg-background border-t border-border p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Field label="Payment Method">
                <SelectInput
                  value={form.paymentMethod}
                  onValueChange={(v) => update("paymentMethod", v as any)}
                  options={[
                    { value: "upi", label: "UPI (Google Pay, PhonePe)" },
                    { value: "card", label: "Credit/Debit Card" },
                    { value: "cash", label: "Cash" },
                    { value: "bank_transfer", label: "Bank Transfer" },
                  ]}
                />
              </Field>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Discount (₹)</span>
                <input 
                  type="number" 
                  value={form.discount}
                  onChange={e => update("discount", e.target.value)}
                  className="w-24 h-7 px-2 text-right text-sm rounded border border-border bg-muted focus:ring-1 focus:ring-lime-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (5%)</span>
                <span className="font-medium">{formatINR(tax)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-border flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-lime-600 dark:text-lime-400">{formatINR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
