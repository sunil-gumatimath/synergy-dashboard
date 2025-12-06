-- ============================================
-- AURORA EMS - COMPLETE DATABASE SETUP
-- Version: 4.0 | Date: 2024-12-07
-- One-shot SQL with ALL features & rich data
-- ============================================

-- SECTION 1: DROP ALL EXISTING TABLES
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

-- ============================================
-- SECTION 2: CREATE ALL TABLES (26 Tables)
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

-- 3. CALENDAR EVENTS
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
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECTION 4: RLS POLICIES (Full Access)
-- ============================================
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
    ('Compensatory Off', 'Leave earned for working on holidays/weekends', '#3b82f6', 0),
    ('Bereavement Leave', 'Leave for family emergencies', '#64748b', 5);

-- ============================================
-- SECTION 6: SEED DATA - HOLIDAYS 2025
-- ============================================
INSERT INTO public.holidays (name, date, description, is_recurring) VALUES
    ('New Year', '2025-01-01', 'New Year Celebration', TRUE),
    ('Pongal', '2025-01-14', 'Harvest Festival', FALSE),
    ('Republic Day', '2025-01-26', 'Republic Day of India', TRUE),
    ('Maha Shivaratri', '2025-02-26', 'Lord Shiva Festival', FALSE),
    ('Holi', '2025-03-14', 'Festival of Colors', FALSE),
    ('Good Friday', '2025-04-18', 'Good Friday', FALSE),
    ('Dr. Ambedkar Jayanti', '2025-04-14', 'Dr. B.R. Ambedkar Birthday', TRUE),
    ('May Day', '2025-05-01', 'International Workers Day', TRUE),
    ('Buddha Purnima', '2025-05-12', 'Birth of Lord Buddha', FALSE),
    ('Eid ul-Fitr', '2025-03-31', 'End of Ramadan', FALSE),
    ('Eid ul-Adha', '2025-06-07', 'Festival of Sacrifice', FALSE),
    ('Independence Day', '2025-08-15', 'Independence Day of India', TRUE),
    ('Janmashtami', '2025-08-16', 'Birth of Lord Krishna', FALSE),
    ('Ganesh Chaturthi', '2025-08-27', 'Lord Ganesha Festival', FALSE),
    ('Onam', '2025-09-05', 'Kerala Harvest Festival', FALSE),
    ('Gandhi Jayanti', '2025-10-02', 'Mahatma Gandhi Birthday', TRUE),
    ('Dussehra', '2025-10-02', 'Victory of Good over Evil', FALSE),
    ('Diwali', '2025-10-20', 'Festival of Lights', FALSE),
    ('Bhai Dooj', '2025-10-22', 'Brother-Sister Festival', FALSE),
    ('Guru Nanak Jayanti', '2025-11-05', 'Birth of Guru Nanak', FALSE),
    ('Christmas', '2025-12-25', 'Christmas Day', TRUE);

-- ============================================
-- SECTION 7: SEED DATA - 35 EMPLOYEES
-- ============================================
INSERT INTO public.employees (name, email, department, role, status, phone, address, location, join_date, salary, performance_score, gender, employment_type, manager, projects_completed, bank_details, education) VALUES
    -- Admin & Managers
    ('Sunil Gumatimath', 'admin@gmail.com', 'IT', 'Admin', 'Active', '+91 98765 43210', 'Koramangala, Bengaluru', 'Bengaluru', '2022-01-15', 180000, 4.9, 'male', 'Full-time', NULL, 45, '{"bankName":"State Bank of India","accountNumber":"XXXX1234","ifscCode":"SBIN0001234","branch":"Koramangala"}'::jsonb, '[{"degree":"M.Tech Computer Science","institution":"IIT Bangalore","year":"2015","grade":"9.2 CGPA"},{"degree":"B.Tech IT","institution":"NIT Surathkal","year":"2013","grade":"8.8 CGPA"}]'::jsonb),
    ('Priya Sharma', 'priya.sharma@aurora.com', 'Human Resources', 'Manager', 'Active', '+91 98765 11111', 'Andheri West, Mumbai', 'Mumbai', '2022-03-10', 140000, 4.7, 'female', 'Full-time', 'Sunil Gumatimath', 32, '{"bankName":"HDFC Bank","accountNumber":"XXXX5678","ifscCode":"HDFC0001234","branch":"Andheri"}'::jsonb, '[{"degree":"MBA HR","institution":"XLRI Jamshedpur","year":"2018","grade":"A"}]'::jsonb),
    ('Rajesh Kumar', 'rajesh.kumar@aurora.com', 'Engineering', 'Manager', 'Active', '+91 98765 22222', 'Connaught Place, Delhi', 'Delhi', '2022-02-20', 155000, 4.6, 'male', 'Full-time', 'Sunil Gumatimath', 38, NULL, NULL),
    ('Ananya Iyer', 'ananya.iyer@aurora.com', 'Design', 'Manager', 'Active', '+91 98765 33333', 'T. Nagar, Chennai', 'Chennai', '2022-04-05', 135000, 4.8, 'female', 'Full-time', 'Sunil Gumatimath', 28, NULL, NULL),
    ('Sanjay Joshi', 'sanjay.joshi@aurora.com', 'Finance', 'Manager', 'Active', '+91 98764 55555', 'Worli, Mumbai', 'Mumbai', '2022-06-15', 145000, 4.5, 'male', 'Full-time', 'Sunil Gumatimath', 22, NULL, NULL),
    ('Deepika Nair', 'deepika.nair@aurora.com', 'Marketing', 'Manager', 'Active', '+91 98765 12345', 'Indiranagar, Bengaluru', 'Bengaluru', '2022-05-01', 130000, 4.6, 'female', 'Full-time', 'Sunil Gumatimath', 25, NULL, NULL),
    
    -- Engineering Team
    ('Vikram Reddy', 'vikram.reddy@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98765 44444', 'Gachibowli, Hyderabad', 'Hyderabad', '2023-01-10', 95000, 4.3, 'male', 'Full-time', 'Rajesh Kumar', 18, NULL, '[{"degree":"B.Tech CSE","institution":"JNTU Hyderabad","year":"2022","grade":"8.5 CGPA"}]'::jsonb),
    ('Sneha Patel', 'sneha.patel@aurora.com', 'Marketing', 'Employee', 'Active', '+91 98765 55555', 'SG Highway, Ahmedabad', 'Ahmedabad', '2023-02-15', 72000, 4.1, 'female', 'Full-time', 'Deepika Nair', 12, NULL, NULL),
    ('Arjun Nair', 'arjun.nair@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98765 66666', 'Marine Drive, Kochi', 'Kochi', '2023-03-20', 98000, 4.4, 'male', 'Full-time', 'Rajesh Kumar', 20, NULL, NULL),
    ('Kavitha Menon', 'kavitha.menon@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98765 77777', 'Technopark, Trivandrum', 'Trivandrum', '2023-05-10', 88000, 4.0, 'female', 'Full-time', 'Rajesh Kumar', 14, NULL, NULL),
    ('Amit Singh', 'amit.singh@aurora.com', 'Human Resources', 'Employee', 'Active', '+91 98764 11111', 'C-Scheme, Jaipur', 'Jaipur', '2023-07-01', 72000, 3.9, 'male', 'Full-time', 'Priya Sharma', 8, NULL, NULL),
    ('Divya Gupta', 'divya.gupta@aurora.com', 'Human Resources', 'Employee', 'Active', '+91 98764 22222', 'Gomti Nagar, Lucknow', 'Lucknow', '2023-08-10', 75000, 4.1, 'female', 'Full-time', 'Priya Sharma', 10, NULL, NULL),
    
    -- Design Team
    ('Rohit Verma', 'rohit.verma@aurora.com', 'Design', 'Employee', 'Active', '+91 98765 88888', 'Koregaon Park, Pune', 'Pune', '2023-04-01', 82000, 4.2, 'male', 'Full-time', 'Ananya Iyer', 15, NULL, NULL),
    ('Meera Krishnan', 'meera.krishnan@aurora.com', 'Design', 'Employee', 'Active', '+91 98765 99999', 'HSR Layout, Bengaluru', 'Bengaluru', '2023-06-15', 78000, 4.5, 'female', 'Full-time', 'Ananya Iyer', 16, NULL, NULL),
    ('Aditya Kapoor', 'aditya.kapoor@aurora.com', 'Design', 'Employee', 'Active', '+91 98766 11111', 'Saket, Delhi', 'Delhi', '2023-09-01', 75000, 4.0, 'male', 'Full-time', 'Ananya Iyer', 11, NULL, NULL),
    
    -- Marketing Team
    ('Karthik Sundaram', 'karthik.sundaram@aurora.com', 'Marketing', 'Employee', 'Active', '+91 98764 33333', 'Adyar, Chennai', 'Chennai', '2023-09-05', 76000, 4.3, 'male', 'Full-time', 'Deepika Nair', 13, NULL, NULL),
    ('Nisha Agarwal', 'nisha.agarwal@aurora.com', 'Marketing', 'Employee', 'Active', '+91 98764 44444', 'Salt Lake, Kolkata', 'Kolkata', '2023-10-01', 78000, 4.2, 'female', 'Full-time', 'Deepika Nair', 14, NULL, NULL),
    ('Rahul Bansal', 'rahul.bansal@aurora.com', 'Marketing', 'Employee', 'Active', '+91 98766 22222', 'Sector 18, Noida', 'Noida', '2024-01-15', 70000, 3.8, 'male', 'Full-time', 'Deepika Nair', 6, NULL, NULL),
    
    -- Finance Team
    ('Pooja Desai', 'pooja.desai@aurora.com', 'Finance', 'Employee', 'Active', '+91 98764 66666', 'Varachha, Surat', 'Surat', '2023-11-01', 82000, 4.1, 'female', 'Full-time', 'Sanjay Joshi', 9, NULL, NULL),
    ('Manish Trivedi', 'manish.trivedi@aurora.com', 'Finance', 'Employee', 'Active', '+91 98766 33333', 'Navrangpura, Ahmedabad', 'Ahmedabad', '2023-12-01', 78000, 4.0, 'male', 'Full-time', 'Sanjay Joshi', 7, NULL, NULL),
    ('Swati Kulkarni', 'swati.kulkarni@aurora.com', 'Finance', 'Employee', 'Active', '+91 98766 44444', 'FC Road, Pune', 'Pune', '2024-02-01', 72000, 3.9, 'female', 'Full-time', 'Sanjay Joshi', 5, NULL, NULL),
    
    -- Operations Team
    ('Manoj Pillai', 'manoj.pillai@aurora.com', 'Operations', 'Employee', 'Active', '+91 98764 77777', 'MG Road, Kochi', 'Kochi', '2023-12-01', 74000, 3.8, 'male', 'Full-time', 'Priya Sharma', 8, NULL, NULL),
    ('Lakshmi Rao', 'lakshmi.rao@aurora.com', 'Operations', 'Employee', 'Active', '+91 98764 88888', 'Beach Road, Vizag', 'Visakhapatnam', '2024-01-10', 70000, 4.0, 'female', 'Full-time', 'Priya Sharma', 6, NULL, NULL),
    ('Suresh Babu', 'suresh.babu@aurora.com', 'Operations', 'Employee', 'Active', '+91 98766 55555', 'Anna Nagar, Chennai', 'Chennai', '2024-03-01', 68000, 3.7, 'male', 'Full-time', 'Priya Sharma', 4, NULL, NULL),
    
    -- IT Support Team
    ('Ramesh Yadav', 'ramesh.yadav@aurora.com', 'IT', 'Employee', 'Active', '+91 98766 66666', 'Whitefield, Bengaluru', 'Bengaluru', '2023-08-15', 85000, 4.2, 'male', 'Full-time', 'Sunil Gumatimath', 16, NULL, NULL),
    ('Priyanka Das', 'priyanka.das@aurora.com', 'IT', 'Employee', 'Active', '+91 98766 77777', 'Park Street, Kolkata', 'Kolkata', '2023-09-20', 82000, 4.1, 'female', 'Full-time', 'Sunil Gumatimath', 14, NULL, NULL),
    ('Venkat Raman', 'venkat.raman@aurora.com', 'IT', 'Employee', 'Active', '+91 98766 88888', 'Velachery, Chennai', 'Chennai', '2024-01-05', 78000, 3.9, 'male', 'Full-time', 'Sunil Gumatimath', 8, NULL, NULL),
    
    -- More Engineering
    ('Neha Saxena', 'neha.saxena@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98766 99999', 'Banjara Hills, Hyderabad', 'Hyderabad', '2024-02-15', 92000, 4.4, 'female', 'Full-time', 'Rajesh Kumar', 10, NULL, NULL),
    ('Siddharth Malhotra', 'siddharth.malhotra@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98767 11111', 'Cyber City, Gurugram', 'Gurugram', '2024-03-10', 96000, 4.3, 'male', 'Full-time', 'Rajesh Kumar', 9, NULL, NULL),
    ('Tanvi Sharma', 'tanvi.sharma@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98767 22222', 'Electronic City, Bengaluru', 'Bengaluru', '2024-04-01', 88000, 4.1, 'female', 'Full-time', 'Rajesh Kumar', 7, NULL, NULL),
    
    -- Contract & Part-time
    ('Akash Mehta', 'akash.mehta@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98767 33333', 'Powai, Mumbai', 'Mumbai', '2024-05-01', 75000, 3.8, 'male', 'Contract', 'Rajesh Kumar', 3, NULL, NULL),
    ('Shreya Reddy', 'shreya.reddy@aurora.com', 'Design', 'Employee', 'Active', '+91 98767 44444', 'Jubilee Hills, Hyderabad', 'Hyderabad', '2024-06-01', 60000, 3.9, 'female', 'Part-time', 'Ananya Iyer', 4, NULL, NULL),
    
    -- Interns
    ('Arun Prakash', 'arun.prakash@aurora.com', 'Engineering', 'Employee', 'Active', '+91 98767 55555', 'Madhapur, Hyderabad', 'Hyderabad', '2024-07-01', 35000, 3.5, 'male', 'Intern', 'Rajesh Kumar', 2, NULL, NULL),
    ('Ishita Jain', 'ishita.jain@aurora.com', 'Marketing', 'Employee', 'Active', '+91 98767 66666', 'DLF Phase 3, Gurugram', 'Gurugram', '2024-07-15', 32000, 3.6, 'female', 'Intern', 'Deepika Nair', 1, NULL, NULL),
    
    -- Inactive/On Leave
    ('Rahul Mehta', 'rahul.mehta@aurora.com', 'Engineering', 'Employee', 'Inactive', '+91 98764 99999', 'Vijay Nagar, Indore', 'Indore', '2022-08-01', 85000, 3.5, 'male', 'Full-time', 'Rajesh Kumar', 15, NULL, NULL),
    ('Anita Bose', 'anita.bose@aurora.com', 'Human Resources', 'Employee', 'On Leave', '+91 98767 77777', 'Ballygunge, Kolkata', 'Kolkata', '2023-04-15', 72000, 4.0, 'female', 'Full-time', 'Priya Sharma', 9, NULL, NULL);

-- ============================================
-- SECTION 8: SEED DATA - TASKS (20+ Tasks)
-- ============================================
INSERT INTO public.tasks (title, description, status, priority, due_date, tags) VALUES
    ('Design System Update', 'Update the design system components with new brand colors and typography', 'In Progress', 'High', CURRENT_DATE + 7, ARRAY['design', 'ui', 'branding']),
    ('API Documentation', 'Write comprehensive API documentation for all REST endpoints', 'To Do', 'Medium', CURRENT_DATE + 14, ARRAY['documentation', 'api', 'backend']),
    ('Bug Fixes - Dashboard', 'Fix critical bugs reported in the analytics dashboard', 'In Progress', 'Urgent', CURRENT_DATE + 3, ARRAY['bug', 'dashboard', 'analytics']),
    ('Performance Optimization', 'Optimize database queries for faster load times', 'To Do', 'High', CURRENT_DATE + 10, ARRAY['performance', 'database', 'backend']),
    ('Mobile Responsive Design', 'Make all pages fully responsive for mobile devices', 'Review', 'Medium', CURRENT_DATE + 5, ARRAY['mobile', 'responsive', 'frontend']),
    ('User Onboarding Flow', 'Create new user onboarding experience with guided tour', 'To Do', 'Low', CURRENT_DATE + 21, ARRAY['onboarding', 'ux', 'feature']),
    ('Security Audit', 'Conduct security audit and implement recommendations', 'In Progress', 'Urgent', CURRENT_DATE + 2, ARRAY['security', 'audit', 'compliance']),
    ('Employee Training Module', 'Develop interactive training module for new employees', 'To Do', 'Medium', CURRENT_DATE + 30, ARRAY['training', 'hr', 'learning']),
    ('Report Generation Feature', 'Build automated report generation system with PDF export', 'Review', 'High', CURRENT_DATE + 8, ARRAY['reports', 'feature', 'pdf']),
    ('Integration Testing', 'Complete integration testing for all new features', 'Done', 'High', CURRENT_DATE - 2, ARRAY['testing', 'qa', 'integration']),
    ('Localization Support', 'Add multi-language support for Hindi, Tamil, and Telugu', 'To Do', 'Low', CURRENT_DATE + 45, ARRAY['i18n', 'localization', 'languages']),
    ('Backup System Implementation', 'Implement automated backup system for data protection', 'In Progress', 'High', CURRENT_DATE + 6, ARRAY['backup', 'infrastructure', 'devops']),
    ('Email Template Redesign', 'Redesign all transactional email templates', 'To Do', 'Medium', CURRENT_DATE + 12, ARRAY['email', 'design', 'templates']),
    ('Payment Gateway Integration', 'Integrate Razorpay payment gateway for payroll', 'In Progress', 'High', CURRENT_DATE + 15, ARRAY['payments', 'integration', 'razorpay']),
    ('Push Notifications', 'Implement push notifications for mobile and web', 'To Do', 'Medium', CURRENT_DATE + 20, ARRAY['notifications', 'mobile', 'pwa']),
    ('Dark Mode Theme', 'Implement dark mode theme across the application', 'Review', 'Low', CURRENT_DATE + 4, ARRAY['theme', 'dark-mode', 'ui']),
    ('Calendar Sync', 'Add Google Calendar and Outlook sync functionality', 'To Do', 'Medium', CURRENT_DATE + 25, ARRAY['calendar', 'integration', 'sync']),
    ('Employee Self-Service Portal', 'Build self-service portal for employees', 'In Progress', 'High', CURRENT_DATE + 18, ARRAY['portal', 'self-service', 'feature']),
    ('Analytics Dashboard V2', 'Create new analytics dashboard with advanced charts', 'To Do', 'High', CURRENT_DATE + 35, ARRAY['analytics', 'dashboard', 'charts']),
    ('Audit Log System', 'Implement comprehensive audit logging for all actions', 'Done', 'Medium', CURRENT_DATE - 5, ARRAY['audit', 'logging', 'security']);

-- ============================================
-- SECTION 9: SEED DATA - CALENDAR EVENTS
-- ============================================
INSERT INTO public.calendar_events (title, description, date, time, end_time, type, location, is_all_day, color, recurrence) VALUES
    ('Daily Standup', 'Daily team standup meeting', CURRENT_DATE, '09:30', '10:00', 'meeting', 'Virtual - Google Meet', FALSE, '#4f46e5', 'daily'),
    ('Sprint Planning', 'Bi-weekly sprint planning session', CURRENT_DATE + 2, '10:00', '12:00', 'meeting', 'Conference Room A', FALSE, '#10b981', 'none'),
    ('Product Review', 'Monthly product review with stakeholders', CURRENT_DATE + 5, '14:00', '16:00', 'meeting', 'Board Room', FALSE, '#f59e0b', 'monthly'),
    ('Team Building Event', 'Quarterly team building activity', CURRENT_DATE + 10, NULL, NULL, 'event', 'Outdoor Venue', TRUE, '#ec4899', 'none'),
    ('Tech Training', 'React Advanced Patterns training', CURRENT_DATE + 7, '11:00', '13:00', 'training', 'Training Room', FALSE, '#8b5cf6', 'none'),
    ('Performance Reviews', 'Q4 performance review meetings', CURRENT_DATE + 14, NULL, NULL, 'deadline', 'HR Department', TRUE, '#ef4444', 'none'),
    ('Client Presentation', 'Quarterly business review with clients', CURRENT_DATE + 8, '15:00', '17:00', 'meeting', 'Virtual - Zoom', FALSE, '#3b82f6', 'none'),
    ('Code Review Session', 'Weekly code review for quality assurance', CURRENT_DATE + 3, '14:00', '15:30', 'meeting', 'Dev Room', FALSE, '#6366f1', 'weekly'),
    ('Design Review', 'UI/UX design review meeting', CURRENT_DATE + 4, '11:00', '12:00', 'meeting', 'Design Studio', FALSE, '#14b8a6', 'weekly'),
    ('All Hands Meeting', 'Monthly all-hands company meeting', CURRENT_DATE + 15, '16:00', '17:30', 'meeting', 'Auditorium', FALSE, '#f97316', 'monthly'),
    ('Priya Sharma Birthday', 'Birthday celebration', CURRENT_DATE + 12, NULL, NULL, 'birthday', 'Cafeteria', TRUE, '#ec4899', 'yearly'),
    ('Work Anniversary - Vikram', '2 Years at Aurora', CURRENT_DATE + 8, NULL, NULL, 'anniversary', NULL, TRUE, '#f59e0b', 'yearly'),
    ('Release v2.5', 'Product release deadline', CURRENT_DATE + 20, NULL, NULL, 'deadline', NULL, TRUE, '#ef4444', 'none'),
    ('Team Lunch', 'Monthly team lunch outing', CURRENT_DATE + 18, '12:30', '14:00', 'event', 'Nearby Restaurant', FALSE, '#22c55e', 'monthly');

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
    ('Password reset not working', 'Not receiving password reset emails', 'authentication', 'urgent', 'in_progress'),
    ('Expense reimbursement delayed', 'Submitted expense report 2 weeks ago, still pending', 'payroll', 'medium', 'open'),
    ('Access card not working', 'Office access card stopped working yesterday', 'access', 'high', 'resolved'),
    ('Printer issues', 'Unable to print from workstation, showing offline', 'it_equipment', 'low', 'open'),
    ('Meeting room booking conflict', 'Double booking issue in conference room B', 'general', 'medium', 'in_progress');

-- ============================================
-- SECTION 11: SEED DATA - TRAININGS
-- ============================================
INSERT INTO public.trainings (title, description, category, instructor, duration_hours, start_date, end_date, max_participants, location, is_mandatory, status) VALUES
    ('React Fundamentals', 'Learn React basics - components, hooks, and state management', 'technical', 'Rajesh Kumar', 16, CURRENT_DATE + 7, CURRENT_DATE + 9, 20, 'Training Room A', TRUE, 'upcoming'),
    ('Leadership Skills', 'Management and leadership training for team leads', 'soft-skills', 'External Trainer', 8, CURRENT_DATE + 14, CURRENT_DATE + 14, 15, 'Board Room', FALSE, 'upcoming'),
    ('AWS Cloud Essentials', 'Introduction to AWS services and cloud computing', 'technical', 'Sunil Gumatimath', 24, CURRENT_DATE + 21, CURRENT_DATE + 24, 25, 'Virtual', TRUE, 'upcoming'),
    ('Effective Communication', 'Business communication and presentation skills', 'soft-skills', 'Priya Sharma', 6, CURRENT_DATE + 10, CURRENT_DATE + 10, 30, 'Auditorium', FALSE, 'upcoming'),
    ('Node.js Advanced', 'Advanced Node.js patterns and microservices', 'technical', 'Arjun Nair', 20, CURRENT_DATE - 10, CURRENT_DATE - 7, 15, 'Training Room B', FALSE, 'completed'),
    ('Data Analytics', 'Introduction to data analytics with Python', 'technical', 'External Trainer', 16, CURRENT_DATE + 28, CURRENT_DATE + 30, 20, 'Virtual', FALSE, 'upcoming'),
    ('Workplace Safety', 'Mandatory workplace safety and compliance training', 'compliance', 'HR Team', 4, CURRENT_DATE + 5, CURRENT_DATE + 5, 50, 'Auditorium', TRUE, 'upcoming'),
    ('Agile Methodology', 'Scrum and Agile project management', 'soft-skills', 'External Trainer', 12, CURRENT_DATE + 35, CURRENT_DATE + 37, 25, 'Conference Room', FALSE, 'upcoming');

-- ============================================
-- SECTION 12: SEED DATA - ANNOUNCEMENTS
-- ============================================
INSERT INTO public.announcements (title, content, type, priority, is_pinned, target_departments, published_at, expires_at) VALUES
    ('Welcome to Aurora EMS 2.0', 'We are excited to announce the launch of Aurora EMS 2.0 with enhanced features including the new employee dashboard, improved leave management, and real-time notifications. Please explore the new features and share your feedback!', 'general', 'high', TRUE, NULL, NOW(), NOW() + INTERVAL '30 days'),
    ('Holiday Schedule 2025', 'Please check the updated holiday schedule for 2025 in the Calendar section. Note that some holidays may require advance leave application.', 'info', 'normal', FALSE, NULL, NOW(), NOW() + INTERVAL '365 days'),
    ('Annual Performance Reviews', 'Annual performance reviews will be conducted from December 15-31. Please ensure your goals and achievements are updated in the system.', 'important', 'high', TRUE, NULL, NOW(), NOW() + INTERVAL '45 days'),
    ('New Health Insurance Policy', 'We have upgraded our health insurance coverage. The new policy includes dental and vision care. Details have been sent to your email.', 'info', 'normal', FALSE, NULL, NOW(), NOW() + INTERVAL '60 days'),
    ('Office Renovation Notice', 'The 3rd floor will be under renovation from Jan 15-30. Teams on 3rd floor will be temporarily relocated to 2nd floor.', 'important', 'high', FALSE, ARRAY['Engineering', 'Design'], NOW(), NOW() + INTERVAL '60 days'),
    ('IT System Maintenance', 'Scheduled maintenance on Dec 10, 2024 from 2 AM to 6 AM IST. Some services may be unavailable during this time.', 'alert', 'high', TRUE, NULL, NOW(), NOW() + INTERVAL '7 days'),
    ('Employee Referral Bonus', 'Refer a friend and earn up to ₹50,000! Check the HR portal for open positions and referral guidelines.', 'general', 'normal', FALSE, NULL, NOW(), NOW() + INTERVAL '90 days'),
    ('Diwali Celebration', 'Join us for Diwali celebrations on Oct 20th at the office terrace. Traditional attire encouraged!', 'event', 'normal', FALSE, NULL, NOW(), NOW() + INTERVAL '320 days');

-- ============================================
-- SECTION 13: SEED DATA - ONBOARDING
-- ============================================
INSERT INTO public.onboarding_workflows (name, description, department, is_active) VALUES
    ('Engineering Onboarding', 'Complete onboarding workflow for engineering team members', 'Engineering', TRUE),
    ('General Onboarding', 'Standard onboarding workflow for all departments', NULL, TRUE),
    ('HR Onboarding', 'Onboarding workflow for HR team members', 'Human Resources', TRUE),
    ('Design Onboarding', 'Onboarding workflow for design team', 'Design', TRUE);

-- ============================================
-- SECTION 14: FUNCTIONS & TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON public.leave_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON public.time_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_performance_reviews_updated_at BEFORE UPDATE ON public.performance_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SECTION 15: INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_employees_email ON public.employees(email);
CREATE INDEX idx_employees_department ON public.employees(department);
CREATE INDEX idx_employees_status ON public.employees(status);
CREATE INDEX idx_employees_user_id ON public.employees(user_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_leave_requests_employee ON public.leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON public.leave_requests(start_date, end_date);
CREATE INDEX idx_time_entries_employee ON public.time_entries(employee_id);
CREATE INDEX idx_time_entries_date ON public.time_entries(date);
CREATE INDEX idx_calendar_events_date ON public.calendar_events(date);
CREATE INDEX idx_calendar_events_type ON public.calendar_events(type);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX idx_payroll_employee ON public.payroll_records(employee_id);
CREATE INDEX idx_expenses_employee ON public.expenses(employee_id);
CREATE INDEX idx_expenses_status ON public.expenses(status);
CREATE INDEX idx_assets_assigned ON public.assets(assigned_to);
CREATE INDEX idx_assets_status ON public.assets(status);
CREATE INDEX idx_trainings_status ON public.trainings(status);
CREATE INDEX idx_training_enrollments_employee ON public.training_enrollments(employee_id);
CREATE INDEX idx_announcements_published ON public.announcements(published_at);

-- ============================================
-- AURORA EMS v4.0 - DATABASE SETUP COMPLETE!
-- ============================================
-- 
-- Summary:
-- ✓ 26 Tables created
-- ✓ Row Level Security enabled on all tables
-- ✓ 26 RLS policies created
-- ✓ 8 Leave types seeded
-- ✓ 21 Holidays seeded (India 2025)
-- ✓ 35 Employees seeded with rich data
-- ✓ 20 Tasks seeded
-- ✓ 14 Calendar events seeded
-- ✓ 12 Support tickets seeded
-- ✓ 8 Trainings seeded
-- ✓ 8 Announcements seeded
-- ✓ 4 Onboarding workflows seeded
-- ✓ Auto-update triggers for updated_at
-- ✓ 25 Performance indexes created
--
-- Admin Login: admin@gmail.com
-- ============================================
