-- ============================================================
-- Stability Physio Care CRM — Fix Missing Demo Data
-- Run this in your Supabase SQL Editor
-- This uses ON CONFLICT DO NOTHING so it won't fail if some data exists.
-- ============================================================

-- 1. Insert Default Organization
INSERT INTO organizations (id, name, gst_number, email, phone, website, plan, created_at, updated_at) 
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'Stability Physio Care', 
  '29AAACC1206D1Z1', 
  'hello@stabilityphysio.com', 
  '9800000000', 
  'https://stabilityphysio.com', 
  'enterprise', 
  now(), 
  now()
)
ON CONFLICT DO NOTHING;

-- 2. Insert Default Branches
INSERT INTO branches (id, org_id, name, location, city, phone, color, created_at, updated_at) 
VALUES 
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Jayanagar HQ', '123 Main St, Jayanagar', 'Chennai', '9800011111', '#D6F04C', now(), now()),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Indiranagar', '456 100ft Rd, Indiranagar', 'Chennai', '9800022222', '#B79AFB', now(), now()),
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Koramangala', '789 80ft Rd, Koramangala', 'Chennai', '9800033333', '#5EEAD4', now(), now()),
('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Whitefield', '101 ITPL Rd, Whitefield', 'Chennai', '9800044444', '#FBBF24', now(), now()),
('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'HSR Layout', '202 27th Main, HSR Layout', 'Chennai', '9800055555', '#F472B6', now(), now())
ON CONFLICT DO NOTHING;

-- 3. Insert Demo Therapists
INSERT INTO therapists (id, org_id, branch_id, name, specialization, patients_count, rating, experience, sessions_today, revenue, avatar_color, status, certifications, created_at, updated_at) 
VALUES 
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Dr. Ananya Krishnan', 'Orthopedic & Sports Rehab', 42, 4.9, 8, 9, 285000, '#D6F04C', 'busy', '{"MPT Ortho", "Cert. Dry Needling", "IASTM"}', now(), now()),
('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Dr. Vikram Shetty', 'Neurological Rehab', 35, 4.8, 11, 7, 312000, '#B79AFB', 'available', '{"MPT Neuro", "Bobath Certified", "NDT"}', now(), now()),
('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Dr. Priya Nair', 'Geriatric Physiotherapy', 38, 4.7, 6, 8, 198000, '#5EEAD4', 'available', '{"MPT Geriatric", "Fall Prevention"}', now(), now()),
('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Dr. Karthik Reddy', 'Sports Injury & Performance', 45, 4.9, 9, 10, 356000, '#FBBF24', 'busy', '{"MPT Sports", "FMS L2", "Kinesio Taping"}', now(), now()),
('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'Dr. Sneha Patel', 'Women''s Health & Pelvic Floor', 28, 4.8, 5, 6, 168000, '#F472B6', 'available', '{"MPT OBS", "Pelvic Floor Rehab"}', now(), now()),
('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'Dr. Aditya Menon', 'Spine & Posture Correction', 41, 4.6, 7, 8, 234000, '#60A5FA', 'off', '{"MPT Ortho", "McKenzie Method"}', now(), now()),
('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', 'Dr. Meera Joshi', 'Pediatric Physiotherapy', 32, 4.9, 10, 7, 212000, '#34D399', 'available', '{"MPT Pedo", "CIMT Certified"}', now(), now()),
('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', 'Dr. Sanjay Kulkarni', 'Manual Therapy & Pain Mgmt', 39, 4.7, 12, 9, 298000, '#FB923C', 'busy', '{"MPT Ortho", "OMT Certified", "Cupping Therapy"}', now(), now())
ON CONFLICT DO NOTHING;

-- 4. Insert Demo Patients
INSERT INTO patients (id, org_id, branch_id, patient_id_code, therapist_id, name, age, gender, dob, phone, email, address, emergency_contact, blood_group, allergies, conditions, previous_treatments, current_treatment, status, tags, avatar_color, registered_on, last_visit, next_appointment, progress, total_sessions, completed_sessions, balance, created_at, updated_at) 
VALUES 
('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'SPC-2024001', '00000000-0000-0000-0000-000000000201', 'Arjun Patel', 45, 'Male', '1979-05-12', '+91 9876543210', 'arjun.patel@email.com', '123 Park Rd, Jayanagar', '+91 9876543211', 'O+', '{"Dust"}', '{"Lower Back Pain"}', '{}', 'Manual Therapy', 'active', '{"VIP"}', '#D6F04C', '2024-01-10', '2025-02-15', '2026-06-25', 45, 12, 5, 1500, now(), now()),
('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'SPC-2024002', '00000000-0000-0000-0000-000000000202', 'Megha Sharma', 32, 'Female', '1992-08-22', '+91 9876543212', 'megha.s@email.com', '45 100ft Rd, Indiranagar', '+91 9876543213', 'A+', '{"None"}', '{"Cervical Spondylosis"}', '{"Heat Therapy"}', 'Postural Correction', 'in_therapy', '{"Regular"}', '#B79AFB', '2024-02-14', '2025-01-20', '2026-06-26', 60, 10, 6, 0, now(), now())
ON CONFLICT DO NOTHING;
