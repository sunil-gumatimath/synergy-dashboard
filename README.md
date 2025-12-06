# Aurora - Employee Management System

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS">
</p>

A modern, comprehensive employee management dashboard built with React, Vite, and Supabase.
**Fully integrated with Supabase backend - No mock data.**

---

## ✨ Features

### 👥 **Employee Management**
- Complete CRUD operations (Create, Read, Update, Delete)
- Advanced employee profiles with detailed information
- Gender-based avatar generation with initials
- **Enhanced Employee Details** including:
  - 📋 Contact information and employment history
  - 🎯 Skills & competencies with visual progress bars
  - 📊 Performance statistics and analytics
  - 📄 Document management and note-taking
  - 📥 PDF export functionality

### 📊 **Analytics Dashboard**
- Interactive charts showing employee growth trends
- Department distribution analytics
- Performance metrics visualization (Avg score, Total payroll)
- Real-time statistics and insights

### 🔔 **Notification System**
- Real-time in-app notifications with bell icon
- Unread count badge with pulse animation
- Mark as read (single/all), delete, clear all
- Auto-trigger on task assignment
- Browser push notification support
- Multiple notification types (info, success, warning, error, task, event, ticket)

### ⏱️ **Time Tracking**
- Clock in/out with live timer
- Weekly timesheet with daily breakdown
- Overtime tracking and approvals
- Work schedule management
- Monthly hours summary
- Visual progress bars for daily hours

### 📅 **Leave Management**
- Multiple leave types (Annual, Sick, Personal, Maternity, Paternity, Comp Off, etc.)
- Leave balance tracking with visual progress
- Apply for leave with half-day support
- Manager approval workflow
- Upcoming holidays calendar (India 2024-2025)
- Leave request history

### 📄 **Reports**
- Employee Reports with filtering
- Leave Reports with export options
- Attendance Reports
- Performance Reports

### 📄 **Documents & Notes System**
- Secure file upload and management per employee
- Categorized note-taking system
- Document organization and retrieval

### 🔐 **Authentication**
- Secure login/signup with Supabase
- Protected routes and session management
- Role-based access control (Admin, Manager, Employee)
- Glassmorphism login UI with animated background

### 📅 **Calendar View**
- Employee scheduling and calendar management
- Event creation with color coding
- Multiple event types (meeting, event, training, deadline)

### 📋 **Task Management**
- Kanban-style task board (To Do, In Progress, Review, Done)
- Drag-and-drop interface for status updates
- Priority filtering and search
- Real-time task creation and assignment
- Task tags and due dates

### 🎫 **Help Desk & Support**
- Internal ticket raising system
- Status tracking for support requests
- Priority-based ticket management
- Category classification

### ⚙️ **Settings** (NEW! - Completely Redesigned)
- **Account**: Profile management with avatar, name, phone, bio
- **Appearance**: Theme selection (Light/Dark/System), accent colors, compact mode
- **Notifications**: Granular controls for email, push, task reminders, mentions, weekly digest
- **Preferences**: Language, timezone, date/time formats, start of week
- **Security**: Password change with strength validation, 2FA (coming soon), active sessions
- **Unsaved Changes Detection**: Floating save bar with discard option
- **Modern UI**: Card-based layout with sidebar navigation

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/sunil-gumatimath/emp-management-vibecode.git
cd react-browser
```

### 2. Install dependencies

```bash
bun install  # or npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the entire contents of `database/aurora_complete_setup.sql`
4. Paste and run the query - this sets up all tables, RLS policies, and seed data

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Create Admin User

1. Go to **Authentication > Users** in Supabase dashboard
2. Click **Add User** and create with:
   - Email: `admin@gmail.com`
   - Password: `Admin@123`
3. The employee record is already seeded and will link automatically on first login

### 6. Start development server

```bash
bun run dev  # or npm run dev
```

### 7. Open in browser

Navigate to `http://localhost:5123` (or the port shown in your terminal)

---

## 🐳 Docker Deployment

You can run the application in a production-ready container using Docker.

### Prerequisites
- Docker & Docker Compose installed

### Steps
1. Create a `.env` file with your Supabase credentials (same as `.env.local`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Build and run the container:
```bash
docker-compose up -d --build
```

3. Access the application at `http://localhost:8080`

---

## 🔑 Sample Login Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@gmail.com` | `Admin@123` | Admin |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19.2, Vite 6.0 |
| **Styling** | TailwindCSS 4.1, Custom CSS |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Charts** | Recharts 3.4 |
| **Icons** | Lucide React |
| **Routing** | React Router 7.9 |
| **Date Handling** | date-fns |

---

## 📁 Project Structure

```
react-browser/
├── database/
│   ├── migrations/          # DB migrations
│   ├── schema/              # Schema definitions
│   ├── seeds/               # Seed data
│   └── aurora_complete_setup.sql    # Complete DB setup script
├── src/
│   ├── components/
│   │   ├── common/          # Shared components (Avatar, Toast, etc.)
│   │   ├── layout/          # Layout components (Header, Sidebar)
│   │   └── ui/              # UI primitives
│   ├── contexts/            # React contexts (Auth)
│   ├── features/
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── calendar/        # Calendar view
│   │   ├── dashboard/       # Employee dashboard
│   │   ├── employees/       # Employee list & management
│   │   ├── leave/           # Leave management
│   │   ├── reports/         # Reports view
│   │   ├── settings/        # Settings (NEW!)
│   │   ├── support/         # Help desk
│   │   ├── tasks/           # Task board
│   │   └── timetracking/    # Time tracking
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Supabase client
│   ├── pages/               # Page components
│   ├── services/            # API services
│   └── utils/               # Utility functions
└── public/                  # Static assets
```

---

## 🗄️ Database Schema

### Tables (17 Total)

| Table | Description |
|-------|-------------|
| `employees` | Core employee data with profile info |
| `tasks` | Task management with Kanban statuses |
| `calendar_events` | Company events and meetings |
| `holidays` | Company holidays (India 2024-2025) |
| `leave_types` | Types of leave (7 types seeded) |
| `leave_balances` | Employee leave balances per year |
| `leave_requests` | Leave applications with approval workflow |
| `time_entries` | Clock in/out records |
| `work_schedules` | Employee work schedules |
| `overtime_records` | Overtime tracking |
| `timesheet_periods` | Timesheet management |
| `notifications` | In-app notifications |
| `notification_preferences` | Notification settings |
| `user_settings` | User preferences (theme, language, etc.) |
| `employee_documents` | Document storage |
| `employee_notes` | Manager notes on employees |
| `support_tickets` | Help desk tickets |




## 🎨 Design Features

- **Mobile-first responsive design** optimized for all devices
- **"Sharp" Modern Theme**: 0px border-radius design language
- **Glassmorphism**: Premium glass effects on Login and modals
- **Interactive UI**: Floating label inputs, smooth transitions, hover effects
- **Performance optimized** with lazy loading and code splitting
- **Touch-friendly interfaces** with proper accessibility
- **Gender-based avatars** with initials and color coding

---

## 📱 Role-Based Access

| Feature | Admin | Manager | Employee |
|---------|-------|---------|----------|
| Employee Management | ✅ Full | ✅ Full | ❌ |
| Analytics Dashboard | ✅ | ✅ | ❌ |
| Employee Dashboard | ✅ | ✅ | ✅ |
| Task Management | ✅ | ✅ | ✅ Own tasks |
| Leave Management | ✅ Approve | ✅ Approve | ✅ Apply |
| Time Tracking | ✅ | ✅ | ✅ |
| Reports | ✅ | ✅ | ❌ |
| Settings | ✅ Full | ✅ Personal | ✅ Personal |

---

## 🔄 Recent Updates

### v2.0.0 (December 2024)
- ✨ **New Settings Page**: Completely redesigned with modern UI
  - Account, Appearance, Notifications, Preferences, Security sections
  - Theme & accent color selection (coming soon)
  - Unsaved changes detection with floating save bar
- 🗄️ **Enhanced Database**: Extended `user_settings` table with 20+ columns
- 👥 **19 Indian Employees**: Comprehensive seed data
- 📅 **22 Indian Holidays**: 2024-2025 calendar
- 🎨 **UI Improvements**: Modern card-based layouts, animations
- 🐳 **Docker Support**: Full Docker setup with Nginx production server
- 📁 **Project Restructuring**: Improved folder structure with dedicated migrations and hooks

---

## 📄 License

MIT License - Free to use for personal and commercial projects.



