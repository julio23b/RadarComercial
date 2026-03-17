import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../mobile-app/services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signInWithPassword: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signUpWithPassword: (email, password) => supabase.auth.signUp({ email, password }),
      signOut: () => supabase.auth.signOut(),
      signInWithProvider: (provider) =>
        supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: 'radarcomercial://auth/callback',
          },
        }),
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
