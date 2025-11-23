import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Users,
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();
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

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await signOut();
    }
  };

  // Get user display name
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Get user initials
  const getUserInitials = () => {
    const name = getUserName();
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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

      {/* Sidebar Container */}
      <div className="sidebar-container">
        {/* Collapse Toggle Button (Desktop only) */}
        <button
          className="sidebar-collapse-toggle"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""} ${isCollapsed ? "collapsed" : ""}`}
        >
          <div className="sidebar-header">
            <div className="brand-logo">
              <span className="text-xl font-bold">A</span>
            </div>
            {!isCollapsed && <h1 className="brand-name">Aurora</h1>}
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
                        <ChevronRight
                          size={16}
                          className="ml-auto opacity-50"
                        />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile-sidebar">
              <div className="user-avatar-sidebar">{getUserInitials()}</div>
              {!isCollapsed && (
                <div className="user-info-sidebar">
                  <span className="user-name-sidebar">{getUserName()}</span>
                  <span className="user-email-sidebar">{user?.email}</span>
                </div>
              )}
              <button
                className="sidebar-logout-btn"
                aria-label="Logout"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default Sidebar;
