"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  UserCog, Plus, Search, Trash2, MoreHorizontal, Download,
  FileText, FileSpreadsheet, ChevronDown, Phone, Mail, Calendar, Briefcase
} from "lucide-react";
import { branches } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { Button } from "../Form";
import { EmployeeModal } from "../modals/EmployeeModal";
import { cn, formatINR, formatDate, exportToCSV, exportToExcel, exportToHTMLPDF } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { toast } from "sonner";

export function EmployeesView() {
  const { employees, deleteEmployee, currentBranchId } = useAppStore();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const departments = useMemo(() => Array.from(new Set(employees.map(e => e.department))), [employees]);

  const filtered = useMemo(() => {
    return employees.filter(e => {
      if (currentBranchId !== "all" && e.branchId !== currentBranchId) return false;
      if (deptFilter !== "all" && e.department !== deptFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
    });
  }, [employees, search, deptFilter, currentBranchId]);

  const totalPayroll = filtered.reduce((s, e) => s + e.salary, 0);

  function handleExportCSV() {
    const rows = filtered.map(e => ({
      name: e.name, role: e.role, department: e.department,
      branch: branches.find(b => b.id === e.branchId)?.name || "",
      phone: e.phone, email: e.email, shift: e.shift,
      salary: e.salary, status: e.status, joinedOn: e.joinedOn,
    }));
    exportToCSV(`employees_${Date.now()}.csv`, rows);
    toast.success("CSV exported");
    setShowExport(false);
  }
  function handleExportExcel() {
    const rows = filtered.map(e => ({
      name: e.name, role: e.role, department: e.department,
      branch: branches.find(b => b.id === e.branchId)?.name || "",
      phone: e.phone, email: e.email, shift: e.shift,
      salary: e.salary, status: e.status, joinedOn: e.joinedOn,
    }));
    exportToExcel({
      filename: `employees_${Date.now()}.xls`,
      sheetName: "Employees",
      columns: [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "department", label: "Department" },
        { key: "branch", label: "Branch" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "shift", label: "Shift" },
        { key: "salary", label: "Salary" },
        { key: "status", label: "Status" },
        { key: "joinedOn", label: "Joined On" },
      ],
      rows,
    });
    toast.success("Excel exported");
    setShowExport(false);
  }
  function handleExportPDF() {
    const rows = filtered.map(e => ({
      name: e.name,
      role: e.role,
      department: e.department,
      branch: branches.find(b => b.id === e.branchId)?.name || "",
      phone: e.phone,
      shift: e.shift,
      salary: e.salary,
      status: e.status,
    }));
    exportToHTMLPDF({
      filename: `employees_${Date.now()}.html`,
      title: "Employee Directory",
      subtitle: `${filtered.length} employees · ${formatINR(totalPayroll)} monthly payroll`,
      meta: [
        { label: "Total Employees", value: String(filtered.length) },
        { label: "Monthly Payroll", value: formatINR(totalPayroll) },
        { label: "Departments", value: String(departments.length) },
        { label: "Generated", value: new Date().toLocaleString("en-IN") },
      ],
      columns: [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "department", label: "Department" },
        { key: "branch", label: "Branch" },
        { key: "phone", label: "Phone" },
        { key: "shift", label: "Shift" },
        { key: "salary", label: "Salary", align: "right" },
        { key: "status", label: "Status" },
      ],
      rows,
      summary: [
        { label: "Total Employees", value: String(filtered.length), accent: "lime" },
        { label: "Payroll", value: formatINR(totalPayroll), accent: "purple" },
        { label: "Active", value: String(filtered.filter(e => e.status === "active").length), accent: "emerald" },
        { label: "On Leave", value: String(filtered.filter(e => e.status === "on_leave").length), accent: "amber" },
      ],
    });
    toast.success("PDF opened");
    setShowExport(false);
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Employees"
        description={`${filtered.length} staff members · ${formatINR(totalPayroll)} monthly payroll`}
        icon={<UserCog className="h-5 w-5" />}
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
              <Plus className="h-4 w-4" /> Add Employee
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, role, email…"
            className="h-10 w-full rounded-xl bg-card pl-9 pr-3 text-sm ring-1 ring-border focus:ring-2 focus:ring-foreground/20 outline-none"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="h-10 rounded-xl bg-card px-3 text-sm ring-1 ring-border focus:ring-2 focus:ring-foreground/20 outline-none"
        >
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl bg-card ring-1 ring-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Employee</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Branch</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shift</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Salary</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => {
              const branch = branches.find(b => b.id === e.branchId);
              return (
                <motion.tr
                  key={e.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/40 hover:bg-muted/30 group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={e.name} color={e.avatarColor} size="sm" />
                      <div>
                        <div className="text-sm font-medium">{e.name}</div>
                        <div className="text-[11px] text-muted-foreground">Joined {formatDate(e.joinedOn)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{e.role}</div>
                    <div className="text-[11px] text-muted-foreground">{e.department}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                      {branch?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs">{e.phone}</div>
                    <div className="text-[11px] text-muted-foreground">{e.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">{e.shift}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">{formatINR(e.salary)}</td>
                  <td className="px-4 py-3"><StatusBadge status={e.status} size="sm" /></td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { deleteEmployee(e.id); toast.success("Employee removed"); }}
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-rose-500/10 text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((e, i) => {
          const branch = branches.find(b => b.id === e.branchId);
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="rounded-2xl bg-card ring-1 ring-border p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={e.name} color={e.avatarColor} size="md" />
                  <div>
                    <div className="text-sm font-medium">{e.name}</div>
                    <div className="text-xs text-muted-foreground">{e.role} · {e.department}</div>
                  </div>
                </div>
                <StatusBadge status={e.status} size="sm" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /> {e.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /> {e.email}</div>
                <div className="flex items-center gap-2"><Calendar className="h-3 w-3 text-muted-foreground" /> {e.shift}</div>
                <div className="flex items-center gap-2"><Briefcase className="h-3 w-3 text-muted-foreground" /> {branch?.name}</div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-2">
                  <span className="text-muted-foreground">Salary</span>
                  <span className="font-semibold">{formatINR(e.salary)}/mo</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full text-rose-500"
                onClick={() => { deleteEmployee(e.id); toast.success("Employee removed"); }}
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </Button>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <UserCog className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No employees found</p>
          <Button variant="lime" size="sm" className="mt-3" onClick={() => setShowModal(true)}>
            <Plus className="h-3.5 w-3.5" /> Add employee
          </Button>
        </div>
      )}

      <EmployeeModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
