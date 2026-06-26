"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: string;
  accent: "lime" | "purple" | "blue" | "amber" | "rose" | "emerald";
  index?: number;
}

const accentMap = {
  lime: {
    bg: "bg-[#D6F04C]/10",
    text: "text-[#A3C128]",
    icon: "bg-[#D6F04C] text-[#1a1a1a]",
    glow: "shadow-[0_8px_32px_-8px_rgba(214,240,76,0.4)]",
    ring: "ring-[#D6F04C]/20",
    chipBg: "bg-[#D6F04C]/15",
    chipText: "text-[#8FA61E]",
  },
  purple: {
    bg: "bg-[#B79AFB]/10",
    text: "text-[#7C5BD9]",
    icon: "bg-[#B79AFB] text-white",
    glow: "shadow-[0_8px_32px_-8px_rgba(183,154,251,0.4)]",
    ring: "ring-[#B79AFB]/20",
    chipBg: "bg-[#B79AFB]/15",
    chipText: "text-[#6B47C9]",
  },
  blue: {
    bg: "bg-[#60A5FA]/10",
    text: "text-[#3B82F6]",
    icon: "bg-[#60A5FA] text-white",
    glow: "shadow-[0_8px_32px_-8px_rgba(96,165,250,0.4)]",
    ring: "ring-[#60A5FA]/20",
    chipBg: "bg-[#60A5FA]/15",
    chipText: "text-[#2563EB]",
  },
  amber: {
    bg: "bg-[#FBBF24]/10",
    text: "text-[#D97706]",
    icon: "bg-[#FBBF24] text-[#1a1a1a]",
    glow: "shadow-[0_8px_32px_-8px_rgba(251,191,36,0.4)]",
    ring: "ring-[#FBBF24]/20",
    chipBg: "bg-[#FBBF24]/15",
    chipText: "text-[#B45309]",
  },
  rose: {
    bg: "bg-[#F87171]/10",
    text: "text-[#EF4444]",
    icon: "bg-[#F87171] text-white",
    glow: "shadow-[0_8px_32px_-8px_rgba(248,113,113,0.4)]",
    ring: "ring-[#F87171]/20",
    chipBg: "bg-[#F87171]/15",
    chipText: "text-[#DC2626]",
  },
  emerald: {
    bg: "bg-[#34D399]/10",
    text: "text-[#10B981]",
    icon: "bg-[#34D399] text-white",
    glow: "shadow-[0_8px_32px_-8px_rgba(52,211,153,0.4)]",
    ring: "ring-[#34D399]/20",
    chipBg: "bg-[#34D399]/15",
    chipText: "text-[#059669]",
  },
};

export function KPICard({
  label,
  value,
  prefix,
  suffix,
  change,
  trend,
  icon,
  accent,
  index = 0,
}: KPICardProps) {
  const a = accentMap[accent];
  const Icon = (Icons as Record<string, LucideIcon>)[icon] || Icons.Circle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.015 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40 transition-all cursor-default",
        "hover:premium-shadow-lg hover:ring-border/60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {label}
          </span>
          <div className="flex items-baseline gap-1">
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              className="text-2xl md:text-[28px] font-semibold text-foreground tabular-nums tracking-tight"
            />
          </div>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            a.icon, a.glow
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <div
          className={cn(
            "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            trend === "up" ? "bg-emerald-500/10 text-emerald-600" :
            trend === "down" ? "bg-rose-500/10 text-rose-600" :
            "bg-muted text-muted-foreground"
          )}
        >
          {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> :
           trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
          {change > 0 ? "+" : ""}{change}%
        </div>
        <span className="text-[11px] text-muted-foreground">vs last week</span>
      </div>

      {/* Decorative gradient blob */}
      <div
        className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: accent === "lime" ? "rgba(214,240,76,0.25)" :
                      accent === "purple" ? "rgba(183,154,251,0.25)" :
                      accent === "blue" ? "rgba(96,165,250,0.25)" :
                      accent === "amber" ? "rgba(251,191,36,0.25)" :
                      accent === "rose" ? "rgba(248,113,113,0.25)" :
                      "rgba(52,211,153,0.25)"
        }}
      />
    </motion.div>
  );
}
