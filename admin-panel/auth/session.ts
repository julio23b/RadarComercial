import type { Provider } from '@supabase/supabase-js';
import { adminSupabase } from '../services/supabaseClient';

export const getAdminSession = async () => {
  const { data, error } = await adminSupabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await adminSupabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await adminSupabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signInWithProvider = async (provider: Provider, redirectTo: string) => {
  const { data, error } = await adminSupabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) throw error;
  return data;
};

export const onAdminAuthStateChange = (callback: Parameters<typeof adminSupabase.auth.onAuthStateChange>[0]) =>
  adminSupabase.auth.onAuthStateChange(callback);
