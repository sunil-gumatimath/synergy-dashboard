import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute - Wrapper component that requires authentication
 * Shows children only if user is authenticated, otherwise shows login page
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!user) {
    // Dynamically import LoginPage to avoid circular dependencies
    const LoginPage = React.lazy(() => import("../pages/LoginPage"));
    return (
      <React.Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <LoginPage />
      </React.Suspense>
    );
  }

  // User is authenticated, show protected content
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
