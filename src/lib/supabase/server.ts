import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabaseServer: any;

try {
  // Server-side client with full permissions (never expose to browser)
  supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
} catch (error) {
  // If client creation fails (e.g., missing env vars during build),
  // create a placeholder that will error clearly at runtime
  supabaseServer = {
    from: () => {
      throw new Error(
        "Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
      );
    },
  };
}

export { supabaseServer };
