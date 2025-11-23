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

INSERT INTO employees (name, email, role, department, status, avatar, join_date) VALUES
  ('Aarav Patel', 'aarav.p@company.com', 'Senior Developer', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Aarav', '2022-03-15'),
  ('Diya Sharma', 'diya.s@company.com', 'Product Designer', 'Design', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Diya', '2023-01-10'),
  ('Vihaan Gupta', 'vihaan.g@company.com', 'Product Manager', 'Product', 'On Leave', 'https://api.dicebear.com/9.x/micah/svg?seed=Vihaan', '2021-11-05'),
  ('Ananya Singh', 'ananya.s@company.com', 'Marketing Lead', 'Marketing', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Ananya', '2022-06-20'),
  ('Arjun Reddy', 'arjun.r@company.com', 'Frontend Dev', 'Engineering', 'Offline', 'https://api.dicebear.com/9.x/micah/svg?seed=Arjun', '2023-04-01'),
  ('Ishita Verma', 'ishita.v@company.com', 'UX Researcher', 'Design', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Ishita', '2023-02-15'),
  ('Rohan Joshi', 'rohan.j@company.com', 'DevOps Engineer', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Rohan', '2022-08-01'),
  ('Kavita Iyer', 'kavita.i@company.com', 'QA Engineer', 'Engineering', 'On Leave', 'https://api.dicebear.com/9.x/micah/svg?seed=Kavita', '2023-05-12'),
  ('Karthik Nair', 'karthik.n@company.com', 'Data Scientist', 'Data', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Karthik', '2022-01-20'),
  ('Meera Malhotra', 'meera.m@company.com', 'HR Manager', 'HR', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Meera', '2021-09-10')
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
-- ORDER BY count DESC;
