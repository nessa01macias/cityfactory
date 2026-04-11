import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("Supabase not configured – running in offline mode.");
  // Create a dummy client that won't crash the app
  supabase = new Proxy({} as SupabaseClient, {
    get: () => () => ({ data: null, error: { message: "Supabase not configured" } }),
  });
}

export { supabase };