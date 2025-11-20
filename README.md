# Employee Management System

A modern, responsive Employee Management Dashboard built with React, Vite, and Tailwind CSS. This application provides an intuitive interface for managing employee data, viewing statistics, and navigating through administrative tasks.

## 🚀 Features

- **Dashboard Overview**: Visual statistics and key metrics at a glance.
- **Analytics Dashboard**: Interactive charts and graphs for tracking employee growth, department distribution, and performance trends.
- **Calendar & Scheduling**: Integrated calendar view for managing team events, meetings, and schedules.
- **Employee Management**: View, manage, and track employee information with localized data support (Indian context).
- **Settings Management**: Comprehensive settings for profile, notifications, security, and preferences.
- **Sharp & Premium UI**: A modern, high-end interface featuring a sharp design language (no rounded corners) for a professional look.
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices.
- **Sidebar Navigation**: Easy access to different modules of the application.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Package Manager**: [Bun](https://bun.sh/) (or npm/yarn)
- **Linting**: ESLint

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Bun](https://bun.sh/) (optional, but recommended for faster installs)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sunil-gumatimath/emp-management-vibecode.git
   cd react-browser
   ```

2. **Install dependencies**
   Using Bun:
   ```bash
   bun install
   ```
   Or using npm:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
bun run dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📜 Scripts

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `preview`: Previews the production build locally.
- `lint`: Runs ESLint to check for code quality issues.

## 📂 Project Structure

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components (Sidebar, Stats, etc.)
├── data/           # Mock data and constants
├── features/       # Feature-specific components (e.g., EmployeeList)
├── layouts/        # Layout components
├── App.css         # App-specific styles
├── App.jsx         # Main application component
├── index.css       # Global styles and Tailwind directives
└── main.jsx        # Entry point
```
