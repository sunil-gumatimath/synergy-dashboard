import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Stats from "./components/Stats";
import EmployeeList from "./features/employees/EmployeeList";
import SettingsView from "./features/settings/SettingsView";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import { useAuth } from "./contexts/AuthContext";

const AnalyticsDashboard = React.lazy(
  () => import("./features/analytics/AnalyticsDashboard"),
);
const CalendarView = React.lazy(
  () => import("./features/calendar/CalendarView"),
);

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Determine active tab from current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith("/employees")) return "employees";
    if (path.startsWith("/analytics")) return "analytics";
    if (path.startsWith("/calendar")) return "calendar";
    if (path.startsWith("/settings")) return "settings";
    return "analytics";
  };

  const activeTab = getActiveTab();

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/employees/") && path !== "/employees") {
      return "Employee Details";
    }
    return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  };

  // Get user display name from auth metadata or email
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Generate avatar seed from user email or id
  const getAvatarSeed = () => {
    return user?.email || user?.id || "default";
  };

  return (
    <ProtectedRoute>
      <div className="app-container">
        <Sidebar activeTab={activeTab} />

        <main className="main-content">
          <header className="app-header">
            <div>
              <h2 className="page-title">{getPageTitle()}</h2>
              <p className="page-subtitle">Welcome back, {getUserName()}</p>
            </div>

            <div className="header-actions">
              <button className="icon-btn">🔔</button>
              <div className="user-profile">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-main">
                    {getUserName()}
                  </p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
                <img
                  src={`https://api.dicebear.com/9.x/micah/svg?seed=${getAvatarSeed()}`}
                  alt={getUserName()}
                  className="user-avatar"
                />
              </div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Navigate to="/analytics" replace />} />

            <Route
              path="/analytics"
              element={
                <Suspense fallback={<LoadingSpinner size="lg" message="Loading analytics..." />}>
                  <AnalyticsDashboard />
                </Suspense>
              }
            />

            <Route
              path="/employees"
              element={
                <>
                  <Stats />
                  <EmployeeList />
                </>
              }
            />

            <Route path="/employees/:id" element={<EmployeeDetailPage />} />

            <Route
              path="/calendar"
              element={
                <Suspense fallback={<LoadingSpinner size="lg" message="Loading calendar..." />}>
                  <CalendarView />
                </Suspense>
              }
            />

            <Route path="/settings" element={<SettingsView />} />

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
