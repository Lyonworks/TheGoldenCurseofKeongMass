import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabase: any;

try {
  // Browser/client Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  // If client creation fails (e.g., missing env vars during build),
  // create a placeholder that will error clearly at runtime
  supabase = {
    from: () => {
      throw new Error(
        "Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
      );
    },
  };
}

export { supabase };
