import { useMemo } from "react";
import { useInvoices, usePatients, useLeads, useAppointments, useTherapists } from "./use-supabase-query";
import { branches } from "@/lib/data"; // fallback if needed

export function useAnalytics(branchId?: string) {
  const { data: invoices = [] } = useInvoices(branchId);
  const { data: patients = [] } = usePatients(branchId);
  const { data: leads = [] } = useLeads(branchId);
  const { data: appointments = [] } = useAppointments(branchId);
  const { data: therapists = [] } = useTherapists(branchId);

  return useMemo(() => {
    // 1. Monthly Revenue Data (last 6 months)
    const monthlyRevenueData = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const monthStr = d.toISOString().slice(0, 7); // YYYY-MM
      
      const monthInvoices = invoices.filter((inv: any) => inv.date?.startsWith(monthStr));
      const monthPatients = patients.filter((p: any) => p.registered_on?.startsWith(monthStr));
      
      const revenue = monthInvoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
      const expenses = revenue * 0.4; // rough estimate for demo

      return {
        name: d.toLocaleDateString("en-US", { month: "short" }),
        revenue,
        expenses,
        profit: revenue - expenses,
        patients: monthPatients.length
      };
    });

    // 2. Branch Comparison Data
    const branchComparisonData = branches.map(b => {
      const bInvoices = invoices.filter((i: any) => i.branch_id === b.id);
      const bPatients = patients.filter((p: any) => p.branch_id === b.id);
      return {
        name: b.name.split(" ")[0], // e.g. "Indiranagar"
        revenue: bInvoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0),
        patients: bPatients.length,
        satisfaction: 95, // mock
        color: b.color || "#D6F04C",
        staff: b.name.length * 2, // deterministic mock
        growth: b.name.length * 3 - 10 // deterministic mock
      };
    });

    // 3. Lead Source Data
    const sources = ["walk_in", "whatsapp", "instagram", "doctor_referral", "website", "phone"];
    const leadSourceData = sources.map(s => ({
      name: s.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      value: leads.filter((l: any) => l.source === s).length || 0,
      color: s === "whatsapp" ? "#34D399" : s === "instagram" ? "#F43F5E" : s === "website" ? "#60A5FA" : "#B79AFB"
    })).filter(d => d.value > 0);

    // Add dummy if empty
    if (leadSourceData.length === 0) {
      leadSourceData.push({ name: "No Data", value: 1, color: "#D6F04C" });
    }

    // 4. Appointment Status Data
    const appointmentStatusData = [
      { name: "Completed", value: appointments.filter((a: any) => a.status === "completed").length, color: "#34D399" },
      { name: "Scheduled", value: appointments.filter((a: any) => a.status === "scheduled").length, color: "#60A5FA" },
      { name: "Cancelled", value: appointments.filter((a: any) => a.status === "cancelled").length, color: "#F87171" },
      { name: "No Show", value: appointments.filter((a: any) => a.status === "no_show").length, color: "#FBBF24" }
    ].filter(d => d.value > 0);
    
    if (appointmentStatusData.length === 0) {
      appointmentStatusData.push({ name: "No Data", value: 1, color: "#D6F04C" });
    }

    // 5. Therapist Performance Data
    const therapistPerformanceData = therapists.map((t: any) => {
      const tAppointments = appointments.filter((a: any) => a.therapist_id === t.id);
      return {
        name: t.name.split(" ")[0],
        patients: t.patients_count || 0,
        sessions: tAppointments.length,
        rating: t.rating || 0
      };
    });

    // 6. Patient Growth Data
    const patientGrowthData = monthlyRevenueData.map(m => ({
      name: m.name,
      new: m.patients,
      returning: Math.floor(m.patients * 1.5) // dummy returning
    }));

    // 7. KPIs
    const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
    const avgRevenue = patients.length ? Math.round(totalRevenue / patients.length) : 0;
    
    return {
      monthlyRevenueData,
      branchComparisonData,
      leadSourceData,
      appointmentStatusData,
      therapistPerformanceData,
      patientGrowthData,
      kpis: {
        avgRevenue,
        retentionRate: patients.length ? 85 : 0,
        avgSessions: appointments.length && patients.length ? Math.round(appointments.length / patients.length) : 0,
        conversionRate: leads.length ? Math.round((leads.filter((l: any) => l.stage === "converted").length / leads.length) * 100) : 0
      }
    };
  }, [invoices, patients, leads, appointments, therapists]);
}
