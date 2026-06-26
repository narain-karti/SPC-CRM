"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Zap, Plus, MoreHorizontal, Clock, IndianRupee, Phone, Mail,
  MessageCircle, Calendar, TrendingUp, Target, ArrowUpRight
} from "lucide-react";
import { leads, branches } from "@/lib/data";
import { Avatar } from "../Avatar";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { cn } from "@/lib/utils";
import type { LeadStage } from "@/lib/types";

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
  const [leadsState, setLeadsState] = useState(leads);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function onDragStart(id: string) { setDraggedId(id); }
  function onDrop(stage: LeadStage) {
    if (!draggedId) return;
    setLeadsState(prev => prev.map(l => l.id === draggedId ? { ...l, stage } : l));
    setDraggedId(null);
  }

  const totalValue = leadsState.reduce((s, l) => s + l.value, 0);
  const converted = leadsState.filter(l => l.stage === "converted").length;
  const conversionRate = ((converted / leadsState.length) * 100).toFixed(0);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Lead Pipeline"
        description="Drag & drop leads between stages"
        icon={<Zap className="h-5 w-5" />}
        action={
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128] px-4 text-sm font-semibold text-[#0F1117] shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} /> Add Lead
          </motion.button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Leads", value: leadsState.length, icon: Zap, color: "#D6F04C" },
          { label: "Pipeline Value", value: totalValue, prefix: "₹", icon: IndianRupee, color: "#34D399" },
          { label: "Converted", value: converted, icon: Target, color: "#B79AFB" },
          { label: "Conversion Rate", value: conversionRate, suffix: "%", icon: TrendingUp, color: "#FBBF24" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-3xl bg-card p-4 premium-shadow ring-1 ring-border/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: `${s.color}15`, color: s.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</div>
                  <div className="text-xl font-semibold tabular-nums">
                    {s.prefix && <span>{s.prefix}</span>}
                    <AnimatedCounter value={Number(s.value)} />
                    {s.suffix && <span>{s.suffix}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto scrollbar-premium pb-2">
        <div className="flex gap-4 min-w-[1100px]">
          {stageOrder.map(stage => {
            const stageLeads = leadsState.filter(l => l.stage === stage);
            const cfg = stageConfig[stage];
            const stageValue = stageLeads.reduce((s, l) => s + l.value, 0);
            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(stage)}
                className="flex-1 min-w-[220px]"
              >
                <div className="rounded-3xl bg-muted/30 p-3 ring-1 ring-border/40">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: cfg.color }} />
                      <span className="text-sm font-semibold">{cfg.label}</span>
                      <span className="rounded-full bg-muted px-1.5 py-0 text-[10px] font-bold text-muted-foreground">{stageLeads.length}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground mb-3 px-1">₹{stageValue.toLocaleString("en-IN")} total</div>

                  <div className="space-y-2 min-h-[200px]">
                    <AnimatePresence>
                      {stageLeads.map((lead, i) => {
                        const branch = branches.find(b => b.id === lead.branchId);
                        return (
                          <motion.div
                            key={lead.id}
                            layout
                            draggable
                            onDragStart={() => onDragStart(lead.id)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileDrag={{ scale: 1.05, rotate: 2 }}
                            className="group cursor-grab active:cursor-grabbing rounded-2xl bg-card p-3 premium-shadow ring-1 ring-border/40 hover:ring-border"
                          >
                            <div className="flex items-start gap-2">
                              <Avatar name={lead.name} color={lead.avatarColor} size="sm" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{lead.name}</div>
                                <div className="text-[11px] text-muted-foreground truncate">{lead.interest}</div>
                              </div>
                              <button className="opacity-0 group-hover:opacity-100 transition-opacity flex h-6 w-6 items-center justify-center rounded-lg hover:bg-muted">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                                {sourceIcons[lead.source]} {lead.source.replace("_", " ")}
                              </span>
                              <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                                {branch?.name}
                              </span>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2">
                              <span className="text-sm font-semibold tabular-nums">₹{lead.value.toLocaleString("en-IN")}</span>
                              <div className="flex items-center gap-1">
                                <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted">
                                  <Phone className="h-3 w-3" />
                                </button>
                                <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted">
                                  <MessageCircle className="h-3 w-3 text-[#34D399]" />
                                </button>
                                <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted">
                                  <ArrowUpRight className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {stageLeads.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-dashed border-border">
                          <Plus className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                        <p className="mt-2 text-[11px] text-muted-foreground">Drop leads here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
