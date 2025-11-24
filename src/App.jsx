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

  return (
    <ProtectedRoute>
      <div className="app-container">
        <Sidebar activeTab={activeTab} />

        <main className="main-content">
          <Header />

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
