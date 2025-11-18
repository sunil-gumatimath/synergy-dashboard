import React from "react";
import EmployeeList from "./features/employees/EmployeeList";
import Sidebar from "./components/Sidebar";
import Stats from "./components/Stats";
import AnalyticsDashboard from "./features/analytics/AnalyticsDashboard";
import CalendarView from "./features/calendar/CalendarView";
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
                <p className="text-sm font-medium text-gray-900">Tedz</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <img
                src="https://api.dicebear.com/9.x/micah/svg?seed=Tedz"
                alt="Tedz"
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

        {activeTab === "analytics" && <AnalyticsDashboard />}

        {activeTab === "calendar" && <CalendarView />}

        {activeTab === "settings" && <SettingsView />}

        {activeTab !== "employees" && activeTab !== "analytics" && activeTab !== "calendar" && activeTab !== "settings" && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} module
            coming soon...
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
