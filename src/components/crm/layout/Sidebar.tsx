"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Calendar, CalendarDays, Stethoscope, UserCog,
  Clock, Receipt, BarChart3, LineChart, Bell, Settings, User,
  ChevronLeft, ChevronDown, Sparkles, Building2, Plus, Zap, X
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useBranches } from "@/hooks/use-supabase-query";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "../Avatar";
import type { Role, ViewKey } from "@/lib/types";

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
  badge?: number;
}

const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["master_admin", "branch_admin", "receptionist", "physiotherapist"] },
  { key: "patients", label: "Patients", icon: Users, roles: ["master_admin", "branch_admin", "receptionist", "physiotherapist"] },
  { key: "appointments", label: "Appointments", icon: Calendar, roles: ["master_admin", "branch_admin", "receptionist", "physiotherapist"], badge: 6 },
  { key: "calendar", label: "Calendar", icon: CalendarDays, roles: ["master_admin", "branch_admin", "receptionist", "physiotherapist"] },
  { key: "therapists", label: "Therapists", icon: Stethoscope, roles: ["master_admin", "branch_admin", "receptionist"] },
  { key: "employees", label: "Employees", icon: UserCog, roles: ["master_admin", "branch_admin"] },
  { key: "attendance", label: "Attendance", icon: Clock, roles: ["master_admin", "branch_admin"] },
  { key: "billing", label: "Billing", icon: Receipt, roles: ["master_admin", "branch_admin", "receptionist"] },
  { key: "reports", label: "Reports", icon: BarChart3, roles: ["master_admin", "branch_admin"] },
  { key: "analytics", label: "Analytics", icon: LineChart, roles: ["master_admin", "branch_admin"] },
  { key: "leads", label: "Leads", icon: Zap, roles: ["master_admin", "branch_admin", "receptionist"], badge: 10 },
  { key: "notifications", label: "Notifications", icon: Bell, roles: ["master_admin", "branch_admin", "receptionist", "physiotherapist"], badge: 3 },
];

const bottomNav: NavItem[] = [
  { key: "settings", label: "Settings", icon: Settings, roles: ["master_admin", "branch_admin", "receptionist", "physiotherapist"] },
  { key: "profile", label: "Profile", icon: User, roles: ["master_admin", "branch_admin", "receptionist", "physiotherapist"] },
];

export const roleLabels: Record<Role, string> = {
  master_admin: "Master Admin",
  branch_admin: "Branch Admin",
  receptionist: "Receptionist",
  physiotherapist: "Physiotherapist",
};

export const roleUser: Record<Role, { name: string; color: string; email: string }> = {
  master_admin: { name: "Aarav Mehta", color: "#D6F04C", email: "aarav@stabilityphysio.com" },
  branch_admin: { name: "Rajesh Kumar", color: "#B79AFB", email: "rajesh@stabilityphysio.com" },
  receptionist: { name: "Lakshmi Iyer", color: "#5EEAD4", email: "lakshmi@stabilityphysio.com" },
  physiotherapist: { name: "Dr. Ananya K.", color: "#FBBF24", email: "ananya@stabilityphysio.com" },
};

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, currentView, setView, currentRole, currentBranchId, setBranch } = useAppStore();
  const [branchOpen, setBranchOpen] = useState(false);
  const { data: branches = [] } = useBranches();

  const filteredNav = navItems.filter(n => n.roles.includes(currentRole));
  const filteredBottom = bottomNav.filter(n => n.roles.includes(currentRole));
  const currentBranch = branches.find(b => b.id === currentBranchId);
  const user = roleUser[currentRole];

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 76 : 268 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-30 hidden md:flex h-screen shrink-0 flex-col bg-[#0F1117] text-white/85"
    >
      <SidebarContent
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        currentView={currentView}
        setView={setView}
        currentRole={currentRole}
        currentBranchId={currentBranchId}
        setBranch={setBranch}
        currentBranch={currentBranch}
        branches={branches}
        user={user}
        filteredNav={filteredNav}
        filteredBottom={filteredBottom}
        branchOpen={branchOpen}
        setBranchOpen={setBranchOpen}
      />
    </motion.aside>
  );
}

export function MobileSidebar() {
  const {
    mobileSidebarOpen, setMobileSidebarOpen,
    sidebarCollapsed, toggleSidebar,
    currentView, setView, currentRole, currentBranchId, setBranch,
  } = useAppStore();
  const [branchOpen, setBranchOpen] = useState(false);
  const { data: branches = [] } = useBranches();

  const filteredNav = navItems.filter(n => n.roles.includes(currentRole));
  const filteredBottom = bottomNav.filter(n => n.roles.includes(currentRole));
  const currentBranch = branches.find(b => b.id === currentBranchId);
  const user = roleUser[currentRole];

  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
            className="absolute left-0 top-0 bottom-0 flex w-[280px] max-w-[85vw] flex-col bg-[#0F1117] text-white/85 safe-bottom"
          >
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute -right-3 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-lg"
            >
              <X className="h-4 w-4 text-[#0F1117]" />
            </button>
            <SidebarContent
              collapsed={false}
              toggleSidebar={() => setMobileSidebarOpen(false)}
              currentView={currentView}
              setView={(v) => { setView(v); setMobileSidebarOpen(false); }}
              currentRole={currentRole}
              currentBranchId={currentBranchId}
              setBranch={setBranch}
              currentBranch={currentBranch}
              branches={branches}
              user={user}
              filteredNav={filteredNav}
              filteredBottom={filteredBottom}
              branchOpen={branchOpen}
              setBranchOpen={setBranchOpen}
              isMobile
            />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function SidebarContent(props: {
  collapsed: boolean;
  toggleSidebar: () => void;
  currentView: ViewKey;
  setView: (v: ViewKey) => void;
  currentRole: Role;
  currentBranchId: string;
  setBranch: (id: string) => void;
  currentBranch?: any;
  branches: any[];
  user: { name: string; color: string };
  filteredNav: NavItem[];
  filteredBottom: NavItem[];
  branchOpen: boolean;
  setBranchOpen: (open: boolean) => void;
  isMobile?: boolean;
}) {
  const {
    collapsed, toggleSidebar, currentView, setView, currentRole,
    currentBranchId, setBranch, currentBranch, branches, user,
    filteredNav, filteredBottom, branchOpen, setBranchOpen, isMobile,
  } = props;

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.05 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)]"
        >
          <img src="/logo.png" className="h-full w-full object-contain" alt="Logo" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="min-w-0"
            >
              <div className="text-[15px] font-semibold leading-tight text-white tracking-tight">
                Stability
              </div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium">
                Physio Care CRM
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Branch Switcher */}
      <div className="px-3 pb-3">
        <button
          onClick={() => !collapsed && setBranchOpen(!branchOpen)}
          className={cn(
            "group flex w-full items-center gap-2.5 rounded-2xl bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/10 transition-all hover:bg-white/[0.07] hover:ring-white/20",
            collapsed && "justify-center px-0"
          )}
        >
          <Building2 className="h-4 w-4 shrink-0 text-[#D6F04C]" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0 text-left"
              >
                <div className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Branch</div>
                <div className="truncate text-xs font-medium text-white">
                  {currentBranchId === "all" ? "All Branches" : currentBranch?.name || "All Branches"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-white/40 transition-transform", branchOpen && "rotate-180")} />
          )}
        </button>
        <AnimatePresence>
          {branchOpen && !collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-0.5">
                <button
                  onClick={() => { setBranch("all"); setBranchOpen(false); }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                    currentBranchId === "all" ? "bg-[#D6F04C]/15 text-[#D6F04C]" : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span>All Branches</span>
                  <span className="text-[10px] opacity-60">{branches.length}</span>
                </button>
                {branches.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setBranch(b.id); setBranchOpen(false); }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                      currentBranchId === b.id ? "bg-[#D6F04C]/15 text-[#D6F04C]" : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.color }} />
                      {b.name}
                    </span>
                    <span className="text-[10px] opacity-60">{b.patients}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-dark">
        <div className="space-y-0.5">
          {filteredNav.map((item, i) => (
            <NavButton
              key={item.key}
              item={item}
              active={currentView === item.key || (item.key === "patients" && currentView === "patient_detail")}
              collapsed={collapsed}
              onClick={() => setView(item.key)}
              index={i}
            />
          ))}
        </div>

        <div className="my-3 h-px bg-white/5" />

        <div className="space-y-0.5">
          {filteredBottom.map((item, i) => (
            <NavButton
              key={item.key}
              item={item}
              active={currentView === item.key}
              collapsed={collapsed}
              onClick={() => setView(item.key)}
              index={i}
            />
          ))}
        </div>
      </nav>

      {/* User card */}
      <div className="border-t border-white/5 p-3">
        <button
          onClick={() => setView("profile")}
          className={cn(
            "group flex w-full items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/5",
            collapsed && "justify-center"
          )}
        >
          <Avatar name={user.name} color={user.color} size="sm" ring={false} />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0 text-left"
              >
                <div className="truncate text-xs font-medium text-white">{user.name}</div>
                <div className="truncate text-[10px] text-white/40">{roleLabels[currentRole]}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle - only on desktop */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-all hover:scale-110"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft className="h-3.5 w-3.5 text-[#0F1117]" />
          </motion.div>
        </button>
      )}
    </>
  );
}

function NavButton({
  item, active, collapsed, onClick, index,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = item.icon;
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.025 }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all",
        active
          ? "bg-gradient-to-r from-[#D6F04C]/15 to-[#D6F04C]/5 text-[#D6F04C] shadow-[0_4px_16px_-4px_rgba(214,240,76,0.3)]"
          : "text-white/55 hover:bg-white/5 hover:text-white",
        collapsed && "justify-center px-0"
      )}
      title={collapsed ? item.label : undefined}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#D6F04C] shadow-[0_0_12px_rgba(214,240,76,0.6)]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-transform", active && "scale-105")} strokeWidth={2.2} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 text-left font-medium tracking-tight"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && item.badge && (
        <span className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
          active ? "bg-[#D6F04C] text-[#0F1117]" : "bg-white/10 text-white/70"
        )}>
          {item.badge}
        </span>
      )}
      {collapsed && item.badge && (
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#D6F04C] ring-2 ring-[#0F1117]" />
      )}
    </motion.button>
  );
}
