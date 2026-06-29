-- ============================================================
-- Stability Physio Care CRM — Initial Database Schema
-- Run this in your Supabase SQL Editor or via migrations
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. Organizations (multi-tenant root)
-- ============================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  gst_number TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  plan TEXT NOT NULL DEFAULT 'enterprise',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. Branches
-- ============================================================
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Chennai',
  phone TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#D6F04C',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_branches_org ON branches(org_id);

-- ============================================================
-- 3. Profiles (linked to auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'receptionist'
    CHECK (role IN ('master_admin', 'branch_admin', 'receptionist', 'physiotherapist')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_color TEXT NOT NULL DEFAULT '#D6F04C',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_auth ON profiles(auth_id);
CREATE INDEX idx_profiles_org ON profiles(org_id);

-- ============================================================
-- 4. Patients
-- ============================================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  patient_id_code TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL DEFAULT 'Male'
    CHECK (gender IN ('Male', 'Female', 'Other')),
  dob DATE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  blood_group TEXT NOT NULL DEFAULT 'O+',
  allergies TEXT[] NOT NULL DEFAULT ARRAY['None'],
  conditions TEXT[] NOT NULL DEFAULT '{}',
  previous_treatments TEXT[] NOT NULL DEFAULT '{}',
  current_treatment TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'in_consultation', 'in_therapy', 'follow_up', 'discharged')),
  therapist_id UUID,
  tags TEXT[] NOT NULL DEFAULT ARRAY['Regular'],
  avatar_color TEXT NOT NULL DEFAULT '#D6F04C',
  progress INTEGER NOT NULL DEFAULT 0,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  balance NUMERIC(10,2) NOT NULL DEFAULT 0,
  registered_on DATE NOT NULL DEFAULT CURRENT_DATE,
  last_visit DATE NOT NULL DEFAULT CURRENT_DATE,
  next_appointment DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_patients_org ON patients(org_id);
CREATE INDEX idx_patients_branch ON patients(branch_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE UNIQUE INDEX idx_patients_code ON patients(org_id, patient_id_code);

-- ============================================================
-- 5. Therapists
-- ============================================================
CREATE TABLE therapists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  patients_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  experience INTEGER NOT NULL DEFAULT 0,
  sessions_today INTEGER NOT NULL DEFAULT 0,
  revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  avatar_color TEXT NOT NULL DEFAULT '#D6F04C',
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'busy', 'off')),
  certifications TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_therapists_org ON therapists(org_id);
CREATE INDEX idx_therapists_branch ON therapists(branch_id);

-- Now add the foreign key for patients -> therapists (deferred because of ordering)
-- Note: therapists table must exist before this constraint
-- The therapist_id FK on patients is defined inline above; 
-- if your DB doesn't support forward references, create patients without it 
-- and add it via ALTER TABLE:
ALTER TABLE patients ADD CONSTRAINT fk_patients_therapist 
  FOREIGN KEY (therapist_id) REFERENCES therapists(id) ON DELETE SET NULL;

-- ============================================================
-- 6. Employees
-- ============================================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'on_leave', 'inactive')),
  shift TEXT NOT NULL DEFAULT '9:00 AM - 6:00 PM',
  joined_on DATE NOT NULL DEFAULT CURRENT_DATE,
  avatar_color TEXT NOT NULL DEFAULT '#D6F04C',
  salary NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_employees_org ON employees(org_id);
CREATE INDEX idx_employees_branch ON employees(branch_id);

-- ============================================================
-- 7. Appointments
-- ============================================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  therapist_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  type TEXT NOT NULL DEFAULT 'consultation'
    CHECK (type IN ('consultation', 'therapy', 'follow_up', 'assessment')),
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'waiting', 'consultation', 'therapy', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_org ON appointments(org_id);
CREATE INDEX idx_appointments_branch ON appointments(branch_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_therapist ON appointments(therapist_id);
CREATE INDEX idx_appointments_date ON appointments(date);

-- ============================================================
-- 8. Invoices
-- ============================================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  invoice_no TEXT NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('paid', 'pending', 'partial', 'refunded')),
  payment_method TEXT
    CHECK (payment_method IS NULL OR payment_method IN ('cash', 'upi', 'card', 'insurance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_org ON invoices(org_id);
CREATE INDEX idx_invoices_branch ON invoices(branch_id);
CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE UNIQUE INDEX idx_invoices_no ON invoices(org_id, invoice_no);

-- ============================================================
-- 9. Invoice Items
-- ============================================================
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);

-- ============================================================
-- 10. Leads
-- ============================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL DEFAULT 'walk_in'
    CHECK (source IN ('walk_in', 'whatsapp', 'instagram', 'doctor_referral', 'website', 'phone')),
  stage TEXT NOT NULL DEFAULT 'new'
    CHECK (stage IN ('new', 'contacted', 'consultation', 'converted', 'lost')),
  interest TEXT NOT NULL DEFAULT '',
  value NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  avatar_color TEXT NOT NULL DEFAULT '#D6F04C',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_org ON leads(org_id);
CREATE INDEX idx_leads_branch ON leads(branch_id);
CREATE INDEX idx_leads_stage ON leads(stage);

-- ============================================================
-- 11. Attendance Records
-- ============================================================
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TEXT,
  check_out TEXT,
  status TEXT NOT NULL DEFAULT 'present'
    CHECK (status IN ('present', 'absent', 'late', 'leave')),
  method TEXT NOT NULL DEFAULT 'manual'
    CHECK (method IN ('qr', 'gps', 'manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attendance_org ON attendance_records(org_id);
CREATE INDEX idx_attendance_employee ON attendance_records(employee_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);

-- ============================================================
-- 12. Notifications
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'appointment'
    CHECK (type IN ('appointment', 'payment', 'follow_up', 'registration', 'attendance', 'report', 'leave')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'low'
    CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_org ON notifications(org_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================================
-- 13. Medical Records
-- ============================================================
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'document'
    CHECK (type IN ('pdf', 'xray', 'mri', 'ct', 'blood_report', 'lab_report', 'document')),
  file_url TEXT NOT NULL,
  size TEXT NOT NULL DEFAULT '0 KB',
  uploaded_by TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);

-- ============================================================
-- 14. Timeline Events
-- ============================================================
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'note'
    CHECK (type IN ('registration', 'consultation', 'report', 'treatment', 'payment', 'prescription', 'note', 'follow_up', 'appointment')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  actor TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeline_patient ON timeline_events(patient_id);

-- ============================================================
-- 15. Treatment Packages
-- ============================================================
CREATE TABLE treatment_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sessions INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT '1 session',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_packages_org ON treatment_packages(org_id);

-- ============================================================
-- 16. Settings (key-value per org)
-- ============================================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, key)
);

CREATE INDEX idx_settings_org ON settings(org_id);

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'organizations', 'branches', 'profiles', 'patients', 'therapists',
    'employees', 'appointments', 'invoices', 'leads', 'treatment_packages'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      tbl
    );
  END LOOP;
END;
$$;

-- ============================================================
-- Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (auth_id, org_id, name, email, role, avatar_color)
  VALUES (
    NEW.id,
    -- Default to first org (in production, use invite-based org assignment)
    (SELECT id FROM organizations LIMIT 1),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'receptionist'),
    '#D6F04C'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Enable Row Level Security on all tables
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies
-- Users can only access data within their organization
-- ============================================================

-- Helper function: get current user's org_id
CREATE OR REPLACE FUNCTION public.get_auth_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM profiles WHERE auth_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE auth_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function: get current user's branch_id
CREATE OR REPLACE FUNCTION public.get_auth_branch_id()
RETURNS UUID AS $$
  SELECT branch_id FROM profiles WHERE auth_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Organizations: users can read their own org
CREATE POLICY "Users can view their org" ON organizations
  FOR SELECT USING (id = public.get_auth_org_id());

-- Branches: users can read all branches in their org
CREATE POLICY "Users can view org branches" ON branches
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Admins can manage branches" ON branches
  FOR ALL USING (
    org_id = public.get_auth_org_id() AND public.get_auth_user_role() IN ('master_admin', 'branch_admin')
  );

-- Profiles: users can read profiles in their org
CREATE POLICY "Users can view org profiles" ON profiles
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth_id = auth.uid());

-- Patients: org-scoped access
CREATE POLICY "Users can view org patients" ON patients
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Staff can create patients" ON patients
  FOR INSERT WITH CHECK (org_id = public.get_auth_org_id());

CREATE POLICY "Staff can update patients" ON patients
  FOR UPDATE USING (org_id = public.get_auth_org_id());

CREATE POLICY "Admins can delete patients" ON patients
  FOR DELETE USING (
    org_id = public.get_auth_org_id() AND public.get_auth_user_role() IN ('master_admin', 'branch_admin')
  );

-- Therapists
CREATE POLICY "Users can view org therapists" ON therapists
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Admins can manage therapists" ON therapists
  FOR ALL USING (
    org_id = public.get_auth_org_id() AND public.get_auth_user_role() IN ('master_admin', 'branch_admin')
  );

-- Employees
CREATE POLICY "Users can view org employees" ON employees
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Admins can manage employees" ON employees
  FOR ALL USING (
    org_id = public.get_auth_org_id() AND public.get_auth_user_role() IN ('master_admin', 'branch_admin')
  );

-- Appointments
CREATE POLICY "Users can view org appointments" ON appointments
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Staff can create appointments" ON appointments
  FOR INSERT WITH CHECK (org_id = public.get_auth_org_id());

CREATE POLICY "Staff can update appointments" ON appointments
  FOR UPDATE USING (org_id = public.get_auth_org_id());

CREATE POLICY "Admins can delete appointments" ON appointments
  FOR DELETE USING (
    org_id = public.get_auth_org_id() AND public.get_auth_user_role() IN ('master_admin', 'branch_admin')
  );

-- Invoices
CREATE POLICY "Users can view org invoices" ON invoices
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Staff can manage invoices" ON invoices
  FOR ALL USING (org_id = public.get_auth_org_id());

-- Invoice Items (via invoice's org scope)
CREATE POLICY "Users can view invoice items" ON invoice_items
  FOR SELECT USING (
    invoice_id IN (SELECT id FROM invoices WHERE org_id = public.get_auth_org_id())
  );

CREATE POLICY "Staff can manage invoice items" ON invoice_items
  FOR ALL USING (
    invoice_id IN (SELECT id FROM invoices WHERE org_id = public.get_auth_org_id())
  );

-- Leads
CREATE POLICY "Users can view org leads" ON leads
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Staff can manage leads" ON leads
  FOR ALL USING (org_id = public.get_auth_org_id());

-- Attendance
CREATE POLICY "Users can view org attendance" ON attendance_records
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Staff can manage attendance" ON attendance_records
  FOR ALL USING (org_id = public.get_auth_org_id());

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (
    org_id = public.get_auth_org_id() AND (user_id IS NULL OR user_id = (SELECT id FROM profiles WHERE auth_id = auth.uid()))
  );

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (
    org_id = public.get_auth_org_id() AND (user_id IS NULL OR user_id = (SELECT id FROM profiles WHERE auth_id = auth.uid()))
  );

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (org_id = public.get_auth_org_id());

-- Medical Records
CREATE POLICY "Users can view org medical records" ON medical_records
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Staff can manage medical records" ON medical_records
  FOR ALL USING (org_id = public.get_auth_org_id());

-- Timeline Events
CREATE POLICY "Users can view org timeline" ON timeline_events
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Staff can create timeline events" ON timeline_events
  FOR INSERT WITH CHECK (org_id = public.get_auth_org_id());

-- Treatment Packages
CREATE POLICY "Users can view org packages" ON treatment_packages
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Admins can manage packages" ON treatment_packages
  FOR ALL USING (
    org_id = public.get_auth_org_id() AND public.get_auth_user_role() IN ('master_admin', 'branch_admin')
  );

-- Settings
CREATE POLICY "Users can view org settings" ON settings
  FOR SELECT USING (org_id = public.get_auth_org_id());

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    org_id = public.get_auth_org_id() AND public.get_auth_user_role() IN ('master_admin', 'branch_admin')
  );

-- ============================================================
-- Storage Buckets
-- Run these separately in Supabase Dashboard > Storage
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('medical-records', 'medical-records', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
