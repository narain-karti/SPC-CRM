-- ============================================================
-- Stability Physio Care CRM — Nullable Therapist Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Make therapist_id and therapist_name optional in the appointments table 
-- to support website bookings landing in an "unassigned" state.
ALTER TABLE appointments ALTER COLUMN therapist_id DROP NOT NULL;
ALTER TABLE appointments ALTER COLUMN therapist_name DROP NOT NULL;
