import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Users,
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  LifeBuoy,
  Home,
  Menu,
  X,
  Umbrella,
  Timer,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ activeTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      id: "dashboard",
      path: "/dashboard",
      roles: ["Employee"],
    },
    {
      icon: LayoutDashboard,
      label: "Analytics",
      id: "analytics",
      path: "/analytics",
      roles: ["Admin", "Manager"],
    },
    {
      icon: Users,
      label: "Employees",
      id: "employees",
      path: "/employees",
      roles: ["Admin", "Manager"],
    },
    {
      icon: ClipboardList,
      label: "Tasks",
      id: "tasks",
      path: "/tasks",
      roles: ["Admin", "Manager", "Employee"],
    },
    {
      icon: Timer,
      label: "Time Tracking",
      id: "timetracking",
      path: "/timetracking",
      roles: ["Admin", "Manager", "Employee"],
    },
    {
      icon: Umbrella,
      label: "Leave",
      id: "leave",
      path: "/leave",
      roles: ["Admin", "Manager", "Employee"],
    },
    {
      icon: LifeBuoy,
      label: "Help Desk",
      id: "support",
      path: "/support",
      roles: ["Admin", "Manager", "Employee"],
    },
    {
      icon: Calendar,
      label: "Calendar",
      id: "calendar",
      path: "/calendar",
      roles: ["Admin", "Manager", "Employee"],
    },
    {
      icon: Settings,
      label: "Settings",
      id: "settings",
      path: "/settings",
      roles: ["Admin", "Manager", "Employee"],
    },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    !item.roles || (user?.role && item.roles.includes(user.role)) || user?.role === 'Admin' // Admin always sees everything as fallback
  );

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
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
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
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
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <Link
              to="/profile"
              className="user-profile-sidebar"
              style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
            >
              <div className="user-avatar-sidebar">{getUserInitials()}</div>
              {!isCollapsed && (
                <div className="user-info-sidebar">
                  <span className="user-name-sidebar">{getUserName()}</span>
                  <span className="user-email-sidebar">{user?.role || 'Employee'}</span>
                </div>
              )}
            </Link>
            <button
              className="sidebar-logout-btn"
              aria-label="Logout"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile Overlay - Render AFTER sidebar so it's on top */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  isMobileMenuOpen: PropTypes.bool.isRequired,
  setIsMobileMenuOpen: PropTypes.func.isRequired,
};

export default Sidebar;
