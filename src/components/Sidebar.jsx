import React from "react";
import { Users, LayoutDashboard, Calendar, Settings, LogOut, ChevronRight } from "lucide-react";

const Logo = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M16 8L8 16M8 8L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 12L12 12.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BrandLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
    <path d="M4 15C4 15 5 16 8 16C11 16 11 14 11 14C11 14 11 12 8 12C5 12 5 10 5 10C5 10 5 8 8 8C11 8 12 9 12 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 16V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 16V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { icon: Users, label: "Employees", id: "employees" },
    { icon: LayoutDashboard, label: "Analytics", id: "analytics" },
    { icon: Calendar, label: "Calendar", id: "calendar" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">
          <span className="text-xl font-bold">S</span>
        </div>
        <h1 className="brand-name">
          Staffly
        </h1>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            >
              <Icon size={20} strokeWidth={2} />
              <span className="text-sm">{item.label}</span>
              {activeTab === item.id && (
                <ChevronRight size={16} className="ml-auto opacity-50" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-sidebar">
          <div className="user-avatar-sidebar">
            JD
          </div>
          <div className="user-info-sidebar">
            <span className="user-name-sidebar">John Doe</span>
            <span className="user-email-sidebar">john@staffly.com</span>
          </div>
          <LogOut size={16} className="ml-auto text-gray-400 hover:text-red-500 transition-colors" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
