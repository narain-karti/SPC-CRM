"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Search, Plus, Download, MoreHorizontal, ChevronDown,
  Users, Phone, Mail, Calendar, ArrowUpDown,
  X, Stethoscope, Tag, Zap, Trash2, Eye, FileSpreadsheet, FileText,
  Filter, UserPlus, ChevronLeft, ChevronRight, Crown
} from "lucide-react";
import { branches, therapists } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { Modal } from "../Modal";
import { Field, TextInput, TextArea, SelectInput, Button } from "../Form";
import { PatientRegistrationModal } from "../modals/PatientRegistrationModal";
import { cn, formatINR, exportToCSV, exportToExcel, exportToHTMLPDF } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import type { Patient } from "@/lib/types";
import { toast } from "sonner";

type SortKey = "name" | "patientId" | "age" | "registeredOn" | "balance" | "progress";

export function PatientsView() {
  const {
    patients, openPatient, currentBranchId, setView,
    deletePatient, addNotification,
  } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>(currentBranchId === "all" ? "all" : currentBranchId);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let list = patients.filter(p => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.patientId.toLowerCase().includes(q) &&
            !p.phone.includes(q) && !p.email.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (tagFilter !== "all" && !p.tags.includes(tagFilter)) return false;
      if (branchFilter !== "all" && p.branchId !== branchFilter) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "patientId") cmp = a.patientId.localeCompare(b.patientId);
      else if (sortKey === "age") cmp = a.age - b.age;
      else if (sortKey === "registeredOn") cmp = a.registeredOn.localeCompare(b.registeredOn);
      else if (sortKey === "balance") cmp = a.balance - b.balance;
      else if (sortKey === "progress") cmp = a.progress - b.progress;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [patients, search, statusFilter, tagFilter, branchFilter, sortKey, sortDir]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const allSelected = paged.length > 0 && paged.every(p => selected.has(p.id));
  const someSelected = paged.some(p => selected.has(p.id));

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function toggleSelectAll() {
    if (allSelected) {
      const next = new Set(selected);
      paged.forEach(p => next.delete(p.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      paged.forEach(p => next.add(p.id));
      setSelected(next);
    }
  }

  function handleBulkDelete() {
    if (selected.size === 0) return;
    selected.forEach(id => deletePatient(id));
    toast.success(`${selected.size} patient(s) deleted`);
    addNotification({
      id: `n_${Date.now()}`,
      type: "registration",
      title: "Patients deleted",
      message: `${selected.size} patient records were removed`,
      time: "Just now",
      read: false,
      priority: "medium",
    });
    setSelected(new Set());
  }

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "in_consultation", label: "In Consultation" },
    { value: "in_therapy", label: "In Therapy" },
    { value: "follow_up", label: "Follow-up" },
    { value: "discharged", label: "Discharged" },
  ];

  const tagOptions = ["VIP", "Post-Surgery", "Sports", "Regular"];

  function handleExportCSV() {
    const rows = filtered.map(p => ({
      patientId: p.patientId,
      name: p.name,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      email: p.email,
      branch: branches.find(b => b.id === p.branchId)?.name || "",
      status: p.status,
      conditions: p.conditions.join("; "),
      balance: p.balance,
      progress: p.progress,
      registeredOn: p.registeredOn,
    }));
    exportToCSV(`patients_${Date.now()}.csv`, rows);
    toast.success("CSV exported & downloaded");
    setShowExport(false);
  }

  function handleExportExcel() {
    const rows = filtered.map(p => ({
      patientId: p.patientId,
      name: p.name,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      email: p.email,
      branch: branches.find(b => b.id === p.branchId)?.name || "",
      status: p.status,
      conditions: p.conditions.join("; "),
      balance: p.balance,
      progress: p.progress,
      registeredOn: p.registeredOn,
    }));
    exportToExcel({
      filename: `patients_${Date.now()}.xls`,
      sheetName: "Patients",
      columns: [
        { key: "patientId", label: "Patient ID" },
        { key: "name", label: "Name" },
        { key: "age", label: "Age" },
        { key: "gender", label: "Gender" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "branch", label: "Branch" },
        { key: "status", label: "Status" },
        { key: "conditions", label: "Conditions" },
        { key: "balance", label: "Balance" },
        { key: "progress", label: "Progress %" },
        { key: "registeredOn", label: "Registered On" },
      ],
      rows,
    });
    toast.success("Excel exported & downloaded");
    setShowExport(false);
  }

  function handleExportPDF() {
    const rows = filtered.map(p => ({
      patientId: p.patientId,
      name: p.name,
      age: String(p.age),
      phone: p.phone,
      branch: branches.find(b => b.id === p.branchId)?.name || "",
      status: p.status,
      balance: p.balance,
    }));
    exportToHTMLPDF({
      filename: `patients_${Date.now()}.html`,
      title: "Patient Directory",
      subtitle: `${filtered.length} patient(s) listed`,
      meta: [
        { label: "Total Patients", value: String(filtered.length) },
        { label: "Branch", value: currentBranchId === "all" ? "All Branches" : branches.find(b => b.id === currentBranchId)?.name || "—" },
        { label: "Generated", value: new Date().toLocaleString("en-IN") },
      ],
      columns: [
        { key: "patientId", label: "Patient ID" },
        { key: "name", label: "Name" },
        { key: "age", label: "Age", align: "center" },
        { key: "phone", label: "Phone" },
        { key: "branch", label: "Branch" },
        { key: "status", label: "Status" },
        { key: "balance", label: "Balance", align: "right" },
      ],
      rows,
      summary: [
        { label: "Total Patients", value: String(filtered.length), accent: "lime" },
        { label: "Active", value: String(filtered.filter(p => p.status === "active").length), accent: "emerald" },
        { label: "Total Outstanding", value: formatINR(filtered.reduce((s, p) => s + p.balance, 0)), accent: "rose" },
        { label: "Avg Progress", value: `${Math.round(filtered.reduce((s, p) => s + p.progress, 0) / (filtered.length || 1))}%`, accent: "purple" },
      ],
    });
    toast.success("PDF report opened — print/save as PDF");
    setShowExport(false);
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Patients"
        description={`${filtered.length} of ${patients.length} patient records`}
        icon={<Users className="h-5 w-5" />}
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
                  <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Export Format</div>
                  <button onClick={handleExportCSV} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted">
                    <FileText className="h-4 w-4 text-emerald-500" /> CSV (auto-download)
                  </button>
                  <button onClick={handleExportExcel} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Excel (auto-download)
                  </button>
                  <button onClick={handleExportPDF} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted">
                    <FileText className="h-4 w-4 text-rose-500" /> PDF (print-ready)
                  </button>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            <Button variant="lime" onClick={() => setShowRegister(true)}>
              <UserPlus className="h-4 w-4" /> Register Patient
            </Button>
          </div>
        }
      />

      {/* Filter bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search name, ID, phone…"
              className="h-10 w-full rounded-xl bg-card pl-9 pr-3 text-sm ring-1 ring-border focus:ring-2 focus:ring-foreground/20 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Button variant="outline" size="default" onClick={() => setShowFilters(f => !f)}>
            <Filter className="h-4 w-4" /> Filters
            {(statusFilter !== "all" || tagFilter !== "all" || branchFilter !== "all") && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6F04C]" />
            )}
          </Button>
          {selected.size > 0 && (
            <Button variant="destructive" size="default" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4" /> Delete ({selected.size})
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-card ring-1 ring-border">
                <Field label="Status">
                  <SelectInput
                    value={statusFilter}
                    onValueChange={(v) => { setStatusFilter(v); setPage(0); }}
                    options={statusOptions}
                  />
                </Field>
                <Field label="Tag">
                  <SelectInput
                    value={tagFilter}
                    onValueChange={(v) => { setTagFilter(v); setPage(0); }}
                    options={[{ value: "all", label: "All Tags" }, ...tagOptions.map(t => ({ value: t, label: t }))]}
                  />
                </Field>
                <Field label="Branch">
                  <SelectInput
                    value={branchFilter}
                    onValueChange={(v) => { setBranchFilter(v); setPage(0); }}
                    options={[{ value: "all", label: "All Branches" }, ...branches.map(b => ({ value: b.id, label: b.name }))]}
                  />
                </Field>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table — responsive: card view on mobile, table on desktop */}
      <div className="rounded-2xl bg-card ring-1 ring-border overflow-hidden">
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="px-4 py-3 text-left w-10">
                  <button onClick={toggleSelectAll} className="flex h-5 w-5 items-center justify-center rounded-md ring-1 ring-border hover:bg-muted">
                    {allSelected && <span className="h-3 w-3 rounded-sm bg-[#D6F04C]" />}
                    {!allSelected && someSelected && <span className="h-1.5 w-1.5 rounded-sm bg-muted-foreground" />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                    Patient <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort("patientId")} className="flex items-center gap-1 hover:text-foreground">
                    ID <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Branch</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Therapist</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort("progress")} className="flex items-center gap-1 hover:text-foreground">
                    Progress <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort("balance")} className="flex items-center gap-1 hover:text-foreground ml-auto">
                    Balance <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p, i) => {
                const branch = branches.find(b => b.id === p.branchId);
                const therapist = therapists.find(t => t.id === p.therapistId);
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => openPatient(p.id)}
                    className="border-b border-border/40 hover:bg-muted/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggleSelect(p.id); }}>
                      <button className="flex h-5 w-5 items-center justify-center rounded-md ring-1 ring-border hover:bg-muted">
                        {selected.has(p.id) && <span className="h-3 w-3 rounded-sm bg-[#D6F04C]" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} color={p.avatarColor} size="sm" />
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-foreground truncate flex items-center gap-1.5">
                            {p.name}
                            {p.tags.includes("VIP") && <Crown className="h-3 w-3 text-amber-500" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{p.age}y · {p.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-muted-foreground">{p.patientId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-foreground">{p.phone}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">{p.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                        {branch?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground">{therapist?.name.replace("Dr. ", "Dr. ")}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} size="sm" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#D6F04C] to-[#A3C128]"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.balance > 0 ? (
                        <span className="text-xs font-semibold text-rose-500">{formatINR(p.balance)}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); openPatient(p.id); }}
                        className="opacity-0 group-hover:opacity-100 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-border/40">
          {paged.map((p, i) => {
            const branch = branches.find(b => b.id === p.branchId);
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => openPatient(p.id)}
                className="w-full text-left p-4 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={p.name} color={p.avatarColor} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground flex items-center gap-1.5">
                      <span className="truncate">{p.name}</span>
                      {p.tags.includes("VIP") && <Crown className="h-3 w-3 text-amber-500 shrink-0" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.patientId} · {p.age}y · {p.gender}</div>
                  </div>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{p.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                    <span>{branch?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Progress:</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#D6F04C] to-[#A3C128]" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="font-medium">{p.progress}%</span>
                  </div>
                  {p.balance > 0 && (
                    <div className="text-rose-500 font-semibold">{formatINR(p.balance)} due</div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {paged.length === 0 && (
          <div className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No patients found</p>
            <Button variant="lime" size="sm" className="mt-3" onClick={() => setShowRegister(true)}>
              <Plus className="h-3.5 w-3.5" /> Register new patient
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              Page {page + 1} of {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <PatientRegistrationModal open={showRegister} onOpenChange={setShowRegister} />
    </div>
  );
}
