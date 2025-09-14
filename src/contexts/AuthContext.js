import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setAuthError(error.message);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setAuthError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          setAuthError(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        setAuthError(error.message);
        return { error };
      }
      
      return { data };
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthError('An unexpected error occurred during sign up');
      return { error: { message: 'An unexpected error occurred during sign up' } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setAuthError(error.message);
        return { error };
      }
      
      return { data };
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError('An unexpected error occurred during sign in');
      return { error: { message: 'An unexpected error occurred during sign in' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setAuthError(error.message);
        return { error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError('An unexpected error occurred during sign out');
      return { error: { message: 'An unexpected error occurred during sign out' } };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    session,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};