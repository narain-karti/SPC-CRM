"use client";

import { motion } from "framer-motion";
import {
  BarChart3, Download, FileText, FileSpreadsheet, TrendingUp,
  IndianRupee, Users, Calendar, Stethoscope, Award, Building2
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Legend
} from "recharts";
import {
  revenueData, monthlyRevenueData, branchComparisonData, leadSourceData,
  appointmentStatusData, patientGrowthData, therapistPerformanceData, revenueForecastData,
  branches
} from "@/lib/data";
import { ChartCard } from "../ChartCard";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { cn } from "@/lib/utils";

export function ReportsView() {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Reports"
        description="Generate and download reports across all branches"
        icon={<BarChart3 className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2">
            <button className="flex h-10 items-center gap-2 rounded-2xl bg-card px-3.5 text-sm font-medium ring-1 ring-border/60 hover:bg-muted premium-shadow">
              <FileText className="h-4 w-4" /> PDF
            </button>
            <button className="flex h-10 items-center gap-2 rounded-2xl bg-card px-3.5 text-sm font-medium ring-1 ring-border/60 hover:bg-muted premium-shadow">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </button>
            <button className="flex h-10 items-center gap-2 rounded-2xl bg-card px-3.5 text-sm font-medium ring-1 ring-border/60 hover:bg-muted premium-shadow">
              <Download className="h-4 w-4" /> CSV
            </button>
          </div>
        }
      />

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Monthly Revenue", value: 1248000, prefix: "₹", change: 24, icon: IndianRupee, color: "#D6F04C" },
          { label: "Total Patients", value: 1224, change: 18, icon: Users, color: "#B79AFB" },
          { label: "Sessions Conducted", value: 1842, change: 22, icon: Calendar, color: "#34D399" },
          { label: "Avg Recovery Score", value: 78, suffix: "%", change: 6, icon: Award, color: "#FBBF24" },
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Revenue vs Expenses" description="Last 6 months" delay={0.1}
          action={<div className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#D6F04C]" />Revenue</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#F87171]" />Expenses</span>
          </div>}>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={monthlyRevenueData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="repRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D6F04C" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#D6F04C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 100000}L`} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]} />
              <Area type="monotone" dataKey="revenue" stroke="#D6F04C" strokeWidth={2.5} fill="url(#repRev)" name="Revenue" />
              <Bar dataKey="expenses" fill="#F87171" radius={[6, 6, 0, 0]} maxBarSize={24} name="Expenses" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Patient Growth" description="Weekly trends" delay={0.15}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={patientGrowthData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="newG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D6F04C" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#D6F04C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="activeG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B79AFB" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#B79AFB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="active" stroke="#B79AFB" strokeWidth={2} fill="url(#activeG)" name="Active" />
              <Area type="monotone" dataKey="new" stroke="#D6F04C" strokeWidth={2.5} fill="url(#newG)" name="New" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Branch Revenue" description="Comparison" className="lg:col-span-2" delay={0.2}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={branchComparisonData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 100000}L`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]} />
              <Bar dataKey="revenue" radius={[0, 8, 8, 0]} maxBarSize={24}>
                {branchComparisonData.map((entry, i) => (
                  <Cell key={i} fill={branches[i].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead Sources" description="Distribution" delay={0.25}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={leadSourceData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                innerRadius={55} outerRadius={85} paddingAngle={3} cornerRadius={6}>
                {leadSourceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {leadSourceData.map(s => (
              <div key={s.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground flex-1">{s.name}</span>
                <span className="font-semibold tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Therapist performance & report cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Therapist Performance" description="Sessions & revenue" className="lg:col-span-2" delay={0.3}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={therapistPerformanceData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(120,120,120,0.05)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="sessions" fill="#D6F04C" radius={[6, 6, 0, 0]} maxBarSize={28} name="Sessions" />
              <Bar dataKey="rating" fill="#B79AFB" radius={[6, 6, 0, 0]} maxBarSize={28} name="Rating ×10" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quick Reports" description="Generate & download" delay={0.35}>
          <div className="space-y-2">
            {[
              { name: "Monthly Revenue Report", icon: IndianRupee, color: "#34D399" },
              { name: "Patient Census Report", icon: Users, color: "#B79AFB" },
              { name: "Therapist Performance", icon: Stethoscope, color: "#D6F04C" },
              { name: "Branch Comparison", icon: Building2, color: "#60A5FA" },
              { name: "Appointment Analytics", icon: Calendar, color: "#FBBF24" },
            ].map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.button
                  key={r.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-muted/40 p-2.5 ring-1 ring-border/40 hover:bg-muted transition-colors text-left"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: `${r.color}15`, color: r.color }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-xs font-medium">{r.name}</span>
                  <Download className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
