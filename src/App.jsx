import React, { Suspense } from "react";
import EmployeeList from "./features/employees/EmployeeList";
import Sidebar from "./components/Sidebar";
import Stats from "./components/Stats";
const AnalyticsDashboard = React.lazy(() => import("./features/analytics/AnalyticsDashboard"));
const CalendarView = React.lazy(() => import("./features/calendar/CalendarView"));
import SettingsView from "./features/settings/SettingsView";

function App() {
  const [activeTab, setActiveTab] = React.useState("employees");

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
                <p className="text-sm font-medium text-gray-900">Aditya Sharma</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <img
                src="https://api.dicebear.com/9.x/micah/svg?seed=Aditya"
                alt="Aditya Sharma"
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
          <Suspense fallback={<div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>}>
            <AnalyticsDashboard />
          </Suspense>
        )}

        {activeTab === "calendar" && (
          <Suspense fallback={<div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>}>
            <CalendarView />
          </Suspense>
        )}

        {activeTab === "settings" && <SettingsView />}

        {(() => {
          const validTabs = ["employees", "analytics", "calendar", "settings"];
          if (!validTabs.includes(activeTab)) {
            return (
              <div className="flex items-center justify-center h-64 text-gray-500">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} module coming soon...
              </div>
            );
          }
          return null;
        })()}
      </main>
    </div>
  );
}

export default App;
