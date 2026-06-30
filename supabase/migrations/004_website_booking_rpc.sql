-- ============================================================
-- Stability Physio Care CRM — Website Booking RPC (Updated)
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION create_website_booking(
  p_patient_name TEXT,
  p_phone TEXT,
  p_date DATE,
  p_time TEXT,
  p_duration INTEGER,
  p_type TEXT,
  p_notes TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id UUID;
  v_branch_id UUID;
  v_patient_id UUID;
  v_appointment_id UUID;
BEGIN
  -- 1. Find the first available branch/org to assign the booking to.
  SELECT id, org_id INTO v_branch_id, v_org_id
  FROM branches 
  LIMIT 1;

  IF v_branch_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No branches exist in the database. Please add a branch first.');
  END IF;

  -- 4. Check if Patient exists by phone
  SELECT id INTO v_patient_id FROM patients WHERE phone = p_phone AND branch_id = v_branch_id LIMIT 1;

  -- 5. Create Patient if not exists
  IF v_patient_id IS NULL THEN
    INSERT INTO patients (
      org_id, branch_id, patient_id_code, name, age, gender, dob, phone, address, emergency_contact
    ) VALUES (
      v_org_id, 
      v_branch_id, 
      'WEB-' || EXTRACT(EPOCH FROM now())::BIGINT, 
      p_patient_name, 
      0, 
      'Other', 
      CURRENT_DATE, 
      p_phone, 
      'Website Booking', 
      'N/A'
    ) RETURNING id INTO v_patient_id;
  END IF;

  -- 6. Create the Appointment with NULL therapist_id and therapist_name
  INSERT INTO appointments (
    org_id, branch_id, patient_id, patient_name, therapist_id, therapist_name, 
    date, time, duration, type, status, notes
  ) VALUES (
    v_org_id, v_branch_id, v_patient_id, p_patient_name, NULL, NULL,
    p_date, p_time, COALESCE(p_duration, 30), COALESCE(NULLIF(p_type, ''), 'consultation'), 'scheduled', p_notes
  ) RETURNING id INTO v_appointment_id;

  -- 7. Add a notification for Receptionist/Admins
  INSERT INTO notifications (
    org_id, type, title, message, priority
  ) VALUES (
    v_org_id, 'appointment', 'New Website Booking', 
    p_patient_name || ' booked a ' || p_type || ' for ' || p_date || ' at ' || p_time || '. Please assign a therapist.', 'high'
  );

  RETURN json_build_object('success', true, 'appointment_id', v_appointment_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
