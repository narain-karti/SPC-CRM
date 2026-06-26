"use client";

import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Award, Star,
  TrendingUp, Activity, Clock, Shield, Bell, Crown, ChevronRight, LogOut
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Avatar } from "../Avatar";
import { SectionHeader } from "../SectionHeader";
import { AnimatedCounter } from "../AnimatedCounter";
import type { Role } from "@/lib/types";

const roleData: Record<Role, { name: string; color: string; email: string; phone: string; branch: string; joinDate: string; title: string }> = {
  master_admin: { name: "Aarav Mehta", color: "#D6F04C", email: "aarav@stabilityphysio.com", phone: "+91 98111 11111", branch: "All Branches", joinDate: "Jan 2018", title: "Master Administrator" },
  branch_admin: { name: "Rajesh Kumar", color: "#B79AFB", email: "rajesh@stabilityphysio.com", phone: "+91 98000 11111", branch: "Indiranagar", joinDate: "Apr 2023", title: "Branch Manager" },
  receptionist: { name: "Lakshmi Iyer", color: "#5EEAD4", email: "lakshmi@stabilityphysio.com", phone: "+91 98000 22222", branch: "Indiranagar", joinDate: "Jan 2024", title: "Receptionist" },
  physiotherapist: { name: "Dr. Ananya Krishnan", color: "#FBBF24", email: "ananya@stabilityphysio.com", phone: "+91 98000 33333", branch: "Indiranagar", joinDate: "Mar 2022", title: "Senior Physiotherapist" },
};

export function ProfileView() {
  const { currentRole, setView } = useAppStore();
  const data = roleData[currentRole];

  return (
    <div className="space-y-5">
      <SectionHeader title="Profile" description="Your account and activity" icon={<User className="h-5 w-5" />} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-card premium-shadow-lg ring-1 ring-border/40"
      >
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: `linear-gradient(120deg, ${data.color}40 0%, ${data.color}10 40%, transparent 100%)`
          }} />
          <div className="absolute inset-0 grid-bg opacity-[0.04]" />
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl opacity-30" style={{ background: data.color }} />
        </div>

        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-wrap items-end gap-4">
            <Avatar name={data.name} color={data.color} size="xl" className="!h-24 !w-24 !text-3xl ring-4 ring-card" />
            <div className="flex-1 min-w-0 pt-8">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
                {currentRole === "master_admin" && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                    <Crown className="h-3 w-3" /> Founder
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{data.title} · {data.branch}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-10 items-center gap-2 rounded-2xl bg-card px-3.5 text-sm font-medium ring-1 ring-border/60 hover:bg-muted premium-shadow">
                <Edit className="h-4 w-4" /> Edit Profile
              </button>
              <button onClick={() => setView("settings")} className="flex h-10 items-center gap-2 rounded-2xl bg-foreground px-3.5 text-sm font-semibold text-background">
                Settings <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Patients Managed", value: 142, icon: User, color: "#D6F04C" },
              { label: "Sessions Conducted", value: 1842, icon: Activity, color: "#B79AFB" },
              { label: "Avg Rating", value: 4.9, suffix: "/5", icon: Star, color: "#FBBF24" },
              { label: "Years Active", value: 4, suffix: "y", icon: Clock, color: "#34D399" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-2xl bg-muted/40 p-3 ring-1 ring-border/40">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: `${s.color}15`, color: s.color }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</span>
                  </div>
                  <div className="mt-1 text-lg font-semibold tabular-nums">
                    <AnimatedCounter value={s.value} />
                    {s.suffix && <span>{s.suffix}</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal info */}
        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-3">Personal Information</h3>
          <div className="space-y-3">
            {[
              { icon: Mail, label: "Email", value: data.email, color: "#B79AFB" },
              { icon: Phone, label: "Phone", value: data.phone, color: "#34D399" },
              { icon: MapPin, label: "Branch", value: data.branch, color: "#FBBF24" },
              { icon: Calendar, label: "Joined", value: data.joinDate, color: "#60A5FA" },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${item.color}15`, color: item.color }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-3xl bg-card p-5 premium-shadow ring-1 ring-border/40">
          <h3 className="text-sm font-semibold mb-3">Account & Security</h3>
          <div className="space-y-2">
            {[
              { icon: Shield, label: "Two-Factor Authentication", desc: "Enabled", color: "#34D399" },
              { icon: Bell, label: "Notification Preferences", desc: "7 active channels", color: "#FBBF24" },
              { icon: Award, label: "Certifications", desc: "3 verified", color: "#B79AFB" },
              { icon: TrendingUp, label: "Performance Goals", desc: "On track", color: "#D6F04C" },
              { icon: LogOut, label: "Sign Out", desc: "End this session", color: "#F87171" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ x: 4 }}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-border/40 hover:bg-muted transition-colors text-left"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${item.color}15`, color: item.color }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
