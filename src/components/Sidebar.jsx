import React, { useState } from "react";
import PropTypes from "prop-types";
import { Users, LayoutDashboard, Calendar, Settings, LogOut, ChevronRight, Menu, X, ChevronLeft } from "lucide-react";

const Sidebar = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Users, label: "Employees", id: "employees" },
    { icon: LayoutDashboard, label: "Analytics", id: "analytics" },
    { icon: Calendar, label: "Calendar", id: "calendar" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Collapse Toggle Button (Desktop only) */}
        <button
          className="sidebar-collapse-toggle"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className="sidebar-header">
          <div className="brand-logo">
            <span className="text-xl font-bold">A</span>
          </div>
          {!isCollapsed && (
            <h1 className="brand-name">
              Aurora
            </h1>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={20} strokeWidth={2} />
                {!isCollapsed && (
                  <>
                    <span className="nav-item-label">{item.label}</span>
                    {activeTab === item.id && (
                      <ChevronRight size={16} className="ml-auto opacity-50" />
                    )}
                  </>
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
            {!isCollapsed && (
              <div className="user-info-sidebar">
                <span className="user-name-sidebar">Sunil Kumar</span>
                <span className="user-email-sidebar">sunil.kumar@aurora.app</span>
              </div>
            )}
            <button
              className="sidebar-logout-btn"
              aria-label="Logout"
              onClick={() => alert('Logout functionality')}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default Sidebar;
