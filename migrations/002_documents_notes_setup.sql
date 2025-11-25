-- ========================================
-- Aurora Employee Management System
-- Documents & Notes Tables Setup
-- ========================================
-- Run this AFTER setting up the main employees table

-- ========================================
-- 1. EMPLOYEE DOCUMENTS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS employee_documents (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'other'
    CHECK (type IN ('resume', 'contract', 'certificate', 'review', 'other')),
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON employee_documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON employee_documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON employee_documents(uploaded_at);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_documents_updated_at ON employee_documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON employee_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employee_documents
-- Policy 1: Authenticated users can view all documents
CREATE POLICY "Authenticated users can view documents"
  ON employee_documents
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2: Authenticated users can insert documents
CREATE POLICY "Authenticated users can create documents"
  ON employee_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Authenticated users can update their uploaded documents
CREATE POLICY "Users can update their documents"
  ON employee_documents
  FOR UPDATE
  TO authenticated
  USING (uploaded_by = auth.email())
  WITH CHECK (uploaded_by = auth.email());

-- Policy 4: Authenticated users can delete their uploaded documents
CREATE POLICY "Users can delete their documents"
  ON employee_documents
  FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.email());

-- For development: allow anonymous access (REMOVE IN PRODUCTION)
CREATE POLICY "Enable all operations for anon users on documents"
  ON employee_documents
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 2. EMPLOYEE NOTES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS employee_notes (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('general', 'performance', 'meeting', 'praise', 'concern', 'other')),
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notes_employee_id ON employee_notes(employee_id);
CREATE INDEX IF NOT EXISTS idx_notes_category ON employee_notes(category);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON employee_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_created_by ON employee_notes(created_by);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_notes_updated_at ON employee_notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON employee_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE employee_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employee_notes
-- Policy 1: Authenticated users can view all notes
CREATE POLICY "Authenticated users can view notes"
  ON employee_notes
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2: Authenticated users can insert notes
CREATE POLICY "Authenticated users can create notes"
  ON employee_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Users can update their own notes
CREATE POLICY "Users can update their notes"
  ON employee_notes
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.email())
  WITH CHECK (created_by = auth.email());

-- Policy 4: Users can delete their own notes
CREATE POLICY "Users can delete their notes"
  ON employee_notes
  FOR DELETE
  TO authenticated
  USING (created_by = auth.email());

-- For development: allow anonymous access (REMOVE IN PRODUCTION)
CREATE POLICY "Enable all operations for anon users on notes"
  ON employee_notes
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 3. CREATE STORAGE BUCKET (Run in Supabase Dashboard)
-- ========================================

-- Note: Storage buckets must be created via Supabase Dashboard or Storage API
-- Go to: Storage → Create a new bucket
-- Bucket name: employee-documents
-- Public bucket: Yes (or No if you want auth-only access)
-- File size limit: 10485760 (10MB)
-- Allowed MIME types: application/pdf, image/*, application/msword, etc.

-- After creating the bucket, add these storage policies:

-- Storage Policy 1: Anyone can upload files (adjust for production)
-- CREATE POLICY "Anyone can upload employee documents"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'employee-documents');

-- Storage Policy 2: Anyone can view files (adjust for production)
-- CREATE POLICY "Anyone can view employee documents"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'employee-documents');

-- Storage Policy 3: Users can delete their own uploads
-- CREATE POLICY "Users can delete their uploaded documents"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'employee-documents' AND auth.email() = owner);

-- ========================================
-- 4. INSERT SAMPLE DATA (Optional)
-- ========================================

-- Get the first employee ID for testing
DO $$
DECLARE
  sample_employee_id BIGINT;
BEGIN
  -- Get the first employee's ID
  SELECT id INTO sample_employee_id FROM employees LIMIT 1;
  
  IF sample_employee_id IS NOT NULL THEN
    -- Insert sample documents
    INSERT INTO employee_documents (employee_id, name, type, file_url, file_size, mime_type, uploaded_by, notes) VALUES
      (sample_employee_id, 'Resume_2024.pdf', 'resume', 'https://illustrations.popsy.co/amber/resume.svg', 2457600, 'application/pdf', 'hr@company.com', 'Updated resume with recent certifications'),
      (sample_employee_id, 'Employment_Contract_2024.pdf', 'contract', 'https://illustrations.popsy.co/amber/contract.svg', 1048576, 'application/pdf', 'legal@company.com', 'Signed employment contract'),
      (sample_employee_id, 'AWS_Certification.pdf', 'certificate', 'https://illustrations.popsy.co/amber/certificate.svg', 524288, 'application/pdf', 'training@company.com', 'AWS Solutions Architect Professional certification')
    ON CONFLICT DO NOTHING;
    
    -- Insert sample notes
    INSERT INTO employee_notes (employee_id, title, content, category, is_private, created_by) VALUES
      (sample_employee_id, 'Quarterly Performance Review - Q4 2024', 'Excellent performance this quarter. Exceeded all targets by 25% and demonstrated exceptional leadership skills. Led the migration project successfully with zero downtime.', 'performance', false, 'manager@company.com'),
      (sample_employee_id, 'One-on-One Meeting Notes', 'Discussed career goals and development plans. Employee expressed interest in taking on more leadership responsibilities. Action items: Enroll in leadership training program, assign mentorship role.', 'meeting', false, 'hr@company.com'),
      (sample_employee_id, 'Outstanding Team Collaboration', 'Helped onboard 3 new team members this month. Consistently provides helpful code reviews and mentorship. Team members have specifically mentioned their positive impact.', 'praise', false, 'team.lead@company.com')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ========================================
-- 5. VERIFICATION QUERIES
-- ========================================

-- Verify tables were created
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name LIKE 'employee_%';

-- Check document types
-- SELECT type, COUNT(*) as count FROM employee_documents GROUP BY type;

-- Check note categories
-- SELECT category, COUNT(*) as count FROM employee_notes GROUP BY category;

-- View all documents for an employee
-- SELECT * FROM employee_documents WHERE employee_id = 1 ORDER BY uploaded_at DESC;

-- View all notes for an employee
-- SELECT * FROM employee_notes WHERE employee_id = 1 ORDER BY created_at DESC;

-- ========================================
-- 6. CLEANUP (If you need to start fresh)
-- ========================================

-- WARNING: This will delete all documents and notes data!
-- Uncomment and run only if you need to reset:

-- DROP TABLE IF EXISTS employee_notes CASCADE;
-- DROP TABLE IF EXISTS employee_documents CASCADE;

-- ========================================
-- SETUP COMPLETE! 🚀
-- ========================================

-- Next steps:
-- 1. Create storage bucket 'employee-documents' in Supabase Dashboard
-- 2. Configure storage policies (see above)
-- 3. Test document upload/download in your app
-- 4. Test note creation/editing in your app
-- 5. Remove anonymous policies before production deployment!
