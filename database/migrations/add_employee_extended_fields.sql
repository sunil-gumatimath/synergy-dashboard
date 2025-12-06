-- ============================================
-- MIGRATION: Add Extended Employee Fields
-- Version: 2.1
-- Date: 2024-12-06
-- Description: Adds bank_details, education, manager, employment_type, projects_completed
-- ============================================

-- Add new columns to employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS manager TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'Full-time',
ADD COLUMN IF NOT EXISTS projects_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.employees.bank_details IS 'JSON object containing: bankName, accountNumber, ifscCode, branch';
COMMENT ON COLUMN public.employees.education IS 'JSON array of education records: [{degree, institution, year, grade}]';
COMMENT ON COLUMN public.employees.manager IS 'Name of the reporting manager';
COMMENT ON COLUMN public.employees.employment_type IS 'Full-time, Part-time, Contract, Intern';
COMMENT ON COLUMN public.employees.projects_completed IS 'Number of completed projects';
COMMENT ON COLUMN public.employees.location IS 'Work location/city';

-- Update existing employees with sample data (optional - for testing)
UPDATE public.employees 
SET 
    location = address,
    projects_completed = FLOOR(RANDOM() * 20 + 1)::INTEGER,
    employment_type = 'Full-time'
WHERE location IS NULL;

-- Add sample bank details for admin user
UPDATE public.employees 
SET bank_details = '{
    "bankName": "State Bank of India",
    "accountNumber": "XXXX-XXXX-1234",
    "ifscCode": "SBIN0001234",
    "branch": "Bengaluru Main Branch"
}'::jsonb
WHERE email = 'admin@gmail.com';

-- Add sample education for admin user
UPDATE public.employees 
SET education = '[
    {
        "degree": "B.Tech in Computer Science",
        "institution": "Indian Institute of Technology, Bengaluru",
        "year": "2018",
        "grade": "8.5 CGPA"
    },
    {
        "degree": "Higher Secondary (12th)",
        "institution": "Kendriya Vidyalaya",
        "year": "2014",
        "grade": "92%"
    }
]'::jsonb
WHERE email = 'admin@gmail.com';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
