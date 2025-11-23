# Aurora - Employee Management System

A modern, responsive employee management dashboard built with React, Vite, Tailwind CSS, and Supabase.

## Features

- **Authentication** - Secure login/signup with Supabase Auth and protected routes
- **Employee Management** - Full CRUD operations (Create, Read, Update, Delete) for employee records
- **Real-time Search** - Instant debounced search across names, roles, departments, and emails
- **Analytics Dashboard** - Interactive charts tracking employee growth, department distribution, and performance
- **Calendar View** - Manage team events and meetings with an integrated calendar
- **Settings** - Comprehensive profile, notification, system, and security settings
- **Supabase Backend** - Production-ready PostgreSQL database with real-time capabilities
- **Performance Optimized** - React.memo, useCallback, lazy loading, and content visibility for lightning-fast performance


## Tech Stack

- **React 19** - Frontend framework
- **Vite 6** - Build tool
- **Tailwind CSS 4** - Styling with custom design system
- **Supabase** - Backend database and authentication
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date utilities


## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/sunil-gumatimath/emp-management-vibecode.git
cd react-browser

# Install dependencies
bun install

# Set up Supabase (required for employee CRUD operations)
# See SUPABASE_SETUP.md for detailed instructions
```

> **⚠️ Important:** You need to configure Supabase before running the app. Follow the step-by-step guide in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

### Development

```bash
bun run dev
```

Visit `http://localhost:3000`

### Build

```bash
bun run build
```

## Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
├── data/            # Mock data
├── features/        # Feature modules (analytics, calendar, employees, settings)
├── App.jsx          # Main app component
├── main.jsx         # App entry point
└── index.css        # Global styles & design system
```

## Recent Updates

**v1.4.0 - Authentication System** 🔐
- ✅ Supabase Auth integration for secure login/signup
- ✅ Auth context for global user state management
- ✅ Protected routes - require login to access app
- ✅ Beautiful login/signup page with validation
- ✅ Real logout functionality
- ✅ User info displayed from auth session
- ✅ Session persistence across page refreshes

**v1.3.0 - Performance Optimization** ⚡
- ✅ Implemented React.memo for employee cards
- ✅ Added useCallback to prevent unnecessary re-renders
- ✅ Debounced search input (300ms) for smoother typing
- ✅ Lazy loading for employee avatar images
- ✅ CSS content-visibility for faster list rendering
- ✅ 40-85% performance improvement across the board
- 📖 See [`PERFORMANCE_OPTIMIZATIONS.md`](./PERFORMANCE_OPTIMIZATIONS.md) for details

**v1.2.0 - Supabase Integration & CRUD Operations** 🎉
- ✅ Integrated Supabase as backend database
- ✅ Full CRUD operations for employees (Create, Read, Update, Delete)
- ✅ Add Employee modal with form validation
- ✅ Edit Employee modal with pre-populated data
- ✅ Delete confirmation modal
- ✅ Real-time search and filtering
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Refresh button for manual data sync

**v1.1.0 - Polish & Refinement**
- Implemented sharp, premium design language
- Fixed sidebar toggle responsiveness
- Updated to Indian Hindu names
- Code cleanup and PropTypes validation
- Removed stale documentation


## License

MIT License Free to use

---

Built with ❤️ using React, Vite, and Tailwind CSS
