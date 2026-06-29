"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Plus, Moon, Sun, Calendar as CalIcon, ChevronDown,
  Building2, Command, Zap, User, LogOut, Settings as SettingsIcon,
  Check, Stethoscope, UserCog, Menu, X
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useBranches, useNotifications } from "@/hooks/use-supabase-query";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Avatar } from "../Avatar";
import * as Popover from "@radix-ui/react-popover";
import type { Role } from "@/lib/types";
import { roleUser } from "./Sidebar";

const roleOptions: { value: Role; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { value: "master_admin", label: "Master Admin", icon: UserCog, color: "#D6F04C" },
  { value: "branch_admin", label: "Branch Admin", icon: Building2, color: "#B79AFB" },
  { value: "receptionist", label: "Receptionist", icon: User, color: "#5EEAD4" },
  { value: "physiotherapist", label: "Physiotherapist", icon: Stethoscope, color: "#FBBF24" },
];

export function Topbar() {
  const {
    theme, toggleTheme, setCommandOpen,
    currentRole, setRole, currentBranchId, setBranch, setView,
    setMobileSidebarOpen,
  } = useAppStore();
  const { data: branches = [] } = useBranches();
  const { data: notifications = [] } = useNotifications();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const user = roleUser[currentRole];
  const currentRoleOpt = roleOptions.find(r => r.value === currentRole)!;
  const currentBranch = branches.find(b => b.id === currentBranchId);
  const unreadCount = notifications.filter(n => !n.read).length;
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short"
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 sm:gap-3 border-b border-border/60 bg-background/80 px-3 sm:px-4 md:px-6 backdrop-blur-xl">
      {/* Mobile menu */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/40 ring-1 ring-border/60 hover:bg-muted"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Search */}
      <button
        onClick={() => setCommandOpen(true)}
        className="group flex h-10 flex-1 min-w-0 max-w-md items-center gap-2.5 rounded-2xl bg-muted/60 px-3.5 ring-1 ring-border/60 transition-all hover:bg-muted hover:ring-border"
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm text-muted-foreground">
          <span className="hidden sm:inline">Search patients, appointments…</span>
          <span className="sm:hidden">Search…</span>
        </span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded-md bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border md:flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Date — hidden on smaller */}
        <div className="hidden xl:flex items-center gap-2 rounded-2xl bg-muted/40 px-3 py-2 ring-1 ring-border/60">
          <CalIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{today}</span>
        </div>

        {/* Branch switcher */}
        <Popover.Root open={branchMenuOpen} onOpenChange={setBranchMenuOpen}>
          <Popover.Trigger asChild>
            <button className="flex h-10 items-center gap-2 rounded-2xl bg-muted/40 px-2.5 sm:px-3 ring-1 ring-border/60 transition-all hover:bg-muted hover:ring-border">
              <Building2 className="h-4 w-4 text-[#7C5BD9]" />
              <span className="hidden lg:block text-xs font-medium text-foreground truncate max-w-[120px]">
                {currentBranchId === "all" ? "All Branches" : currentBranch?.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="end"
              sideOffset={8}
              className="z-50 w-64 rounded-2xl bg-popover p-2 premium-shadow-lg ring-1 ring-border"
            >
              <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Switch Branch</div>
              <button
                onClick={() => { setBranch("all"); setBranchMenuOpen(false); }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-sm transition-colors",
                  currentBranchId === "all" ? "bg-[#D6F04C]/15 text-[#8FA61E]" : "hover:bg-muted"
                )}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" />
                  All Branches
                </span>
                {currentBranchId === "all" && <Check className="h-3.5 w-3.5" />}
              </button>
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setBranch(b.id); setBranchMenuOpen(false); }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-sm transition-colors",
                    currentBranchId === b.id ? "bg-[#D6F04C]/15 text-[#8FA61E]" : "hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                    {b.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{b.city}</span>
                </button>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Role switcher */}
        <Popover.Root open={roleMenuOpen} onOpenChange={setRoleMenuOpen}>
          <Popover.Trigger asChild>
            <button className="flex h-10 items-center gap-2 rounded-2xl bg-muted/40 px-2.5 sm:px-3 ring-1 ring-border/60 transition-all hover:bg-muted hover:ring-border">
              <Avatar name={user.name} color={user.color} size="xs" ring={false} />
              <span className="hidden lg:block text-xs font-medium text-foreground">{currentRoleOpt.label}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="end"
              sideOffset={8}
              className="z-50 w-64 rounded-2xl bg-popover p-2 premium-shadow-lg ring-1 ring-border"
            >
              <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Switch Role</div>
              {roleOptions.map(opt => {
                const Icon = opt.icon;
                const isActive = currentRole === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => { setRole(opt.value); setRoleMenuOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors",
                      isActive ? "bg-primary/5 text-foreground" : "hover:bg-muted"
                    )}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-[#1a1a1a]"
                      style={{ background: opt.color }}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="flex-1 text-left">{opt.label}</span>
                    {isActive && <Check className="h-3.5 w-3.5 text-foreground" />}
                  </button>
                );
              })}
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => { setView("settings"); setRoleMenuOpen(false); }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
                <SettingsIcon className="h-3.5 w-3.5" /> Account Settings
              </button>
              <button
                onClick={() => { setView("profile"); setRoleMenuOpen(false); }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-rose-500 transition-colors hover:bg-rose-500/10">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/40 ring-1 ring-border/60 transition-all hover:bg-muted"
        >
          <AnimatePresence mode="wait">
            {theme === "light" ? (
              <motion.div key="moon" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }}>
                <Moon className="h-4 w-4 text-foreground" />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ opacity: 0, rotate: 45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -45 }}>
                <Sun className="h-4 w-4 text-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <button
          onClick={() => setView("notifications")}
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/40 ring-1 ring-border/60 transition-all hover:bg-muted"
        >
          <Bell className="h-4 w-4 text-foreground" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D6F04C] px-1 text-[10px] font-bold text-[#0F1117] ring-2 ring-background"
            >
              {unreadCount}
            </motion.span>
          )}
        </button>

        {/* Quick Add */}
        <Popover.Root open={quickAddOpen} onOpenChange={setQuickAddOpen}>
          <Popover.Trigger asChild>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128] px-3 sm:px-4 text-[#0F1117] shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)] transition-all hover:shadow-[0_12px_32px_-6px_rgba(214,240,76,0.7)]"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" strokeWidth={2.5} />
              <span className="hidden md:block text-sm font-semibold">Quick Add</span>
            </motion.button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="end"
              sideOffset={8}
              className="z-50 w-64 rounded-2xl bg-popover p-2 premium-shadow-lg ring-1 ring-border"
            >
              <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Create New</div>
              {[
                { label: "New Patient", icon: User, view: "patients" as const, color: "#D6F04C" },
                { label: "New Appointment", icon: CalIcon, view: "appointments" as const, color: "#B79AFB" },
                { label: "New Lead", icon: Zap, view: "leads" as const, color: "#5EEAD4" },
                { label: "New Invoice", icon: Building2, view: "billing" as const, color: "#FBBF24" },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => { setView(item.view); setQuickAddOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0F1117]"
                      style={{ background: item.color }}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                  </button>
                );
              })}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </header>
  );
}
