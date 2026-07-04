// app/api/follow-up/route.ts — POST: Clerk auth → paid check → Gemini → return FollowUpChain JSON

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserEntitlementsFromClaims } from "@/lib/entitlements";
import { generateFollowUpChain } from "@/features/generator/generator.service";
import { projectInputSchema } from "@/features/generator/generator.schema";
import { successResponse, errorResponse } from "@/types/api";
import { AppError } from "@/lib/errors";
import type { PromptKit } from "@/features/generator/generator.types";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json(
        errorResponse("Authentication required.", "AUTHENTICATION_ERROR"),
        { status: 401 }
      );
    }

    const entitlements = getUserEntitlementsFromClaims(sessionClaims);
    if (entitlements.plan !== "pro") {
      return NextResponse.json(
        errorResponse("Follow-up prompts require a Pro subscription.", "AUTHORIZATION_ERROR"),
        { status: 403 }
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

    const bodyObj =
      typeof body === "object" && body !== null && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : null;

    if (!bodyObj) {
      return NextResponse.json(
        errorResponse("Request body must be a JSON object.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const parsed = projectInputSchema.safeParse(bodyObj["input"]);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
      return NextResponse.json(
        errorResponse(firstError, "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const kit = bodyObj["kit"];
    if (typeof kit !== "object" || kit === null || Array.isArray(kit)) {
      return NextResponse.json(
        errorResponse("Request body must include a valid kit object.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const followUpChain = await generateFollowUpChain(
      parsed.data,
      kit as PromptKit
    );

    return NextResponse.json(successResponse(followUpChain), { status: 200 });
  } catch (error: unknown) {
    if (AppError.isAppError(error)) {
      return NextResponse.json(
        errorResponse(error.toClientResponse().error, error.code),
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      errorResponse(
        "An unexpected error occurred. Please try again later.",
        "INTERNAL_ERROR"
      ),
      { status: 500 }
    );
  }
}
