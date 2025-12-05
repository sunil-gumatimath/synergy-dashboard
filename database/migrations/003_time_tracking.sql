-- ========================================
-- Time Tracking System Schema
-- ========================================

-- 1. TIME ENTRIES TABLE (Clock in/out records)
-- ========================================
CREATE TABLE IF NOT EXISTS time_entries (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  break_minutes INTEGER DEFAULT 0,
  total_hours NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN clock_out IS NOT NULL AND clock_in IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600 - (break_minutes / 60.0)
      ELSE NULL 
    END
  ) STORED,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'adjusted')),
  notes TEXT,
  location TEXT, -- For tracking where clock-in happened
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_employee ON time_entries(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date);
CREATE INDEX IF NOT EXISTS idx_time_entries_status ON time_entries(status);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_time_entries_updated_at ON time_entries;
CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- 2. OVERTIME TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS overtime_records (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  time_entry_id BIGINT REFERENCES time_entries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  overtime_hours NUMERIC(4,2) NOT NULL,
  overtime_type TEXT DEFAULT 'regular'
    CHECK (overtime_type IN ('regular', 'weekend', 'holiday')),
  multiplier NUMERIC(3,2) DEFAULT 1.5,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_overtime_employee ON overtime_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_overtime_date ON overtime_records(date);


-- 3. WORK SCHEDULE TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS work_schedules (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL DEFAULT '09:00:00',
  end_time TIME NOT NULL DEFAULT '18:00:00',
  is_working_day BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employee_id, day_of_week)
);


-- 4. TIMESHEET PERIODS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS timesheet_periods (
  id BIGSERIAL PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'open'
    CHECK (status IN ('open', 'submitted', 'approved', 'locked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 5. RLS POLICIES
-- ========================================

-- Time Entries
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated" ON time_entries
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Overtime Records
ALTER TABLE overtime_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated" ON overtime_records
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Work Schedules
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated" ON work_schedules
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Timesheet Periods
ALTER TABLE timesheet_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated" ON timesheet_periods
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 6. FUNCTIONS
-- ========================================

-- Function to get today's time entry for an employee
CREATE OR REPLACE FUNCTION get_today_time_entry(p_employee_id BIGINT)
RETURNS time_entries AS $$
DECLARE
  entry time_entries;
BEGIN
  SELECT * INTO entry
  FROM time_entries
  WHERE employee_id = p_employee_id
    AND date = CURRENT_DATE;
  
  RETURN entry;
END;
$$ LANGUAGE plpgsql;


-- Function to clock in
CREATE OR REPLACE FUNCTION clock_in(p_employee_id BIGINT, p_notes TEXT DEFAULT NULL)
RETURNS time_entries AS $$
DECLARE
  new_entry time_entries;
BEGIN
  -- Check if already clocked in today
  IF EXISTS (
    SELECT 1 FROM time_entries 
    WHERE employee_id = p_employee_id 
      AND date = CURRENT_DATE
  ) THEN
    RAISE EXCEPTION 'Already clocked in today';
  END IF;

  INSERT INTO time_entries (employee_id, date, clock_in, notes, status)
  VALUES (p_employee_id, CURRENT_DATE, NOW(), p_notes, 'active')
  RETURNING * INTO new_entry;

  RETURN new_entry;
END;
$$ LANGUAGE plpgsql;


-- Function to clock out
CREATE OR REPLACE FUNCTION clock_out(p_employee_id BIGINT, p_notes TEXT DEFAULT NULL)
RETURNS time_entries AS $$
DECLARE
  updated_entry time_entries;
BEGIN
  UPDATE time_entries
  SET 
    clock_out = NOW(),
    status = 'completed',
    notes = COALESCE(p_notes, notes)
  WHERE employee_id = p_employee_id
    AND date = CURRENT_DATE
    AND clock_out IS NULL
  RETURNING * INTO updated_entry;

  IF updated_entry IS NULL THEN
    RAISE EXCEPTION 'No active clock-in found for today';
  END IF;

  RETURN updated_entry;
END;
$$ LANGUAGE plpgsql;


-- Function to calculate weekly hours
CREATE OR REPLACE FUNCTION get_weekly_hours(p_employee_id BIGINT, p_week_start DATE)
RETURNS TABLE (
  day_name TEXT,
  hours NUMERIC(5,2),
  date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(te.date, 'Dy') as day_name,
    COALESCE(te.total_hours, 0) as hours,
    te.date
  FROM generate_series(
    p_week_start,
    p_week_start + INTERVAL '6 days',
    '1 day'
  ) AS d(date)
  LEFT JOIN time_entries te ON te.date = d.date::DATE AND te.employee_id = p_employee_id
  ORDER BY d.date;
END;
$$ LANGUAGE plpgsql;


-- 7. SAMPLE DATA
-- ========================================

-- Initialize default work schedule for all employees
INSERT INTO work_schedules (employee_id, day_of_week, start_time, end_time, is_working_day)
SELECT 
  e.id,
  d.day,
  CASE WHEN d.day IN (0, 6) THEN '00:00:00'::TIME ELSE '09:00:00'::TIME END,
  CASE WHEN d.day IN (0, 6) THEN '00:00:00'::TIME ELSE '18:00:00'::TIME END,
  d.day NOT IN (0, 6) -- Sunday and Saturday are off
FROM employees e
CROSS JOIN (
  SELECT generate_series(0, 6) as day
) d
ON CONFLICT (employee_id, day_of_week) DO NOTHING;

-- Sample time entries for the past week (for first 5 employees)
INSERT INTO time_entries (employee_id, date, clock_in, clock_out, status, break_minutes)
SELECT 
  e.id,
  d::DATE,
  (d + INTERVAL '9 hours' + (random() * INTERVAL '30 minutes'))::TIMESTAMPTZ,
  (d + INTERVAL '18 hours' + (random() * INTERVAL '60 minutes'))::TIMESTAMPTZ,
  'completed',
  30 + floor(random() * 30)::INTEGER
FROM employees e
CROSS JOIN generate_series(
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE - INTERVAL '1 day',
  '1 day'
) d
WHERE e.id <= 5
  AND EXTRACT(DOW FROM d) NOT IN (0, 6) -- Skip weekends
ON CONFLICT (employee_id, date) DO NOTHING;
