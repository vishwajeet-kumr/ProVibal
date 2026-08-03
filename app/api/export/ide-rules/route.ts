// app/api/export/ide-rules/route.ts — POST: auth → Pro-only → generate IDE rule files → save to DB

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserEntitlementsFromClaims } from "@/lib/entitlements";
import { generateIdeRules } from "@/features/generator/generator.service";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/types/api";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      throw AppError.authentication(
        "No authenticated session found for protected route",
        {}
      );
    }

    // Pro-only feature
    const entitlements = getUserEntitlementsFromClaims(sessionClaims);
    if (entitlements.plan !== "pro") {
      throw AppError.authorization(
        "IDE rules export is a Pro feature. Upgrade to generate .cursorrules, .windsurfrules, and AGENTS.md files.",
        { userId }
      );
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

    const { input, kit, generationId } = body as {
      input: unknown;
      kit: unknown;
      generationId?: string;
    };

    if (!input || typeof input !== "object") {
      return NextResponse.json(
        errorResponse("Missing or invalid 'input' field.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (!kit || typeof kit !== "object") {
      return NextResponse.json(
        errorResponse("Missing or invalid 'kit' field.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ideRules = await generateIdeRules(input as any, kit as any);

    // Persist to database if we have a generation ID
    const kitId = generationId || (kit as Record<string, unknown>).id;
    if (kitId && typeof kitId === "string") {
      await supabaseAdmin
        .from("generations")
        .update({ ide_rules: ideRules })
        .eq("id", kitId)
        .eq("user_id", userId);
    }

    return NextResponse.json(successResponse(ideRules), { status: 200 });
  } catch (error: unknown) {
    if (AppError.isAppError(error)) {
      return NextResponse.json(
        errorResponse(error.toClientResponse().error, error.code),
        { status: error.statusCode }
      );
    }

    console.error("IDE rules generation failed:", error);
    return NextResponse.json(
      errorResponse(
        "Failed to generate IDE rules. Please try again.",
        "INTERNAL_ERROR"
      ),
      { status: 500 }
    );
  }
}
