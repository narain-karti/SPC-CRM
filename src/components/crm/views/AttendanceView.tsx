"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Clock, QrCode, MapPin, Hand, Plus, CheckCircle2, XCircle,
  Calendar as CalIcon, TrendingUp, Users, Download, ChevronLeft, ChevronRight
} from "lucide-react";
import { branches } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import { cn, mapAttendanceRecord } from "@/lib/utils";
import { useAttendanceRecords, useEmployees } from "@/hooks/use-supabase-query";

export function AttendanceView() {
  const { currentBranchId } = useAppStore();
  const { data: rawEmployees = [] } = useEmployees(currentBranchId);
  const { data: rawAttendance = [], isLoading } = useAttendanceRecords(currentBranchId);
  const employees = rawEmployees.map(e => ({ ...e, id: e.id }));
  const attendanceRecords = rawAttendance.map(mapAttendanceRecord);
  
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = attendanceRecords.filter(a => a.date === today);
  const present = todayRecords.filter(a => a.status === "present").length;
  const late = todayRecords.filter(a => a.status === "late").length;
  const absent = todayRecords.filter(a => a.status === "absent").length;
  const onLeave = todayRecords.filter(a => a.status === "leave").length;
  const [view, setView] = useState<"today" | "calendar">("today");

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Attendance"
        description="Track staff check-ins with QR, GPS, and manual override"
        icon={<Clock className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-2xl bg-card p-1 premium-shadow ring-1 ring-border/40">
              {[
                { key: "today", label: "Today" },
                { key: "calendar", label: "Calendar" },
              ].map(opt => (
                <button key={opt.key} onClick={() => setView(opt.key as any)}
                  className={cn("relative rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                    view === opt.key ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {view === opt.key && <motion.div layoutId="att-view" className="absolute inset-0 rounded-xl bg-primary/8" />}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              ))}
            </div>
            <button className="flex h-10 items-center gap-2 rounded-2xl bg-card px-3.5 text-sm font-medium ring-1 ring-border/60 hover:bg-muted premium-shadow">
              <Download className="h-4 w-4" /> <span className="hidden sm:block">Export</span>
            </button>
          </div>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Present Today", value: present, icon: CheckCircle2, color: "#34D399", bg: "bg-emerald-500/10" },
          { label: "Late Check-ins", value: late, icon: Clock, color: "#FBBF24", bg: "bg-amber-500/10" },
          { label: "Absent", value: absent, icon: XCircle, color: "#F87171", bg: "bg-rose-500/10" },
          { label: "On Leave", value: onLeave, icon: Users, color: "#B79AFB", bg: "bg-[#B79AFB]/15" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl bg-card p-4 premium-shadow ring-1 ring-border/40"
            >
              <div className="flex items-center justify-between">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", s.bg)} style={{ color: s.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-semibold tabular-nums">
                  <AnimatedCounter value={s.value} />
                </span>
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Check-in method showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: QrCode, label: "QR Check-in", desc: "Scan at clinic entrance", color: "#D6F04C", count: 32 },
          { icon: MapPin, label: "GPS Check-in", desc: "Auto-detect on arrival", color: "#B79AFB", count: 18 },
          { icon: Hand, label: "Manual Override", desc: "Admin verified entry", color: "#60A5FA", count: 8 },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -2 }}
              className="rounded-3xl bg-card p-4 premium-shadow ring-1 ring-border/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${m.color}15`, color: m.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{m.label}</div>
                  <div className="text-[11px] text-muted-foreground">{m.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold tabular-nums">{m.count}</div>
                  <div className="text-[10px] text-muted-foreground">today</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {view === "today" && (
        <div className="rounded-3xl bg-card premium-shadow ring-1 ring-border/40 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/60 p-4">
            <h3 className="text-sm font-semibold">Today's Check-ins · {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}</h3>
          </div>
          <div className="divide-y divide-border/40">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D6F04C] border-t-transparent" />
                <p className="mt-4 text-sm">Loading attendance...</p>
              </div>
            ) : todayRecords.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-3 opacity-20" />
                No attendance records for today
              </div>
            ) : todayRecords.map((r, i) => {
              const emp = employees.find(e => e.id === r.employeeId);
              const branch = branches.find(b => b.id === r.branchId);
              if (!emp) return null;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors"
                >
                  <Avatar name={r.employeeName} color={emp.avatarColor} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{r.employeeName}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: branch?.color }} />{branch?.name}</span>
                      <span>·</span>
                      <span>{emp.role}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <span className="rounded-lg bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {r.method}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums">{r.checkIn}</div>
                    <div className="text-[10px] text-muted-foreground">{r.checkOut ? `Out: ${r.checkOut}` : "Still working"}</div>
                  </div>
                  <StatusBadge status={r.status} size="sm" />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-3">7-Day Attendance Overview</h3>
          <div className="overflow-x-auto scrollbar-premium">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left p-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Employee</th>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return (
                      <th key={i} className="p-2 text-center text-[10px] font-medium text-muted-foreground">
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                        <div className="text-xs font-semibold text-foreground">{d.getDate()}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 8).map((e, ri) => (
                  <tr key={e.id} className="border-b border-border/40">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Avatar name={e.name} color={e.avatarColor} size="xs" />
                        <span className="text-xs font-medium truncate max-w-[120px]">{e.name}</span>
                      </div>
                    </td>
                    {Array.from({ length: 7 }).map((_, ci) => {
                      const rec = attendanceRecords.find(r => r.employeeId === e.id && r.date === (() => {
                        const d = new Date();
                        d.setDate(d.getDate() - ci);
                        return d.toISOString().split("T")[0];
                      })());
                      if (!rec) return <td key={ci} className="p-2 text-center"><div className="h-6 w-6 mx-auto rounded-md bg-muted/30" /></td>;
                      return (
                        <td key={ci} className="p-2 text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: ri * 0.04 + ci * 0.02 }}
                            className={cn("mx-auto flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold",
                              rec.status === "present" ? "bg-emerald-500/20 text-emerald-600" :
                              rec.status === "late" ? "bg-amber-500/20 text-amber-600" :
                              rec.status === "absent" ? "bg-rose-500/20 text-rose-600" :
                              "bg-[#B79AFB]/20 text-[#7C5BD9]"
                            )}>
                            {rec.status === "present" ? "P" : rec.status === "late" ? "L" : rec.status === "absent" ? "A" : "Lv"}
                          </motion.div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-4 text-[11px]">
            {[
              { label: "Present", color: "bg-emerald-500/20 text-emerald-600" },
              { label: "Late", color: "bg-amber-500/20 text-amber-600" },
              { label: "Absent", color: "bg-rose-500/20 text-rose-600" },
              { label: "Leave", color: "bg-[#B79AFB]/20 text-[#7C5BD9]" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={cn("flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold", l.color)}>P</div>
                <span className="text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
