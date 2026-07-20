// Test Supabase connection and table access
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("NEXT_PUBLIC_SUPABASE_URL:", url ? `${url.substring(0, 30)}...` : "MISSING");
console.log("SUPABASE_SERVICE_ROLE_KEY:", key ? `${key.substring(0, 20)}...` : "MISSING");

if (!url || !key) {
  console.error("Missing env vars. Exiting.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  // Test 1: Can we select from generations?
  console.log("\n--- Test 1: SELECT from generations ---");
  const { data: g, error: ge } = await supabase.from("generations").select("id").limit(1);
  console.log("Data:", g);
  console.log("Error:", ge);

  // Test 2: Can we select from subscriptions?
  console.log("\n--- Test 2: SELECT from subscriptions ---");
  const { data: s, error: se } = await supabase.from("subscriptions").select("id").limit(1);
  console.log("Data:", s);
  console.log("Error:", se);

  // Test 3: Can we select from usage_logs?
  console.log("\n--- Test 3: SELECT from usage_logs ---");
  const { data: u, error: ue } = await supabase.from("usage_logs").select("id").limit(1);
  console.log("Data:", u);
  console.log("Error:", ue);

  // Test 4: Can we INSERT into generations?
  console.log("\n--- Test 4: INSERT into generations ---");
  const { data: ig, error: ige } = await supabase
    .from("generations")
    .insert({
      user_id: "test_user_123",
      project_name: "Test Project",
      project_type: "web-app",
      tech_stack: "default",
      description: "Test description",
      foundation_prompt: "Test foundation",
      file_map: { overview: "test", fileStructure: [] },
      build_steps: { steps: [] },
      follow_up_runs: [],
    })
    .select("id")
    .single();
  console.log("Inserted ID:", ig?.id);
  console.log("Error:", ige);

  // Cleanup test row
  if (ig?.id) {
    await supabase.from("generations").delete().eq("id", ig.id);
    console.log("Cleaned up test row");
  }
}

test().catch(console.error);
