"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Bell, Calendar, IndianRupee, Clock, UserPlus, FileText,
  AlertTriangle, CheckCircle2, X, Check
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { SectionHeader } from "../SectionHeader";
import { Button } from "../Form";
import { cn, mapNotification } from "@/lib/utils";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/use-supabase-query";

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  appointment: { icon: Calendar, color: "#60A5FA", bg: "bg-blue-500/10" },
  payment: { icon: IndianRupee, color: "#34D399", bg: "bg-emerald-500/10" },
  follow_up: { icon: Clock, color: "#FBBF24", bg: "bg-amber-500/10" },
  registration: { icon: UserPlus, color: "#B79AFB", bg: "bg-[#B79AFB]/15" },
  attendance: { icon: AlertTriangle, color: "#F87171", bg: "bg-rose-500/10" },
  report: { icon: FileText, color: "#5EEAD4", bg: "bg-[#5EEAD4]/15" },
  leave: { icon: Clock, color: "#A78BFA", bg: "bg-[#A78BFA]/15" },
};

export function NotificationsView() {
  const { data: rawNotifications = [], isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  
  const notifications = rawNotifications.map(mapNotification);
  
  const [filter, setFilter] = useState("all");

  const filtered = notifications.filter(n => filter === "all" || (filter === "unread" && !n.read) || n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Notifications"
        description={`${unreadCount} unread notifications`}
        icon={<Bell className="h-5 w-5" />}
        action={
          <Button variant="outline" onClick={() => markAllReadMutation.mutate()} disabled={unreadCount === 0 || markAllReadMutation.isPending}>
            <Check className="h-4 w-4" /> Mark all read
          </Button>
        }
      />

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {["all", "unread", "appointment", "payment", "follow_up", "registration", "attendance", "report", "leave"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-xl px-3 py-2 text-xs font-medium transition-all whitespace-nowrap",
              filter === f ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:bg-muted ring-1 ring-border/60"
            )}
          >
            {f === "all" ? "All" : f === "unread" ? "Unread" : f.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-card ring-1 ring-border/40 overflow-hidden">
        <div className="divide-y divide-border/40">
          {filtered.map((n, i) => {
            const cfg = typeConfig[n.type] || typeConfig.report;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ x: 4 }}
                className={cn(
                  "group flex items-start gap-3 p-4 cursor-pointer transition-colors",
                  n.read ? "hover:bg-muted/40" : "bg-[#D6F04C]/[0.04] hover:bg-[#D6F04C]/[0.08]"
                )}
                onClick={() => !n.read && markReadMutation.mutate(n.id)}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", cfg.bg)} style={{ color: cfg.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-sm font-medium", !n.read && "font-semibold")}>{n.title}</span>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[#D6F04C]" />}
                    {n.priority === "high" && (
                      <span className="rounded-full bg-rose-500/10 px-1.5 py-0 text-[9px] font-bold text-rose-600 uppercase tracking-wider">High</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                  <div className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D6F04C] border-t-transparent" />
            <p className="mt-4 text-sm">Loading notifications...</p>
          </div>
        ) : filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">All caught up!</h3>
            <p className="mt-1 text-xs text-muted-foreground">You have no notifications in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

