"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Zap, Plus, MoreHorizontal, Phone, Mail,
  MessageCircle, Calendar, Target, Trash2, FileText, FileSpreadsheet, Download, ChevronDown, UserPlus
} from "lucide-react";
import { branches } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { Button } from "../Form";
import { LeadModal } from "../modals/LeadModal";
import { cn, formatINR, exportToCSV, exportToExcel, exportToHTMLPDF, uid, mapLead } from "@/lib/utils";
import { useLeads, useUpdateLead, useDeleteLead } from "@/hooks/use-supabase-query";
import * as Popover from "@radix-ui/react-popover";
import { toast } from "sonner";
import type { LeadStage, Lead } from "@/lib/types";

const stageConfig: Record<LeadStage, { label: string; color: string; bg: string; chip: string }> = {
  new: { label: "New", color: "#60A5FA", bg: "bg-blue-500/10", chip: "text-blue-600" },
  contacted: { label: "Contacted", color: "#FBBF24", bg: "bg-amber-500/10", chip: "text-amber-600" },
  consultation: { label: "Consultation", color: "#B79AFB", bg: "bg-[#B79AFB]/15", chip: "text-[#7C5BD9]" },
  converted: { label: "Converted", color: "#34D399", bg: "bg-emerald-500/10", chip: "text-emerald-600" },
  lost: { label: "Lost", color: "#F87171", bg: "bg-rose-500/10", chip: "text-rose-600" },
};

const stageOrder: LeadStage[] = ["new", "contacted", "consultation", "converted", "lost"];

const sourceIcons: Record<string, React.ReactNode> = {
  walk_in: <Calendar className="h-3 w-3" />,
  whatsapp: <MessageCircle className="h-3 w-3" />,
  instagram: <Zap className="h-3 w-3" />,
  doctor_referral: <Phone className="h-3 w-3" />,
  website: <Mail className="h-3 w-3" />,
  phone: <Phone className="h-3 w-3" />,
};

export function LeadsView() {
  const { addPatient, addNotification, currentBranchId } = useAppStore();
  const { data: rawLeads = [], isLoading } = useLeads(currentBranchId);
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();
  
  const leads = useMemo(() => rawLeads.map(mapLead), [rawLeads]);
  
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const filteredLeads = leads; // Already filtered by branch in the query

  function onDragStart(id: string) { setDraggedId(id); }
  function onDrop(stage: LeadStage) {
    if (!draggedId) return;
    const lead = leads.find(l => l.id === draggedId);
    if (!lead) return;
    updateLeadMutation.mutate({ id: draggedId, updates: { stage } });
    if (stage === "converted") {
      addNotification({
        id: uid("n"),
        type: "registration",
        title: "Lead converted!",
        message: `${lead.name} converted to patient`,
        time: "Just now",
        read: false,
        priority: "high",
      });
      toast.success(`${lead.name} converted!`, {
        description: "Optionally create a patient record",
      });
    } else {
      toast.success(`Lead moved to ${stageConfig[stage].label}`);
    }
    setDraggedId(null);
  }

  function convertToPatient(lead: Lead) {
    const patientId = uid("pt");
    addPatient({
      id: patientId,
      patientId: `SPC-${String(2024000 + Math.floor(Math.random() * 9999))}`,
      name: lead.name,
      age: 30,
      gender: "Male",
      dob: "1995-01-01",
      phone: lead.phone,
      email: lead.email || `${lead.name.toLowerCase().replace(/\s/g, ".")}@email.com`,
      address: branches.find(b => b.id === lead.branchId)?.name || "Chennai",
      emergencyContact: lead.phone,
      branchId: lead.branchId,
      bloodGroup: "O+",
      allergies: ["None"],
      conditions: [lead.interest],
      previousTreatments: [],
      currentTreatment: "Initial Assessment",
      status: "in_consultation",
      therapistId: "th1",
      tags: ["Converted Lead"],
      avatarColor: lead.avatarColor,
      registeredOn: new Date().toISOString().split("T")[0],
      lastVisit: new Date().toISOString().split("T")[0],
      progress: 0,
      totalSessions: 8,
      completedSessions: 0,
      balance: 0,
    });
    updateLeadMutation.mutate({ id: lead.id, updates: { stage: "converted" } });
    toast.success(`${lead.name} converted to patient!`);
  }

  const totalValue = filteredLeads.reduce((s, l) => s + l.value, 0);
  const convertedCount = filteredLeads.filter(l => l.stage === "converted").length;
  const conversionRate = filteredLeads.length > 0 ? ((convertedCount / filteredLeads.length) * 100).toFixed(0) : "0";

  function handleExportCSV() {
    const rows = filteredLeads.map(l => ({
      name: l.name, phone: l.phone, email: l.email,
      source: l.source, stage: l.stage,
      branch: branches.find(b => b.id === l.branchId)?.name || "",
      interest: l.interest, value: l.value,
      createdAt: l.createdAt, notes: l.notes,
    }));
    exportToCSV(`leads_${Date.now()}.csv`, rows);
    toast.success("CSV exported");
    setShowExport(false);
  }
  function handleExportExcel() {
    const rows = filteredLeads.map(l => ({
      name: l.name, phone: l.phone, email: l.email,
      source: l.source, stage: l.stage,
      branch: branches.find(b => b.id === l.branchId)?.name || "",
      interest: l.interest, value: l.value, createdAt: l.createdAt,
    }));
    exportToExcel({
      filename: `leads_${Date.now()}.xls`,
      sheetName: "Leads",
      columns: [
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "source", label: "Source" },
        { key: "stage", label: "Stage" },
        { key: "branch", label: "Branch" },
        { key: "interest", label: "Interest" },
        { key: "value", label: "Value" },
        { key: "createdAt", label: "Created" },
      ],
      rows,
    });
    toast.success("Excel exported");
    setShowExport(false);
  }
  function handleExportPDF() {
    const rows = filteredLeads.map(l => ({
      name: l.name,
      phone: l.phone,
      source: l.source,
      stage: l.stage,
      branch: branches.find(b => b.id === l.branchId)?.name || "",
      interest: l.interest,
      value: l.value,
    }));
    exportToHTMLPDF({
      filename: `leads_${Date.now()}.html`,
      title: "Leads Pipeline",
      subtitle: `${filteredLeads.length} leads · ${conversionRate}% conversion`,
      meta: [
        { label: "Total Leads", value: String(filteredLeads.length) },
        { label: "Pipeline Value", value: formatINR(totalValue) },
        { label: "Converted", value: String(convertedCount) },
        { label: "Conversion Rate", value: `${conversionRate}%` },
      ],
      columns: [
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "source", label: "Source" },
        { key: "stage", label: "Stage" },
        { key: "branch", label: "Branch" },
        { key: "interest", label: "Interest" },
        { key: "value", label: "Value", align: "right" },
      ],
      rows,
      summary: [
        { label: "Total Leads", value: String(filteredLeads.length), accent: "lime" },
        { label: "Pipeline Value", value: formatINR(totalValue), accent: "purple" },
        { label: "Converted", value: String(convertedCount), accent: "emerald" },
        { label: "Conversion Rate", value: `${conversionRate}%`, accent: "blue" },
      ],
    });
    toast.success("PDF opened");
    setShowExport(false);
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Leads Pipeline"
        description={`${filteredLeads.length} leads · ${formatINR(totalValue)} pipeline value · ${conversionRate}% conversion`}
        icon={<Zap className="h-5 w-5" />}
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
              <Plus className="h-4 w-4" /> New Lead
            </Button>
          </div>
        }
      />

      {/* Kanban Board */}
      <div className="overflow-x-auto scrollbar-premium pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 min-w-[800px] sm:min-w-0">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">Loading leads...</div>
          ) : (
            stageOrder.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.stage === stage);
              const stageValue = stageLeads.reduce((s, l) => s + l.value, 0);
              const config = stageConfig[stage];
              return (
                <div
                  key={stage}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(stage)}
                  className="rounded-2xl bg-muted/30 ring-1 ring-border p-3 min-h-[200px]"
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: config.color }} />
                      <span className="text-xs font-semibold">{config.label}</span>
                      <span className="text-[10px] text-muted-foreground">({stageLeads.length})</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground px-1 mb-2">{formatINR(stageValue)}</div>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {stageLeads.map((lead, i) => (
                        <motion.div
                          key={lead.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.04 }}
                          draggable
                          onDragStart={() => onDragStart(lead.id)}
                          className="group rounded-xl bg-card p-3 ring-1 ring-border hover:ring-foreground/20 cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Avatar name={lead.name} color={lead.avatarColor} size="sm" />
                            <Popover.Root>
                              <Popover.Trigger asChild>
                                <button className="h-6 w-6 flex items-center justify-center rounded bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                              </Popover.Trigger>
                              <Popover.Portal>
                                <Popover.Content align="end" sideOffset={4} className="z-50 w-40 rounded-xl bg-popover p-1.5 shadow-xl ring-1 ring-border">
                                  {stage !== "converted" && (
                                    <button
                                      onClick={() => convertToPatient(lead)}
                                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10"
                                    >
                                      <UserPlus className="h-3.5 w-3.5" /> Convert to Patient
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteLeadMutation.mutate(lead.id)}
                                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" /> Delete Lead
                                  </button>
                                </Popover.Content>
                              </Popover.Portal>
                            </Popover.Root>
                          </div>
                          <div className="text-sm font-semibold text-foreground mb-0.5">{lead.name}</div>
                          <div className="text-[11px] text-muted-foreground mb-2 truncate">{lead.interest}</div>
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                              {sourceIcons[lead.source]}
                              {lead.source.replace("_", " ")}
                            </span>
                            <span className="text-xs font-bold" style={{ color: config.color }}>{formatINR(lead.value)}</span>
                          </div>
                        {lead.notes && (
                          <p className="mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground line-clamp-2 italic">"{lead.notes}"</p>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {stageLeads.length === 0 && (
                    <div className="text-center text-[11px] text-muted-foreground/40 py-6 border-2 border-dashed border-border/40 rounded-xl">
                      Drop leads here
                    </div>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      <LeadModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
