"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Stethoscope, Star, Users, IndianRupee, Activity, Plus, Search,
  Award, TrendingUp, Clock, Calendar, MessageCircle, MoreHorizontal, ChevronRight
} from "lucide-react";
import { therapists, branches, patients } from "@/lib/data";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { cn } from "@/lib/utils";

export function TherapistsView() {
  const [search, setSearch] = useState("");
  const filtered = therapists.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = therapists.reduce((sum, t) => sum + t.revenue, 0);
  const totalPatients = therapists.reduce((sum, t) => sum + t.patients, 0);
  const avgRating = (therapists.reduce((sum, t) => sum + t.rating, 0) / therapists.length).toFixed(1);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Therapists"
        description={`${therapists.length} physiotherapists across all branches`}
        icon={<Stethoscope className="h-5 w-5" />}
        action={
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128] px-4 text-sm font-semibold text-[#0F1117] shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} /> Add Therapist
          </motion.button>
        }
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Therapists", value: therapists.length, icon: Stethoscope, color: "#D6F04C" },
          { label: "Active Patients", value: totalPatients, icon: Users, color: "#B79AFB" },
          { label: "Monthly Revenue", value: totalRevenue, prefix: "₹", icon: IndianRupee, color: "#34D399" },
          { label: "Avg Rating", value: avgRating, icon: Star, color: "#FBBF24" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl bg-card p-4 premium-shadow ring-1 ring-border/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: `${stat.color}15`, color: stat.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{stat.label}</div>
                  <div className="text-xl font-semibold tabular-nums">
                    {stat.prefix && <span>{stat.prefix}</span>}
                    <AnimatedCounter value={Number(stat.value)} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex h-10 max-w-md items-center gap-2.5 rounded-2xl bg-card px-3.5 ring-1 ring-border/60 premium-shadow">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or specialization…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Therapist grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t, i) => {
          const branch = branches.find(b => b.id === t.branchId);
          const therapistPatients = patients.filter(p => p.therapistId === t.id);
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40 hover:premium-shadow-lg transition-all"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 blur-2xl" style={{ background: t.avatarColor }} />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} color={t.avatarColor} size="lg" />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">{t.specialization}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-1.5 flex-wrap">
                {t.certifications.map(c => (
                  <span key={c} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <Award className="h-2.5 w-2.5" />{c}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Stat icon={<Users className="h-3.5 w-3.5" />} label="Patients" value={t.patients} color="#B79AFB" />
                <Stat icon={<Calendar className="h-3.5 w-3.5" />} label="Today" value={t.sessionsToday} color="#D6F04C" />
                <Stat icon={<IndianRupee className="h-3.5 w-3.5" />} label="Revenue" value={`₹${(t.revenue / 1000).toFixed(0)}k`} color="#34D399" />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="text-sm font-semibold">{t.rating}</span>
                  <span className="text-[11px] text-muted-foreground">· {t.experience}y exp</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />
                  {branch?.name}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-muted/60 py-2 text-xs font-medium ring-1 ring-border/60 hover:bg-muted">
                  <MessageCircle className="h-3.5 w-3.5" /> Message
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-foreground py-2 text-xs font-semibold text-background">
                  <Calendar className="h-3.5 w-3.5" /> Schedule
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; color: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-2.5">
      <div className="flex items-center gap-1" style={{ color }}>
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}
