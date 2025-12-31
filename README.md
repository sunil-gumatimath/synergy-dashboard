# Aurora EMS

A comprehensive **Employee Management System** built with modern web technologies. Streamline HR operations, workforce management, and organizational productivity with an intuitive, feature-rich dashboard.

## Recent Updates

### Performance & Architecture
- Multi-stage Docker build with Bun for optimized production images
- Code splitting and lazy loading for faster initial load times
- Nginx configuration with gzip compression and security headers
- Enhanced mobile responsiveness and PWA capabilities
- Service worker for offline support and faster caching

### New Features
- Team Chat with real-time messaging
- Performance Reviews with analytics and goal tracking
- Enhanced Settings with Account, Appearance, Notifications, Preferences, and Security sections
- Employee profile page with comprehensive details
- Real-time notifications system
- Dark/light theme support
- Toast notifications for user feedback

## Features

### HR Core

- **Employee Profiles**: Complete employee information with personal details, contact info, and organizational data
- **Document Management**: Upload and manage employee documents, contracts, and certificates
- **Role-Based Access**: Admin, Manager, and Employee roles with appropriate permissions
- **Bank & Education Details**: Secure storage of banking information and educational background
- **Performance Reviews**: Track employee performance with reviews and goal setting

### Workforce Management

- **Time Tracking**: Clock in/out functionality with break tracking and overtime calculation
- **Leave Management**: Multiple leave types (Annual, Sick, Maternity, etc.) with approval workflows
- **Attendance Monitoring**: Daily attendance tracking with work schedules
- **Payroll Processing**: Salary calculations, allowances, deductions, and payslip generation
- **Expense Tracking**: Employee expense claims and reimbursement management

### Productivity Tools

- **Task Management**: Kanban-style task board with drag-and-drop functionality
- **Interactive Calendar**: Schedule events, meetings, and holidays with visual calendar view
- **Analytics Dashboard**: Comprehensive insights with charts, metrics, and performance indicators
- **Reports Generation**: Detailed reports on employees, attendance, leave, and productivity
- **Team Chat**: Real-time messaging and collaboration for teams

### Support & Development

- **Help Desk**: Internal ticketing system for employee support requests
- **Training Management**: Course enrollment, progress tracking, and certifications
- **Asset Management**: Track company assets and their assignments
- **Onboarding Workflows**: Structured onboarding process for new employees
- **Announcements**: Company-wide announcements and notifications

## Tech Stack

### Frontend

- **React 19** - Latest React with concurrent features and performance optimizations
- **Vite 6** - Lightning-fast build tool and development server
- **TailwindCSS 4** - Utility-first CSS framework with modern design system
- **React Router 7** - Advanced routing with nested routes and data loading
- **Recharts** - Beautiful, customizable charts and data visualizations
- **Lucide React** - Modern icon library with consistent design
- **Date-fns** - Modern JavaScript date utility library
- **@hello-pangea/dnd** - Drag-and-drop functionality for task management

### Backend & Database

- **Supabase** - Open-source Firebase alternative
  - PostgreSQL database with advanced features
  - Built-in authentication and authorization
  - Row Level Security (RLS) for data protection
  - Real-time subscriptions and webhooks
  - File storage and edge functions

### Infrastructure & DevOps

- **Docker** - Multi-stage containerization for consistent deployment
- **Nginx** - Production web server with reverse proxy, gzip, and security headers
- **Bun** - Fast JavaScript runtime and package manager
- **ESLint** - Code linting and quality assurance

### PWA Capabilities

- Service Worker for offline caching
- Installable as standalone app
- App shortcuts for quick access
- Responsive design for all devices
- Mobile-enhanced UI

## Database Schema

**26 Tables** with comprehensive relationships:

### Core Entities

- `employees` - Employee profiles and organizational data
- `tasks` - Task management with Kanban board
- `calendar_events` - Calendar events and scheduling
- `notifications` - System and user notifications

### HR & Workforce

- `leave_types`, `leave_requests`, `leave_balances` - Leave management system
- `time_entries`, `work_schedules`, `overtime_records`, `timesheet_periods` - Time tracking
- `payroll_records` - Salary and compensation data
- `performance_reviews` - Employee evaluations

### Support & Development

- `support_tickets` - Help desk ticketing system
- `trainings`, `training_enrollments` - Learning management
- `assets` - Company asset tracking
- `onboarding_workflows`, `onboarding_tasks` - Employee onboarding
- `expenses` - Expense reimbursement system

### Administrative

- `announcements` - Company communications
- `employee_documents`, `employee_notes` - Document and note management
- `user_settings`, `notification_preferences` - User preferences

**Security**: All tables use Row Level Security (RLS) with role-based policies.

## Quick Start

### Prerequisites

- Node.js 18+ or Bun runtime
- Supabase account (supabase.com)

### 1. Clone & Install

```bash
git clone https://github.com/sunil-gumatimath/emp-management-vibecode.git
cd react-browser
# With Bun (recommended)
bun install

# Or with npm
npm install
```

### 2. Database Setup

1. Create a new project at Supabase
2. Go to SQL Editor and run `database/aurora_ems_complete.sql`
3. This creates 26 tables with complete seed data including:
   - 10 sample employees (Admin, Managers, Employees)
   - 8 leave types with balances
   - Work schedules and time entries
   - Tasks, calendar events, and support tickets

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Development Server

```bash
# With Bun
bun run dev

# Or with npm
npm run dev
```

Access at `http://localhost:5173`

### 5. Production Build

```bash
bun run build
bun run preview
```

## Docker Deployment

### Quick Docker Setup

```bash
# Build and run with docker-compose
docker-compose up -d --build
```

Access at `http://localhost:8080`

### Manual Docker Build

```bash
# Build image (multi-stage with Bun)
docker build -t aurora-ems .

# Run container
docker run -d \
  -p 8080:80 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  --name aurora-ems \
  aurora-ems
```

## Default Login Credentials

**Admin Access:**

- Email: `admin@gmail.com`
- Password: `Admin@123`

**Demo Employees:** Various roles available in seed data

## Project Structure

```
aurora-ems/
├── database/           # SQL schema and migrations
├── public/            # Static assets (PWA manifest, service worker)
├── src/
│   ├── components/    # Reusable UI components
│   │   ├── common/    # Shared components (Avatar, Toast, etc.)
│   │   ├── layout/    # Layout components (Header, Sidebar)
│   │   └── ui/        # Base UI components (Button, Card)
│   ├── contexts/      # React contexts (Auth, Theme, Notifications)
│   ├── features/      # Feature modules
│   │   ├── analytics/ # Analytics dashboard
│   │   ├── calendar/  # Calendar management
│   │   ├── chat/      # Team chat
│   │   ├── dashboard/ # Employee dashboard
│   │   └── ...        # Other features
│   ├── lib/           # External service configurations
│   ├── pages/         # Page components
│   ├── services/      # API service layer
│   └── utils/         # Utility functions
├── supabase/          # Supabase migrations
├── docker-compose.yml # Docker orchestration
├── Dockerfile         # Multi-stage container configuration
├── nginx.conf         # Production server config
└── vite.config.js     # Build configuration with code splitting
```

## Available Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Run ESLint
```

## Key Features Showcase

### Analytics Dashboard

- Real-time employee metrics and KPIs
- Interactive charts (growth trends, department distribution)
- Performance analytics by department
- Recent activity timeline

### Calendar Management

- Full calendar view with event creation
- Holiday management and display
- Meeting scheduling and invitations
- Recurring event support

### Time Tracking

- Clock in/out with GPS location
- Break time tracking
- Overtime calculation
- Timesheet approval workflow

### Leave Management

- Multiple leave types (Annual, Sick, Maternity, etc.)
- Leave balance tracking
- Approval workflow for managers
- Holiday calendar integration

### Task Management

- Kanban board with drag-and-drop
- Task assignment and tracking
- Priority and status management
- Due date notifications

### Team Chat

- Real-time messaging
- Individual and group conversations
- Message search and history
- Online status indicators

### Performance Reviews

- Employee performance evaluations
- Goal setting and tracking
- Performance analytics and metrics
- Review workflow for managers

### PWA Features

- Install as desktop/mobile app
- Offline support with service worker
- App shortcuts for quick navigation
- Fast caching with service worker

## Performance Optimizations

- Code splitting with lazy loading for routes
- Manual chunk splitting for heavy dependencies (React, Recharts, Supabase)
- Terser minification with console removal
- Gzip compression in Nginx
- Asset caching with immutable cache headers
- Pre-bundling of heavy dependencies
- CSS code splitting enabled

## Security

- Row Level Security (RLS) on all database tables
- Role-based access control (RBAC)
- Protected routes for different user roles
- Security headers in Nginx (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Environment variable protection
- Secure authentication with Supabase Auth

## License

This project is proprietary software. All rights reserved.
