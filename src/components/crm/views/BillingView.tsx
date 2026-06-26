"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Receipt, Plus, Search, Download, IndianRupee, TrendingUp,
  Clock, CheckCircle2, AlertCircle, FileText, CreditCard, Banknote,
  Smartphone, Shield, Filter, MoreHorizontal, ChevronDown, Percent
} from "lucide-react";
import { invoices, branches, patients } from "@/lib/data";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";

export function BillingView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"invoices" | "packages">("invoices");

  const filtered = invoices.filter(inv => {
    if (search && !inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) && !inv.patientName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    return true;
  });

  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0);
  const pendingAmount = invoices.reduce((s, i) => s + (i.total - i.paid), 0);
  const paidCount = invoices.filter(i => i.status === "paid").length;
  const pendingCount = invoices.filter(i => i.status === "pending" || i.status === "partial").length;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Billing"
        description="Invoices, payments, packages and refunds"
        icon={<Receipt className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-2xl bg-card p-1 premium-shadow ring-1 ring-border/40">
              {[
                { key: "invoices", label: "Invoices" },
                { key: "packages", label: "Packages" },
              ].map(opt => (
                <button key={opt.key} onClick={() => setView(opt.key as any)}
                  className={cn("relative rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                    view === opt.key ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {view === opt.key && <motion.div layoutId="billing-view" className="absolute inset-0 rounded-xl bg-primary/8" />}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128] px-4 text-sm font-semibold text-[#0F1117] shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} /> New Invoice
            </motion.button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Collected", value: totalRevenue, prefix: "₹", icon: IndianRupee, color: "#34D399", bg: "bg-emerald-500/10" },
          { label: "Pending Amount", value: pendingAmount, prefix: "₹", icon: Clock, color: "#FBBF24", bg: "bg-amber-500/10" },
          { label: "Paid Invoices", value: paidCount, icon: CheckCircle2, color: "#D6F04C", bg: "bg-[#D6F04C]/15" },
          { label: "Pending Invoices", value: pendingCount, icon: AlertCircle, color: "#F87171", bg: "bg-rose-500/10" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-3xl bg-card p-4 premium-shadow ring-1 ring-border/40">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", s.bg)} style={{ color: s.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</div>
                  <div className="text-xl font-semibold tabular-nums">
                    {s.prefix && <span>{s.prefix}</span>}
                    <AnimatedCounter value={s.value} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Payment methods */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Banknote, label: "Cash", value: 284500, color: "#34D399" },
          { icon: Smartphone, label: "UPI", value: 412800, color: "#D6F04C" },
          { icon: CreditCard, label: "Card", value: 198400, color: "#B79AFB" },
          { icon: Shield, label: "Insurance", value: 352600, color: "#60A5FA" },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-3xl bg-card p-4 premium-shadow ring-1 ring-border/40">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5" style={{ color: m.color }} />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{m.label}</span>
              </div>
              <div className="mt-2 text-lg font-semibold tabular-nums">₹{(m.value / 1000).toFixed(1)}k</div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(m.value / 412800) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                  className="h-full rounded-full" style={{ background: m.color }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {view === "invoices" && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-10 flex-1 min-w-[220px] max-w-md items-center gap-2.5 rounded-2xl bg-card px-3.5 ring-1 ring-border/60 premium-shadow">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoice no. or patient…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <FilterSelect label="Status" value={statusFilter}
              options={[{ value: "all", label: "All" }, { value: "paid", label: "Paid" }, { value: "pending", label: "Pending" }, { value: "partial", label: "Partial" }, { value: "refunded", label: "Refunded" }]}
              onChange={setStatusFilter} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((inv, i) => {
              const p = patients.find(p => p.id === inv.patientId);
              const branch = branches.find(b => b.id === inv.branchId);
              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40 hover:premium-shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/5">
                        <FileText className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold font-mono">{inv.invoiceNo}</div>
                        <div className="text-[10px] text-muted-foreground">{inv.date}</div>
                      </div>
                    </div>
                    <StatusBadge status={inv.status} size="sm" />
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Avatar name={inv.patientName} color={p?.avatarColor || "#D6F04C"} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{inv.patientName}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                        {branch?.name} · {inv.items.length} items
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium tabular-nums">₹{inv.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1"><Percent className="h-3 w-3" /> GST (5%)</span>
                      <span className="font-medium tabular-nums">₹{inv.tax.toLocaleString("en-IN")}</span>
                    </div>
                    {inv.discount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-medium tabular-nums text-emerald-600">−₹{inv.discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-border/60 pt-1.5 mt-1.5">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold tabular-nums text-base">₹{inv.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {inv.status !== "paid" && inv.status !== "refunded" && (
                    <div className="mt-3 rounded-xl bg-amber-500/10 p-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-700 font-medium">Outstanding</span>
                        <span className="font-semibold text-amber-700 tabular-nums">₹{(inv.total - inv.paid).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-muted/60 py-2 text-xs font-medium ring-1 ring-border/60 hover:bg-muted">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                    {inv.status !== "paid" && inv.status !== "refunded" && (
                      <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-foreground py-2 text-xs font-semibold text-background">
                        <IndianRupee className="h-3.5 w-3.5" /> Collect
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {view === "packages" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Single Session", price: 800, sessions: 1, desc: "Pay-as-you-go", color: "#D6F04C", popular: false },
            { name: "Recovery Pack", price: 6400, sessions: 8, desc: "Save 20% · 8 sessions", color: "#B79AFB", popular: true },
            { name: "Complete Rehab", price: 18000, sessions: 24, desc: "Save 25% · 24 sessions", color: "#34D399", popular: false },
            { name: "Sports Performance", price: 25000, sessions: 30, desc: "Includes assessment + plan", color: "#FBBF24", popular: false },
            { name: "Senior Care", price: 12000, sessions: 16, desc: "Home visit available", color: "#F472B6", popular: false },
            { name: "Post-Surgery", price: 28000, sessions: 36, desc: "12-week intensive rehab", color: "#60A5FA", popular: false },
          ].map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={cn("relative overflow-hidden rounded-3xl bg-card p-5 premium-shadow ring-1 transition-all",
                pkg.popular ? "ring-2 ring-[#D6F04C]/50" : "ring-border/40 hover:premium-shadow-lg")}
            >
              {pkg.popular && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[#D6F04C] px-2 py-0.5 text-[10px] font-bold text-[#0F1117]">
                  <TrendingUp className="h-2.5 w-2.5" /> POPULAR
                </div>
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: `${pkg.color}15`, color: pkg.color }}>
                <Receipt className="h-5 w-5" />
              </div>
              <div className="mt-3 text-sm font-semibold">{pkg.name}</div>
              <div className="text-[11px] text-muted-foreground">{pkg.desc}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-semibold tabular-nums">₹{pkg.price.toLocaleString("en-IN")}</span>
                <span className="text-[11px] text-muted-foreground">/ {pkg.sessions} sessions</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                ₹{Math.round(pkg.price / pkg.sessions)} per session
              </div>
              <button className={cn("mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all",
                pkg.popular ? "bg-gradient-to-br from-[#D6F04C] to-[#A3C128] text-[#0F1117] shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)]" : "bg-foreground text-background")}>
                Select Package
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="flex h-10 items-center gap-2 rounded-2xl bg-muted/60 px-3.5 text-xs font-medium ring-1 ring-border/60 hover:bg-muted">
          <span className="text-muted-foreground">{label}:</span>
          <span className="text-foreground">{current?.label}</span>
          <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={8} className="z-50 w-48 rounded-2xl bg-popover p-1.5 premium-shadow-lg ring-1 ring-border">
          {options.map(o => (
            <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
              className={cn("flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors",
                value === o.value ? "bg-primary/5 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              {o.label}
              {value === o.value && <div className="h-1.5 w-1.5 rounded-full bg-[#D6F04C]" />}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
