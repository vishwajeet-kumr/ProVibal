import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

// We use the service role key because we are interacting with Supabase purely 
// from our Next.js Route Handlers (Server). Authentication is already handled by Clerk,
// so we manually enforce user_id checks in our DB queries.
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);
