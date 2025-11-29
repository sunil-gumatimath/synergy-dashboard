import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { employeeService } from "../services/employeeService";
import PropTypes from "prop-types";

const Header = ({ onMobileMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // In a real app, you might have a specific search endpoint
        // Here we'll fetch all and filter client-side for simplicity
        const { data } = await employeeService.getAll();
        if (data) {
          const filtered = data.filter(emp =>
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 5); // Limit to 5 results
          setSearchResults(filtered);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleResultClick = (employeeId) => {
    navigate(`/employees/${employeeId}`);
    setSearchQuery("");
    setShowResults(false);
  };

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

        <div className="header-title-container">
          <h2 className="page-title">{getPageTitle()}</h2>
          <p className="page-subtitle">Welcome back, {getUserName()}</p>
        </div>
      </div>

      {/* Global Search */}
      <div className="header-search-container" ref={searchRef}>
        <div className="header-search-input-wrapper">
          <Search size={18} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search employees..."
            className="header-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery) setShowResults(true);
            }}
          />
          {searchQuery && (
            <button
              className="header-search-clear"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="header-search-results">
            {isSearching ? (
              <div className="p-4 text-center text-sm text-muted">Searching...</div>
            ) : searchResults.length > 0 ? (
              <ul>
                {searchResults.map(result => (
                  <li key={result.id}>
                    <button
                      className="header-search-result-item"
                      onClick={() => handleResultClick(result.id)}
                    >
                      <div className="header-search-avatar">
                        {result.name.charAt(0)}
                      </div>
                      <div className="header-search-info">
                        <p className="header-search-name">{result.name}</p>
                        <p className="header-search-role">{result.role}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-muted">No results found</div>
            )}
          </div>
        )}
      </div>

      <div className="header-actions">
        <button className="icon-btn">🔔</button>
        <Link to="/profile" className="user-profile cursor-pointer hover:bg-gray-100 rounded-lg transition-colors">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-main">{getUserName()}</p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
          <img
            src={`https://api.dicebear.com/9.x/micah/svg?seed=${getAvatarSeed()}`}
            alt={getUserName()}
            className="user-avatar"
          />
        </Link>
      </div>
    </header>
  );
};

Header.propTypes = {
  onMobileMenuToggle: PropTypes.func,
};

export default Header;
