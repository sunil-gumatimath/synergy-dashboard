import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { authService } from "../services/authService";

const AuthContext = createContext({});

/* eslint-disable react-refresh/only-export-components */

// Provider component for authentication context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    const initializeAuth = async () => {
      const { session: currentSession } = await authService.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { subscription } = authService.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      },
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, metadata) => {
    const { user: newUser, error } = await authService.signUp(
      email,
      password,
      metadata,
    );
    if (!error && newUser) {
      setUser(newUser);
    }
    return { user: newUser, error };
  };

  const signIn = async (email, password) => {
    const {
      user: signedInUser,
      session: newSession,
      error,
    } = await authService.signIn(email, password);
    if (!error) {
      setUser(signedInUser);
      setSession(newSession);
    }
    return { user: signedInUser, error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for using authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
