import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { authService } from "../services/authService";
import { supabase } from "../lib/supabase";

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
      try {
        const { session: currentSession, error } = await authService.getSession();

        if (error) {
          console.error('Session error:', error);
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        // Check if session exists and is valid
        if (currentSession) {
          // Check if token is expired
          const expiresAt = currentSession.expires_at * 1000; // Convert to milliseconds
          const now = Date.now();

          if (expiresAt < now) {
            console.log('Session expired, attempting to refresh...');
            // Try to refresh the session
            // Note: The provided edit uses `supabase.auth.refreshSession()`.
            // If `supabase` is not globally available or imported,
            // you might need to adjust this to `authService.refreshSession()`
            // if authService provides such a method, or import `supabase`.
            const { data: { session: newSession }, error: refreshError } =
              await supabase.auth.refreshSession();

            if (refreshError || !newSession) {
              console.error('Failed to refresh expired session, signing out...');
              await authService.signOut();
              setSession(null);
              setUser(null);
            } else {
              console.log('Session refreshed successfully');
              setSession(newSession);
              setUser(newSession.user);
            }
          } else {
            setSession(currentSession);
            setUser(currentSession.user);
          }
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes (including automatic token refresh)
    const { subscription } = authService.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth event:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Handle token refresh
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }

        // Handle sign out
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        }
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
