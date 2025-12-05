-- ========================================
-- AURORA EMPLOYEE MANAGEMENT SYSTEM
-- COMPLETE DATABASE SETUP
-- Run this ONCE in Supabase SQL Editor
-- ========================================

-- ========================================
-- DROP ALL EXISTING TABLES (Fresh Start)
-- ========================================
-- Drop in reverse order of dependencies

DROP TABLE IF EXISTS work_schedules CASCADE;
DROP TABLE IF EXISTS timesheet_periods CASCADE;
DROP TABLE IF EXISTS overtime_records CASCADE;
DROP TABLE IF EXISTS time_entries CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS leave_balances CASCADE;
DROP TABLE IF EXISTS holidays CASCADE;
DROP TABLE IF EXISTS leave_types CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS employee_notes CASCADE;
DROP TABLE IF EXISTS employee_documents CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS employees CASCADE;


-- ========================================
-- PART 1: CORE TABLES
-- ========================================

-- 1. EMPLOYEES TABLE
-- ========================================
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

CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

-- Updated_at Function (Shared by all tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON employees;
DROP POLICY IF EXISTS "Enable all operations for anon users" ON employees;

CREATE POLICY "Enable all operations for authenticated users" ON employees
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon users" ON employees
  FOR ALL TO anon USING (true) WITH CHECK (true);


-- 2. TASKS & TICKETS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  assignee_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'task'
    CHECK (type IN ('task', 'ticket')),
  category TEXT,
  comments INTEGER DEFAULT 0,
  attachments INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type);

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Enable all operations for anon users" ON tasks;

CREATE POLICY "Enable all operations for authenticated users" ON tasks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon users" ON tasks
  FOR ALL TO anon USING (true) WITH CHECK (true);


-- 3. DOCUMENTS TABLE
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

ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON employee_documents;
DROP POLICY IF EXISTS "Enable all operations for anon users" ON employee_documents;

CREATE POLICY "Enable all operations for authenticated users" ON employee_documents
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon users" ON employee_documents
  FOR ALL TO anon USING (true) WITH CHECK (true);


-- 4. NOTES TABLE
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

DROP TRIGGER IF EXISTS update_notes_updated_at ON employee_notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON employee_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE employee_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON employee_notes;
DROP POLICY IF EXISTS "Enable all operations for anon users" ON employee_notes;

CREATE POLICY "Enable all operations for authenticated users" ON employee_notes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon users" ON employee_notes
  FOR ALL TO anon USING (true) WITH CHECK (true);


-- 5. CALENDAR EVENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  type TEXT NOT NULL DEFAULT 'event',
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);

DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON calendar_events;
DROP POLICY IF EXISTS "Enable all operations for anon users" ON calendar_events;

CREATE POLICY "Enable all operations for authenticated users" ON calendar_events
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon users" ON calendar_events
  FOR ALL TO anon USING (true) WITH CHECK (true);


-- ========================================
-- PART 2: NOTIFICATIONS SYSTEM
-- ========================================

CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info'
    CHECK (type IN ('info', 'success', 'warning', 'error', 'task', 'event', 'ticket')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
DROP POLICY IF EXISTS "Service can create notifications" ON notifications;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service can create notifications" ON notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  task_assigned BOOLEAN DEFAULT TRUE,
  task_completed BOOLEAN DEFAULT TRUE,
  task_due_soon BOOLEAN DEFAULT TRUE,
  ticket_created BOOLEAN DEFAULT TRUE,
  ticket_resolved BOOLEAN DEFAULT TRUE,
  event_reminder BOOLEAN DEFAULT TRUE,
  employee_updates BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own preferences" ON notification_preferences;
CREATE POLICY "Users can manage their own preferences" ON notification_preferences
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_link TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS notifications AS $$
DECLARE
  new_notification notifications;
BEGIN
  INSERT INTO notifications (user_id, title, message, type, link, metadata)
  VALUES (p_user_id, p_title, p_message, p_type, p_link, p_metadata)
  RETURNING * INTO new_notification;
  
  RETURN new_notification;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-notify on task assignment
CREATE OR REPLACE FUNCTION notify_task_assigned()
RETURNS TRIGGER AS $$
DECLARE
  assignee_email TEXT;
  assignee_user_id UUID;
BEGIN
  IF NEW.assignee_id IS NOT NULL AND 
     (OLD.assignee_id IS NULL OR OLD.assignee_id != NEW.assignee_id) THEN
    
    SELECT email INTO assignee_email FROM employees WHERE id = NEW.assignee_id;
    SELECT id INTO assignee_user_id FROM auth.users WHERE email = assignee_email;
    
    IF assignee_user_id IS NOT NULL THEN
      PERFORM create_notification(
        assignee_user_id,
        'New Task Assigned',
        'You have been assigned a new task: ' || NEW.title,
        'task',
        '/tasks',
        jsonb_build_object('task_id', NEW.id, 'priority', NEW.priority)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS task_assigned_notification ON tasks;
CREATE TRIGGER task_assigned_notification
  AFTER INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_task_assigned();


-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  new_employee_alerts BOOLEAN DEFAULT true,
  system_updates BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  auto_backup BOOLEAN DEFAULT true,
  data_retention TEXT DEFAULT '3years',
  two_factor_auth BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;

CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ========================================
-- PART 3: LEAVE MANAGEMENT SYSTEM
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

DROP TRIGGER IF EXISTS update_leave_balances_updated_at ON leave_balances;
CREATE TRIGGER update_leave_balances_updated_at
  BEFORE UPDATE ON leave_balances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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

CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);

DROP TRIGGER IF EXISTS update_leave_requests_updated_at ON leave_requests;
CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS holidays (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL UNIQUE,
  is_optional BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

-- Leave RLS Policies
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leave_types_all_policy" ON leave_types;
DROP POLICY IF EXISTS "leave_balances_all_policy" ON leave_balances;
DROP POLICY IF EXISTS "leave_requests_all_policy" ON leave_requests;
DROP POLICY IF EXISTS "holidays_all_policy" ON holidays;

CREATE POLICY "leave_types_all_policy" ON leave_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "leave_balances_all_policy" ON leave_balances FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "leave_requests_all_policy" ON leave_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "holidays_all_policy" ON holidays FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Leave Functions
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
  IF p_is_half_day THEN RETURN 0.5; END IF;

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

CREATE OR REPLACE FUNCTION initialize_leave_balances(p_employee_id BIGINT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO leave_balances (employee_id, leave_type_id, year, total_days)
  SELECT p_employee_id, lt.id, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, lt.days_per_year
  FROM leave_types lt WHERE lt.days_per_year > 0
  ON CONFLICT (employee_id, leave_type_id, year) DO NOTHING;
END;
$$ LANGUAGE plpgsql;


-- ========================================
-- PART 4: TIME TRACKING SYSTEM
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
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

CREATE INDEX IF NOT EXISTS idx_time_entries_employee ON time_entries(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date);
CREATE INDEX IF NOT EXISTS idx_time_entries_status ON time_entries(status);

DROP TRIGGER IF EXISTS update_time_entries_updated_at ON time_entries;
CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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

CREATE INDEX IF NOT EXISTS idx_overtime_employee ON overtime_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_overtime_date ON overtime_records(date);

CREATE TABLE IF NOT EXISTS work_schedules (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL DEFAULT '09:00:00',
  end_time TIME NOT NULL DEFAULT '18:00:00',
  is_working_day BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employee_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS timesheet_periods (
  id BIGSERIAL PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'open'
    CHECK (status IN ('open', 'submitted', 'approved', 'locked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Time Tracking RLS
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE overtime_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheet_periods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated" ON time_entries;
DROP POLICY IF EXISTS "Enable all for authenticated" ON overtime_records;
DROP POLICY IF EXISTS "Enable all for authenticated" ON work_schedules;
DROP POLICY IF EXISTS "Enable all for authenticated" ON timesheet_periods;

CREATE POLICY "Enable all for authenticated" ON time_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON overtime_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON work_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON timesheet_periods FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Time Tracking Functions
CREATE OR REPLACE FUNCTION get_today_time_entry(p_employee_id BIGINT)
RETURNS time_entries AS $$
DECLARE
  entry time_entries;
BEGIN
  SELECT * INTO entry FROM time_entries
  WHERE employee_id = p_employee_id AND date = CURRENT_DATE;
  RETURN entry;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION clock_in(p_employee_id BIGINT, p_notes TEXT DEFAULT NULL)
RETURNS time_entries AS $$
DECLARE
  new_entry time_entries;
BEGIN
  IF EXISTS (SELECT 1 FROM time_entries WHERE employee_id = p_employee_id AND date = CURRENT_DATE) THEN
    RAISE EXCEPTION 'Already clocked in today';
  END IF;

  INSERT INTO time_entries (employee_id, date, clock_in, notes, status)
  VALUES (p_employee_id, CURRENT_DATE, NOW(), p_notes, 'active')
  RETURNING * INTO new_entry;

  RETURN new_entry;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION clock_out(p_employee_id BIGINT, p_notes TEXT DEFAULT NULL)
RETURNS time_entries AS $$
DECLARE
  updated_entry time_entries;
BEGIN
  UPDATE time_entries
  SET clock_out = NOW(), status = 'completed', notes = COALESCE(p_notes, notes)
  WHERE employee_id = p_employee_id AND date = CURRENT_DATE AND clock_out IS NULL
  RETURNING * INTO updated_entry;

  IF updated_entry IS NULL THEN
    RAISE EXCEPTION 'No active clock-in found for today';
  END IF;

  RETURN updated_entry;
END;
$$ LANGUAGE plpgsql;


-- ========================================
-- PART 5: SAMPLE DATA
-- ========================================

-- Employees (Including your user - UPDATE EMAIL TO YOUR LOGIN EMAIL!)
INSERT INTO employees (name, email, role, department, status, avatar, join_date, salary, performance_score) VALUES
  -- ADD YOUR USER HERE (Replace email with YOUR login email)
  ('Sunil Gumatimath', 'sunilgumatimath38@gmail.com', 'Employee', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Sunil', CURRENT_DATE, 100000, 90),
  -- Sample employees
  ('Aarav Patel', 'aarav.p@company.com', 'Senior Developer', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Aarav', '2022-03-15', 120000, 92),
  ('Diya Sharma', 'diya.s@company.com', 'Product Designer', 'Design', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Diya', '2023-01-10', 95000, 88),
  ('Vihaan Gupta', 'vihaan.g@company.com', 'Product Manager', 'Product', 'On Leave', 'https://api.dicebear.com/9.x/micah/svg?seed=Vihaan', '2021-11-05', 110000, 85),
  ('Ananya Singh', 'ananya.s@company.com', 'Marketing Lead', 'Marketing', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Ananya', '2022-06-20', 105000, 94),
  ('Arjun Reddy', 'arjun.r@company.com', 'Frontend Dev', 'Engineering', 'Offline', 'https://api.dicebear.com/9.x/micah/svg?seed=Arjun', '2023-04-01', 90000, 82),
  ('Ishita Verma', 'ishita.v@company.com', 'UX Researcher', 'Design', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Ishita', '2023-02-15', 88000, 90),
  ('Rohan Joshi', 'rohan.j@company.com', 'DevOps Engineer', 'Engineering', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Rohan', '2022-08-01', 115000, 89),
  ('Kavita Iyer', 'kavita.i@company.com', 'QA Engineer', 'Engineering', 'On Leave', 'https://api.dicebear.com/9.x/micah/svg?seed=Kavita', '2023-05-12', 85000, 87),
  ('Karthik Nair', 'karthik.n@company.com', 'Data Scientist', 'Data', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Karthik', '2022-01-20', 130000, 96),
  ('Meera Malhotra', 'meera.m@company.com', 'HR Manager', 'HR', 'Active', 'https://api.dicebear.com/9.x/micah/svg?seed=Meera', '2021-09-10', 98000, 91)
ON CONFLICT (email) DO NOTHING;

-- Tasks & Tickets
INSERT INTO tasks (title, description, status, priority, due_date, assignee_id, type, category, comments, attachments) VALUES
  ('Onboard new designers', 'Prepare welcome kit and system access for the 3 new UX designers joining next week.', 'todo', 'high', CURRENT_DATE + INTERVAL '5 days', 10, 'task', NULL, 2, 1),
  ('Q4 Performance Reviews', 'Complete initial self-assessments and peer reviews for the engineering team.', 'in-progress', 'medium', CURRENT_DATE + INTERVAL '15 days', 1, 'task', NULL, 5, 0),
  ('Update Employee Handbook', 'Revise the remote work policy section to reflect new guidelines.', 'review', 'low', CURRENT_DATE + INTERVAL '3 days', 10, 'task', NULL, 0, 3),
  ('Laptop screen flickering', 'My laptop screen flickers intermittently when connected to the external monitor.', 'todo', 'medium', CURRENT_DATE + INTERVAL '7 days', NULL, 'ticket', 'IT Support', 0, 0),
  ('Request for new chair', 'My current chair is broken and causing back pain.', 'in-progress', 'low', CURRENT_DATE + INTERVAL '10 days', NULL, 'ticket', 'Facilities', 1, 0)
ON CONFLICT DO NOTHING;

-- Calendar Events
INSERT INTO calendar_events (title, description, date, time, type, location) VALUES
  ('Team Sync', 'Weekly team synchronization meeting', CURRENT_DATE, '10:00 AM', 'meeting', 'Conference Room A'),
  ('Project Review', 'Review Q4 project milestones', CURRENT_DATE + INTERVAL '1 day', '2:00 PM', 'meeting', 'Zoom'),
  ('Office Party', 'Annual holiday celebration', CURRENT_DATE + INTERVAL '5 days', '6:00 PM', 'event', 'Main Hall'),
  ('Design Workshop', 'UX/UI design principles workshop', CURRENT_DATE + INTERVAL '3 days', '11:00 AM', 'workshop', 'Design Studio')
ON CONFLICT DO NOTHING;

-- Initialize work schedules for all employees
INSERT INTO work_schedules (employee_id, day_of_week, start_time, end_time, is_working_day)
SELECT 
  e.id,
  d.day,
  CASE WHEN d.day IN (0, 6) THEN '00:00:00'::TIME ELSE '09:00:00'::TIME END,
  CASE WHEN d.day IN (0, 6) THEN '00:00:00'::TIME ELSE '18:00:00'::TIME END,
  d.day NOT IN (0, 6)
FROM employees e
CROSS JOIN (SELECT generate_series(0, 6) as day) d
ON CONFLICT (employee_id, day_of_week) DO NOTHING;

-- Initialize leave balances for all employees
DO $$
BEGIN
  PERFORM initialize_leave_balances(id) FROM employees;
END $$;


-- ========================================
-- DONE! 
-- After running this, log out and log back in
-- to refresh your user data.
-- ========================================
