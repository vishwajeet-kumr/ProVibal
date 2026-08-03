// app/api/user/stats/route.ts — GET: authenticated user's activity stats

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface UserStats {
  totalKitsGenerated: number;
  totalProtocolRuns: number;
  mostUsedStack: string | null;
  mostUsedProjectType: string | null;
  memberSince: string | null;
  lastGeneratedAt: string | null;
}

export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all generations for this user
    const { data: generations, error: genError } = await supabaseAdmin
      .from("generations")
      .select("project_type, tech_stack, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (genError) {
      console.error("[user/stats] Failed to fetch generations:", genError);
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }

    // Fetch protocol runs count
    const { count: protocolCount, error: protocolError } = await supabaseAdmin
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("action_type", "follow_up");

    if (protocolError) {
      console.error("[user/stats] Failed to fetch protocol count:", protocolError);
    }

    const allGens = generations ?? [];
    const totalKitsGenerated = allGens.length;

    // Calculate most used stack
    const stackCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};

    for (const gen of allGens) {
      const stack = gen.tech_stack === "default" ? "Auto-selected" : gen.tech_stack;
      stackCounts[stack] = (stackCounts[stack] ?? 0) + 1;
      typeCounts[gen.project_type] = (typeCounts[gen.project_type] ?? 0) + 1;
    }

    const mostUsedStack = Object.entries(stackCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const mostUsedProjectType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    const stats: UserStats = {
      totalKitsGenerated,
      totalProtocolRuns: protocolCount ?? 0,
      mostUsedStack,
      mostUsedProjectType,
      memberSince: allGens[0]?.created_at ?? null,
      lastGeneratedAt: allGens[allGens.length - 1]?.created_at ?? null,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
