import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute - Wrapper component that requires authentication
 * Shows children only if user is authenticated, otherwise shows login page
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
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
  if (user) {
    // Check for role-based access
    // If allowedRoles is provided and user's role is not in the list
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Redirect to home or show unauthorized message
      // For now, we'll just return null or a message, or redirect to a safe route
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600">You do not have permission to view this page.</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return children;
  }

  return null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;
