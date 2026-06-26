"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Calendar, Clock, Plus, ChevronLeft, ChevronRight, Filter,
  Users, Phone, MessageCircle, Bell, MoreHorizontal, Search,
  Stethoscope, CalendarDays, List, Grid3x3, Video, MapPin
} from "lucide-react";
import { appointments, patients, therapists, branches } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { StatusBadge } from "../StatusBadge";
import { SectionHeader } from "../SectionHeader";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "day" | "week" | "month";

export function AppointmentsView() {
  const { openPatient, setView } = useAppStore();
  const [mode, setMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = appointments.filter(a => {
    if (search) {
      const q = search.toLowerCase();
      if (!a.patientName.toLowerCase().includes(q) && !a.therapistName.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  const groupedByDate = filtered.reduce((acc, a) => {
    (acc[a.date] = acc[a.date] || []).push(a);
    return acc;
  }, {} as Record<string, typeof appointments>);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Appointments"
        description={`${filtered.length} appointments scheduled`}
        icon={<Calendar className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-2xl bg-card p-1 premium-shadow ring-1 ring-border/40">
              {([
                { key: "list", icon: List },
                { key: "day", icon: Clock },
                { key: "week", icon: Grid3x3 },
                { key: "month", icon: CalendarDays },
              ] as const).map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setMode(opt.key)}
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                      mode === opt.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {mode === opt.key && (
                      <motion.div layoutId="appt-mode" className="absolute inset-0 rounded-xl bg-primary/8" />
                    )}
                    <Icon className="h-4 w-4 relative z-10" />
                  </button>
                );
              })}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128] px-4 text-sm font-semibold text-[#0F1117] shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} /> Book Appointment
            </motion.button>
          </div>
        }
      />

      {/* Filter bar */}
      <div className="rounded-3xl bg-card p-3 premium-shadow ring-1 ring-border/40">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 flex-1 min-w-[220px] items-center gap-2.5 rounded-2xl bg-muted/60 px-3.5 ring-1 ring-border/60">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patient or therapist…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {["all", "scheduled", "waiting", "consultation", "therapy", "completed", "cancelled", "no_show"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-medium transition-all whitespace-nowrap",
                  statusFilter === s ? "bg-foreground text-background" : "bg-muted/60 text-muted-foreground hover:bg-muted ring-1 ring-border/60"
                )}
              >
                {s === "all" ? "All" : s === "no_show" ? "No Show" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === "list" && (
        <div className="space-y-5">
          {Object.entries(groupedByDate).map(([date, appts], gi) => {
            const d = new Date(date);
            const isToday = date === appointments[0].date;
            return (
              <div key={date}>
                <div className="mb-3 flex items-center gap-3">
                  <div className={cn(
                    "flex h-12 w-12 flex-col items-center justify-center rounded-2xl",
                    isToday ? "bg-[#D6F04C] text-[#0F1117]" : "bg-card text-foreground premium-shadow ring-1 ring-border/40"
                  )}>
                    <span className="text-[9px] uppercase font-bold leading-none">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                    <span className="text-lg font-bold leading-none mt-0.5">{d.getDate()}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      {isToday ? "Today" : d.toLocaleDateString("en-US", { weekday: "long" })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} · {appts.length} appointments
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {appts.map((appt, i) => {
                    const p = patients.find(p => p.id === appt.patientId);
                    const t = therapists.find(t => t.id === appt.therapistId);
                    const branch = branches.find(b => b.id === appt.branchId);
                    return (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ x: 4 }}
                        className="group flex items-center gap-3 rounded-2xl bg-card p-3 premium-shadow ring-1 ring-border/40 cursor-pointer hover:ring-border"
                        onClick={() => openPatient(appt.patientId)}
                      >
                        <div className="flex flex-col items-center gap-0.5 min-w-[60px]">
                          <span className="text-sm font-bold tabular-nums">{appt.time}</span>
                          <span className="text-[10px] text-muted-foreground">{appt.duration}min</span>
                        </div>
                        <div className="h-12 w-1 rounded-full" style={{ background: t?.avatarColor }} />
                        <Avatar name={appt.patientName} color={p?.avatarColor || "#D6F04C"} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{appt.patientName}</span>
                            <StatusBadge status={appt.status} size="sm" />
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {appt.therapistName} · {appt.type.replace("_", " ")} · {branch?.name}
                          </div>
                        </div>
                        <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted" title="Call">
                            <Phone className="h-3.5 w-3.5" />
                          </button>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted" title="WhatsApp">
                            <MessageCircle className="h-3.5 w-3.5 text-[#34D399]" />
                          </button>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted" title="Video">
                            <Video className="h-3.5 w-3.5 text-[#B79AFB]" />
                          </button>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode === "day" && <DayView />}
      {mode === "week" && <WeekView />}
      {mode === "month" && <MonthView />}
    </div>
  );
}

function DayView() {
  const hours = Array.from({ length: 12 }).map((_, i) => 8 + i); // 8 AM - 7 PM
  const todayAppts = appointments.filter(a => a.date === appointments[0].date);

  return (
    <div className="rounded-3xl bg-card p-4 md:p-6 premium-shadow ring-1 ring-border/40">
      <div className="space-y-1">
        {hours.map(h => {
          const appts = todayAppts.filter(a => parseInt(a.time.split(":")[0]) === h);
          return (
            <div key={h} className="flex gap-3 group">
              <div className="w-14 text-xs text-muted-foreground font-medium pt-1.5">
                {h > 12 ? h - 12 : h}:00 {h >= 12 ? "PM" : "AM"}
              </div>
              <div className="flex-1 min-h-[56px] border-t border-border/40 group-hover:border-border transition-colors relative">
                <div className="space-y-1 pt-1">
                  {appts.map(a => {
                    const p = patients.find(p => p.id === a.patientId);
                    const t = therapists.find(t => t.id === a.therapistId);
                    return (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="flex items-center gap-2 rounded-xl p-2 cursor-pointer text-white"
                        style={{
                          background: `linear-gradient(135deg, ${t?.avatarColor}40 0%, ${t?.avatarColor}20 100%)`,
                          borderLeft: `3px solid ${t?.avatarColor}`,
                        }}
                      >
                        <Avatar name={a.patientName} color={p?.avatarColor || "#D6F04C"} size="xs" ring={false} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground truncate">{a.patientName}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{a.therapistName} · {a.duration}min</div>
                        </div>
                        <StatusBadge status={a.status} size="sm" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);

  return (
    <div className="rounded-3xl bg-card p-4 premium-shadow ring-1 ring-border/40 overflow-x-auto">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-2 min-w-[800px]">
        <div></div>
        {days.map((d, i) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + i);
          const isToday = date.toDateString() === today.toDateString();
          return (
            <div key={d} className="text-center pb-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{d}</div>
              <div className={cn(
                "mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold",
                isToday ? "bg-[#D6F04C] text-[#0F1117]" : "bg-muted/60 text-foreground"
              )}>
                {date.getDate()}
              </div>
            </div>
          );
        })}

        {Array.from({ length: 8 }).map((_, hourIdx) => (
          <>
            <div key={`h${hourIdx}`} className="text-[10px] text-muted-foreground font-medium pt-2 text-right pr-1">
              {8 + hourIdx}:00
            </div>
            {days.map((d, dayIdx) => {
              const date = new Date(weekStart);
              date.setDate(weekStart.getDate() + dayIdx);
              const dateStr = date.toISOString().split("T")[0];
              const appts = appointments.filter(a => a.date === dateStr && parseInt(a.time.split(":")[0]) === 8 + hourIdx);
              return (
                <div key={`${hourIdx}-${dayIdx}`} className="min-h-[60px] rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors p-1">
                  {appts.map(a => {
                    const t = therapists.find(t => t.id === a.therapistId);
                    return (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.04 }}
                        className="rounded-lg p-1.5 text-[10px] font-medium mb-1 cursor-pointer"
                        style={{ background: `${t?.avatarColor}25`, borderLeft: `2px solid ${t?.avatarColor}` }}
                      >
                        <div className="text-foreground truncate">{a.patientName.split(" ")[0]}</div>
                        <div className="text-muted-foreground truncate">{a.time}</div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

function MonthView() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const cells = Array.from({ length: 42 }).map((_, i) => {
    const dayNum = i - startWeekday + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
    return d;
  });

  return (
    <div className="rounded-3xl bg-card p-4 md:p-6 premium-shadow ring-1 ring-border/40">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="rounded-xl bg-muted/60 px-3 py-2 text-xs font-medium hover:bg-muted">
            Today
          </button>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 hover:bg-muted">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="text-center text-[10px] uppercase tracking-wider text-muted-foreground font-semibold py-2">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="min-h-[80px] md:min-h-[100px] rounded-xl bg-muted/10" />;
          const dateStr = d.toISOString().split("T")[0];
          const appts = appointments.filter(a => a.date === dateStr);
          const isToday = d.toDateString() === today.toDateString();
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "min-h-[80px] md:min-h-[100px] rounded-xl p-1.5 cursor-pointer transition-all",
                isToday ? "bg-[#D6F04C]/15 ring-2 ring-[#D6F04C]/40" :
                appts.length > 0 ? "bg-muted/40 hover:bg-muted/60" : "bg-muted/20 hover:bg-muted/40"
              )}
            >
              <div className={cn(
                "text-xs font-semibold mb-1",
                isToday && "text-[#8FA61E]"
              )}>{d.getDate()}</div>
              <div className="space-y-0.5">
                {appts.slice(0, 3).map(a => {
                  const t = therapists.find(t => t.id === a.therapistId);
                  return (
                    <div key={a.id} className="rounded-md px-1.5 py-0.5 text-[10px] truncate font-medium"
                      style={{ background: `${t?.avatarColor}25`, color: "#1a1a1a" }}>
                      {a.time} {a.patientName.split(" ")[0]}
                    </div>
                  );
                })}
                {appts.length > 3 && (
                  <div className="text-[10px] text-muted-foreground font-medium px-1">+{appts.length - 3} more</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
