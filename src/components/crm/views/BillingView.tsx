"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Receipt, Plus, Search, Download, IndianRupee,
  CheckCircle2, AlertCircle, FileText, CreditCard, Banknote,
  Smartphone, Shield, MoreHorizontal, ChevronDown, Trash2, Printer, FileSpreadsheet
} from "lucide-react";
import { branches, treatmentPackages } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { Button } from "../Form";
import { InvoiceModal } from "../modals/InvoiceModal";
import { cn, formatINR, formatDate, exportToCSV, exportToExcel, exportToHTMLPDF } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { toast } from "sonner";

export function BillingView() {
  const { invoices, deleteInvoice, updateInvoice, addNotification, currentBranchId } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"invoices" | "packages">("invoices");
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      if (currentBranchId !== "all" && inv.branchId !== currentBranchId) return false;
      if (search && !inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) && !inv.patientName.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      return true;
    });
  }, [invoices, search, statusFilter, currentBranchId]);

  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0);
  const pendingAmount = invoices.reduce((s, i) => s + (i.total - i.paid), 0);
  const paidCount = invoices.filter(i => i.status === "paid").length;
  const pendingCount = invoices.filter(i => i.status === "pending" || i.status === "partial").length;

  function handleMarkPaid(id: string) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    updateInvoice(id, { status: "paid", paid: inv.total });
    addNotification({
      id: `n_${Date.now()}`,
      type: "payment",
      title: "Payment received",
      message: `${inv.invoiceNo} marked as paid — ${formatINR(inv.total)}`,
      time: "Just now",
      read: false,
      priority: "high",
    });
    toast.success("Invoice marked as paid");
  }

  function handleRefund(id: string) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    updateInvoice(id, { status: "refunded" });
    addNotification({
      id: `n_${Date.now()}`,
      type: "payment",
      title: "Invoice refunded",
      message: `${inv.invoiceNo} refunded — ${formatINR(inv.total)}`,
      time: "Just now",
      read: false,
      priority: "high",
    });
    toast.success("Invoice refunded");
  }

  function handleDelete(id: string) {
    deleteInvoice(id);
    toast.success("Invoice deleted");
  }

  function handleExportCSV() {
    const rows = filtered.map(inv => ({
      invoiceNo: inv.invoiceNo,
      patient: inv.patientName,
      branch: branches.find(b => b.id === inv.branchId)?.name || "",
      date: inv.date,
      dueDate: inv.dueDate,
      subtotal: inv.subtotal,
      tax: inv.tax,
      discount: inv.discount,
      total: inv.total,
      paid: inv.paid,
      balance: inv.total - inv.paid,
      status: inv.status,
      paymentMethod: inv.paymentMethod || "",
    }));
    exportToCSV(`invoices_${Date.now()}.csv`, rows);
    toast.success("CSV exported");
    setShowExport(false);
  }
  function handleExportExcel() {
    const rows = filtered.map(inv => ({
      invoiceNo: inv.invoiceNo,
      patient: inv.patientName,
      branch: branches.find(b => b.id === inv.branchId)?.name || "",
      date: inv.date,
      total: inv.total,
      paid: inv.paid,
      balance: inv.total - inv.paid,
      status: inv.status,
    }));
    exportToExcel({
      filename: `invoices_${Date.now()}.xls`,
      sheetName: "Invoices",
      columns: [
        { key: "invoiceNo", label: "Invoice No" },
        { key: "patient", label: "Patient" },
        { key: "branch", label: "Branch" },
        { key: "date", label: "Date" },
        { key: "total", label: "Total" },
        { key: "paid", label: "Paid" },
        { key: "balance", label: "Balance" },
        { key: "status", label: "Status" },
      ],
      rows,
    });
    toast.success("Excel exported");
    setShowExport(false);
  }
  function handleExportPDF() {
    const rows = filtered.map(inv => ({
      invoiceNo: inv.invoiceNo,
      patient: inv.patientName,
      branch: branches.find(b => b.id === inv.branchId)?.name || "",
      date: formatDate(inv.date),
      total: inv.total,
      paid: inv.paid,
      balance: inv.total - inv.paid,
      status: inv.status,
    }));
    exportToHTMLPDF({
      filename: `invoices_${Date.now()}.html`,
      title: "Invoice Report",
      subtitle: `${filtered.length} invoice(s) · Total ${formatINR(filtered.reduce((s, i) => s + i.total, 0))}`,
      meta: [
        { label: "Total Invoices", value: String(filtered.length) },
        { label: "Revenue Collected", value: formatINR(filtered.reduce((s, i) => s + i.paid, 0)) },
        { label: "Outstanding", value: formatINR(filtered.reduce((s, i) => s + (i.total - i.paid), 0)) },
        { label: "Generated", value: new Date().toLocaleString("en-IN") },
      ],
      columns: [
        { key: "invoiceNo", label: "Invoice #" },
        { key: "patient", label: "Patient" },
        { key: "branch", label: "Branch" },
        { key: "date", label: "Date" },
        { key: "total", label: "Total", align: "right" },
        { key: "paid", label: "Paid", align: "right" },
        { key: "balance", label: "Balance", align: "right" },
        { key: "status", label: "Status" },
      ],
      rows,
      summary: [
        { label: "Total Revenue", value: formatINR(totalRevenue), accent: "emerald" },
        { label: "Outstanding", value: formatINR(pendingAmount), accent: "rose" },
        { label: "Paid Invoices", value: String(paidCount), accent: "lime" },
        { label: "Pending", value: String(pendingCount), accent: "amber" },
      ],
    });
    toast.success("PDF opened");
    setShowExport(false);
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Billing & Invoices"
        description={`${filtered.length} invoices · ${formatINR(pendingAmount)} outstanding`}
        icon={<Receipt className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Popover.Root open={showExport} onOpenChange={setShowExport}>
              <Popover.Trigger asChild>
                <Button variant="outline" size="default">
                  <Download className="h-4 w-4" /> Export
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content align="end" sideOffset={8} className="z-50 w-56 rounded-2xl bg-popover p-2 premium-shadow-lg ring-1 ring-border">
                  <button onClick={handleExportCSV} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted">
                    <FileText className="h-4 w-4 text-emerald-500" /> CSV
                  </button>
                  <button onClick={handleExportExcel} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Excel
                  </button>
                  <button onClick={handleExportPDF} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted">
                    <FileText className="h-4 w-4 text-rose-500" /> PDF
                  </button>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            <Button variant="lime" onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" /> New Invoice
            </Button>
          </div>
        }
      />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiChip label="Total Revenue" value={formatINR(totalRevenue)} icon={<IndianRupee className="h-4 w-4" />} accent="lime" />
        <KpiChip label="Outstanding" value={formatINR(pendingAmount)} icon={<AlertCircle className="h-4 w-4" />} accent="rose" />
        <KpiChip label="Paid" value={String(paidCount)} icon={<CheckCircle2 className="h-4 w-4" />} accent="emerald" />
        <KpiChip label="Pending" value={String(pendingCount)} icon={<Clock className="h-4 w-4" />} accent="amber" />
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 rounded-xl bg-card p-1 ring-1 ring-border">
          {[
            { key: "invoices", label: "Invoices" },
            { key: "packages", label: "Treatment Packages" },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setView(opt.key as any)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                view === opt.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {view === "invoices" && (
          <>
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search invoice #, patient…"
                className="h-10 w-full rounded-xl bg-card pl-9 pr-3 text-sm ring-1 ring-border focus:ring-2 focus:ring-foreground/20 outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl bg-card px-3 text-sm ring-1 ring-border focus:ring-2 focus:ring-foreground/20 outline-none"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="refunded">Refunded</option>
            </select>
          </>
        )}
      </div>

      {view === "invoices" && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl bg-card ring-1 ring-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Invoice #</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Patient</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Branch</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Balance</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Method</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => {
                  const branch = branches.find(b => b.id === inv.branchId);
                  return (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-border/40 hover:bg-muted/30 group"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{inv.invoiceNo}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={inv.patientName} color="#D6F04C" size="xs" />
                          <span className="text-sm font-medium">{inv.patientName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                          {branch?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(inv.date)}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">{formatINR(inv.total)}</td>
                      <td className="px-4 py-3 text-right text-sm">
                        {inv.total - inv.paid > 0 ? (
                          <span className="text-rose-500 font-semibold">{formatINR(inv.total - inv.paid)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} size="sm" /></td>
                      <td className="px-4 py-3">
                        <PaymentIcon method={inv.paymentMethod} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <InvoiceActions
                          invoice={inv}
                          onMarkPaid={() => handleMarkPaid(inv.id)}
                          onRefund={() => handleRefund(inv.id)}
                          onDelete={() => handleDelete(inv.id)}
                          onPrint={() => printInvoice(inv)}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((inv, i) => {
              const branch = branches.find(b => b.id === inv.branchId);
              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="rounded-2xl bg-card ring-1 ring-border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-xs text-muted-foreground">{inv.invoiceNo}</div>
                    <StatusBadge status={inv.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={inv.patientName} color="#D6F04C" size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{inv.patientName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {branch?.name} · {formatDate(inv.date)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-border/40">
                    <div>
                      <div className="text-muted-foreground text-[10px]">Total</div>
                      <div className="font-semibold">{formatINR(inv.total)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px]">Paid</div>
                      <div className="font-semibold text-emerald-500">{formatINR(inv.paid)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px]">Balance</div>
                      <div className="font-semibold text-rose-500">{formatINR(inv.total - inv.paid)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {inv.status !== "paid" && inv.status !== "refunded" && (
                      <Button size="sm" variant="lime" onClick={() => handleMarkPaid(inv.id)}>Mark Paid</Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => printInvoice(inv)}>Print</Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No invoices found</p>
              <Button variant="lime" size="sm" className="mt-3" onClick={() => setShowModal(true)}>
                <Plus className="h-3.5 w-3.5" /> Create invoice
              </Button>
            </div>
          )}
        </>
      )}

      {view === "packages" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {treatmentPackages.map(pkg => (
            <div key={pkg.id} className="rounded-2xl bg-card ring-1 ring-border p-5 hover:ring-foreground/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold">{pkg.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{pkg.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{formatINR(pkg.price)}</div>
                  <div className="text-[10px] text-muted-foreground">{pkg.sessions} sessions</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" /> {pkg.duration}
                </span>
                <span className="text-muted-foreground">{formatINR(Math.round(pkg.price / pkg.sessions))}/session</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <InvoiceModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}

function KpiChip({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: string }) {
  const colors: Record<string, string> = {
    lime: "text-[#8FA61E] bg-[#D6F04C]/10",
    rose: "text-rose-500 bg-rose-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    amber: "text-amber-500 bg-amber-500/10",
  };
  return (
    <div className="rounded-2xl bg-card ring-1 ring-border p-3 flex items-center gap-3">
      <div className={cn("h-9 w-9 flex items-center justify-center rounded-xl", colors[accent])}>{icon}</div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-bold truncate">{value}</div>
      </div>
    </div>
  );
}

function PaymentIcon({ method }: { method?: string }) {
  if (!method) return <span className="text-xs text-muted-foreground">—</span>;
  const icons: Record<string, React.ReactNode> = {
    cash: <Banknote className="h-3.5 w-3.5 text-emerald-500" />,
    upi: <Smartphone className="h-3.5 w-3.5 text-blue-500" />,
    card: <CreditCard className="h-3.5 w-3.5 text-purple-500" />,
    insurance: <Shield className="h-3.5 w-3.5 text-amber-500" />,
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      {icons[method]}
      <span className="capitalize">{method}</span>
    </span>
  );
}

function InvoiceActions({ invoice, onMarkPaid, onRefund, onDelete, onPrint }: {
  invoice: any;
  onMarkPaid: () => void;
  onRefund: () => void;
  onDelete: () => void;
  onPrint: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="opacity-0 group-hover:opacity-100 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={4} className="z-50 w-48 rounded-xl bg-popover p-1.5 premium-shadow-lg ring-1 ring-border">
          {invoice.status !== "paid" && invoice.status !== "refunded" && (
            <button onClick={() => { onMarkPaid(); setOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-muted">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Mark as Paid
            </button>
          )}
          <button onClick={() => { onPrint(); setOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-muted">
            <Printer className="h-3.5 w-3.5" /> Print Invoice
          </button>
          {invoice.status !== "refunded" && (
            <button onClick={() => { onRefund(); setOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-amber-500/10 text-amber-600">
              <AlertCircle className="h-3.5 w-3.5" /> Refund
            </button>
          )}
          <div className="my-1 h-px bg-border" />
          <button onClick={() => { onDelete(); setOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-rose-500/10 text-rose-500">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function printInvoice(invoice: any) {
  const branch = branches.find(b => b.id === invoice.branchId);
  const html = `<!DOCTYPE html><html><head><title>${invoice.invoiceNo}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #0F1117; }
  .header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #0F1117; }
  .brand { font-size: 24px; font-weight: bold; }
  .meta { text-align: right; font-size: 12px; color: #666; }
  .patient { margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th { background: #0F1117; color: #fff; padding: 10px; text-align: left; font-size: 11px; }
  td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
  .totals { margin-top: 20px; margin-left: auto; width: 300px; }
  .totals div { display: flex; justify-content: space-between; padding: 6px 0; }
  .total { border-top: 2px solid #0F1117; font-weight: bold; font-size: 16px; }
</style></head><body>
  <div class="header">
    <div>
      <div class="brand">Stability Physio Care</div>
      <div style="font-size:12px;color:#666;">${branch?.name} · ${branch?.location}, Chennai</div>
      <div style="font-size:12px;color:#666;">${branch?.phone}</div>
    </div>
    <div class="meta">
      <div style="font-size:20px;font-weight:bold;color:#0F1117;">INVOICE</div>
      <div>${invoice.invoiceNo}</div>
      <div>Date: ${formatDate(invoice.date)}</div>
      <div>Due: ${formatDate(invoice.dueDate)}</div>
    </div>
  </div>
  <div class="patient">
    <strong>Bill To:</strong> ${invoice.patientName}<br>
    <span style="color:#666;font-size:12px;">Payment Method: ${invoice.paymentMethod}</span>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
      ${invoice.items.map((it: any) => `<tr><td>${it.description}</td><td>${it.qty}</td><td>${formatINR(it.rate)}</td><td>${formatINR(it.amount)}</td></tr>`).join("")}
    </tbody>
  </table>
  <div class="totals">
    <div><span>Subtotal:</span><span>${formatINR(invoice.subtotal)}</span></div>
    <div><span>GST (5%):</span><span>${formatINR(invoice.tax)}</span></div>
    <div><span>Discount:</span><span>-${formatINR(invoice.discount)}</span></div>
    <div class="total"><span>Total:</span><span>${formatINR(invoice.total)}</span></div>
    <div><span>Paid:</span><span>${formatINR(invoice.paid)}</span></div>
    <div><span>Balance:</span><span>${formatINR(invoice.total - invoice.paid)}</span></div>
  </div>
  <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (!w) {
    toast.error("Please allow popups to print invoices");
  } else {
    toast.success("Invoice opened in new tab — print to save as PDF");
  }
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
