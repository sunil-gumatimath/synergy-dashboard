-- ========================================
-- Leave Management System Schema
-- ========================================

-- 1. LEAVE TYPES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS leave_types (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  days_per_year INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#3B82F6',
  is_paid BOOLEAN DEFAULT TRUE,
  requires_approval BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default leave types
INSERT INTO leave_types (name, description, days_per_year, color, is_paid) VALUES
  ('Annual Leave', 'Regular vacation/holiday leave', 20, '#3B82F6', TRUE),
  ('Sick Leave', 'Medical or health-related leave', 12, '#EF4444', TRUE),
  ('Personal Leave', 'Personal time off for appointments, emergencies', 5, '#8B5CF6', TRUE),
  ('Maternity Leave', 'Leave for new mothers', 90, '#EC4899', TRUE),
  ('Paternity Leave', 'Leave for new fathers', 14, '#06B6D4', TRUE),
  ('Bereavement Leave', 'Leave for family death', 5, '#6B7280', TRUE),
  ('Unpaid Leave', 'Leave without pay', 0, '#F59E0B', FALSE),
  ('Work From Home', 'Remote work day', 0, '#10B981', TRUE)
ON CONFLICT (name) DO NOTHING;


-- 2. LEAVE BALANCES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS leave_balances (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id BIGINT REFERENCES leave_types(id) ON DELETE CASCADE,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  total_days INTEGER NOT NULL DEFAULT 0,
  used_days INTEGER NOT NULL DEFAULT 0,
  pending_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employee_id, leave_type_id, year)
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_leave_balances_updated_at ON leave_balances;
CREATE TRIGGER update_leave_balances_updated_at
  BEFORE UPDATE ON leave_balances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- 3. LEAVE REQUESTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS leave_requests (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id BIGINT REFERENCES leave_types(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days NUMERIC(4,1) NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approver_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  is_half_day BOOLEAN DEFAULT FALSE,
  half_day_period TEXT CHECK (half_day_period IS NULL OR half_day_period IN ('morning', 'afternoon')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_approver ON leave_requests(approver_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_leave_requests_updated_at ON leave_requests;
CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- 4. HOLIDAYS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS holidays (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL UNIQUE,
  is_optional BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert sample holidays for 2025
INSERT INTO holidays (name, date, is_optional, description) VALUES
  ('New Year''s Day', '2025-01-01', FALSE, 'Start of the new year'),
  ('Republic Day', '2025-01-26', FALSE, 'Indian Republic Day'),
  ('Holi', '2025-03-14', FALSE, 'Festival of Colors'),
  ('Good Friday', '2025-04-18', FALSE, 'Christian holiday'),
  ('Eid ul-Fitr', '2025-03-31', FALSE, 'End of Ramadan'),
  ('Independence Day', '2025-08-15', FALSE, 'Indian Independence Day'),
  ('Ganesh Chaturthi', '2025-08-27', TRUE, 'Hindu festival'),
  ('Dussehra', '2025-10-02', FALSE, 'Victory of good over evil'),
  ('Diwali', '2025-10-20', FALSE, 'Festival of Lights'),
  ('Christmas', '2025-12-25', FALSE, 'Christmas Day')
ON CONFLICT (date) DO NOTHING;


-- 5. RLS POLICIES
-- ========================================

-- Leave Types
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leave_types_select_policy" ON leave_types;
DROP POLICY IF EXISTS "leave_types_all_policy" ON leave_types;

CREATE POLICY "leave_types_select_policy" ON leave_types
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "leave_types_all_policy" ON leave_types
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Leave Balances
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leave_balances_all_policy" ON leave_balances;

CREATE POLICY "leave_balances_all_policy" ON leave_balances
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Leave Requests
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leave_requests_all_policy" ON leave_requests;

CREATE POLICY "leave_requests_all_policy" ON leave_requests
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Holidays
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "holidays_select_policy" ON holidays;
DROP POLICY IF EXISTS "holidays_all_policy" ON holidays;

CREATE POLICY "holidays_select_policy" ON holidays
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "holidays_all_policy" ON holidays
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 6. FUNCTIONS
-- ========================================

-- Function to calculate business days (fixed variable name conflict)
CREATE OR REPLACE FUNCTION calculate_leave_days(
  p_start_date DATE,
  p_end_date DATE,
  p_is_half_day BOOLEAN DEFAULT FALSE
)
RETURNS NUMERIC AS $$
DECLARE
  total_days NUMERIC := 0;
  loop_date DATE := p_start_date;
BEGIN
  IF p_is_half_day THEN
    RETURN 0.5;
  END IF;

  WHILE loop_date <= p_end_date LOOP
    IF EXTRACT(DOW FROM loop_date) NOT IN (0, 6) THEN
      IF NOT EXISTS (SELECT 1 FROM holidays WHERE date = loop_date AND is_optional = FALSE) THEN
        total_days := total_days + 1;
      END IF;
    END IF;
    loop_date := loop_date + 1;
  END LOOP;

  RETURN total_days;
END;
$$ LANGUAGE plpgsql;


-- Function to initialize leave balances for an employee
CREATE OR REPLACE FUNCTION initialize_leave_balances(p_employee_id BIGINT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO leave_balances (employee_id, leave_type_id, year, total_days)
  SELECT 
    p_employee_id,
    lt.id,
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    lt.days_per_year
  FROM leave_types lt
  WHERE lt.days_per_year > 0
  ON CONFLICT (employee_id, leave_type_id, year) DO NOTHING;
END;
$$ LANGUAGE plpgsql;


-- Trigger function for leave balance updates
CREATE OR REPLACE FUNCTION update_leave_balance_on_request()
RETURNS TRIGGER AS $$
BEGIN
  -- When approved from pending
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE leave_balances
    SET 
      used_days = used_days + NEW.total_days::INTEGER,
      pending_days = GREATEST(0, pending_days - NEW.total_days::INTEGER)
    WHERE employee_id = NEW.employee_id 
      AND leave_type_id = NEW.leave_type_id
      AND year = EXTRACT(YEAR FROM NEW.start_date)::INTEGER;
  
  -- When rejected or cancelled from pending
  ELSIF NEW.status IN ('rejected', 'cancelled') AND OLD.status = 'pending' THEN
    UPDATE leave_balances
    SET pending_days = GREATEST(0, pending_days - NEW.total_days::INTEGER)
    WHERE employee_id = NEW.employee_id 
      AND leave_type_id = NEW.leave_type_id
      AND year = EXTRACT(YEAR FROM NEW.start_date)::INTEGER;
  
  -- When cancelled from approved
  ELSIF NEW.status = 'cancelled' AND OLD.status = 'approved' THEN
    UPDATE leave_balances
    SET used_days = GREATEST(0, used_days - NEW.total_days::INTEGER)
    WHERE employee_id = NEW.employee_id 
      AND leave_type_id = NEW.leave_type_id
      AND year = EXTRACT(YEAR FROM NEW.start_date)::INTEGER;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leave_balance_update_trigger ON leave_requests;
CREATE TRIGGER leave_balance_update_trigger
  AFTER UPDATE ON leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_leave_balance_on_request();


-- Trigger for adding pending days on create
CREATE OR REPLACE FUNCTION add_pending_leave_on_create()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO leave_balances (employee_id, leave_type_id, year, total_days, pending_days)
  VALUES (
    NEW.employee_id,
    NEW.leave_type_id,
    EXTRACT(YEAR FROM NEW.start_date)::INTEGER,
    COALESCE((SELECT days_per_year FROM leave_types WHERE id = NEW.leave_type_id), 0),
    NEW.total_days::INTEGER
  )
  ON CONFLICT (employee_id, leave_type_id, year) 
  DO UPDATE SET pending_days = leave_balances.pending_days + NEW.total_days::INTEGER;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leave_pending_on_create_trigger ON leave_requests;
CREATE TRIGGER leave_pending_on_create_trigger
  AFTER INSERT ON leave_requests
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION add_pending_leave_on_create();


-- 7. SAMPLE DATA (Optional)
-- ========================================
-- Only insert if tables are empty to avoid conflicts
DO $$
BEGIN
  -- Initialize balances for existing employees
  PERFORM initialize_leave_balances(id) FROM employees;
END $$;
