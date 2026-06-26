"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Stethoscope, Star, Users, IndianRupee, Activity, Plus, Search,
  Award, TrendingUp, Clock, MoreHorizontal, Trash2, Download, FileText, FileSpreadsheet, ChevronDown, Eye
} from "lucide-react";
import { branches } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { Button } from "../Form";
import { EmployeeModal } from "../modals/EmployeeModal";
import { cn, formatINR, exportToCSV, exportToExcel, exportToHTMLPDF } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { toast } from "sonner";

export function TherapistsView() {
  const { therapists, deleteTherapist, currentBranchId, setView } = useAppStore();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const filtered = useMemo(() => {
    return therapists.filter(t => {
      if (currentBranchId !== "all" && t.branchId !== currentBranchId) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.specialization.toLowerCase().includes(q);
    });
  }, [therapists, search, currentBranchId]);

  const totalRevenue = filtered.reduce((sum, t) => sum + t.revenue, 0);
  const totalPatients = filtered.reduce((sum, t) => sum + t.patients, 0);
  const avgRating = filtered.length ? (filtered.reduce((sum, t) => sum + t.rating, 0) / filtered.length).toFixed(1) : "0";

  function handleExportCSV() {
    const rows = filtered.map(t => ({
      name: t.name,
      specialization: t.specialization,
      branch: branches.find(b => b.id === t.branchId)?.name || "",
      patients: t.patients,
      rating: t.rating,
      experience: t.experience,
      sessionsToday: t.sessionsToday,
      revenue: t.revenue,
      status: t.status,
      certifications: t.certifications.join("; "),
    }));
    exportToCSV(`therapists_${Date.now()}.csv`, rows);
    toast.success("CSV exported");
    setShowExport(false);
  }
  function handleExportExcel() {
    const rows = filtered.map(t => ({
      name: t.name,
      specialization: t.specialization,
      branch: branches.find(b => b.id === t.branchId)?.name || "",
      patients: t.patients,
      rating: t.rating,
      experience: t.experience,
      revenue: t.revenue,
      status: t.status,
    }));
    exportToExcel({
      filename: `therapists_${Date.now()}.xls`,
      sheetName: "Therapists",
      columns: [
        { key: "name", label: "Name" },
        { key: "specialization", label: "Specialization" },
        { key: "branch", label: "Branch" },
        { key: "patients", label: "Patients" },
        { key: "rating", label: "Rating" },
        { key: "experience", label: "Experience (yrs)" },
        { key: "revenue", label: "Revenue" },
        { key: "status", label: "Status" },
      ],
      rows,
    });
    toast.success("Excel exported");
    setShowExport(false);
  }
  function handleExportPDF() {
    const rows = filtered.map(t => ({
      name: t.name,
      specialization: t.specialization,
      branch: branches.find(b => b.id === t.branchId)?.name || "",
      patients: String(t.patients),
      rating: String(t.rating),
      revenue: t.revenue,
    }));
    exportToHTMLPDF({
      filename: `therapists_${Date.now()}.html`,
      title: "Therapist Directory",
      subtitle: `${filtered.length} therapists`,
      meta: [
        { label: "Total Therapists", value: String(filtered.length) },
        { label: "Combined Revenue", value: formatINR(totalRevenue) },
        { label: "Avg Rating", value: avgRating },
        { label: "Generated", value: new Date().toLocaleString("en-IN") },
      ],
      columns: [
        { key: "name", label: "Name" },
        { key: "specialization", label: "Specialization" },
        { key: "branch", label: "Branch" },
        { key: "patients", label: "Patients", align: "center" },
        { key: "rating", label: "Rating", align: "center" },
        { key: "revenue", label: "Revenue", align: "right" },
      ],
      rows,
      summary: [
        { label: "Total", value: String(filtered.length), accent: "lime" },
        { label: "Revenue", value: formatINR(totalRevenue), accent: "emerald" },
        { label: "Patients", value: String(totalPatients), accent: "blue" },
        { label: "Avg Rating", value: avgRating, accent: "purple" },
      ],
    });
    toast.success("PDF opened");
    setShowExport(false);
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Therapists"
        description={`${filtered.length} physiotherapists · ${formatINR(totalRevenue)} total revenue · ${avgRating} avg rating`}
        icon={<Stethoscope className="h-5 w-5" />}
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
              <Plus className="h-4 w-4" /> Add Therapist
            </Button>
          </div>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search therapists…"
          className="h-10 w-full rounded-xl bg-card pl-9 pr-3 text-sm ring-1 ring-border focus:ring-2 focus:ring-foreground/20 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filtered.map((t, i) => {
          const branch = branches.find(b => b.id === t.branchId);
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group rounded-2xl bg-card ring-1 ring-border p-5 hover:ring-foreground/20 transition-all relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} color={t.avatarColor} size="lg" />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.specialization}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-medium">{t.rating}</span>
                      <span className="text-[10px] text-muted-foreground">· {t.experience}y exp</span>
                    </div>
                  </div>
                </div>
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="opacity-0 group-hover:opacity-100 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content align="end" sideOffset={4} className="z-50 w-44 rounded-xl bg-popover p-1.5 premium-shadow-lg ring-1 ring-border">
                      <button onClick={() => setView("appointments")} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-muted">
                        <Eye className="h-3.5 w-3.5" /> View Schedule
                      </button>
                      <button
                        onClick={() => { deleteTherapist(t.id); toast.success("Therapist removed"); }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-rose-500/10 text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                  {branch?.name}
                </span>
                <StatusBadge status={t.status} size="sm" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/40">
                <div className="text-center">
                  <div className="text-base font-bold">{t.patients}</div>
                  <div className="text-[10px] text-muted-foreground">Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold">{t.sessionsToday}</div>
                  <div className="text-[10px] text-muted-foreground">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-emerald-600">{formatINR(t.revenue, { compact: true })}</div>
                  <div className="text-[10px] text-muted-foreground">Revenue</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.certifications.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-[#D6F04C]/10 px-2 py-0.5 text-[10px] font-medium text-[#8FA61E]">
                    <Award className="h-2.5 w-2.5" /> {c}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No therapists found</p>
            <Button variant="lime" size="sm" className="mt-3" onClick={() => setShowModal(true)}>
              <Plus className="h-3.5 w-3.5" /> Add new therapist
            </Button>
          </div>
        )}
      </div>

      <EmployeeModal open={showModal} onOpenChange={setShowModal} type="therapist" />
    </div>
  );
}
