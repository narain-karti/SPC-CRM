"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "../Modal";
import { Field, TextInput, SelectInput, Button } from "../Form";
import { useAppStore } from "@/lib/store";
import { branches, treatmentPackages } from "@/lib/data";
import { uid, todayISO, formatINR } from "@/lib/utils";
import { toast } from "sonner";
import type { Invoice, InvoiceItem } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetPatientId?: string;
}

export function InvoiceModal({ open, onOpenChange, presetPatientId }: Props) {
  const { patients, addInvoice, addNotification } = useAppStore();
  const [form, setForm] = useState({
    patientId: presetPatientId || patients[0]?.id || "",
    branchId: branches[0].id,
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
    const patient = patients.find(p => p.id === form.patientId);
    if (!patient) return;

    const invoice: Invoice = {
      id: uid("inv"),
      invoiceNo: `INV-2026-${String(1000 + Math.floor(Math.random() * 8999))}`,
      patientId: patient.id,
      patientName: patient.name,
      branchId: form.branchId,
      date: form.date,
      dueDate: form.dueDate,
      items: items.filter(i => i.description.trim()),
      subtotal,
      tax,
      discount,
      total,
      paid: 0,
      status: "pending",
      paymentMethod: form.paymentMethod,
    };
    addInvoice(invoice);
    addNotification({
      id: uid("n"),
      type: "payment",
      title: "Invoice created",
      message: `${invoice.invoiceNo} for ${patient.name} — ${formatINR(total)}`,
      time: "Just now",
      read: false,
      priority: "medium",
    });
    toast.success("Invoice created!", {
      description: `${invoice.invoiceNo} · ${formatINR(total)}`,
    });
    onOpenChange(false);
    setItems([{ description: "Consultation Fee", qty: 1, rate: 600, amount: 600 }]);
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
          <Button variant="lime" onClick={submit}>Create Invoice · {formatINR(total)}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Patient" required error={errors.patientId}>
            <SelectInput
              value={form.patientId}
              onValueChange={(v) => update("patientId", v)}
              options={patients.map(p => ({ value: p.id, label: `${p.name} (${p.patientId})` }))}
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
          <Field label="Quick-add package">
            <SelectInput
              value=""
              onValueChange={(v) => v && applyPackage(v)}
              placeholder="Select a treatment package…"
              options={treatmentPackages.map(p => ({ value: p.id, label: `${p.name} — ${formatINR(p.price)}` }))}
            />
          </Field>
          <Field label="Payment Method">
            <SelectInput
              value={form.paymentMethod || "upi"}
              onValueChange={(v) => update("paymentMethod", v as Invoice["paymentMethod"])}
              options={[
                { value: "cash", label: "Cash" },
                { value: "upi", label: "UPI" },
                { value: "card", label: "Card" },
                { value: "insurance", label: "Insurance" },
              ]}
            />
          </Field>
        </div>

        {/* Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Line Items</label>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-3.5 w-3.5" /> Add Item
            </Button>
          </div>
          {errors.items && <p className="text-[11px] text-rose-500">{errors.items}</p>}
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-muted/40 ring-1 ring-border">
                <input
                  value={it.description}
                  onChange={e => updateItem(i, { description: e.target.value })}
                  placeholder="Description"
                  className="col-span-12 sm:col-span-6 h-9 px-2 rounded-md bg-card ring-1 ring-border text-sm focus:ring-2 focus:ring-foreground/20 outline-none"
                />
                <input
                  type="number"
                  value={it.qty}
                  onChange={e => updateItem(i, { qty: Number(e.target.value) || 0 })}
                  placeholder="Qty"
                  className="col-span-3 sm:col-span-2 h-9 px-2 rounded-md bg-card ring-1 ring-border text-sm focus:ring-2 focus:ring-foreground/20 outline-none"
                />
                <input
                  type="number"
                  value={it.rate}
                  onChange={e => updateItem(i, { rate: Number(e.target.value) || 0 })}
                  placeholder="Rate"
                  className="col-span-5 sm:col-span-2 h-9 px-2 rounded-md bg-card ring-1 ring-border text-sm focus:ring-2 focus:ring-foreground/20 outline-none"
                />
                <div className="col-span-3 sm:col-span-1 text-right text-xs font-medium">{formatINR(it.amount)}</div>
                <button
                  onClick={() => removeItem(i)}
                  className="col-span-1 h-8 w-8 flex items-center justify-center rounded-md hover:bg-rose-500/10 text-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Discount (₹)">
            <TextInput type="number" value={form.discount} onChange={e => update("discount", e.target.value)} placeholder="0" />
          </Field>
          <div className="space-y-1 p-3 rounded-xl bg-muted/40 ring-1 ring-border text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><span className="font-medium">{formatINR(tax)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-medium text-rose-500">−{formatINR(discount)}</span></div>
            <div className="flex justify-between pt-1 border-t border-border"><span className="font-semibold">Total</span><span className="font-bold text-base">{formatINR(total)}</span></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
