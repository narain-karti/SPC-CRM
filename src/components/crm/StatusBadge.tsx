"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StatusType = "active" | "in_consultation" | "in_therapy" | "follow_up" | "discharged" |
  "scheduled" | "waiting" | "consultation" | "therapy" | "completed" | "cancelled" | "no_show" |
  "paid" | "pending" | "partial" | "refunded" | "available" | "busy" | "off" |
  "present" | "absent" | "late" | "leave" | "on_leave" | "inactive" |
  "new" | "contacted" | "converted" | "lost";

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: "Active", bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  in_consultation: { label: "In Consultation", bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  in_therapy: { label: "In Therapy", bg: "bg-[#B79AFB]/15", text: "text-[#7C5BD9]", dot: "bg-[#B79AFB]" },
  follow_up: { label: "Follow-up", bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  discharged: { label: "Discharged", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  scheduled: { label: "Scheduled", bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  waiting: { label: "Waiting", bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  consultation: { label: "Consultation", bg: "bg-[#B79AFB]/15", text: "text-[#7C5BD9]", dot: "bg-[#B79AFB]" },
  therapy: { label: "Therapy", bg: "bg-[#D6F04C]/20", text: "text-[#8FA61E]", dot: "bg-[#D6F04C]" },
  completed: { label: "Completed", bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", bg: "bg-rose-500/10", text: "text-rose-600", dot: "bg-rose-500" },
  no_show: { label: "No Show", bg: "bg-rose-500/10", text: "text-rose-600", dot: "bg-rose-500" },
  paid: { label: "Paid", bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  pending: { label: "Pending", bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  partial: { label: "Partial", bg: "bg-orange-500/10", text: "text-orange-600", dot: "bg-orange-500" },
  refunded: { label: "Refunded", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  available: { label: "Available", bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  busy: { label: "Busy", bg: "bg-rose-500/10", text: "text-rose-600", dot: "bg-rose-500" },
  off: { label: "Off Duty", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  present: { label: "Present", bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  absent: { label: "Absent", bg: "bg-rose-500/10", text: "text-rose-600", dot: "bg-rose-500" },
  late: { label: "Late", bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  leave: { label: "On Leave", bg: "bg-[#B79AFB]/15", text: "text-[#7C5BD9]", dot: "bg-[#B79AFB]" },
  on_leave: { label: "On Leave", bg: "bg-[#B79AFB]/15", text: "text-[#7C5BD9]", dot: "bg-[#B79AFB]" },
  inactive: { label: "Inactive", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  new: { label: "New", bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  contacted: { label: "Contacted", bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  converted: { label: "Converted", bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  lost: { label: "Lost", bg: "bg-rose-500/10", text: "text-rose-600", dot: "bg-rose-500" },
};

export function StatusBadge({
  status,
  size = "md",
  className,
}: {
  status: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const cfg = statusConfig[status] || { label: status, bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" };
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        cfg.bg, cfg.text, className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </motion.span>
  );
}
