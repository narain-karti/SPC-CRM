"use client";

import { motion } from "framer-motion";
import {
  LineChart as LineIcon, TrendingUp, IndianRupee, Users, Calendar,
  Target, Activity, Award, Download, Sparkles, Brain, Zap
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis
} from "recharts";
import { revenueForecastData } from "@/lib/data"; // Forecast is still static for demo
import { useAnalytics } from "@/hooks/use-analytics";
import { useAppStore } from "@/lib/store";
import { useBranches, useTherapists } from "@/hooks/use-supabase-query";
import { ChartCard } from "../ChartCard";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { Avatar } from "../Avatar";
import { cn } from "@/lib/utils";

export function AnalyticsView() {
  const { currentBranchId } = useAppStore();
  const {
    monthlyRevenueData,
    branchComparisonData,
    leadSourceData,
    appointmentStatusData,
    therapistPerformanceData,
    patientGrowthData,
    kpis
  } = useAnalytics(currentBranchId);
  const { data: branches = [] } = useBranches();
  const { data: therapists = [] } = useTherapists(currentBranchId);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Analytics"
        description="Deep insights into clinic performance and trends"
        icon={<LineIcon className="h-5 w-5" />}
        action={
          <button className="flex h-10 items-center gap-2 rounded-2xl bg-card px-3.5 text-sm font-medium ring-1 ring-border/60 hover:bg-muted premium-shadow">
            <Download className="h-4 w-4" /> Export Dashboard
          </button>
        }
      />

      {/* AI insight banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1117] via-[#16161F] to-[#1A1B2E] p-6 premium-shadow-lg"
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#B79AFB]/20 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-[#D6F04C]/20 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128]">
              <Brain className="h-5 w-5 text-[#0F1117]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#D6F04C] font-semibold">AI Insight</span>
                <Sparkles className="h-3 w-3 text-[#D6F04C]" />
              </div>
              <h3 className="mt-1 text-base font-semibold text-white">Revenue projected to grow 18% next quarter</h3>
              <p className="mt-1 text-xs text-white/60 max-w-xl">
                Based on current trends, lead conversion patterns, and seasonal analysis. Indiranagar and Koramangala show strongest momentum.
              </p>
            </div>
          </div>
          <button className="rounded-2xl bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
            View Full Report
          </button>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Avg Revenue/Patient", value: kpis.avgRevenue, prefix: "₹", change: 12, icon: IndianRupee, color: "#D6F04C" },
          { label: "Retention Rate", value: kpis.retentionRate, suffix: "%", change: 4, icon: Users, color: "#B79AFB" },
          { label: "Avg Sessions/Patient", value: kpis.avgSessions, change: 8, icon: Calendar, color: "#34D399" },
          { label: "Conversion Rate", value: kpis.conversionRate, suffix: "%", change: 5, icon: Target, color: "#FBBF24" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-3xl bg-card p-4 premium-shadow ring-1 ring-border/40">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl" style={{ background: `${s.color}15`, color: s.color }}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> +{s.change}%
                </span>
              </div>
              <div className="mt-2 text-xl font-semibold tabular-nums">
                {s.prefix && <span>{s.prefix}</span>}
                <AnimatedCounter value={s.value} />
                {s.suffix && <span>{s.suffix}</span>}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue forecast */}
      <ChartCard
        title="Revenue Forecast"
        description="AI-projected next 6 months based on trends"
        delay={0.1}
        action={
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#D6F04C]" />Actual</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#B79AFB]" />Forecast</span>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueForecastData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="actualG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D6F04C" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#D6F04C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B79AFB" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#B79AFB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 100000}L`} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => v > 0 ? [`₹${v.toLocaleString("en-IN")}`, ""] : ["—", ""]} />
            <Area type="monotone" dataKey="actual" stroke="#D6F04C" strokeWidth={3} fill="url(#actualG)" name="Actual" />
            <Area type="monotone" dataKey="forecast" stroke="#B79AFB" strokeWidth={2.5} strokeDasharray="6 4" fill="url(#forecastG)" name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Branch comparison radar + top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Branch Performance Matrix" description="Revenue vs Growth" delay={0.15}>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" />
              <XAxis type="number" dataKey="revenue" name="Revenue" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `₹${v / 100000}L`} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="growth" name="Growth" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
              <ZAxis type="number" dataKey="patients" range={[80, 400]} name="Patients" />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Scatter data={branchComparisonData}>
                {branchComparisonData.map((entry, i) => (
                  <Cell key={i} fill={branches[i]?.color || "#D6F04C"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {branches.map(b => (
              <div key={b.id} className="flex items-center gap-1 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                <span className="text-muted-foreground">{b.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top Performing Therapists" description="By revenue & rating" delay={0.2}>
          <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-premium pr-1">
            {[...therapists].sort((a, b) => b.revenue - a.revenue).slice(0, 6).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-border/40"
              >
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                  i === 0 ? "bg-amber-400/20 text-amber-600" :
                  i === 1 ? "bg-slate-300/30 text-slate-600" :
                  i === 2 ? "bg-orange-400/20 text-orange-600" :
                  "bg-muted-foreground/10 text-muted-foreground")}>
                  {i === 0 ? <Award className="h-4 w-4" /> : i + 1}
                </div>
                <Avatar name={t.name} color={t.avatarColor} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{t.specialization}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">₹{(t.revenue / 1000).toFixed(0)}k</div>
                  <div className="text-[10px] text-amber-600 flex items-center gap-0.5 justify-end">
                    <Award className="h-2.5 w-2.5" /> {t.rating}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Conversion funnel */}
      <ChartCard title="Lead Conversion Funnel" description="From lead to paying patient" delay={0.25}>
        <div className="space-y-2">
          {[
            { stage: "New Leads", count: 100, color: "#60A5FA", pct: 100 },
            { stage: "Contacted", count: 78, color: "#B79AFB", pct: 78 },
            { stage: "Consultation", count: 52, color: "#FBBF24", pct: 52 },
            { stage: "Converted", count: 38, color: "#34D399", pct: 38 },
          ].map((s, i) => (
            <motion.div
              key={s.stage}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{s.stage}</span>
                <span className="text-xs font-semibold tabular-nums">{s.count} ({s.pct}%)</span>
              </div>
              <div className="h-8 w-full rounded-xl bg-muted/40 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-xl flex items-center px-3 text-[11px] font-semibold text-[#1a1a1a]"
                  style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)` }}
                >
                  {s.count} leads
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
