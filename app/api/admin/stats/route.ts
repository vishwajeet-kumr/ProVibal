import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/types/api";

export const dynamic = "force-dynamic";

// Simple admin protection - in a real app, you'd check a specific admin user ID
// or a custom claim `isAdmin` in Clerk metadata.
// For now, we will just restrict this to a specific ID if provided in env, 
// or require a secret token. Let's use a secret token.
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get("authorization");
    
    // In MVP, we just use the DODO webhook secret or another env var as a poor man's admin token
    // Example: curl -H "Authorization: Bearer my-secret" http://localhost:3000/api/admin/stats
    if (authHeader !== `Bearer ${process.env.DODO_WEBHOOK_SECRET}`) {
      return NextResponse.json(
        errorResponse("Unauthorized.", "AUTHENTICATION_ERROR"),
        { status: 401 }
      );
    }

    // 1. Total Generations
    const { count: totalGenerations } = await supabaseAdmin
      .from("generations")
      .select("*", { count: "exact", head: true });

    // 2. Total Active Subscriptions
    const { count: activeSubscriptions } = await supabaseAdmin
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    // 3. Total Follow-up Runs
    const { count: totalFollowUps } = await supabaseAdmin
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("action_type", "follow_up");

    return NextResponse.json(successResponse({
      totalGenerations: totalGenerations ?? 0,
      activeSubscriptions: activeSubscriptions ?? 0,
      totalFollowUps: totalFollowUps ?? 0
    }), { status: 200 });
  } catch (error) {
    console.error("Unexpected error fetching admin stats:", error);
    return NextResponse.json(
      errorResponse("An unexpected error occurred.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
