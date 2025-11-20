import React from "react";
import PropTypes from "prop-types";
import { Users, LayoutDashboard, Calendar, Settings, LogOut, ChevronRight } from "lucide-react";

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
            SK
          </div>
          <div className="user-info-sidebar">
            <span className="user-name-sidebar">Sunil Kumar</span>
            <span className="user-email-sidebar">sunil.kumar@staffly.com</span>
          </div>
          <LogOut size={16} className="ml-auto text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default Sidebar;
