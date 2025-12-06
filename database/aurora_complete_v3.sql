-- ============================================
-- AURORA EMS - COMPLETE ONE-SHOT DATABASE SETUP
-- Version: 3.0 | Date: 2024-12-07
-- ALL FEATURES INCLUDED
-- ============================================

-- SECTION 1: DROP ALL TABLES
DROP TABLE IF EXISTS public.onboarding_tasks CASCADE;
DROP TABLE IF EXISTS public.onboarding_workflows CASCADE;
DROP TABLE IF EXISTS public.assets CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.training_enrollments CASCADE;
DROP TABLE IF EXISTS public.trainings CASCADE;
DROP TABLE IF EXISTS public.payroll_records CASCADE;
DROP TABLE IF EXISTS public.performance_reviews CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
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

-- SECTION 2: CREATE ALL TABLES

-- 1. EMPLOYEES (Extended)
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
    location TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    salary NUMERIC(12, 2) DEFAULT 0,
    performance_score NUMERIC(3, 1) DEFAULT 0,
    employment_type TEXT DEFAULT 'Full-time',
    manager TEXT,
    projects_completed INTEGER DEFAULT 0,
    bank_details JSONB DEFAULT NULL,
    education JSONB DEFAULT '[]'::jsonb,
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

-- 3. CALENDAR EVENTS (Enhanced)
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
    theme TEXT DEFAULT 'system',
    accent_color TEXT DEFAULT 'indigo',
    compact_mode BOOLEAN DEFAULT FALSE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    task_reminders BOOLEAN DEFAULT TRUE,
    leave_updates BOOLEAN DEFAULT TRUE,
    system_updates BOOLEAN DEFAULT TRUE,
    weekly_reports BOOLEAN DEFAULT FALSE,
    mention_notifications BOOLEAN DEFAULT TRUE,
    new_employee_alerts BOOLEAN DEFAULT TRUE,
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Asia/Kolkata',
    date_format TEXT DEFAULT 'DD/MM/YYYY',
    time_format TEXT DEFAULT '12h',
    start_of_week TEXT DEFAULT 'monday',
    auto_backup BOOLEAN DEFAULT TRUE,
    data_retention TEXT DEFAULT '3years',
    two_factor_auth BOOLEAN DEFAULT FALSE,
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

-- 18. ANNOUNCEMENTS
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    priority TEXT DEFAULT 'normal',
    is_pinned BOOLEAN DEFAULT FALSE,
    target_departments TEXT[],
    target_roles TEXT[],
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. PERFORMANCE REVIEWS
CREATE TABLE public.performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    review_period TEXT NOT NULL,
    overall_rating NUMERIC(3, 1),
    goals_met INTEGER DEFAULT 0,
    goals_total INTEGER DEFAULT 0,
    strengths TEXT[],
    improvements TEXT[],
    comments TEXT,
    status TEXT DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. PAYROLL RECORDS
CREATE TABLE public.payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    basic_salary NUMERIC(12, 2) DEFAULT 0,
    allowances JSONB DEFAULT '{}',
    deductions JSONB DEFAULT '{}',
    overtime_pay NUMERIC(12, 2) DEFAULT 0,
    bonus NUMERIC(12, 2) DEFAULT 0,
    gross_pay NUMERIC(12, 2) DEFAULT 0,
    net_pay NUMERIC(12, 2) DEFAULT 0,
    status TEXT DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. TRAININGS
CREATE TABLE public.trainings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    instructor TEXT,
    duration_hours INTEGER DEFAULT 1,
    start_date DATE,
    end_date DATE,
    max_participants INTEGER,
    location TEXT,
    is_mandatory BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. TRAINING ENROLLMENTS
CREATE TABLE public.training_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    training_id UUID NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'enrolled',
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    certificate_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(training_id, employee_id)
);

-- 23. EXPENSES
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    description TEXT,
    receipt_url TEXT,
    expense_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'pending',
    approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. ASSETS
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    asset_tag TEXT UNIQUE,
    category TEXT DEFAULT 'equipment',
    description TEXT,
    purchase_date DATE,
    purchase_cost NUMERIC(12, 2),
    current_value NUMERIC(12, 2),
    status TEXT DEFAULT 'available',
    assigned_to UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ,
    location TEXT,
    warranty_expiry DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. ONBOARDING WORKFLOWS
CREATE TABLE public.onboarding_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    department TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. ONBOARDING TASKS
CREATE TABLE public.onboarding_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES public.onboarding_workflows(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    assigned_to UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    due_days INTEGER DEFAULT 7,
    due_date DATE,
    status TEXT DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SECTION 3: ENABLE RLS ON ALL TABLES
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
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;

-- SECTION 4: RLS POLICIES (Full Access for Authenticated Users)
CREATE POLICY "full_access" ON public.employees FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.calendar_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.holidays FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.leave_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.leave_balances FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.leave_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.time_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.work_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.overtime_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.timesheet_periods FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.notification_preferences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.user_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.employee_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.employee_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.support_tickets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.performance_reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.payroll_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.trainings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.training_enrollments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.onboarding_workflows FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.onboarding_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SECTION 5: SEED DATA
INSERT INTO public.leave_types (name, description, color, default_days) VALUES
    ('Annual Leave', 'Paid vacation days', '#10b981', 20),
    ('Sick Leave', 'Medical leave', '#ef4444', 12),
    ('Personal Leave', 'Personal matters', '#f59e0b', 5),
    ('Maternity Leave', 'Maternity leave', '#ec4899', 180),
    ('Paternity Leave', 'Paternity leave', '#8b5cf6', 15),
    ('Unpaid Leave', 'Leave without pay', '#6b7280', 0),
    ('Compensatory Off', 'Comp-off days', '#3b82f6', 0);

INSERT INTO public.holidays (name, date, description, is_recurring) VALUES
    ('New Year', '2025-01-01', 'New Year', TRUE),
    ('Republic Day', '2025-01-26', 'Republic Day of India', TRUE),
    ('Holi', '2025-03-14', 'Festival of Colors', FALSE),
    ('Independence Day', '2025-08-15', 'Independence Day', TRUE),
    ('Gandhi Jayanti', '2025-10-02', 'Gandhi Jayanti', TRUE),
    ('Diwali', '2025-10-20', 'Festival of Lights', FALSE),
    ('Christmas', '2025-12-25', 'Christmas Day', TRUE);

INSERT INTO public.employees (name, email, department, role, status, phone, address, join_date, salary, performance_score, gender, employment_type, location) VALUES
    ('Sunil Gumatimath', 'admin@gmail.com', 'IT', 'Admin', 'Active', '+91 98765 43210', 'Bengaluru, Karnataka', '2022-01-15', 150000, 4.8, 'male', 'Full-time', 'Bengaluru'),
    ('Priya Sharma', 'priya.sharma@aurora.com', 'Human Resources', 'Manager', 'Active', '+91 98765 11111', 'Mumbai', '2022-03-10', 120000, 4.7, 'female', 'Full-time', 'Mumbai'),
    ('Rajesh Kumar', 'rajesh.kumar@aurora.com', 'Engineering', 'Manager', 'Active', '+91 98765 22222', 'Delhi', '2022-02-20', 130000, 4.5, 'male', 'Full-time', 'Delhi'),
    ('Ananya Iyer', 'ananya.iyer@aurora.com', 'Design', 'Manager', 'Active', '+91 98765 33333', 'Chennai', '2022-04-05', 115000, 4.6, 'female', 'Full-time', 'Chennai'),
    ('Vikram Reddy', 'vikram.reddy@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98765 44444', 'Hyderabad', '2023-01-10', 85000, 4.2, 'male', 'Full-time', 'Hyderabad'),
    ('Sneha Patel', 'sneha.patel@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98765 55555', 'Ahmedabad', '2023-02-15', 82000, 4.0, 'female', 'Full-time', 'Ahmedabad');

INSERT INTO public.tasks (title, description, status, priority, due_date, tags) VALUES
    ('Design System Update', 'Update design system components', 'In Progress', 'High', CURRENT_DATE + 7, ARRAY['design', 'ui']),
    ('API Documentation', 'Write API documentation', 'To Do', 'Medium', CURRENT_DATE + 14, ARRAY['docs', 'api']),
    ('Bug Fixes', 'Fix dashboard bugs', 'In Progress', 'Urgent', CURRENT_DATE + 3, ARRAY['bug', 'dashboard']),
    ('Performance Optimization', 'Optimize database queries', 'To Do', 'High', CURRENT_DATE + 10, ARRAY['performance']);

INSERT INTO public.trainings (title, description, category, instructor, duration_hours, start_date, is_mandatory) VALUES
    ('React Fundamentals', 'Learn React basics', 'technical', 'John Doe', 16, CURRENT_DATE + 7, TRUE),
    ('Leadership Skills', 'Management training', 'soft-skills', 'Jane Smith', 8, CURRENT_DATE + 14, FALSE);

INSERT INTO public.announcements (title, content, type, priority, is_pinned, published_at) VALUES
    ('Welcome to Aurora EMS', 'Welcome to our new employee management system!', 'general', 'high', TRUE, NOW()),
    ('Holiday Schedule 2025', 'Please check the updated holiday schedule for 2025.', 'info', 'normal', FALSE, NOW());

INSERT INTO public.onboarding_workflows (name, description, department, is_active) VALUES
    ('Engineering Onboarding', 'Onboarding workflow for engineering team', 'Engineering', TRUE),
    ('General Onboarding', 'Standard onboarding for all departments', NULL, TRUE);

-- SECTION 6: FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON public.time_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SECTION 7: INDEXES
CREATE INDEX idx_employees_email ON public.employees(email);
CREATE INDEX idx_employees_department ON public.employees(department);
CREATE INDEX idx_employees_user_id ON public.employees(user_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_leave_requests_employee ON public.leave_requests(employee_id);
CREATE INDEX idx_time_entries_employee ON public.time_entries(employee_id);
CREATE INDEX idx_time_entries_date ON public.time_entries(date);
CREATE INDEX idx_calendar_events_date ON public.calendar_events(date);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_payroll_employee ON public.payroll_records(employee_id);
CREATE INDEX idx_expenses_employee ON public.expenses(employee_id);
CREATE INDEX idx_assets_assigned ON public.assets(assigned_to);

-- ============================================
-- AURORA EMS v3.0 - COMPLETE SETUP DONE!
-- 26 Tables | All Features | Ready to Use
-- ============================================
