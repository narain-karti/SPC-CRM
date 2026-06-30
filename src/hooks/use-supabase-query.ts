"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

// ============================================================
// Auth & User Profile
// ============================================================
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase.from("profiles").select("*").eq("auth_id", user.id).single();
      return { user, profile };
    },
  });
}

// ============================================================
// Role Credentials
// ============================================================
export function useRoleCredentials() {
  return useQuery({
    queryKey: ["roleCredentials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("role_credentials").select("role, password");
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// Patients
// ============================================================
export function usePatients(branchId?: string) {
  return useQuery({
    queryKey: ["patients", branchId],
    queryFn: async () => {
      let query = supabase.from("patients").select("*").order("created_at", { ascending: false });
      if (branchId && branchId !== "all") {
        query = query.eq("branch_id", branchId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function usePatient(id: string | null) {
  return useQuery({
    queryKey: ["patient", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  return useMutation({
    mutationFn: async (patient: any) => {
      const payload = { ...patient, org_id: currentUser?.profile?.org_id };
      const { data, error } = await supabase.from("patients").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient registered successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register patient");
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase.from("patients").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", data.id] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient deleted");
    },
  });
}

// ============================================================
// Appointments
// ============================================================
export function useAppointments(branchId?: string) {
  return useQuery({
    queryKey: ["appointments", branchId],
    queryFn: async () => {
      let query = supabase.from("appointments").select("*").order("date", { ascending: true }).order("time", { ascending: true });
      if (branchId && branchId !== "all") {
        query = query.eq("branch_id", branchId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  return useMutation({
    mutationFn: async (appointment: any) => {
      const payload = { ...appointment, org_id: currentUser?.profile?.org_id };
      const { data, error } = await supabase.from("appointments").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment booked!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to book appointment");
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase.from("appointments").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment deleted");
    },
  });
}

// ============================================================
// Invoices
// ============================================================
export function useInvoices(branchId?: string) {
  return useQuery({
    queryKey: ["invoices", branchId],
    queryFn: async () => {
      let query = supabase.from("invoices").select("*, invoice_items(*)").order("created_at", { ascending: false });
      if (branchId && branchId !== "all") {
        query = query.eq("branch_id", branchId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  return useMutation({
    mutationFn: async ({ invoice, items }: { invoice: any; items: any[] }) => {
      const payload = { ...invoice, org_id: currentUser?.profile?.org_id };
      const { data: inv, error: invError } = await supabase.from("invoices").insert(payload).select().single();
      if (invError) throw invError;

      if (items.length > 0) {
        const itemsWithInvoiceId = items.map((item) => ({ ...item, invoice_id: inv.id }));
        const { error: itemsError } = await supabase.from("invoice_items").insert(itemsWithInvoiceId);
        if (itemsError) throw itemsError;
      }

      return inv;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create invoice");
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase.from("invoices").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted");
    },
  });
}

// ============================================================
// Leads
// ============================================================
export function useLeads(branchId?: string) {
  return useQuery({
    queryKey: ["leads", branchId],
    queryFn: async () => {
      let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (branchId && branchId !== "all") {
        query = query.eq("branch_id", branchId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  return useMutation({
    mutationFn: async (lead: any) => {
      const payload = { ...lead, org_id: currentUser?.profile?.org_id };
      const { data, error } = await supabase.from("leads").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead added!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add lead");
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase.from("leads").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}



export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
    },
  });
}

// ============================================================
// Employees
// ============================================================
export function useEmployees(branchId?: string) {
  return useQuery({
    queryKey: ["employees", branchId],
    queryFn: async () => {
      let query = supabase.from("employees").select("*").order("name");
      if (branchId && branchId !== "all") {
        query = query.eq("branch_id", branchId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  return useMutation({
    mutationFn: async (employee: any) => {
      const payload = { ...employee, org_id: currentUser?.profile?.org_id };
      const { data, error } = await supabase.from("employees").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee added!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add employee");
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase.from("employees").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted");
    },
  });
}

// ============================================================
// Therapists
// ============================================================
export function useTherapists(branchId?: string) {
  return useQuery({
    queryKey: ["therapists", branchId],
    queryFn: async () => {
      let query = supabase.from("therapists").select("*").order("name");
      if (branchId && branchId !== "all") {
        query = query.eq("branch_id", branchId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteTherapist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("therapists").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapists"] });
      toast.success("Therapist deleted");
    },
  });
}

// ============================================================
// Notifications
// ============================================================
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  return useMutation({
    mutationFn: async (notification: any) => {
      const payload = { ...notification, org_id: currentUser?.profile?.org_id };
      const { data, error } = await supabase.from("notifications").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ============================================================
// Branches
// ============================================================
export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("branches").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// Attendance
// ============================================================
export function useAttendanceRecords(branchId?: string, date?: string) {
  return useQuery({
    queryKey: ["attendance", branchId, date],
    queryFn: async () => {
      let query = supabase.from("attendance_records").select("*").order("date", { ascending: false });
      if (branchId && branchId !== "all") {
        query = query.eq("branch_id", branchId);
      }
      if (date) {
        query = query.eq("date", date);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// Medical Records
// ============================================================
export function useMedicalRecords(patientId: string) {
  return useQuery({
    queryKey: ["medical-records", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ patientId, file, metadata }: { patientId: string; file: File; metadata: any }) => {
      // Upload file to Supabase Storage
      const fileName = `${patientId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("medical-records")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage.from("medical-records").getPublicUrl(fileName);

      // Save metadata to DB
      const { data, error } = await supabase
        .from("medical_records")
        .insert({
          ...metadata,
          patient_id: patientId,
          file_url: urlData.publicUrl,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medical-records", variables.patientId] });
      toast.success("File uploaded successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload file");
    },
  });
}

// ============================================================
// Timeline Events
// ============================================================
export function useTimelineEvents(patientId: string) {
  return useQuery({
    queryKey: ["timeline", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTimelineEvent() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  return useMutation({
    mutationFn: async (event: any) => {
      const payload = { ...event, org_id: currentUser?.profile?.org_id };
      const { data, error } = await supabase.from("timeline_events").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timeline", variables.patient_id] });
    },
  });
}

// ============================================================
// Treatment Packages
// ============================================================
export function useTreatmentPackages() {
  return useQuery({
    queryKey: ["treatment-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("treatment_packages").select("*").order("price");
      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// Dashboard Stats (aggregated)
// ============================================================
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];

      // Parallel queries for dashboard metrics
      const [
        { count: totalPatients },
        { count: todayAppointments },
        { data: todayInvoices },
        { count: activeLeads },
      ] = await Promise.all([
        supabase.from("patients").select("*", { count: "exact", head: true }),
        supabase.from("appointments").select("*", { count: "exact", head: true }).eq("date", today),
        supabase.from("invoices").select("paid, total").eq("date", today),
        supabase.from("leads").select("*", { count: "exact", head: true }).in("stage", ["new", "contacted", "consultation"]),
      ]);

      const todayRevenue = todayInvoices?.reduce((sum, inv) => sum + Number(inv.paid), 0) || 0;

      return {
        totalPatients: totalPatients || 0,
        todayAppointments: todayAppointments || 0,
        todayRevenue,
        activeLeads: activeLeads || 0,
      };
    },
    staleTime: 30 * 1000, // Refresh every 30 seconds
  });
}
export function useCreateTherapist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (therapist: any) => {
      const { data, error } = await supabase.from('therapists').insert([therapist]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
    }
  });
}

// ============================================================
// Realtime Data Sync Hook
// ============================================================
import { useEffect } from "react";

export function useSupabaseRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to all postgres changes in the public schema
    const channel = supabase
      .channel("supabase-realtime-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        (payload) => {
          const table = payload.table;
          
          // Invalidate React Query caches depending on the table that updated
          if (table === "patients") {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            queryClient.invalidateQueries({ queryKey: ["patient"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
          } else if (table === "appointments") {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
          } else if (table === "therapists") {
            queryClient.invalidateQueries({ queryKey: ["therapists"] });
          } else if (table === "employees") {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
          } else if (table === "leads") {
            queryClient.invalidateQueries({ queryKey: ["leads"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
          } else if (table === "invoices") {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
          } else if (table === "notifications") {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          } else if (table === "timeline_events") {
            queryClient.invalidateQueries({ queryKey: ["timeline"] });
          } else if (table === "attendance_records") {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

