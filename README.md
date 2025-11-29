# Aurora - Employee Management System

A modern, comprehensive employee management dashboard built with React, Vite, and Supabase.
**Fully integrated with Supabase backend - No mock data.**

## ✨ Features

### 👥 **Employee Management**

- Complete CRUD operations (Create, Read, Update, Delete)
- Advanced employee profiles with detailed information
- **Enhanced Employee Details** including:
  - 📋 Contact information and employment history
  - 🎯 Skills & competencies with visual progress bars
  - 📊 Performance statistics and analytics
  - 📄 Document management and note-taking
  - 📥 PDF export functionality

### 📊 **Analytics Dashboard**

- Interactive charts showing employee growth trends
- Department distribution analytics
- Performance metrics visualization
- Real-time statistics and insights

### 📄 **Documents & Notes System**

- Secure file upload and management per employee
- Categorized note-taking system
- Document organization and retrieval

### 🔐 **Authentication**

- Secure login/signup with Supabase
- Protected routes and session management
- Glassmorphism login UI with animated background

### 📅 **Calendar View**

- Employee scheduling and calendar management

### 📋 **Task Management**
- Kanban-style task board (Todo, In Progress, Review, Done)
- Drag-and-drop interface for status updates
- Priority filtering and search
- Real-time task creation and assignment

### 🎫 **Help Desk & Support**
- Internal ticket raising system
- Status tracking for support requests
- Priority-based ticket management

### ⚙️ **Settings**

- **Profile Management**: Update personal details and avatar
- **Notifications**: Configure email and push alerts
- **System**: Admin-only controls for language, timezone, and data retention
- **Security**: Secure password change functionality
- **Database Backed**: All settings persist to `user_settings` table in Supabase

## 🚀 Quick Start

1. Clone the repository:

```bash
git clone https://github.com/sunil-gumatimath/emp-management-vibecode.git
cd react-browser
```

2. Install dependencies:

```bash
bun install  # or npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL scripts from `supabase-setup.sql` and `migrations/` in your Supabase SQL editor

4. Configure environment variables in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Start development server:

```bash
bun run dev  # or npm run dev
```

6. Open in browser at `http://localhost:5173` (or the port shown in your terminal)

7. **Sample Login Credentials:**
   - Email: admin@gmail.com
   - Password: Admin@123

## 🛠️ Tech Stack

- **Frontend**: React 19.2, Vite 6.0, Tailwind CSS 4.1
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Charts**: Recharts 3.4
- **Icons**: Lucide React
- **Routing**: React Router 7.1

## 📁 Key Components

- **Analytics Dashboard**: Interactive charts and performance metrics
- **Employee Management**: Full employee lifecycle management
- **Document System**: File uploads with Supabase Storage
- **Notes System**: Categorized note-taking per employee
- **Calendar Integration**: Employee scheduling features

## 🎨 Design Features

- **Mobile-first responsive design** optimized for all devices
- **"Sharp" Modern Theme**: 0px border-radius design language for a clean, professional look
- **Glassmorphism**: Premium glass effects on Login and modal elements
- **Interactive UI**: Floating label inputs, smooth transitions, and hover effects
- **Performance optimized** with lazy loading and code splitting
- **Touch-friendly interfaces** with proper accessibility

## 📄 Database Schema

- `employees` - Core employee information
- `employee_documents` - File attachments per employee
- `employee_notes` - Categorized notes and comments
- `tasks` - Task management and tracking
- `calendar_events` - Company events and schedules
- `user_settings` - User-specific preferences and configurations

## 📄 License

MIT License - Free to use for personal and commercial projects.
