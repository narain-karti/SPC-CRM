"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Settings as SettingsIcon, Building2, Users, Bell, Shield, CreditCard,
  MessageCircle, Globe, Palette, Database, ChevronRight, Check, Crown
} from "lucide-react";
import { Avatar } from "../Avatar";
import { SectionHeader } from "../SectionHeader";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useBranches } from "@/hooks/use-supabase-query";

const sections = [
  { key: "general", label: "General", icon: SettingsIcon, color: "#D6F04C" },
  { key: "branches", label: "Branches", icon: Building2, color: "#B79AFB" },
  { key: "users", label: "Users & Roles", icon: Users, color: "#60A5FA" },
  { key: "notifications", label: "Notifications", icon: Bell, color: "#FBBF24" },
  { key: "security", label: "Security", icon: Shield, color: "#F87171" },
  { key: "billing", label: "Billing Plans", icon: CreditCard, color: "#34D399" },
  { key: "communication", label: "Communication", icon: MessageCircle, color: "#5EEAD4" },
  { key: "appearance", label: "Appearance", icon: Palette, color: "#A78BFA" },
  { key: "data", label: "Data & Backups", icon: Database, color: "#FB923C" },
];

export function SettingsView() {
  const [active, setActive] = useState("general");

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Settings"
        description="Manage your clinic, team, and preferences"
        icon={<SettingsIcon className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Section nav */}
        <div className="rounded-3xl bg-card p-2 premium-shadow ring-1 ring-border/40 h-fit">
          <div className="space-y-0.5">
            {sections.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active === s.key ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  {active === s.key && (
                    <motion.div layoutId="settings-active" className="absolute inset-0 rounded-2xl bg-primary/8" />
                  )}
                  <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${s.color}15`, color: s.color }}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="relative z-10 flex-1 text-left">{s.label}</span>
                  <ChevronRight className="relative z-10 h-3.5 w-3.5 opacity-50" />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-card p-6 premium-shadow ring-1 ring-border/40"
          >
            {active === "general" && <GeneralSection />}
            {active === "branches" && <BranchesSection />}
            {active === "users" && <UsersSection />}
            {active === "notifications" && <NotificationsSection />}
            {active === "security" && <SecuritySection />}
            {active === "billing" && <BillingSection />}
            {active === "communication" && <CommunicationSection />}
            {active === "appearance" && <AppearanceSection />}
            {active === "data" && <DataSection />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</label>
      <input
        defaultValue={value}
        className="mt-1.5 w-full rounded-xl bg-muted/40 px-3 py-2 text-sm outline-none ring-1 ring-border/60 focus:ring-foreground/20 transition-all"
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ToggleRow({ title, desc, defaultChecked }: { title: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-0">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function GeneralSection() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-1">Clinic Information</h3>
      <p className="text-xs text-muted-foreground mb-5">Basic details about your clinic</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Clinic Name" value="Stability Physio Care" />
        <Field label="GST Number" value="29ABCDE1234F1Z5" />
        <Field label="Contact Email" value="hello@stabilityphysio.com" />
        <Field label="Contact Phone" value="+91 80 2345 6789" />
        <Field label="Website" value="www.stabilityphysio.com" />
        <Field label="Established" value="2018" />
      </div>
      <div className="mt-6 flex items-center justify-end gap-2">
        <button className="rounded-xl bg-muted/60 px-4 py-2 text-xs font-medium ring-1 ring-border/60 hover:bg-muted">Cancel</button>
        <button className="rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background">Save Changes</button>
      </div>
    </div>
  );
}

function BranchesSection() {
  const { data: branches = [], isLoading } = useBranches();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold">Branches</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Manage your clinic locations</p>
        </div>
        <button className="rounded-xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128] px-3 py-2 text-xs font-semibold text-[#0F1117]">+ Add Branch</button>
      </div>
      <div className="space-y-2">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading branches...</div>
        ) : branches.map((b: any, i: number) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-border/40"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${b.color}15`, color: b.color }}>
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{b.name}</div>
              <div className="text-[11px] text-muted-foreground">{b.location}, {b.city} · {b.phone}</div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs">
              <div className="text-center">
                <div className="font-semibold tabular-nums">—</div>
                <div className="text-[10px] text-muted-foreground">patients</div>
              </div>
              <div className="text-center">
                <div className="font-semibold tabular-nums">—</div>
                <div className="text-[10px] text-muted-foreground">staff</div>
              </div>
              <div className="text-center">
                <div className="font-semibold tabular-nums">—</div>
                <div className="text-[10px] text-muted-foreground">revenue</div>
              </div>
            </div>
            <button className="text-xs font-medium text-primary hover:underline">Edit</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function UsersSection() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-1">Users & Roles</h3>
      <p className="text-xs text-muted-foreground mb-5">Role-based access control</p>
      <div className="space-y-2">
        {[
          { role: "Master Admin", desc: "Full access to all features and branches", count: 1, color: "#D6F04C", icon: Crown },
          { role: "Branch Admin", desc: "Manage a single branch and its staff", count: 5, color: "#B79AFB", icon: Building2 },
          { role: "Receptionist", desc: "Front-desk operations and patient intake", count: 8, color: "#5EEAD4", icon: Users },
          { role: "Physiotherapist", desc: "Clinical access to assigned patients", count: 12, color: "#FBBF24", icon: Users },
          { role: "Doctor (Future)", desc: "Doctor consultations and prescriptions", count: 0, color: "#A78BFA", icon: Users },
        ].map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div key={r.role} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-border/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: `${r.color}15`, color: r.color }}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{r.role}</div>
                <div className="text-[11px] text-muted-foreground">{r.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold tabular-nums">{r.count}</div>
                <div className="text-[10px] text-muted-foreground">users</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-1">Notification Preferences</h3>
      <p className="text-xs text-muted-foreground mb-4">Choose what you want to be notified about</p>
      <ToggleRow title="Appointment Reminders" desc="Get notified 30 minutes before each appointment" defaultChecked />
      <ToggleRow title="New Patient Registrations" desc="Alert when a new patient is registered" defaultChecked />
      <ToggleRow title="Payment Confirmations" desc="Real-time alerts for payments received" defaultChecked />
      <ToggleRow title="Follow-up Reminders" desc="Daily summary of follow-ups due" defaultChecked />
      <ToggleRow title="Staff Attendance Alerts" desc="Late check-ins and absences" />
      <ToggleRow title="Daily Revenue Summary" desc="End-of-day revenue report via email" defaultChecked />
      <ToggleRow title="Weekly Performance Digest" desc="Monday morning performance summary" defaultChecked />
    </div>
  );
}

function SecuritySection() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-1">Security</h3>
      <p className="text-xs text-muted-foreground mb-4">Protect your account and data</p>
      <ToggleRow title="Two-Factor Authentication" desc="Require OTP on every login" defaultChecked />
      <ToggleRow title="Session Timeout" desc="Auto logout after 30 minutes of inactivity" defaultChecked />
      <ToggleRow title="IP Whitelist" desc="Restrict access to specific IP addresses" />
      <ToggleRow title="Audit Logging" desc="Track all user actions for compliance" defaultChecked />
      <ToggleRow title="Data Encryption at Rest" desc="AES-256 encryption for stored data" defaultChecked />
    </div>
  );
}

function BillingSection() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-1">Billing Plan</h3>
      <p className="text-xs text-muted-foreground mb-5">Your subscription and usage</p>
      <div className="rounded-2xl bg-gradient-to-br from-[#0F1117] to-[#1A1B2E] p-5 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#D6F04C]/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-[#D6F04C]" />
            <span className="text-[10px] uppercase tracking-wider text-[#D6F04C] font-semibold">Enterprise Plan</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-semibold">₹49,999</span>
            <span className="text-sm text-white/60">/month</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div><div className="text-[10px] uppercase text-white/40 font-semibold">Branches</div><div className="text-lg font-semibold">5 / ∞</div></div>
            <div><div className="text-[10px] uppercase text-white/40 font-semibold">Users</div><div className="text-lg font-semibold">26 / 50</div></div>
            <div><div className="text-[10px] uppercase text-white/40 font-semibold">Storage</div><div className="text-lg font-semibold">12 GB</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunicationSection() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-1">Communication Channels</h3>
      <p className="text-xs text-muted-foreground mb-4">Configure integrations</p>
      <ToggleRow title="WhatsApp Business" desc="Send appointment reminders via WhatsApp" defaultChecked />
      <ToggleRow title="SMS Gateway" desc="Backup SMS for critical alerts" defaultChecked />
      <ToggleRow title="Email Automation" desc="Welcome emails, follow-up sequences" defaultChecked />
      <ToggleRow title="Patient Feedback Surveys" desc="Auto-send satisfaction surveys after discharge" defaultChecked />
      <ToggleRow title="Rehab Tips Campaign" desc="Weekly posture and rehab tips to active patients" />
      <ToggleRow title="Birthday Wishes" desc="Auto-greet patients on their birthday" defaultChecked />
    </div>
  );
}

function AppearanceSection() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-1">Appearance</h3>
      <p className="text-xs text-muted-foreground mb-5">Customize how the CRM looks</p>
      <div className="space-y-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Theme</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "Light", bg: "bg-white border-2", active: true },
              { name: "Dark", bg: "bg-[#0F1117] border-2", active: false },
              { name: "System", bg: "bg-gradient-to-br from-white to-[#0F1117] border-2", active: false },
            ].map(t => (
              <button key={t.name} className={cn("relative rounded-2xl p-4 text-left", t.bg, t.active ? "border-[#D6F04C]" : "border-border")}>
                {t.active && <Check className="absolute top-2 right-2 h-3.5 w-3.5 text-[#8FA61E]" />}
                <div className="text-xs font-medium">{t.name}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Accent Color</div>
          <div className="flex items-center gap-2">
            {["#D6F04C", "#B79AFB", "#5EEAD4", "#FBBF24", "#F472B6", "#60A5FA"].map(c => (
              <button key={c} className={cn("h-9 w-9 rounded-xl ring-2 ring-offset-2 ring-offset-background transition-all hover:scale-110",
                c === "#D6F04C" ? "ring-foreground" : "ring-transparent")} style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataSection() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-1">Data & Backups</h3>
      <p className="text-xs text-muted-foreground mb-4">Manage your clinic data</p>
      <ToggleRow title="Automatic Daily Backups" desc="Backup all data at 2 AM IST" defaultChecked />
      <ToggleRow title="Encrypted Backups" desc="AES-256 encrypted cloud storage" defaultChecked />
      <ToggleRow title="Audit Log Retention" desc="Keep logs for 24 months" defaultChecked />
      <div className="mt-4 flex items-center gap-2">
        <button className="rounded-xl bg-muted/60 px-4 py-2 text-xs font-medium ring-1 ring-border/60 hover:bg-muted">Export All Data</button>
        <button className="rounded-xl bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-500/20">Delete Account</button>
      </div>
    </div>
  );
}
