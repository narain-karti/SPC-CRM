-- ============================================================
-- Stability Physio Care CRM — Role Credentials
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS role_credentials (
  role TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed demo passwords
INSERT INTO role_credentials (role, password) VALUES 
('master_admin', 'admin123'),
('branch_admin', 'branch123'),
('receptionist', 'reception123'),
('physiotherapist', 'physio123')
ON CONFLICT (role) DO UPDATE SET password = EXCLUDED.password;

-- Allow reading from the frontend (for the demo Topbar switcher)
ALTER TABLE role_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read role credentials" ON role_credentials;
CREATE POLICY "Anyone can read role credentials" ON role_credentials FOR SELECT USING (true);
