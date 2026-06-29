"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Plus, Clock } from "lucide-react";
import { therapists, patients } from "@/lib/data";
import { SectionHeader } from "../SectionHeader";
import { Button } from "../Form";
import { Avatar } from "../Avatar";
import { AppointmentModal } from "../modals/AppointmentModal";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export function CalendarView() {
  const { openPatient, appointments, currentBranchId } = useAppStore();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(today.toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const cells = Array.from({ length: 42 }).map((_, i) => {
    const dayNum = i - startWeekday + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
  });

  const filteredAppts = currentBranchId === "all"
    ? appointments
    : appointments.filter(a => a.branchId === currentBranchId);
  const selectedAppts = selectedDate ? filteredAppts.filter(a => a.date === selectedDate) : [];

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Calendar"
        description="Schedule and manage all appointments"
        icon={<CalIcon className="h-5 w-5" />}
        action={
          <Button variant="lime" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" /> New Appointment
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar grid */}
        <div className="lg:col-span-2 rounded-3xl bg-card p-4 md:p-6 premium-shadow ring-1 ring-border/40">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 hover:bg-muted">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => { setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(today.toISOString().split("T")[0]); }}
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
              if (!d) return <div key={i} className="min-h-[72px] md:min-h-[92px] rounded-xl bg-muted/10" />;
              const dateStr = d.toISOString().split("T")[0];
              const appts = filteredAppts.filter(a => a.date === dateStr);
              const isToday = d.toDateString() === today.toDateString();
              const isSelected = dateStr === selectedDate;
              return (
                <motion.button
                  key={i}
                  onClick={() => setSelectedDate(dateStr)}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "min-h-[72px] md:min-h-[92px] rounded-xl p-1.5 text-left transition-all",
                    isSelected ? "bg-foreground/5 ring-2 ring-foreground/30" :
                    isToday ? "bg-[#D6F04C]/15 ring-2 ring-[#D6F04C]/40" :
                    appts.length > 0 ? "bg-muted/40 hover:bg-muted/60" : "bg-muted/20 hover:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "text-xs font-semibold mb-1",
                    isToday && !isSelected && "text-[#8FA61E]"
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
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Side panel - selected date */}
        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                {selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" }) : "Select a date"}
              </div>
              <div className="text-sm font-semibold">
                {selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", { day: "numeric", month: "long" }) : ""}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D6F04C]/15">
              <Clock className="h-4 w-4 text-[#8FA61E]" />
            </div>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto scrollbar-premium pr-1">
            {selectedAppts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <CalIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium">No appointments</p>
                <p className="text-xs text-muted-foreground">Schedule one for this date</p>
              </div>
            ) : (
              selectedAppts.map((a, i) => {
                const p = patients.find(p => p.id === a.patientId);
                const t = therapists.find(t => t.id === a.therapistId);
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ x: 4 }}
                    onClick={() => openPatient(a.patientId)}
                    className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-border/40 cursor-pointer hover:bg-muted"
                  >
                    <div className="flex flex-col items-center gap-0.5 min-w-[44px]">
                      <span className="text-sm font-bold tabular-nums">{a.time}</span>
                      <span className="text-[10px] text-muted-foreground">{a.duration}min</span>
                    </div>
                    <div className="h-10 w-1 rounded-full" style={{ background: t?.avatarColor }} />
                    <Avatar name={a.patientName} color={p?.avatarColor || "#D6F04C"} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{a.patientName}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{t?.name}</div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <AppointmentModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
