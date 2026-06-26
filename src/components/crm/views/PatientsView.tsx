"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Search, Filter, Plus, Download, MoreHorizontal, ChevronDown,
  Users, Phone, Mail, Calendar, ArrowUpDown, CheckSquare, Square,
  X, Stethoscope, TrendingUp, ArrowUpRight, Tag, Crown, Sparkles, Zap, Activity
} from "lucide-react";
import { patients, branches, therapists } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";

type SortKey = "name" | "patientId" | "age" | "registeredOn" | "balance" | "progress";

export function PatientsView() {
  const { openPatient, currentBranchId, setView } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>(currentBranchId === "all" ? "all" : currentBranchId);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
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
  }, [search, statusFilter, tagFilter, branchFilter, sortKey, sortDir]);

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

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "in_consultation", label: "In Consultation" },
    { value: "in_therapy", label: "In Therapy" },
    { value: "follow_up", label: "Follow-up" },
    { value: "discharged", label: "Discharged" },
  ];

  const tagOptions = ["VIP", "Post-Surgery", "Sports", "Regular"];

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Patients"
        description={`${filtered.length} patients ${currentBranchId !== "all" ? "in this branch" : "across all branches"}`}
        icon={<Users className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2">
            <button className="flex h-10 items-center gap-2 rounded-2xl bg-card px-3.5 text-sm font-medium ring-1 ring-border/60 transition-all hover:bg-muted premium-shadow">
              <Download className="h-4 w-4" /> <span className="hidden sm:block">Export</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128] px-4 text-sm font-semibold text-[#0F1117] shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} /> New Patient
            </motion.button>
          </div>
        }
      />

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-card p-3 premium-shadow ring-1 ring-border/40"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 flex-1 min-w-[220px] items-center gap-2.5 rounded-2xl bg-muted/60 px-3.5 ring-1 ring-border/60">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search by name, ID, phone, email…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <FilterSelect
            label="Status"
            value={statusFilter}
            options={statusOptions}
            onChange={(v) => { setStatusFilter(v); setPage(0); }}
          />
          <FilterSelect
            label="Tag"
            value={tagFilter}
            options={[{ value: "all", label: "All Tags" }, ...tagOptions.map(t => ({ value: t, label: t }))]}
            onChange={(v) => { setTagFilter(v); setPage(0); }}
          />
          <FilterSelect
            label="Branch"
            value={branchFilter}
            options={[{ value: "all", label: "All Branches" }, ...branches.map(b => ({ value: b.id, label: b.name }))]}
            onChange={(v) => { setBranchFilter(v); setPage(0); }}
          />

          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-2xl bg-[#D6F04C]/15 px-3 py-2 ring-1 ring-[#D6F04C]/30"
            >
              <span className="text-xs font-medium text-[#8FA61E]">{selected.size} selected</span>
              <div className="h-4 w-px bg-[#D6F04C]/30" />
              <button className="text-xs font-medium text-[#8FA61E] hover:underline">Assign Tag</button>
              <button className="text-xs font-medium text-rose-600 hover:underline">Archive</button>
              <button onClick={() => setSelected(new Set())} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="overflow-hidden rounded-3xl bg-card premium-shadow ring-1 ring-border/40"
      >
        <div className="overflow-x-auto scrollbar-premium">
          <table className="w-full min-w-[840px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="w-10 px-4 py-3">
                  <button onClick={toggleSelectAll} className="flex h-5 w-5 items-center justify-center rounded-md transition-colors hover:bg-muted">
                    {allSelected || (someSelected && !allSelected) ? (
                      <CheckSquare className={`h-4 w-4 ${allSelected ? "text-[#8FA61E]" : "text-muted-foreground"}`} />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </button>
                </th>
                <Th label="Patient" sortKey="name" currentSort={sortKey} sortDir={sortDir} onSort={() => toggleSort("name")} />
                <Th label="Patient ID" sortKey="patientId" currentSort={sortKey} sortDir={sortDir} onSort={() => toggleSort("patientId")} />
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                <Th label="Age" sortKey="age" currentSort={sortKey} sortDir={sortDir} onSort={() => toggleSort("age")} />
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Therapist</th>
                <Th label="Progress" sortKey="progress" currentSort={sortKey} sortDir={sortDir} onSort={() => toggleSort("progress")} />
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <Th label="Balance" sortKey="balance" currentSort={sortKey} sortDir={sortDir} onSort={() => toggleSort("balance")} />
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paged.map((p, i) => {
                  const branch = branches.find(b => b.id === p.branchId);
                  const therapist = therapists.find(t => t.id === p.therapistId);
                  const isSelected = selected.has(p.id);
                  return (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.025 }}
                      onClick={() => openPatient(p.id)}
                      className={cn(
                        "group cursor-pointer border-b border-border/40 transition-colors",
                        isSelected ? "bg-[#D6F04C]/[0.06]" : "hover:bg-muted/40"
                      )}
                    >
                      <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); toggleSelect(p.id); }}>
                        <button className="flex h-5 w-5 items-center justify-center rounded-md">
                          {isSelected
                            ? <CheckSquare className="h-4 w-4 text-[#8FA61E]" />
                            : <Square className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.name} color={p.avatarColor} size="md" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium truncate">{p.name}</span>
                              {p.tags.includes("VIP") && <Crown className="h-3 w-3 text-amber-500" />}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                              <span className="text-[11px] text-muted-foreground">{branch?.name}</span>
                              {p.tags.slice(0, 1).map(t => (
                                <span key={t} className="rounded-full bg-muted px-1.5 py-0 text-[9px] font-medium text-muted-foreground">{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">{p.patientId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.phone.split(" ").slice(-2).join(" ")}</span>
                          <span className="flex items-center gap-1 truncate max-w-[160px]"><Mail className="h-3 w-3" />{p.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm tabular-nums">{p.age}</span>
                        <span className="ml-1 text-[11px] text-muted-foreground">{p.gender[0]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={therapist?.name || ""} color={therapist?.avatarColor} size="xs" />
                          <span className="text-xs truncate max-w-[120px]">{therapist?.name.replace("Dr. ", "")}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${p.progress}%` }}
                              transition={{ duration: 0.8, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                              className={cn(
                                "h-full rounded-full",
                                p.progress >= 75 ? "bg-emerald-500" :
                                p.progress >= 40 ? "bg-[#D6F04C]" :
                                "bg-amber-500"
                              )}
                            />
                          </div>
                          <span className="text-[11px] font-medium tabular-nums">{p.progress}%</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{p.completedSessions}/{p.totalSessions} sessions</div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} size="sm" /></td>
                      <td className="px-4 py-3">
                        {p.balance > 0 ? (
                          <span className="text-sm font-semibold text-rose-600 tabular-nums">₹{p.balance.toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); openPatient(p.id); }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {paged.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No patients found</h3>
            <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-3">
          <div className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{page * pageSize + 1}</span>–
            <span className="font-semibold text-foreground">{Math.min((page + 1) * pageSize, filtered.length)}</span> of{" "}
            <span className="font-semibold text-foreground">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-8 items-center gap-1 rounded-xl bg-card px-3 text-xs font-medium ring-1 ring-border/60 transition-all hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl text-xs font-medium transition-all",
                  page === i ? "bg-foreground text-background" : "bg-card ring-1 ring-border/60 hover:bg-muted"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex h-8 items-center gap-1 rounded-xl bg-card px-3 text-xs font-medium ring-1 ring-border/60 transition-all hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Th({
  label, sortKey, currentSort, sortDir, onSort,
}: {
  label: string;
  sortKey?: SortKey;
  currentSort?: SortKey;
  sortDir?: "asc" | "desc";
  onSort?: () => void;
}) {
  const isActive = sortKey && currentSort === sortKey;
  return (
    <th className="px-4 py-3 text-left">
      <button
        onClick={onSort}
        className={cn(
          "flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        <ArrowUpDown className={cn("h-3 w-3", isActive && "text-[#8FA61E]")} />
        {isActive && <span className="text-[#8FA61E] text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </button>
    </th>
  );
}

function FilterSelect({
  label, value, options, onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="flex h-10 items-center gap-2 rounded-2xl bg-muted/60 px-3.5 text-xs font-medium ring-1 ring-border/60 transition-all hover:bg-muted hover:ring-border">
          <span className="text-muted-foreground">{label}:</span>
          <span className="text-foreground">{current?.label}</span>
          <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-48 rounded-2xl bg-popover p-1.5 premium-shadow-lg ring-1 ring-border"
        >
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors",
                value === o.value ? "bg-primary/5 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {o.label}
              {value === o.value && <div className="h-1.5 w-1.5 rounded-full bg-[#D6F04C]" />}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
