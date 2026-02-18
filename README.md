# Synergy EMS

A comprehensive **Employee Management System** built with modern web technologies. Streamline HR operations, workforce management, and organizational productivity with an intuitive, feature-rich dashboard.

## Recent Updates

### Performance & Architecture
- Multi-stage Docker build with Bun for optimized production images
- Code splitting and lazy loading for faster initial load times
- Manual chunk splitting for heavy dependencies (React, Recharts, Supabase)
- Nginx configuration with gzip compression and security headers
- Enhanced mobile responsiveness and PWA capabilities
- Service worker for offline support and faster caching
- Terser minification with console removal in production builds
- CSS code splitting enabled for smaller bundles
- Pre-bundling of heavy dependencies for faster dev server startup
- Real-time subscriptions with Supabase for live updates

### New Features
- Team Chat with real-time messaging, file attachments, and online status
- Performance Reviews with analytics, goal tracking, and review workflows
- Enhanced Settings with modular sections: Account, Appearance, Notifications, Preferences, Security
- Employee detail page with comprehensive profile, documents, notes, and activity
- Real-time notifications system with browser push notifications
- Dark/light theme support with system preference detection
- Toast notifications for user feedback and alerts
- Global search functionality for employees
- Profile completion tracking and indicators
- Password strength indicator for security
- Bulk actions for employee management
- Advanced filtering and sorting across all modules
- Mobile-enhanced UI with responsive design
- App shortcuts for quick navigation

### Security Enhancements
- Row Level Security (RLS) policies on all database tables
- Role-based access control (Admin, Manager, Employee)
- Protected routes with role-based access
- Session management with automatic token refresh
- Security headers in Nginx (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Password strength validation
- Two-factor authentication framework ready

## Features

### HR Core

- **Employee Profiles**: Complete employee information with personal details, contact info, and organizational data
- **Document Management**: Upload and manage employee documents, contracts, and certificates
- **Role-Based Access**: Admin, Manager, and Employee roles with appropriate permissions
- **Bank & Education Details**: Secure storage of banking information and educational background
- **Performance Reviews**: Track employee performance with reviews and goal setting
- **Employee Notes**: Add and manage notes on employee profiles
- **Profile Completion**: Track and encourage profile completion for employees

### Workforce Management

- **Time Tracking**: Clock in/out functionality with break tracking and overtime calculation
- **Leave Management**: Multiple leave types (Annual, Sick, Maternity, etc.) with approval workflows
- **Attendance Monitoring**: Daily attendance tracking with work schedules
- **Payroll Processing**: Salary calculations, allowances, deductions, and payslip generation
- **Expense Tracking**: Employee expense claims and reimbursement management
- **Overtime Records**: Track and approve overtime hours with multipliers

### Productivity Tools

- **Task Management**: Kanban-style task board with drag-and-drop functionality using @hello-pangea/dnd
- **Task Statistics**: Track task completion rates, overdue tasks, and distribution
- **Interactive Calendar**: Schedule events, meetings, and holidays with visual calendar view
- **Analytics Dashboard**: Comprehensive insights with charts, metrics, and performance indicators
- **Reports Generation**: Detailed reports on employees, attendance, leave, tasks, and time tracking
- **Team Chat**: Real-time messaging and collaboration for teams with file attachments
- **Performance Reviews**: Goal setting, tracking, and review workflows

### Support & Development

- **Help Desk**: Internal ticketing system for employee support requests
- **Training Management**: Course enrollment, progress tracking, and certifications
- **Asset Management**: Track company assets and their assignments
- **Onboarding Workflows**: Structured onboarding process for new employees
- **Announcements**: Company-wide announcements and notifications

### User Experience

- **Real-time Updates**: Live updates across the application using Supabase subscriptions
- **Notification System**: In-app notifications with browser push support
- **Theme Support**: Light/dark/system themes with customizable accent colors
- **Mobile Responsive**: Fully responsive design optimized for all devices
- **PWA Support**: Installable as standalone app with offline capabilities
- **Global Search**: Search employees across the application
- **Bulk Actions**: Perform actions on multiple items at once
- **Advanced Filtering**: Filter by department, role, status, and more
- **Sortable Lists**: Sort by various fields with ascending/descending order
- **Loading States**: Skeleton loaders for better perceived performance

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
- **PropTypes** - Runtime type checking for React components

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
- **Terser** - JavaScript minification and compression

### PWA Capabilities

- **Service Worker** - Offline caching and background sync
- **Web App Manifest** - Installable as standalone app
- **App Shortcuts** - Quick access to key features
- **Responsive Design** - Optimized for all devices
- **Mobile-Enhanced UI** - Touch-friendly interface

## Database Schema

**26 Tables** with comprehensive relationships:

### Core Entities

- `employees` - Employee profiles and organizational data
- `tasks` - Task management with Kanban board
- `calendar_events` - Calendar events and scheduling
- `notifications` - System and user notifications
- `holidays` - Holiday management and display

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

## Project Structure

```
synergy-ems/
├── database/                    # SQL schema and migrations
│   ├── synergy_ems_complete.sql  # Complete database setup with seed data
│   └── update_user_roles.sql    # User role management scripts
├── public/                      # Static assets
│   ├── synergy.svg              # Application logo
│   ├── staffly.svg             # Alternative logo
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   └── icons/                  # PWA icons
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Shared components
│   │   │   ├── Avatar.jsx            # Avatar component
│   │   │   ├── ErrorBoundary.jsx     # Error boundary
│   │   │   ├── LoadingSpinner.jsx    # Loading indicator
│   │   │   ├── ProtectedRoute.jsx    # Authenticated route wrapper
│   │   │   ├── Skeleton.jsx          # Skeleton loading states
│   │   │   ├── Toast.jsx             # Toast notifications
│   │   │   └── SynergyLogo.jsx        # Logo component
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.jsx            # Application header
│   │   │   └── Sidebar.jsx           # Navigation sidebar
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.jsx            # Button component
│   │   │   ├── Card.jsx              # Card component
│   │   │   └── ConfirmModal.jsx      # Confirmation dialog
│   │   ├── AddEmployeeModal.jsx       # Add employee dialog
│   │   ├── AddNoteModal.jsx           # Add note dialog
│   │   ├── BankDetailsModal.jsx       # Bank details management
│   │   ├── BulkActionToolbar.jsx      # Bulk actions toolbar
│   │   ├── DocumentList.jsx           # Document management list
│   │   ├── DocumentUploadModal.jsx    # Document upload dialog
│   │   ├── EditEmployeeModal.jsx      # Edit employee dialog
│   │   ├── EditNoteModal.jsx          # Edit note dialog
│   │   ├── EducationModal.jsx         # Education management
│   │   ├── EmployeeCard.jsx           # Employee card component
│   │   ├── FilterPanel.jsx            # Advanced filtering panel
│   │   ├── NotesList.jsx              # Notes management list
│   │   ├── NotificationPanel.jsx      # Notification center
│   │   ├── PasswordStrengthIndicator.jsx # Password strength
│   │   ├── ProfileCompletionBar.jsx   # Profile completion tracker
│   │   ├── SettingsView.jsx           # Settings page
│   │   ├── SortControls.jsx           # Sorting controls
│   │   └── Stats.jsx                   # Statistics cards
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.jsx       # Authentication state
│   │   ├── NotificationContext.jsx  # Notifications state
│   │   ├── ThemeContext.jsx      # Theme management
│   │   └── ToastContext.jsx       # Toast notifications
│   ├── features/               # Feature modules
│   │   ├── analytics/           # Analytics dashboard
│   │   │   └── AnalyticsDashboard.jsx
│   │   ├── calendar/            # Calendar management
│   │   │   ├── CalendarView.jsx
│   │   │   └── AddEventModal.jsx
│   │   ├── chat/                # Team chat
│   │   │   └── TeamChat.jsx
│   │   ├── dashboard/           # Employee dashboard
│   │   │   └── EmployeeDashboard.jsx
│   │   ├── employees/           # Employee management
│   │   │   └── EmployeeList.jsx
│   │   ├── leave/               # Leave management
│   │   │   ├── LeaveManagement.jsx
│   │   │   └── ApplyLeaveModal.jsx
│   │   ├── performance/         # Performance reviews
│   │   │   └── PerformanceReviews.jsx
│   │   ├── reports/             # Reports generation
│   │   │   └── ReportsView.jsx
│   │   ├── settings/            # Settings management
│   │   │   ├── SettingsView.jsx
│   │   │   └── components/      # Settings sub-components
│   │   │       ├── AccountSection.jsx
│   │   │       ├── AppearanceSection.jsx
│   │   │       ├── NotificationsSection.jsx
│   │   │       ├── PreferencesSection.jsx
│   │   │       ├── SecuritySection.jsx
│   │   │       └── index.js
│   │   ├── support/             # Help desk
│   │   │   ├── SupportView.jsx
│   │   │   └── CreateTicketModal.jsx
│   │   ├── tasks/               # Task management
│   │   │   └── TasksView.jsx
│   │   └── timetracking/        # Time tracking
│   │       └── TimeTracking.jsx
│   ├── lib/                    # External service configurations
│   │   ├── supabase.js          # Supabase client
│   │   └── tokenRefresh.js      # Token refresh utility
│   ├── pages/                  # Page components
│   │   ├── EmployeeDetailPage.jsx   # Employee detail view
│   │   ├── LoginPage.jsx            # Login page
│   │   ├── ProfilePage.jsx          # Profile page
│   │   └── ResetPasswordPage.jsx    # Password reset
│   ├── services/               # API service layer
│   │   ├── authService.js           # Authentication service
│   │   ├── calendarService.js       # Calendar API
│   │   ├── chatService.js           # Chat API
│   │   ├── documentService.js       # Document management
│   │   ├── employeeService.js       # Employee management
│   │   ├── leaveService.js          # Leave management
│   │   ├── noteService.js           # Note management
│   │   ├── notificationService.js   # Notifications
│   │   ├── performanceService.js    # Performance reviews
│   │   ├── reportsService.js        # Reports generation
│   │   ├── supportService.js        # Help desk
│   │   ├── taskService.js           # Task management
│   │   └── timeTrackingService.js   # Time tracking
│   ├── utils/                  # Utility functions
│   │   ├── avatarUtils.js            # Avatar generation
│   │   ├── dateUtils.js             # Date formatting
│   │   └── helpers.js               # Helper functions
│   ├── App.jsx                 # Main application component
│   ├── index.css               # Global styles
│   ├── main.jsx                # Application entry point
│   └── mobile-enhancements.css # Mobile-specific styles
├── supabase/                   # Supabase configuration
│   └── migrations/             # Database migrations
│       ├── 20260101000000_setup.sql
│       └── 20260101000001_fix_rls.sql
├── docker-compose.yml         # Docker orchestration
├── Dockerfile                  # Multi-stage container configuration
├── nginx.conf                  # Production server config
├── vite.config.js             # Build configuration with code splitting
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint configuration
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
└── package.json               # Project dependencies
```

## Available Scripts

```bash
bun run dev          # Start development server (port 5173)
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
- Employee distribution by department and role
- Salary and performance statistics
- Task completion and overdue metrics
- Attendance and leave analytics

### Calendar Management

- Full calendar view with event creation
- Holiday management and display
- Meeting scheduling and invitations
- Recurring event support
- Event color coding
- All-day events
- Location and time management
- Personal and company-wide events

### Time Tracking

- Clock in/out with GPS location
- Break time tracking
- Overtime calculation with multipliers
- Timesheet approval workflow
- Weekly and daily summaries
- Work schedule management
- Real-time elapsed time display
- Automatic time tracking

### Leave Management

- Multiple leave types (Annual, Sick, Maternity, etc.)
- Leave balance tracking by type and year
- Approval workflow for managers
- Holiday calendar integration
- Half-day leave support
- Leave statistics and analytics
- Pending, approved, and rejected leaves
- Leave history and usage reports

### Task Management

- Kanban board with drag-and-drop
- Task assignment and tracking
- Priority and status management
- Due date notifications
- Task statistics and filters
- Multiple view modes (board and list)
- Task tags and search
- Task completion tracking

### Team Chat

- Real-time messaging
- Individual and group conversations
- Message search and history
- Online status indicators
- File attachments support
- Message read receipts
- Typing indicators
- Conversation management

### Performance Reviews

- Employee performance evaluations
- Goal setting and tracking
- Performance analytics and metrics
- Review workflow for managers
- Performance scores and trends
- Goal completion tracking
- Performance history

### Reports Generation

- Attendance reports
- Leave reports
- Task reports
- Time tracking reports
- Employee summary reports
- CSV export functionality
- Print support
- Date range filtering
- Department filtering

### Settings

- Account management (profile, email, phone)
- Appearance settings (theme, accent color, compact mode)
- Notification preferences (email, push, in-app)
- User preferences (language, timezone, date format)
- Security settings (password change, 2FA)

### PWA Features

- Install as desktop/mobile app
- Offline support with service worker
- App shortcuts for quick navigation (Dashboard, Tasks, Leave)
- Fast caching with service worker
- Responsive design for all devices
- Push notifications support

### Security

- Row Level Security (RLS) on all database tables
- Role-based access control (RBAC)
- Protected routes for different user roles
- Security headers in Nginx
- Session management with automatic refresh
- Password strength validation
- Secure token storage and refresh

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
2. Go to SQL Editor and run `database/synergy_ems_complete.sql`
3. This creates 26 tables with complete seed data including:
   - 10 sample employees (Admin, Managers, Employees)
   - 8 leave types with balances
   - Work schedules and time entries
   - Tasks, calendar events, and support tickets
   - Complete RLS policies and permissions

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
docker build -t synergy-ems .

# Run container
docker run -d \
  -p 8080:80 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  --name synergy-ems \
  synergy-ems
```

## Default Login Credentials

**Admin Access:**

- Email: `admin@gmail.com`
- Password: `Admin@123`

**Demo Employees:** Various roles available in seed data
- Managers: priya.sharma@synergy.com, rajesh.kumar@synergy.com
- Employees: vikram.reddy@synergy.com, and more

## Performance Optimizations

### Build Optimizations
- Code splitting with lazy loading for routes
- Manual chunk splitting for heavy dependencies:
  - React vendor chunk
  - Recharts vendor chunk
  - Supabase vendor chunk
  - UI utilities vendor chunk
- Terser minification with console removal
- CSS code splitting enabled
- Pre-bundling of heavy dependencies (recharts, supabase-js, lucide-react)

### Runtime Optimizations
- Debounced search queries (300ms)
- Memoized components with React.useMemo and React.useCallback
- Virtual scrolling for large lists
- Skeleton loading states for better perceived performance
- Optimized re-renders with careful state management

### Server Optimizations
- Nginx gzip compression
- Static asset caching with immutable cache headers
- Health checks for containers
- Multi-stage Docker builds for smaller images

### Network Optimizations
- Real-time subscriptions for live updates
- Efficient API calls with proper batching
- Lazy loading of heavy components
- Optimistic UI updates

## Development Guidelines

### Component Structure
- Feature-based organization
- Reusable components in common folder
- Context providers for state management
- Service layer for API calls

### Code Quality
- ESLint for code linting
- PropTypes for type checking
- Error boundaries for graceful error handling
- Loading states for async operations

### Best Practices
- Use lazy loading for heavy components
- Implement proper error handling
- Add loading states for all async operations
- Use memoization for expensive computations
- Follow React best practices and hooks rules

## Troubleshooting

### Common Issues

**Build fails with "chunk size warning"**
- This is expected for development; the limit is set to 600KB
- In production, chunks are split and optimized

**Supabase connection errors**
- Check environment variables are set correctly
- Verify Supabase project is active
- Check RLS policies allow access

**Docker container not starting**
- Ensure port 8080 is not in use
- Check environment variables are passed correctly
- Verify Docker logs for specific errors

**Service worker not registering**
- Ensure running over HTTPS or localhost
- Clear browser cache and service workers
- Check browser console for errors

## License

This project is proprietary software. All rights reserved. © Synergy EMS.
