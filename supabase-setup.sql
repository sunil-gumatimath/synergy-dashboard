-- ========================================
-- Aurora Employee Management System
-- Supabase Database Setup Script
-- ========================================

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active', 'On Leave', 'Offline')),
  avatar TEXT,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  salary INTEGER DEFAULT 0,
  performance_score INTEGER DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth needs)
-- For now, we'll allow all authenticated users to perform CRUD operations
CREATE POLICY "Enable all operations for authenticated users"
  ON employees
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- For development: allow anonymous access (remove in production)
CREATE POLICY "Enable all operations for anon users"
  ON employees
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ========================================
-- Insert Sample Data (Optional)
-- ========================================

INSERT INTO employees (name, email, role, department, status, avatar, join_date, salary, performance_score) VALUES
  ('Aarav Patel', 'aarav.p@company.com', 'Senior Developer', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Aarav', '2022-03-15', 120000, 92),
  ('Diya Sharma', 'diya.s@company.com', 'Product Designer', 'Design', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Diya', '2023-01-10', 95000, 88),
  ('Vihaan Gupta', 'vihaan.g@company.com', 'Product Manager', 'Product', 'On Leave', 'https://api.dicebear.com/9.x/micah/svg?seed=Vihaan', '2021-11-05', 110000, 85),
  ('Ananya Singh', 'ananya.s@company.com', 'Marketing Lead', 'Marketing', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Ananya', '2022-06-20', 105000, 94),
  ('Arjun Reddy', 'arjun.r@company.com', 'Frontend Dev', 'Engineering', 'Offline', 'https://api.dicebear.com/9.x/micah/svg?seed=Arjun', '2023-04-01', 90000, 82),
  ('Ishita Verma', 'ishita.v@company.com', 'UX Researcher', 'Design', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Ishita', '2023-02-15', 88000, 90),
  ('Rohan Joshi', 'rohan.j@company.com', 'DevOps Engineer', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Rohan', '2022-08-01', 115000, 89),
  ('Kavita Iyer', 'kavita.i@company.com', 'QA Engineer', 'Engineering', 'On Leave', 'https://api.dicebear.com/9.x/micah/svg?seed=Kavita', '2023-05-12', 85000, 87),
  ('Karthik Nair', 'karthik.n@company.com', 'Data Scientist', 'Data', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Karthik', '2022-01-20', 130000, 96),
  ('Meera Malhotra', 'meera.m@company.com', 'HR Manager', 'HR', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Meera', '2021-09-10', 98000, 91),
  ('Vikram Singh', 'vikram.s@company.com', 'Sales Director', 'Sales', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Vikram', '2021-05-15', 140000, 93),
  ('Priya Kapoor', 'priya.k@company.com', 'Content Strategist', 'Marketing', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Priya', '2023-03-10', 82000, 86),
  ('Rahul Khanna', 'rahul.k@company.com', 'Backend Developer', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Rahul', '2022-11-20', 95000, 84),
  ('Sneha Reddy', 'sneha.r@company.com', 'Recruiter', 'HR', 'Offline', 'https://api.dicebear.com/9.x/micah/svg?seed=Sneha', '2023-06-01', 75000, 88),
  ('Amit Shah', 'amit.s@company.com', 'Financial Analyst', 'Finance', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Amit', '2022-02-28', 92000, 90),
  ('Neha Gupta', 'neha.g@company.com', 'Full Stack Dev', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Neha', '2023-01-15', 100000, 91),
  ('Rajesh Kumar', 'rajesh.k@company.com', 'Sales Executive', 'Sales', 'On Leave', 'https://api.dicebear.com/9.x/micah/svg?seed=Rajesh', '2022-09-05', 80000, 83),
  ('Pooja Mishra', 'pooja.m@company.com', 'Graphic Designer', 'Design', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Pooja', '2023-04-20', 78000, 89),
  ('Sanjay Dutt', 'sanjay.d@company.com', 'System Architect', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Sanjay', '2021-12-10', 145000, 95),
  ('Riya Sen', 'riya.s@company.com', 'Product Owner', 'Product', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Riya', '2022-07-01', 112000, 87),
  ('Manish Malhotra', 'manish.m@company.com', 'SEO Specialist', 'Marketing', 'Offline', 'https://api.dicebear.com/9.x/micah/svg?seed=Manish', '2023-02-01', 85000, 84),
  ('Sonal Chauhan', 'sonal.c@company.com', 'HR Coordinator', 'HR', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Sonal', '2023-05-01', 70000, 86),
  ('Vivek Oberoi', 'vivek.o@company.com', 'Accountant', 'Finance', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Vivek', '2022-10-15', 88000, 92),
  ('Shilpa Shetty', 'shilpa.s@company.com', 'UI Designer', 'Design', 'On Leave', 'https://api.dicebear.com/9.x/micah/svg?seed=Shilpa', '2023-03-25', 90000, 88),
  ('Karan Johar', 'karan.j@company.com', 'Product Analyst', 'Product', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Karan', '2022-04-10', 94000, 85)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- Verification Queries
-- ========================================

-- Check if table was created successfully
-- SELECT * FROM employees ORDER BY created_at DESC;

-- Count total employees
-- SELECT COUNT(*) as total_employees FROM employees;

-- Check employees by department
-- SELECT department, COUNT(*) as count 
-- FROM employees 
-- GROUP BY department 

-- ========================================
-- Documents Table
-- ========================================

CREATE TABLE IF NOT EXISTS employee_documents (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by TEXT,
  notes TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON employee_documents(employee_id);

-- Enable RLS for documents
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;

-- Policies for documents
CREATE POLICY "Enable all operations for authenticated users"
  ON employee_documents FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon users"
  ON employee_documents FOR ALL TO anon
  USING (true) WITH CHECK (true);

-- ========================================
-- Notes Table
-- ========================================

CREATE TABLE IF NOT EXISTS employee_notes (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_employee_id ON employee_notes(employee_id);

-- Trigger for notes updated_at
DROP TRIGGER IF EXISTS update_notes_updated_at ON employee_notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON employee_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for notes
ALTER TABLE employee_notes ENABLE ROW LEVEL SECURITY;

-- Policies for notes
CREATE POLICY "Enable all operations for authenticated users"
  ON employee_notes FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon users"
  ON employee_notes FOR ALL TO anon
  USING (true) WITH CHECK (true);

-- ========================================
-- Storage Bucket Setup Instructions
-- ========================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named 'employee-documents'
-- 3. Set it to Public
-- 4. Add Policy: "Give users access to all files" (SELECT, INSERT, UPDATE, DELETE) for all users (anon and authenticated)

