import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!userId) {
      return NextResponse.json(
        errorResponse("Authentication required.", "AUTHENTICATION_ERROR"),
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("generations")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId) // Enforce user ownership
      .single();

    if (error || !data) {
      return NextResponse.json(
        errorResponse("Prompt kit not found.", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // Reconstruct the PromptKit shape expected by the frontend
    const promptKit = {
      id: data.id,
      projectName: data.project_name,
      projectType: data.project_type,
      techStack: data.tech_stack,
      foundation: data.foundation_prompt,
      projectMap: data.file_map,
      featureSequence: data.build_steps,
      followUpChain:
        data.follow_up_runs && data.follow_up_runs.length > 0
          ? data.follow_up_runs[data.follow_up_runs.length - 1]
          : null,
    };

    return NextResponse.json(successResponse(promptKit), { status: 200 });
  } catch (error) {
    console.error("Unexpected error fetching generation:", error);
    return NextResponse.json(
      errorResponse("An unexpected error occurred.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
