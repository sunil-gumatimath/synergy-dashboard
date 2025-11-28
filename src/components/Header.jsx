import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

const Header = ({ onMobileMenuToggle }) => {
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

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    const activeTab = getActiveTab();

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
    <header className="app-header">
      <div className="header-left">
        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          className="mobile-menu-btn-header"
          onClick={onMobileMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="page-title">{getPageTitle()}</h2>
          <p className="page-subtitle">Welcome back, {getUserName()}</p>
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-btn">🔔</button>
        <div className="user-profile">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-main">{getUserName()}</p>
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
  );
};

Header.propTypes = {
  onMobileMenuToggle: PropTypes.func,
};

export default Header;
