# Aurora - Employee Management System

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS">
</p>

A modern, full-featured Employee Management System built with React, Vite, and Supabase. Fully integrated backend with no mock data.

---

## ✨ Features

- 👥 **Employee Management** - CRUD operations, profiles, documents, notes, PDF export
- 📊 **Analytics Dashboard** - Charts, metrics, department analytics
- 🔔 **Notifications** - Real-time in-app notifications with auto-triggers
- ⏱️ **Time Tracking** - Clock in/out, timesheets, overtime, work schedules
- 📅 **Leave Management** - 7 leave types, balances, approvals, 22 Indian holidays
- 📄 **Reports** - Employee, leave, attendance, performance reports
- 📅 **Calendar** - Events, meetings, recurring events, mini calendar widget
- 📋 **Tasks** - Kanban board with drag-and-drop, priorities, assignments
- 🎫 **Support** - Help desk ticketing system
- ⚙️ **Settings** - Account, appearance, notifications, preferences, security
- 🔐 **Authentication** - Supabase auth with role-based access control (Admin/Manager/Employee)

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/sunil-gumatimath/emp-management-vibecode.git
cd react-browser
bun install  # or npm install
```

### 2. Setup Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run `database/aurora_complete_setup.sql` in SQL Editor (creates 17 tables + seed data)
3. Get your API credentials from Settings > API

### 3. Configure Environment

Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create Admin User

In Supabase Dashboard > Authentication > Users:
- Email: `admin@gmail.com`
- Password: `Admin@123`
- Auto Confirm User: ✅

### 5. Run

```bash
bun run dev  # or npm run dev
```

Open `http://localhost:5123` and login with admin credentials.

---

## 🐳 Docker Deployment

```bash
# Create .env file with Supabase credentials
docker-compose up -d --build
```

Access at `http://localhost:8080`

---

## 🛠️ Tech Stack

**Frontend:** React 19.2, Vite 6.0, TailwindCSS 4.1, React Router 7.9, Recharts 3.4, Lucide Icons  
**Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)  
**DevOps:** Docker, Nginx, ESLint

---

## 🗄️ Database Schema

17 tables with Row Level Security:
- `employees` - Employee profiles
- `tasks` - Kanban task management
- `calendar_events` - Events & meetings
- `holidays` - Company holidays
- `leave_types`, `leave_balances`, `leave_requests` - Leave management
- `time_entries`, `work_schedules`, `overtime_records`, `timesheet_periods` - Time tracking
- `notifications`, `notification_preferences` - Notification system
- `user_settings` - User preferences (20+ columns)
- `employee_documents`, `employee_notes` - Document & note management
- `support_tickets` - Help desk

**Features:** RLS policies, auto-update triggers, performance indexes, foreign key constraints

---

## 📱 Role-Based Access

| Feature | Admin | Manager | Employee |
|---------|-------|---------|----------|
| Employee Management | ✅ Full | ✅ Full | ❌ |
| Analytics | ✅ | ✅ | ❌ |
| Dashboard | ✅ | ✅ | ✅ Own |
| Tasks | ✅ All | ✅ All | ✅ Own |
| Leave | ✅ Approve | ✅ Approve | ✅ Apply |
| Time Tracking | ✅ All | ✅ All | ✅ Own |
| Reports | ✅ | ✅ | ❌ |
| Calendar | ✅ Manage | ✅ Manage | ✅ View |
| Support | ✅ Manage | ✅ Manage | ✅ Create |

---

## 📁 Project Structure

```
src/
├── components/       # Common & layout components
├── contexts/         # React contexts (Auth)
├── features/         # Feature modules (analytics, calendar, dashboard, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Supabase client
├── pages/            # Page components
├── services/         # API service layers (10 services)
└── utils/            # Utility functions
```

---

## 🎨 Design Features

- Mobile-first responsive design
- "Sharp" modern theme (0px border-radius)
- Glassmorphism effects
- Gender-based avatars with initials
- Code splitting & lazy loading
- Optimized vendor chunks

---

## 📄 License

MIT License - Free for personal and commercial use.




