-- ============================================
-- AURORA EMS - COMPLETE DATABASE SETUP
-- Version: 2.0
-- Last Updated: 2024-12-06
-- ============================================

-- ============================================
-- SECTION 1: DROP EXISTING TABLES
-- ============================================
DROP TABLE IF EXISTS public.employee_notes CASCADE;
DROP TABLE IF EXISTS public.employee_documents CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.notification_preferences CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.timesheet_periods CASCADE;
DROP TABLE IF EXISTS public.overtime_records CASCADE;
DROP TABLE IF EXISTS public.work_schedules CASCADE;
DROP TABLE IF EXISTS public.time_entries CASCADE;
DROP TABLE IF EXISTS public.leave_requests CASCADE;
DROP TABLE IF EXISTS public.leave_balances CASCADE;
DROP TABLE IF EXISTS public.leave_types CASCADE;
DROP TABLE IF EXISTS public.holidays CASCADE;
DROP TABLE IF EXISTS public.calendar_events CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;

-- ============================================
-- SECTION 2: CREATE TABLES
-- ============================================

-- 1. EMPLOYEES
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT,
    gender TEXT DEFAULT 'other',
    department TEXT,
    role TEXT DEFAULT 'Employee',
    status TEXT DEFAULT 'Active',
    phone TEXT,
    address TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    salary NUMERIC(12, 2) DEFAULT 0,
    performance_score NUMERIC(3, 1) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TASKS
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'To Do',
    priority TEXT DEFAULT 'Medium',
    assignee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    due_date DATE,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TEXT,
    end_time TEXT,
    type TEXT DEFAULT 'event',
    location TEXT,
    recurrence TEXT DEFAULT 'none',
    is_all_day BOOLEAN DEFAULT FALSE,
    color TEXT,
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HOLIDAYS
CREATE TABLE public.holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEAVE TYPES
CREATE TABLE public.leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#4f46e5',
    default_days INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEAVE BALANCES
CREATE TABLE public.leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES public.leave_types(id) ON DELETE CASCADE,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    total_days INTEGER NOT NULL DEFAULT 0,
    used_days INTEGER NOT NULL DEFAULT 0,
    pending_days INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, leave_type_id, year)
);

-- 7. LEAVE REQUESTS
CREATE TABLE public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES public.leave_types(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL DEFAULT 1,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TIME ENTRIES
CREATE TABLE public.time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    clock_in TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    break_minutes INTEGER DEFAULT 0,
    notes TEXT,
    location TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- 9. WORK SCHEDULES
CREATE TABLE public.work_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time TIME DEFAULT '09:00:00',
    end_time TIME DEFAULT '17:00:00',
    is_working_day BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, day_of_week)
);

-- 10. OVERTIME RECORDS
CREATE TABLE public.overtime_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    time_entry_id UUID REFERENCES public.time_entries(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    overtime_hours NUMERIC(5, 2) NOT NULL,
    overtime_type TEXT DEFAULT 'regular',
    multiplier NUMERIC(3, 2) DEFAULT 1.5,
    status TEXT DEFAULT 'pending',
    approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TIMESHEET PERIODS
CREATE TABLE public.timesheet_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_hours NUMERIC(6, 2) DEFAULT 0,
    regular_hours NUMERIC(6, 2) DEFAULT 0,
    overtime_hours NUMERIC(6, 2) DEFAULT 0,
    status TEXT DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTIFICATIONS
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATION PREFERENCES
CREATE TABLE public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    leave_updates BOOLEAN DEFAULT TRUE,
    task_updates BOOLEAN DEFAULT TRUE,
    announcements BOOLEAN DEFAULT TRUE,
    weekly_digest BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. USER SETTINGS
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    -- Appearance
    theme TEXT DEFAULT 'system',
    accent_color TEXT DEFAULT 'indigo',
    compact_mode BOOLEAN DEFAULT FALSE,
    -- Notifications
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    task_reminders BOOLEAN DEFAULT TRUE,
    leave_updates BOOLEAN DEFAULT TRUE,
    system_updates BOOLEAN DEFAULT TRUE,
    weekly_reports BOOLEAN DEFAULT FALSE,
    mention_notifications BOOLEAN DEFAULT TRUE,
    new_employee_alerts BOOLEAN DEFAULT TRUE,
    -- Preferences
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Asia/Kolkata',
    date_format TEXT DEFAULT 'DD/MM/YYYY',
    time_format TEXT DEFAULT '12h',
    start_of_week TEXT DEFAULT 'monday',
    auto_backup BOOLEAN DEFAULT TRUE,
    data_retention TEXT DEFAULT '3years',
    -- Security
    two_factor_auth BOOLEAN DEFAULT FALSE,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. EMPLOYEE DOCUMENTS
CREATE TABLE public.employee_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    uploaded_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. EMPLOYEE NOTES
CREATE TABLE public.employee_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. SUPPORT TICKETS
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    created_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 3: ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheet_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECTION 4: RLS POLICIES
-- ============================================

-- Employees
CREATE POLICY "read_employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_employees" ON public.employees FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tasks
CREATE POLICY "read_tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_tasks" ON public.tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Calendar Events
CREATE POLICY "read_calendar" ON public.calendar_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_calendar" ON public.calendar_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Holidays
CREATE POLICY "read_holidays" ON public.holidays FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_holidays" ON public.holidays FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Leave Types
CREATE POLICY "read_leave_types" ON public.leave_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_leave_types" ON public.leave_types FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Leave Balances
CREATE POLICY "read_leave_balances" ON public.leave_balances FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_leave_balances" ON public.leave_balances FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Leave Requests
CREATE POLICY "read_leave_requests" ON public.leave_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_leave_requests" ON public.leave_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Time Entries
CREATE POLICY "read_time_entries" ON public.time_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_time_entries" ON public.time_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Work Schedules
CREATE POLICY "read_work_schedules" ON public.work_schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_work_schedules" ON public.work_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Overtime Records
CREATE POLICY "read_overtime" ON public.overtime_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_overtime" ON public.overtime_records FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Timesheet Periods
CREATE POLICY "read_timesheets" ON public.timesheet_periods FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_timesheets" ON public.timesheet_periods FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Notifications (User-specific)
CREATE POLICY "read_notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "write_notifications" ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Notification Preferences (User-specific)
CREATE POLICY "read_notif_prefs" ON public.notification_preferences FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "write_notif_prefs" ON public.notification_preferences FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (true);

-- User Settings (User-specific)
CREATE POLICY "read_user_settings" ON public.user_settings FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "write_user_settings" ON public.user_settings FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (true);

-- Employee Documents
CREATE POLICY "read_docs" ON public.employee_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_docs" ON public.employee_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Employee Notes
CREATE POLICY "read_notes" ON public.employee_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_notes" ON public.employee_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Support Tickets
CREATE POLICY "read_tickets" ON public.support_tickets FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_tickets" ON public.support_tickets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- SECTION 5: SEED DATA - LEAVE TYPES
-- ============================================
INSERT INTO public.leave_types (name, description, color, default_days) VALUES
    ('Annual Leave', 'Paid vacation days for rest and recreation', '#10b981', 20),
    ('Sick Leave', 'Medical leave for illness or health issues', '#ef4444', 12),
    ('Personal Leave', 'Leave for personal matters and emergencies', '#f59e0b', 5),
    ('Maternity Leave', 'Maternity leave for expecting mothers', '#ec4899', 180),
    ('Paternity Leave', 'Paternity leave for new fathers', '#8b5cf6', 15),
    ('Unpaid Leave', 'Leave without pay for extended absences', '#6b7280', 0),
    ('Compensatory Off', 'Leave earned for working on holidays/weekends', '#3b82f6', 0);

-- ============================================
-- SECTION 6: SEED DATA - HOLIDAYS (INDIA 2024-2025)
-- ============================================
INSERT INTO public.holidays (name, date, description, is_recurring) VALUES
    -- 2024 Holidays
    ('New Year', '2024-01-01', 'New Year Celebration', TRUE),
    ('Republic Day', '2024-01-26', 'Republic Day of India', TRUE),
    ('Holi', '2024-03-25', 'Festival of Colors', FALSE),
    ('Good Friday', '2024-03-29', 'Good Friday', FALSE),
    ('Eid ul-Fitr', '2024-04-11', 'End of Ramadan', FALSE),
    ('Ram Navami', '2024-04-17', 'Birth of Lord Rama', FALSE),
    ('Dr. Ambedkar Jayanti', '2024-04-14', 'Birth Anniversary of Dr. B.R. Ambedkar', TRUE),
    ('May Day', '2024-05-01', 'International Workers Day', TRUE),
    ('Buddha Purnima', '2024-05-23', 'Birth of Lord Buddha', FALSE),
    ('Eid ul-Adha', '2024-06-17', 'Festival of Sacrifice', FALSE),
    ('Muharram', '2024-07-17', 'Islamic New Year', FALSE),
    ('Independence Day', '2024-08-15', 'Independence Day of India', TRUE),
    ('Janmashtami', '2024-08-26', 'Birth of Lord Krishna', FALSE),
    ('Milad un-Nabi', '2024-09-16', 'Prophet Muhammad Birthday', FALSE),
    ('Gandhi Jayanti', '2024-10-02', 'Birth Anniversary of Mahatma Gandhi', TRUE),
    ('Dussehra', '2024-10-12', 'Victory of Good over Evil', FALSE),
    ('Diwali', '2024-11-01', 'Festival of Lights', FALSE),
    ('Guru Nanak Jayanti', '2024-11-15', 'Birth of Guru Nanak', FALSE),
    ('Christmas', '2024-12-25', 'Christmas Day', TRUE),
    -- 2025 Holidays
    ('New Year 2025', '2025-01-01', 'New Year 2025', TRUE),
    ('Pongal/Makar Sankranti', '2025-01-14', 'Harvest Festival', FALSE),
    ('Republic Day 2025', '2025-01-26', 'Republic Day of India 2025', TRUE);

-- ============================================
-- SECTION 7: SEED DATA - EMPLOYEES (15+ Indian Names)
-- ============================================
INSERT INTO public.employees (name, email, department, role, status, phone, address, join_date, salary, performance_score, gender) VALUES
    -- Admin User (links to admin@gmail.com)
    ('Sunil Gumatimath', 'admin@gmail.com', 'IT', 'Admin', 'Active', '+91 98765 43210', 'Bengaluru, Karnataka', '2022-01-15', 150000, 4.8, 'male'),
    
    -- Managers
    ('Priya Sharma', 'priya.sharma@aurora.com', 'Human Resources', 'Manager', 'Active', '+91 98765 11111', 'Mumbai, Maharashtra', '2022-03-10', 120000, 4.7, 'female'),
    ('Rajesh Kumar', 'rajesh.kumar@aurora.com', 'Engineering', 'Manager', 'Active', '+91 98765 22222', 'Delhi, NCR', '2022-02-20', 130000, 4.5, 'male'),
    ('Ananya Iyer', 'ananya.iyer@aurora.com', 'Design', 'Manager', 'Active', '+91 98765 33333', 'Chennai, Tamil Nadu', '2022-04-05', 115000, 4.6, 'female'),
    
    -- Engineering Department
    ('Vikram Reddy', 'vikram.reddy@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98765 44444', 'Hyderabad, Telangana', '2023-01-10', 85000, 4.2, 'male'),
    ('Sneha Patel', 'sneha.patel@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98765 55555', 'Ahmedabad, Gujarat', '2023-02-15', 82000, 4.0, 'female'),
    ('Arjun Nair', 'arjun.nair@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98765 66666', 'Kochi, Kerala', '2023-03-20', 88000, 4.3, 'male'),
    ('Kavitha Menon', 'kavitha.menon@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98765 77777', 'Thiruvananthapuram, Kerala', '2023-05-10', 78000, 3.9, 'female'),
    
    -- Design Department
    ('Rohit Verma', 'rohit.verma@aurora.com', 'Design', 'Employee', 'Active', '+91 98765 88888', 'Pune, Maharashtra', '2023-04-01', 75000, 4.1, 'male'),
    ('Meera Krishnan', 'meera.krishnan@aurora.com', 'Design', 'Employee', 'Active', '+91 98765 99999', 'Bengaluru, Karnataka', '2023-06-15', 72000, 4.4, 'female'),
    
    -- HR Department
    ('Amit Singh', 'amit.singh@aurora.com', 'Human Resources', 'Employee', 'Active', '+91 98764 11111', 'Jaipur, Rajasthan', '2023-07-01', 65000, 3.8, 'male'),
    ('Divya Gupta', 'divya.gupta@aurora.com', 'Human Resources', 'Employee', 'Active', '+91 98764 22222', 'Lucknow, Uttar Pradesh', '2023-08-10', 68000, 4.0, 'female'),
    
    -- Marketing Department
    ('Karthik Sundaram', 'karthik.sundaram@aurora.com', 'Marketing', 'Employee', 'Active', '+91 98764 33333', 'Chennai, Tamil Nadu', '2023-09-05', 70000, 4.2, 'male'),
    ('Nisha Agarwal', 'nisha.agarwal@aurora.com', 'Marketing', 'Employee', 'Active', '+91 98764 44444', 'Kolkata, West Bengal', '2023-10-01', 72000, 4.1, 'female'),
    
    -- Finance Department
    ('Sanjay Joshi', 'sanjay.joshi@aurora.com', 'Finance', 'Manager', 'Active', '+91 98764 55555', 'Mumbai, Maharashtra', '2022-06-15', 125000, 4.6, 'male'),
    ('Pooja Desai', 'pooja.desai@aurora.com', 'Finance', 'Employee', 'Active', '+91 98764 66666', 'Surat, Gujarat', '2023-11-01', 75000, 4.0, 'female'),
    
    -- Operations Department
    ('Manoj Pillai', 'manoj.pillai@aurora.com', 'Operations', 'Employee', 'Active', '+91 98764 77777', 'Kochi, Kerala', '2023-12-01', 68000, 3.7, 'male'),
    ('Lakshmi Rao', 'lakshmi.rao@aurora.com', 'Operations', 'Employee', 'Active', '+91 98764 88888', 'Visakhapatnam, Andhra Pradesh', '2024-01-10', 65000, 3.9, 'female'),
    
    -- Inactive Employee
    ('Rahul Mehta', 'rahul.mehta@aurora.com', 'Engineering', 'Employee', 'Inactive', '+91 98764 99999', 'Indore, Madhya Pradesh', '2022-08-01', 80000, 3.5, 'male');

-- ============================================
-- SECTION 8: SEED DATA - TASKS
-- ============================================
INSERT INTO public.tasks (title, description, status, priority, due_date, tags) VALUES
    ('Design System Update', 'Update the design system components with new brand colors and typography', 'In Progress', 'High', CURRENT_DATE + INTERVAL '7 days', ARRAY['design', 'ui']),
    ('API Documentation', 'Write comprehensive API documentation for the new endpoints', 'To Do', 'Medium', CURRENT_DATE + INTERVAL '14 days', ARRAY['documentation', 'api']),
    ('Bug Fixes - Dashboard', 'Fix critical bugs reported in the analytics dashboard', 'In Progress', 'Urgent', CURRENT_DATE + INTERVAL '3 days', ARRAY['bug', 'dashboard']),
    ('Performance Optimization', 'Optimize database queries for faster load times', 'To Do', 'High', CURRENT_DATE + INTERVAL '10 days', ARRAY['performance', 'backend']),
    ('Mobile Responsive Design', 'Make all pages fully responsive for mobile devices', 'Review', 'Medium', CURRENT_DATE + INTERVAL '5 days', ARRAY['mobile', 'responsive']),
    ('User Onboarding Flow', 'Create new user onboarding experience with guided tour', 'To Do', 'Low', CURRENT_DATE + INTERVAL '21 days', ARRAY['onboarding', 'ux']),
    ('Security Audit', 'Conduct security audit and implement recommendations', 'In Progress', 'Urgent', CURRENT_DATE + INTERVAL '2 days', ARRAY['security', 'audit']),
    ('Employee Training Module', 'Develop interactive training module for new employees', 'To Do', 'Medium', CURRENT_DATE + INTERVAL '30 days', ARRAY['training', 'hr']),
    ('Report Generation Feature', 'Build automated report generation system', 'Review', 'High', CURRENT_DATE + INTERVAL '8 days', ARRAY['reports', 'feature']),
    ('Integration Testing', 'Complete integration testing for all new features', 'Done', 'High', CURRENT_DATE - INTERVAL '2 days', ARRAY['testing', 'qa']),
    ('Localization Support', 'Add multi-language support for Hindi and Tamil', 'To Do', 'Low', CURRENT_DATE + INTERVAL '45 days', ARRAY['i18n', 'localization']),
    ('Backup System Implementation', 'Implement automated backup system for data protection', 'In Progress', 'High', CURRENT_DATE + INTERVAL '6 days', ARRAY['backup', 'infrastructure']);

-- ============================================
-- SECTION 9: SEED DATA - CALENDAR EVENTS
-- ============================================
INSERT INTO public.calendar_events (title, description, start_date, end_date, all_day, type, color) VALUES
    ('Team Standup', 'Daily team standup meeting', NOW()::DATE + TIME '09:30:00', NOW()::DATE + TIME '10:00:00', FALSE, 'meeting', '#4f46e5'),
    ('Sprint Planning', 'Bi-weekly sprint planning session', NOW()::DATE + INTERVAL '2 days' + TIME '10:00:00', NOW()::DATE + INTERVAL '2 days' + TIME '12:00:00', FALSE, 'meeting', '#10b981'),
    ('Product Review', 'Monthly product review with stakeholders', NOW()::DATE + INTERVAL '5 days' + TIME '14:00:00', NOW()::DATE + INTERVAL '5 days' + TIME '16:00:00', FALSE, 'meeting', '#f59e0b'),
    ('Team Building Event', 'Quarterly team building activity', NOW()::DATE + INTERVAL '10 days', NOW()::DATE + INTERVAL '10 days', TRUE, 'event', '#ec4899'),
    ('Training Session', 'New technology training for engineering team', NOW()::DATE + INTERVAL '7 days' + TIME '11:00:00', NOW()::DATE + INTERVAL '7 days' + TIME '13:00:00', FALSE, 'training', '#8b5cf6'),
    ('Performance Reviews', 'Q4 performance review meetings', NOW()::DATE + INTERVAL '14 days', NOW()::DATE + INTERVAL '16 days', TRUE, 'deadline', '#ef4444'),
    ('Client Presentation', 'Quarterly business review with clients', NOW()::DATE + INTERVAL '8 days' + TIME '15:00:00', NOW()::DATE + INTERVAL '8 days' + TIME '17:00:00', FALSE, 'meeting', '#3b82f6'),
    ('Code Review Session', 'Weekly code review for quality assurance', NOW()::DATE + INTERVAL '3 days' + TIME '14:00:00', NOW()::DATE + INTERVAL '3 days' + TIME '15:30:00', FALSE, 'meeting', '#6366f1');

-- ============================================
-- SECTION 10: SEED DATA - SUPPORT TICKETS
-- ============================================
INSERT INTO public.support_tickets (title, description, category, priority, status) VALUES
    ('Cannot access employee dashboard', 'Getting 403 error when trying to access the employee dashboard after login', 'technical', 'high', 'open'),
    ('Leave balance not updating', 'Applied leave got approved but balance is not reflecting correctly', 'bug', 'medium', 'in_progress'),
    ('Request for new laptop', 'Current laptop is 4 years old and running slow, requesting upgrade', 'it_equipment', 'low', 'open'),
    ('Salary slip not generated', 'November salary slip is not visible in the system', 'payroll', 'high', 'resolved'),
    ('Need VPN access', 'Requesting VPN access for work from home setup', 'access', 'medium', 'in_progress'),
    ('Training enrollment issue', 'Unable to enroll in the AWS certification training program', 'training', 'low', 'open'),
    ('Calendar sync not working', 'Google Calendar integration stopped syncing events', 'integration', 'medium', 'open'),
    ('Password reset not working', 'Not receiving password reset emails', 'authentication', 'urgent', 'in_progress');

-- ============================================
-- SECTION 11: FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
    BEFORE UPDATE ON public.calendar_events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
    BEFORE UPDATE ON public.leave_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON public.time_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SECTION 12: INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_employees_email ON public.employees(email);
CREATE INDEX idx_employees_department ON public.employees(department);
CREATE INDEX idx_employees_user_id ON public.employees(user_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_leave_requests_employee ON public.leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX idx_time_entries_employee ON public.time_entries(employee_id);
CREATE INDEX idx_time_entries_date ON public.time_entries(date);
CREATE INDEX idx_calendar_events_dates ON public.calendar_events(start_date, end_date);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);

-- ============================================
-- AURORA EMS DATABASE SETUP COMPLETE
-- ============================================
-- 
-- Summary:
-- - 17 Tables created
-- - Row Level Security enabled on all tables
-- - 34 RLS policies created
-- - 7 Leave types seeded
-- - 22 Holidays seeded (India 2024-2025)
-- - 19 Employees seeded (Indian names)
-- - 12 Tasks seeded
-- - 8 Calendar events seeded
-- - 8 Support tickets seeded
-- - Auto-update triggers for updated_at columns
-- - Performance indexes created
--
-- Default Admin: admin@gmail.com (link to auth.users)
-- ============================================
