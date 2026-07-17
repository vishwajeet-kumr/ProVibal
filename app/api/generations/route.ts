import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        errorResponse("Authentication required.", "AUTHENTICATION_ERROR"),
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("generations")
      .select("id, project_name, project_type, tech_stack, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch generations:", error);
      return NextResponse.json(
        errorResponse("Failed to fetch kit history.", "INTERNAL_ERROR"),
        { status: 500 }
      );
    }

    return NextResponse.json(successResponse(data), { status: 200 });
  } catch (error) {
    console.error("Unexpected error fetching generations:", error);
    return NextResponse.json(
      errorResponse("An unexpected error occurred.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
