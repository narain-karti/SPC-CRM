"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, ArrowUpRight, MoreHorizontal, Plus,
  Users, Calendar, Clock, IndianRupee, Activity, Zap, ChevronRight,
  Building2, Award, Crown, Star, UserCheck
} from "lucide-react";
import { kpiData } from "@/lib/data"; // fallback if needed
import { useAppointments, usePatients, useInvoices, useLeads } from "@/hooks/use-supabase-query";
import { useAnalytics } from "@/hooks/use-analytics";
import { KPICard } from "../KPICard";
import { ChartCard } from "../ChartCard";
import { SectionHeader } from "../SectionHeader";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { AnimatedCounter } from "../AnimatedCounter";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";
import { useAppStore } from "@/lib/store";
import { PhysioDashboardView } from "./PhysioDashboardView";

export function DashboardView() {
  const { setView, openPatient, currentRole } = useAppStore();
  const isPhysio = currentRole === "physiotherapist";
  const isReception = currentRole === "receptionist";
  
  const { data: allAppointments = [], isLoading } = useAppointments("all");
  const { data: patients = [] } = usePatients("all");
  const { data: invoices = [] } = useInvoices("all");
  const { data: leads = [] } = useLeads("all");
  const { monthlyRevenueData, leadSourceData, appointmentStatusData, therapistPerformanceData, branchComparisonData, kpis } = useAnalytics("all");

  // Show dedicated physio dashboard for physiotherapists
  if (isPhysio) {
    return <PhysioDashboardView />;
  }

  // Role-specific KPIs
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = allAppointments.filter((a: any) => a.date === today);
  const pendingBills = invoices.filter((i: any) => i.status === "pending").length;
  
  const dynamicKpiData = [
    { label: "Today's Patients", value: todayAppts.length, change: 0, icon: "Users", accent: "lime" as const, trend: "up" as const },
    { label: "Appointments", value: allAppointments.length, change: 0, icon: "Calendar", accent: "purple" as const, trend: "up" as const },
    { label: "Patients Waiting", value: todayAppts.filter((a: any) => a.status === "waiting").length, change: 0, icon: "Clock", accent: "amber" as const, trend: "down" as const },
    { label: "Total Revenue", value: invoices.reduce((sum: number, i: any) => sum + (i.total || 0), 0), prefix: "₹", change: 0, icon: "IndianRupee", accent: "emerald" as const, trend: "up" as const },
    { label: "Pending Bills", value: pendingBills, change: 0, icon: "Activity", accent: "rose" as const, trend: "down" as const },
    { label: "Lead Conversion", value: kpis.conversionRate, suffix: "%", change: 0, icon: "Zap", accent: "blue" as const, trend: "up" as const },
  ];

  const visibleKpis = isReception
    ? dynamicKpiData.filter(k => ["Today's Patients", "Appointments", "Patients Waiting", "Pending Bills", "Lead Conversion"].includes(k.label))
    : dynamicKpiData;

  const todayAppointments = allAppointments
    .filter((a: any) => {
      const today = new Date().toISOString().split("T")[0];
      return a.date === today;
    })
    .slice(0, 6)
    .map((a: any) => ({
      ...a, 
      patientId: a.patient_id, 
      patientName: a.patient_name,
      therapistId: a.therapist_id,
      therapistName: a.therapist_name
    }));

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1117] via-[#16161F] to-[#1A1B2E] p-6 md:p-8 premium-shadow-lg"
      >
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#D6F04C]/20 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-[#B79AFB]/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6F04C] animate-pulse" />
              <span className="text-[11px] font-medium text-white/70">All systems operational</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {isPhysio ? "Welcome back, Dr. Ananya" : isReception ? "Welcome back, Lakshmi" : "Good morning, Aarav"}
            </h1>
            <p className="mt-1.5 text-sm text-white/50 max-w-lg">
              {isPhysio
                ? "You have 9 sessions scheduled today. 2 patients are waiting and 1 follow-up needs scheduling."
                : isReception
                ? "5 new walk-ins today. 3 appointments pending confirmation and 9 invoices awaiting payment."
                : "Revenue is up 24% this month across 5 branches. Indiranagar leads with ₹18.4L. 4 actions need your attention."}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Total Revenue</div>
              <div className="mt-1 text-2xl font-semibold text-[#D6F04C]">
                <AnimatedCounter value={dynamicKpiData[3].value} prefix="₹" />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <TrendingUp className="h-3 w-3" /> Updated just now
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Active Patients</div>
              <div className="mt-1 text-2xl font-semibold text-[#B79AFB]">
                <AnimatedCounter value={patients.length} />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-white/50">
                <UserCheck className="h-3 w-3" /> Live Data
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
        {visibleKpis.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue trend */}
        <ChartCard
          title="Revenue This Week"
          description="Daily revenue vs target"
          className="lg:col-span-2"
          delay={0.1}
          action={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-2 py-1 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-[#D6F04C]" /> Revenue
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-2 py-1 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-[#B79AFB]" /> Target
              </div>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revLime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D6F04C" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#D6F04C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B79AFB" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#B79AFB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 12, padding: "8px 12px", boxShadow: "0 8px 24px -8px rgba(0,0,0,0.1)"
                }}
                formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]}
              />
              <Area type="monotone" dataKey="target" stroke="#B79AFB" strokeWidth={2} strokeDasharray="4 4" fill="url(#revPurple)" />
              <Area type="monotone" dataKey="revenue" stroke="#D6F04C" strokeWidth={2.5} fill="url(#revLime)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Lead sources */}
        <ChartCard title="Lead Sources" description="Where patients come from" delay={0.15}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leadSourceData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                innerRadius={55} outerRadius={85} paddingAngle={3} cornerRadius={6}>
                {leadSourceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 12, padding: "8px 12px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {leadSourceData.map(s => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground flex-1">{s.name}</span>
                <span className="font-semibold tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Branch comparison */}
        <ChartCard
          title="Branch Revenue Comparison"
          description="Monthly revenue across 5 branches"
          className="lg:col-span-2"
          delay={0.2}
          action={<button className="text-xs font-medium text-primary hover:underline">View report</button>}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={branchComparisonData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="barLime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D6F04C" />
                  <stop offset="100%" stopColor="#A3C128" />
                </linearGradient>
                <linearGradient id="barPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B79AFB" />
                  <stop offset="100%" stopColor="#7C5BD9" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${v / 100000}L`} />
              <Tooltip
                cursor={{ fill: "rgba(120,120,120,0.05)" }}
                contentStyle={{
                  background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12,
                  fontSize: 12, padding: "8px 12px"
                }}
                formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]}
              />
              <Bar dataKey="revenue" fill="url(#barLime)" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Appointment status donut */}
        <ChartCard title="Appointment Status" description="Last 30 days" delay={0.25}>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart innerRadius="40%" outerRadius="100%" data={appointmentStatusData} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-semibold tabular-nums">264</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {appointmentStatusData.map(s => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground flex-1">{s.name}</span>
                <span className="font-semibold tabular-nums">{s.value}</span>
                <span className="text-muted-foreground text-[10px] tabular-nums">
                  {Math.round(s.value / 264 * 100)}%
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Branch leaderboard + Today's appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Branch leaderboard */}
        <ChartCard
          title="Branch Leaderboard"
          description="Ranked by revenue this month"
          className="lg:col-span-2"
          delay={0.3}
        >
          <div className="space-y-2">
            {[...branchComparisonData].sort((a, b) => b.revenue - a.revenue).map((b, i) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                whileHover={{ x: 4 }}
                className="group flex items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-border/40 transition-all hover:bg-muted hover:ring-border"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  i === 0 ? "bg-amber-400/20 text-amber-600" :
                  i === 1 ? "bg-slate-300/30 text-slate-600" :
                  i === 2 ? "bg-orange-400/20 text-orange-600" :
                  "bg-muted-foreground/10 text-muted-foreground"
                }`}>
                  {i === 0 ? <Crown className="h-4 w-4" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                    <span className="text-sm font-medium truncate">{b.name}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{b.patients} patients · {b.staff} staff</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">₹{(b.revenue / 100000).toFixed(1)}L</div>
                  <div className={`text-[11px] flex items-center gap-0.5 justify-end ${b.growth > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {b.growth > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {b.growth}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>

        {/* Today's appointments */}
        <ChartCard
          title="Today's Schedule"
          description="Upcoming appointments"
          className="lg:col-span-3"
          delay={0.35}
          action={
            <button onClick={() => setView("appointments")} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          }
        >
          <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-premium pr-1">
            {isLoading ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              Loading appointments...
            </div>
          ) : todayAppointments.length > 0 ? todayAppointments.map((appt, i) => {
              return (
                <motion.button
                  key={appt.id}
                  onClick={() => openPatient(appt.patientId)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-border/40 transition-all hover:bg-muted hover:ring-border text-left"
                >
                  <div className="flex flex-col items-center gap-0.5 min-w-[52px]">
                    <span className="text-sm font-semibold tabular-nums">{appt.time}</span>
                    <span className="text-[10px] text-muted-foreground">{appt.duration}min</span>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <Avatar name={appt.patientName} color="#D6F04C" size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{appt.patientName}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{appt.therapistName} · {appt.type.replace("_", " ")}</div>
                  </div>
                  <StatusBadge status={appt.status} size="sm" />
                </motion.button>
              );
            }) : null}
          </div>
        </ChartCard>
      </div>

      {/* Therapist performance */}
      <ChartCard
        title="Therapist Performance"
        description="Sessions & revenue contribution this week"
        delay={0.4}
        action={<button className="text-xs font-medium text-primary hover:underline">View report</button>}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={therapistPerformanceData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.1)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₹${v}k`} />
            <Tooltip
              cursor={{ fill: "rgba(120,120,120,0.05)" }}
              contentStyle={{
                background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12,
                fontSize: 12, padding: "8px 12px"
              }}
            />
            <Bar yAxisId="left" dataKey="sessions" fill="#D6F04C" radius={[6, 6, 0, 0]} maxBarSize={32} name="Sessions" />
            <Bar yAxisId="right" dataKey="revenue" fill="#B79AFB" radius={[6, 6, 0, 0]} maxBarSize={32} name="Revenue (₹k)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
