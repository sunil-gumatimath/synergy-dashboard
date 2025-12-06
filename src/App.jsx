import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Stats from "./components/Stats";
import EmployeeList from "./features/employees/EmployeeList";
import SettingsView from "./features/settings/SettingsView";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Header from "./components/layout/Header";
import LoadingSpinner from "./components/common/LoadingSpinner";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./contexts/AuthContext";
import "./components/common/Avatar.css";

const AnalyticsDashboard = React.lazy(
  () => import("./features/analytics/AnalyticsDashboard"),
);
const CalendarView = React.lazy(
  () => import("./features/calendar/CalendarView"),
);

const TasksView = React.lazy(
  () => import("./features/tasks/TasksView"),
);
const SupportView = React.lazy(
  () => import("./features/support/SupportView"),
);
const EmployeeDashboard = React.lazy(
  () => import("./features/dashboard/EmployeeDashboard"),
);
const LeaveManagement = React.lazy(
  () => import("./features/leave/LeaveManagement"),
);
const TimeTracking = React.lazy(
  () => import("./features/timetracking/TimeTracking"),
);
const ReportsView = React.lazy(
  () => import("./features/reports/ReportsView"),
);

const HomeRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'Admin' || user?.role === 'Manager') {
    return <Navigate to="/analytics" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

function App() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Determine active tab from current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "dashboard";
    if (path.startsWith("/employees")) return "employees";
    if (path.startsWith("/tasks")) return "tasks";
    if (path.startsWith("/timetracking")) return "timetracking";
    if (path.startsWith("/leave")) return "leave";
    if (path.startsWith("/support")) return "support";
    if (path.startsWith("/analytics")) return "analytics";
    if (path.startsWith("/calendar")) return "calendar";
    if (path.startsWith("/reports")) return "reports";
    if (path.startsWith("/settings")) return "settings";
    return "dashboard"; // Default fallback
  };

  const activeTab = getActiveTab();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <ProtectedRoute>
      <div className="app-container">
        <Sidebar
          activeTab={activeTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main className="main-content">
          <Header onMobileMenuToggle={toggleMobileMenu} />

          <Routes>
            <Route path="/" element={<HomeRedirect />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Employee', 'Admin', 'Manager']}>
                  <Suspense
                    fallback={
                      <LoadingSpinner size="lg" message="Loading dashboard..." />
                    }
                  >
                    <EmployeeDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <Suspense
                    fallback={
                      <LoadingSpinner size="lg" message="Loading analytics..." />
                    }
                  >
                    <AnalyticsDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
// ... existing routes ...

            <Route
              path="/employees"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <>
                    <Stats />
                    <EmployeeList />
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/employees/:id"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <EmployeeDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner size="lg" message="Loading calendar..." />
                  }
                >
                  <CalendarView />
                </Suspense>
              }
            />

            <Route
              path="/tasks"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner size="lg" message="Loading tasks..." />
                  }
                >
                  <TasksView />
                </Suspense>
              }
            />

            <Route
              path="/support"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner size="lg" message="Loading support..." />
                  }
                >
                  <SupportView />
                </Suspense>
              }
            />

            <Route
              path="/leave"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner size="lg" message="Loading leave management..." />
                  }
                >
                  <LeaveManagement />
                </Suspense>
              }
            />

            <Route
              path="/timetracking"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner size="lg" message="Loading time tracking..." />
                  }
                >
                  <TimeTracking />
                </Suspense>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <Suspense
                    fallback={
                      <LoadingSpinner size="lg" message="Loading reports..." />
                    }
                  >
                    <ReportsView />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route path="/settings" element={<SettingsView />} />

            <Route path="/profile" element={<ProfilePage />} />

            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-64 text-muted">
                  Page not found
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default App;
