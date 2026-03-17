import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.ADMIN_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.ADMIN_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing admin Supabase env vars');
}

export const adminSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
