import React, { Suspense, useState } from "react";
import Sidebar from "./components/Sidebar";
import Stats from "./components/Stats";
import EmployeeList from "./features/employees/EmployeeList";
import SettingsView from "./features/settings/SettingsView";

const AnalyticsDashboard = React.lazy(() => import("./features/analytics/AnalyticsDashboard"));
const CalendarView = React.lazy(() => import("./features/calendar/CalendarView"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState("employees");

  const validTabs = ["employees", "analytics", "calendar", "settings"];

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content">
        <header className="app-header">
          <div>
            <h2 className="page-title">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="page-subtitle">Welcome back, Admin</p>
          </div>

          <div className="header-actions">
            <button className="icon-btn">🔔</button>
            <div className="user-profile">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Sunil Kumar</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <img
                src="https://api.dicebear.com/9.x/micah/svg?seed=Felix"
                alt="Sunil Kumar"
                className="user-avatar"
              />
            </div>
          </div>
        </header>

        {activeTab === "employees" && (
          <>
            <Stats />
            <EmployeeList />
          </>
        )}

        {activeTab === "analytics" && (
          <Suspense fallback={<LoadingSpinner />}>
            <AnalyticsDashboard />
          </Suspense>
        )}

        {activeTab === "calendar" && (
          <Suspense fallback={<LoadingSpinner />}>
            <CalendarView />
          </Suspense>
        )}

        {activeTab === "settings" && <SettingsView />}

        {!validTabs.includes(activeTab) && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} module coming soon...
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
