import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Stats from "./components/Stats";
import EmployeeList from "./features/employees/EmployeeList";
import SettingsView from "./features/settings/SettingsView";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import ProfilePage from "./pages/ProfilePage";

const AnalyticsDashboard = React.lazy(
  () => import("./features/analytics/AnalyticsDashboard"),
);
const CalendarView = React.lazy(
  () => import("./features/calendar/CalendarView"),
);
const TaskBoard = React.lazy(
  () => import("./features/tasks/TaskBoard"),
);
const SupportView = React.lazy(
  () => import("./features/support/SupportView"),
);

function App() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Determine active tab from current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith("/employees")) return "employees";
    if (path.startsWith("/tasks")) return "tasks";
    if (path.startsWith("/support")) return "support";
    if (path.startsWith("/analytics")) return "analytics";
    if (path.startsWith("/calendar")) return "calendar";
    if (path.startsWith("/settings")) return "settings";
    return "analytics";
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
            <Route path="/" element={<Navigate to="/analytics" replace />} />

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
                  <TaskBoard />
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
