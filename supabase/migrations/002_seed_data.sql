-- ============================================================
-- Seed Data for Stability Physio Care CRM
-- Run this AFTER 001_initial_schema.sql
-- ============================================================

-- 1. Organization
INSERT INTO organizations (id, name, gst_number, email, phone, website, plan)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Stability Physio Care',
  '29ABCDE1234F1Z5',
  'hello@stabilityphysio.com',
  '+91 44 2345 6789',
  'www.stabilityphysio.com',
  'enterprise'
) ON CONFLICT DO NOTHING;

-- 2. Branches (5 Chennai branches)
INSERT INTO branches (id, org_id, name, location, city, phone, color) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Kodambakkam', 'Arcot Road', 'Chennai', '+91 44 4567 8901', '#D6F04C'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Pallikaranai', 'Velachery Main Road', 'Chennai', '+91 44 4678 9012', '#B79AFB'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Sholinganallur', 'OMR', 'Chennai', '+91 44 4789 0123', '#5EEAD4'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Nerkundram', 'Poonamallee High Road', 'Chennai', '+91 44 4890 1234', '#FBBF24'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'Ponneri', 'Chennai Tirupati Highway', 'Chennai', '+91 44 4901 2345', '#F472B6')
ON CONFLICT DO NOTHING;

-- 3. Therapists
INSERT INTO therapists (id, org_id, branch_id, name, specialization, patients_count, rating, experience, sessions_today, revenue, avatar_color, status, certifications) VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Dr. Ananya Krishnan', 'Orthopedic & Sports Rehab', 42, 4.9, 8, 9, 285000, '#D6F04C', 'busy', ARRAY['MPT Ortho', 'Cert. Dry Needling', 'IASTM']),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Dr. Vikram Shetty', 'Neurological Rehab', 35, 4.8, 11, 7, 312000, '#B79AFB', 'available', ARRAY['MPT Neuro', 'Bobath Certified', 'NDT']),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Dr. Priya Nair', 'Geriatric Physiotherapy', 38, 4.7, 6, 8, 198000, '#5EEAD4', 'available', ARRAY['MPT Geriatric', 'Fall Prevention']),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Dr. Karthik Reddy', 'Sports Injury & Performance', 45, 4.9, 9, 10, 356000, '#FBBF24', 'busy', ARRAY['MPT Sports', 'FMS L2', 'Kinesio Taping']),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'Dr. Sneha Patel', 'Womens Health & Pelvic Floor', 28, 4.8, 5, 6, 168000, '#F472B6', 'available', ARRAY['MPT OBS', 'Pelvic Floor Rehab']),
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'Dr. Aditya Menon', 'Spine & Posture Correction', 41, 4.6, 7, 8, 234000, '#60A5FA', 'off', ARRAY['MPT Ortho', 'McKenzie Method']),
  ('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', 'Dr. Meera Joshi', 'Pediatric Physiotherapy', 32, 4.9, 10, 7, 212000, '#34D399', 'available', ARRAY['MPT Pedo', 'CIMT Certified']),
  ('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', 'Dr. Sanjay Kulkarni', 'Manual Therapy & Pain Mgmt', 39, 4.7, 12, 9, 298000, '#FB923C', 'busy', ARRAY['MPT Ortho', 'OMT Certified', 'Cupping Therapy'])
ON CONFLICT DO NOTHING;

-- 4. Employees
INSERT INTO employees (id, org_id, branch_id, name, role, department, phone, email, status, shift, joined_on, avatar_color, salary) VALUES
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Rajesh Kumar', 'Branch Manager', 'Operations', '+91 98000 11111', 'rajesh@stabilityphysio.com', 'active', '9:00 AM - 6:00 PM', '2023-04-12', '#D6F04C', 75000),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Lakshmi Iyer', 'Receptionist', 'Front Office', '+91 98000 22222', 'lakshmi@stabilityphysio.com', 'active', '8:00 AM - 4:00 PM', '2024-01-15', '#B79AFB', 32000),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Deepak Sharma', 'Receptionist', 'Front Office', '+91 98000 33333', 'deepak@stabilityphysio.com', 'on_leave', '12:00 PM - 9:00 PM', '2024-06-20', '#5EEAD4', 32000),
  ('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Sunita Rao', 'Accounts Executive', 'Finance', '+91 98000 44444', 'sunita@stabilityphysio.com', 'active', '10:00 AM - 7:00 PM', '2023-08-11', '#FBBF24', 48000),
  ('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Arjun Mehta', 'Marketing Lead', 'Marketing', '+91 98000 55555', 'arjun@stabilityphysio.com', 'active', '10:00 AM - 7:00 PM', '2023-11-02', '#F472B6', 62000)
ON CONFLICT DO NOTHING;

-- 5. Treatment Packages
INSERT INTO treatment_packages (org_id, name, sessions, price, duration, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Single Consultation', 1, 800, '45 min', 'Initial assessment + consultation'),
  ('00000000-0000-0000-0000-000000000001', 'Therapy Session', 1, 1200, '60 min', 'Single physiotherapy session'),
  ('00000000-0000-0000-0000-000000000001', 'Recovery Pack (8 sessions)', 8, 8800, '8 weeks', 'Standard treatment plan'),
  ('00000000-0000-0000-0000-000000000001', 'Premium Rehab (12 sessions)', 12, 14400, '12 weeks', 'Comprehensive rehab program'),
  ('00000000-0000-0000-0000-000000000001', 'Sports Performance (16 sessions)', 16, 22400, '8 weeks', 'Athlete-focused intensive program'),
  ('00000000-0000-0000-0000-000000000001', 'Post-Op Rehab (20 sessions)', 20, 28000, '16 weeks', 'Surgical recovery program')
ON CONFLICT DO NOTHING;

-- 6. Sample Leads
INSERT INTO leads (org_id, branch_id, name, phone, email, source, stage, interest, value, notes, avatar_color) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Ramesh Gupta', '+91 98111 22222', 'ramesh.g@email.com', 'walk_in', 'new', 'Knee Pain Consultation', 4500, 'Walked in for info, will decide tomorrow', '#D6F04C'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Sneha Reddy', '+91 98111 33333', 'sneha.r@email.com', 'instagram', 'new', 'Sports Rehab Package', 18000, 'DMd on Instagram, sent brochure', '#B79AFB'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Anil Joshi', '+91 98111 44444', 'anil.j@email.com', 'whatsapp', 'contacted', 'Post-Stroke Rehab', 32000, 'Called twice, interested in home visits', '#5EEAD4'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'Kavita Nair', '+91 98111 55555', 'kavita.n@email.com', 'doctor_referral', 'contacted', 'Cervical Spondylosis Treatment', 12000, 'Referred by Dr. Agarwal, awaiting reports', '#FBBF24'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Harish Pillai', '+91 98111 66666', 'harish.p@email.com', 'website', 'consultation', 'Frozen Shoulder Therapy', 15000, 'Booked consultation for Friday', '#F472B6'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', 'Madhuri Rao', '+91 98111 77777', 'madhuri.r@email.com', 'phone', 'consultation', 'Lower Back Pain Program', 22000, 'Visited clinic, took trial session', '#60A5FA'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Ganesh Iyer', '+91 98111 88888', 'ganesh.i@email.com', 'walk_in', 'converted', 'Post-Op Knee Rehab', 28000, 'Converted! Started 12-session plan', '#34D399'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Latha Shetty', '+91 98111 99999', 'latha.s@email.com', 'instagram', 'converted', 'Sports Performance Package', 35000, 'Paid in full, started sessions', '#FB923C')
ON CONFLICT DO NOTHING;

-- 7. Sample Notifications
INSERT INTO notifications (org_id, type, title, message, read, priority) VALUES
  ('00000000-0000-0000-0000-000000000001', 'appointment', 'New appointment booked', 'Arjun Sharma booked a consultation at 4:30 PM with Dr. Ananya', false, 'high'),
  ('00000000-0000-0000-0000-000000000001', 'payment', 'Payment received', '₹4,500 UPI payment from Priya Reddy for INV-2026-1003', false, 'high'),
  ('00000000-0000-0000-0000-000000000001', 'follow_up', 'Follow-up due', 'Rohan Nairs 6-week follow-up is due tomorrow', false, 'medium'),
  ('00000000-0000-0000-0000-000000000001', 'registration', 'New patient registered', 'Ananya Iyer registered at Kodambakkam branch', true, 'low'),
  ('00000000-0000-0000-0000-000000000001', 'attendance', 'Late check-in', 'Deepak Sharma checked in 45 min late at Pallikaranai', true, 'medium'),
  ('00000000-0000-0000-0000-000000000001', 'report', 'MRI report uploaded', 'Dr. Vikram uploaded an MRI report for Karthik Reddy', true, 'low'),
  ('00000000-0000-0000-0000-000000000001', 'leave', 'Leave request', 'Sunita Rao requested leave for 28 Jun - 30 Jun', true, 'medium')
ON CONFLICT DO NOTHING;

-- 8. Sample Patients (10 patients to start with)
INSERT INTO patients (org_id, branch_id, patient_id_code, name, age, gender, dob, phone, email, address, emergency_contact, blood_group, allergies, conditions, previous_treatments, current_treatment, status, therapist_id, tags, avatar_color, progress, total_sessions, completed_sessions, balance) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'SPC-2024001', 'Arjun Sharma', 34, 'Male', '1991-03-15', '+91 98456 12345', 'arjun.sharma@email.com', '42, 2nd Cross, Kodambakkam, Chennai', '+91 99876 54321', 'B+', ARRAY['None'], ARRAY['Lower Back Pain', 'Sciatica'], ARRAY['Manual Therapy', 'TENS'], 'Dry Needling + Exercise Therapy', 'active', '00000000-0000-0000-0000-000000000201', ARRAY['Regular'], '#D6F04C', 65, 12, 8, 0),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'SPC-2024002', 'Priya Reddy', 28, 'Female', '1997-07-22', '+91 98456 23456', 'priya.reddy@email.com', '15, 4th Main, Kodambakkam, Chennai', '+91 99876 65432', 'A+', ARRAY['Penicillin'], ARRAY['Cervical Spondylosis'], ARRAY['Ultrasound Therapy'], 'Manual Therapy', 'in_consultation', '00000000-0000-0000-0000-000000000201', ARRAY['VIP'], '#B79AFB', 40, 16, 6, 2500),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'SPC-2024003', 'Rohan Nair', 45, 'Male', '1980-11-08', '+91 98456 34567', 'rohan.nair@email.com', '78, Park Road, Pallikaranai, Chennai', '+91 99876 76543', 'O+', ARRAY['None'], ARRAY['Frozen Shoulder'], ARRAY['Mobility Training'], 'Posture Correction', 'in_therapy', '00000000-0000-0000-0000-000000000203', ARRAY['Regular'], '#5EEAD4', 55, 10, 5, 0),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'SPC-2024004', 'Ananya Iyer', 52, 'Female', '1973-05-30', '+91 98456 45678', 'ananya.iyer@email.com', '23, Temple Street, Pallikaranai, Chennai', '+91 99876 87654', 'AB+', ARRAY['Sulfa'], ARRAY['Knee Osteoarthritis', 'Lower Back Pain'], ARRAY['Exercise Therapy', 'Strength Training'], 'Sports Rehab', 'follow_up', '00000000-0000-0000-0000-000000000204', ARRAY['Post-Surgery'], '#FBBF24', 80, 20, 16, 4200),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'SPC-2024005', 'Vikram Gupta', 38, 'Male', '1987-09-12', '+91 98456 56789', 'vikram.gupta@email.com', '56, MG Road, Sholinganallur, Chennai', '+91 99876 98765', 'B-', ARRAY['None'], ARRAY['Post-Stroke Rehab'], ARRAY['Neurological Rehab'], 'Mobility Training', 'active', '00000000-0000-0000-0000-000000000205', ARRAY['Sports'], '#F472B6', 30, 24, 7, 0),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'SPC-2024006', 'Sneha Patel', 31, 'Female', '1994-01-25', '+91 98456 67890', 'sneha.patel@email.com', '90, 2nd Cross, Sholinganallur, Chennai', '+91 99876 09876', 'A-', ARRAY['Latex'], ARRAY['Tennis Elbow'], ARRAY['Dry Needling'], 'TENS', 'active', '00000000-0000-0000-0000-000000000206', ARRAY['Regular'], '#60A5FA', 45, 8, 4, 0),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', 'SPC-2024007', 'Karthik Menon', 62, 'Male', '1963-12-03', '+91 98456 78901', 'karthik.menon@email.com', '12, Park Road, Nerkundram, Chennai', '+91 99876 10987', 'O-', ARRAY['Aspirin'], ARRAY['Plantar Fasciitis', 'Sciatica'], ARRAY['Manual Therapy', 'Ultrasound Therapy'], 'Strength Training', 'in_therapy', '00000000-0000-0000-0000-000000000207', ARRAY['VIP'], '#34D399', 70, 16, 11, 1800),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', 'SPC-2024008', 'Divya Kapoor', 25, 'Female', '2000-06-18', '+91 98456 89012', 'divya.kapoor@email.com', '34, 4th Main, Nerkundram, Chennai', '+91 99876 21098', 'AB-', ARRAY['None'], ARRAY['Rotator Cuff Tear'], ARRAY['Sports Rehab'], 'Exercise Therapy', 'discharged', '00000000-0000-0000-0000-000000000208', ARRAY['Sports'], '#FB923C', 100, 12, 12, 0),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000105', 'SPC-2024009', 'Aditya Murthy', 41, 'Male', '1984-08-07', '+91 98456 90123', 'aditya.murthy@email.com', '67, Temple Street, Ponneri, Chennai', '+91 99876 32109', 'B+', ARRAY['None'], ARRAY['Lumbar Disc Herniation'], ARRAY['Posture Correction'], 'Manual Therapy', 'active', '00000000-0000-0000-0000-000000000201', ARRAY['Regular'], '#A78BFA', 35, 14, 5, 0),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000105', 'SPC-2024010', 'Meera Prasad', 55, 'Female', '1970-04-20', '+91 98456 01234', 'meera.prasad@email.com', '101, MG Road, Ponneri, Chennai', '+91 99876 43210', 'O+', ARRAY['Penicillin'], ARRAY['Cervical Spondylosis', 'Frozen Shoulder'], ARRAY['TENS', 'Dry Needling'], 'Neurological Rehab', 'in_consultation', '00000000-0000-0000-0000-000000000201', ARRAY['VIP'], '#2DD4BF', 20, 18, 4, 3600)
ON CONFLICT DO NOTHING;
