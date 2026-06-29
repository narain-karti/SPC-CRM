// Supabase Database Types — auto-generated from schema
// These types match the PostgreSQL tables in supabase/migrations/001_initial_schema.sql

export type Role = "master_admin" | "branch_admin" | "receptionist" | "physiotherapist";
export type AppointmentStatus = "scheduled" | "waiting" | "consultation" | "therapy" | "completed" | "cancelled" | "no_show";
export type PatientStatus = "active" | "in_consultation" | "in_therapy" | "follow_up" | "discharged";
export type LeadStage = "new" | "contacted" | "consultation" | "converted" | "lost";
export type LeadSource = "walk_in" | "whatsapp" | "instagram" | "doctor_referral" | "website" | "phone";
export type PaymentMethod = "cash" | "upi" | "card" | "insurance";
export type InvoiceStatus = "paid" | "pending" | "partial" | "refunded";
export type AttendanceStatus = "present" | "absent" | "late" | "leave";
export type AttendanceMethod = "qr" | "gps" | "manual";
export type EmployeeStatus = "active" | "on_leave" | "inactive";
export type TherapistStatus = "available" | "busy" | "off";
export type Gender = "Male" | "Female" | "Other";
export type AppointmentType = "consultation" | "therapy" | "follow_up" | "assessment";
export type NotificationType = "appointment" | "payment" | "follow_up" | "registration" | "attendance" | "report" | "leave";
export type NotificationPriority = "low" | "medium" | "high";
export type TimelineEventType = "registration" | "consultation" | "report" | "treatment" | "payment" | "prescription" | "note" | "follow_up" | "appointment";
export type MedicalRecordType = "pdf" | "xray" | "mri" | "ct" | "blood_report" | "lab_report" | "document";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          gst_number: string | null;
          email: string | null;
          phone: string | null;
          website: string | null;
          plan: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organizations"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
      };
      branches: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          location: string;
          city: string;
          phone: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["branches"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["branches"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          auth_id: string;
          org_id: string;
          branch_id: string | null;
          role: Role;
          name: string;
          email: string;
          phone: string | null;
          avatar_color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      patients: {
        Row: {
          id: string;
          org_id: string;
          branch_id: string;
          patient_id_code: string;
          name: string;
          age: number;
          gender: Gender;
          dob: string;
          phone: string;
          email: string | null;
          address: string;
          emergency_contact: string;
          blood_group: string;
          allergies: string[];
          conditions: string[];
          previous_treatments: string[];
          current_treatment: string;
          status: PatientStatus;
          therapist_id: string | null;
          tags: string[];
          avatar_color: string;
          progress: number;
          total_sessions: number;
          completed_sessions: number;
          balance: number;
          registered_on: string;
          last_visit: string;
          next_appointment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["patients"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["patients"]["Insert"]>;
      };
      therapists: {
        Row: {
          id: string;
          org_id: string;
          branch_id: string;
          profile_id: string | null;
          name: string;
          specialization: string;
          patients_count: number;
          rating: number;
          experience: number;
          sessions_today: number;
          revenue: number;
          avatar_color: string;
          status: TherapistStatus;
          certifications: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["therapists"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["therapists"]["Insert"]>;
      };
      employees: {
        Row: {
          id: string;
          org_id: string;
          branch_id: string;
          profile_id: string | null;
          name: string;
          role: string;
          department: string;
          phone: string;
          email: string;
          status: EmployeeStatus;
          shift: string;
          joined_on: string;
          avatar_color: string;
          salary: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["employees"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["employees"]["Insert"]>;
      };
      appointments: {
        Row: {
          id: string;
          org_id: string;
          branch_id: string;
          patient_id: string;
          patient_name: string;
          therapist_id: string;
          therapist_name: string;
          date: string;
          time: string;
          duration: number;
          type: AppointmentType;
          status: AppointmentStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["appointments"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["appointments"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          org_id: string;
          branch_id: string;
          invoice_no: string;
          patient_id: string;
          patient_name: string;
          date: string;
          due_date: string;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          paid: number;
          status: InvoiceStatus;
          payment_method: PaymentMethod | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["invoices"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          qty: number;
          rate: number;
          amount: number;
        };
        Insert: Omit<Database["public"]["Tables"]["invoice_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["invoice_items"]["Insert"]>;
      };
      leads: {
        Row: {
          id: string;
          org_id: string;
          branch_id: string;
          name: string;
          phone: string;
          email: string | null;
          source: LeadSource;
          stage: LeadStage;
          interest: string;
          value: number;
          notes: string | null;
          avatar_color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leads"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
      };
      attendance_records: {
        Row: {
          id: string;
          org_id: string;
          branch_id: string;
          employee_id: string;
          employee_name: string;
          date: string;
          check_in: string | null;
          check_out: string | null;
          status: AttendanceStatus;
          method: AttendanceMethod;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["attendance_records"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["attendance_records"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          org_id: string;
          user_id: string | null;
          type: NotificationType;
          title: string;
          message: string;
          read: boolean;
          priority: NotificationPriority;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      medical_records: {
        Row: {
          id: string;
          org_id: string;
          patient_id: string;
          name: string;
          type: MedicalRecordType;
          file_url: string;
          size: string;
          uploaded_by: string;
          version: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["medical_records"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["medical_records"]["Insert"]>;
      };
      timeline_events: {
        Row: {
          id: string;
          org_id: string;
          patient_id: string;
          type: TimelineEventType;
          title: string;
          description: string;
          actor: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["timeline_events"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["timeline_events"]["Insert"]>;
      };
      treatment_packages: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          sessions: number;
          price: number;
          duration: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["treatment_packages"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["treatment_packages"]["Insert"]>;
      };
      settings: {
        Row: {
          id: string;
          org_id: string;
          key: string;
          value: Record<string, unknown>;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["settings"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
    };
  };
}
