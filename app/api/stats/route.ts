// app/api/stats/route.ts — GET: returns public stats (total kits generated)

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 300; // cache for 5 minutes

export async function GET(): Promise<NextResponse> {
  try {
    const { count, error } = await supabaseAdmin
      .from("generations")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[stats] Failed to fetch count:", error);
      return NextResponse.json({ kitsGenerated: 0 }, { status: 200 });
    }

    return NextResponse.json(
      { kitsGenerated: count ?? 0 },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json({ kitsGenerated: 0 }, { status: 200 });
  }
}
