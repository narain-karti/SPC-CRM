"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  UserCog, Plus, Search, MoreHorizontal, Building2, Phone, Mail,
  Calendar, Briefcase, Download, Filter, ChevronDown
} from "lucide-react";
import { employees, branches } from "@/lib/data";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";

export function EmployeesView() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const departments = ["all", ...Array.from(new Set(employees.map(e => e.department)))];
  const filtered = employees.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.role.toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter !== "all" && e.department !== deptFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Employees"
        description={`${employees.length} staff members across all branches`}
        icon={<UserCog className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2">
            <button className="flex h-10 items-center gap-2 rounded-2xl bg-card px-3.5 text-sm font-medium ring-1 ring-border/60 hover:bg-muted premium-shadow">
              <Download className="h-4 w-4" /> <span className="hidden sm:block">Export</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128] px-4 text-sm font-semibold text-[#0F1117] shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} /> Add Employee
            </motion.button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-10 flex-1 min-w-[220px] max-w-md items-center gap-2.5 rounded-2xl bg-card px-3.5 ring-1 ring-border/60 premium-shadow">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <FilterSelect label="Department" value={deptFilter} options={departments.map(d => ({ value: d, label: d === "all" ? "All Departments" : d }))} onChange={setDeptFilter} />
      </div>

      <div className="overflow-hidden rounded-3xl bg-card premium-shadow ring-1 ring-border/40">
        <div className="overflow-x-auto scrollbar-premium">
          <table className="w-full min-w-[840px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Employee</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Department</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Branch</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shift</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const branch = branches.find(b => b.id === e.branchId);
                return (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group border-b border-border/40 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={e.name} color={e.avatarColor} size="md" />
                        <div>
                          <div className="text-sm font-medium">{e.name}</div>
                          <div className="text-[11px] text-muted-foreground">Joined {e.joinedOn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{e.role}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{e.department}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                        {branch?.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{e.phone}</span>
                        <span className="flex items-center gap-1 truncate max-w-[160px]"><Mail className="h-3 w-3" />{e.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{e.shift}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status === "active" ? "active" : e.status === "on_leave" ? "on_leave" : "inactive"} size="sm" /></td>
                    <td className="px-4 py-3">
                      <button className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
