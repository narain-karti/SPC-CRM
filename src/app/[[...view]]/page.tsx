"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Sidebar, MobileSidebar } from "@/components/crm/layout/Sidebar";
import { Topbar } from "@/components/crm/layout/Topbar";
import { PageTransition } from "@/components/crm/PageTransition";
import { CommandPalette } from "@/components/crm/CommandPalette";

import { DashboardView } from "@/components/crm/views/DashboardView";
import { PatientsView } from "@/components/crm/views/PatientsView";
import { PatientDetailView } from "@/components/crm/views/PatientDetailView";
import { AppointmentsView } from "@/components/crm/views/AppointmentsView";
import { CalendarViewPage } from "@/components/crm/views/CalendarViewPage";
import { TherapistsView } from "@/components/crm/views/TherapistsView";
import { EmployeesView } from "@/components/crm/views/EmployeesView";
import { AttendanceView } from "@/components/crm/views/AttendanceView";
import { BillingView } from "@/components/crm/views/BillingView";
import { ReportsView } from "@/components/crm/views/ReportsView";
import { AnalyticsView } from "@/components/crm/views/AnalyticsView";
import { LeadsView } from "@/components/crm/views/LeadsView";
import { NotificationsView } from "@/components/crm/views/NotificationsView";
import { SettingsView } from "@/components/crm/views/SettingsView";
import { ProfileView } from "@/components/crm/views/ProfileView";

import { useParams, useRouter } from "next/navigation";

export default function Home() {
  const { currentView, setView, theme, commandOpen, setCommandOpen } = useAppStore();
  const params = useParams();
  const router = useRouter();

  // Sync URL changes to Zustand state
  useEffect(() => {
    const viewParam = Array.isArray(params?.view) ? params.view[0] : params?.view;
    const validViews = [
      "dashboard", "patients", "patient_detail", "appointments", "calendar", 
      "therapists", "employees", "attendance", "billing", "reports", 
      "analytics", "leads", "notifications", "settings", "profile"
    ];
    if (viewParam && validViews.includes(viewParam)) {
      if (viewParam !== currentView) {
        setView(viewParam as any);
      }
    } else if (!viewParam && currentView !== "dashboard") {
      setView("dashboard");
    }
  }, [params?.view, setView]); // Only depend on params.view

  // Sync Zustand state changes to URL using Next.js router
  useEffect(() => {
    const targetPath = currentView === "dashboard" ? "/" : `/${currentView}`;
    if (window.location.pathname !== targetPath) {
      router.push(targetPath);
    }
  }, [currentView, router]);

  // Apply theme class on documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Cmd+K to open command palette
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandOpen]);

  function renderView() {
    switch (currentView) {
      case "dashboard": return <DashboardView />;
      case "patients": return <PatientsView />;
      case "patient_detail": return <PatientDetailView />;
      case "appointments": return <AppointmentsView />;
      case "calendar": return <CalendarViewPage />;
      case "therapists": return <TherapistsView />;
      case "employees": return <EmployeesView />;
      case "attendance": return <AttendanceView />;
      case "billing": return <BillingView />;
      case "reports": return <ReportsView />;
      case "analytics": return <AnalyticsView />;
      case "leads": return <LeadsView />;
      case "notifications": return <NotificationsView />;
      case "settings": return <SettingsView />;
      case "profile": return <ProfileView />;
      default: return <DashboardView />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background bg-mesh">
      <Sidebar />
      <MobileSidebar />
      <div className="flex flex-1 flex-col min-w-0 h-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-premium p-3 sm:p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <PageTransition key={currentView} viewKey={currentView}>
              {renderView()}
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
