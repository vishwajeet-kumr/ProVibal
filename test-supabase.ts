import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function test() {
  console.log("Checking generations table...");
  const { data, error } = await supabaseAdmin.from("generations").select("*").limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! Data:", data);
  }
}
test();
