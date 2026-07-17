// app/api/generate/route.ts — POST: auth → entitlements → validate → rate limit → Gemini → return PromptKit JSON

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserEntitlementsFromClaims, canGenerate, markProjectTrialUsed } from "@/lib/entitlements";
import { projectInputSchema } from "@/features/generator/generator.schema";
import { generatePromptKit } from "@/features/generator/generator.service";
import { checkRateLimit } from "@/lib/rate-limit";
import { successResponse, errorResponse } from "@/types/api";
import { AppError } from "@/lib/errors";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function extractIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      throw AppError.authentication(
        "No authenticated session found for protected route",
        {}
      );
    }

    const entitlements = getUserEntitlementsFromClaims(sessionClaims);
    if (!canGenerate(entitlements)) {
      throw AppError.authorization(
        "Free trial already used. Upgrade to Pro.",
        { userId }
      );
    }

    if (entitlements.plan !== "pro") {
      const ip = extractIp(request);
      try {
        checkRateLimit(ip);
      } catch (rateLimitError: unknown) {
        if (AppError.isAppError(rateLimitError)) {
          return NextResponse.json(
            errorResponse(
              rateLimitError.toClientResponse().error,
              rateLimitError.code
            ),
            { status: 429 }
          );
        }
        return NextResponse.json(
          errorResponse("Too many requests. Please try again later.", "RATE_LIMIT_EXCEEDED"),
          { status: 429 }
        );
      }
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        errorResponse("Request body must be valid JSON.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const parsed = projectInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
      return NextResponse.json(
        errorResponse(firstError, "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const promptKit = await generatePromptKit(parsed.data);

    // Save to database
    const { data: dbRecord, error: dbError } = await supabaseAdmin
      .from("generations")
      .insert({
        user_id: userId,
        project_name: parsed.data.projectName,
        project_type: parsed.data.projectType,
        tech_stack: parsed.data.techStack,
        description: parsed.data.description,
        foundation_prompt: promptKit.foundation,
        file_map: promptKit.projectMap,
        build_steps: promptKit.featureSequence,
        follow_up_runs: promptKit.followUpChain ? [promptKit.followUpChain] : [],
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Failed to save generation to DB:", dbError);
    }

    // Log usage
    await supabaseAdmin.from("usage_logs").insert({
      user_id: userId,
      action_type: "generate_kit",
    });

    if (entitlements.plan === "free") {
      await markProjectTrialUsed(userId);
    }

    const finalKit = dbRecord ? { ...promptKit, id: dbRecord.id } : promptKit;
    return NextResponse.json(successResponse(finalKit), { status: 200 });
  } catch (error: unknown) {
    if (AppError.isAppError(error)) {
      return NextResponse.json(
        errorResponse(error.toClientResponse().error, error.code),
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      errorResponse("An unexpected error occurred. Please try again later.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
