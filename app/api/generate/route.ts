// app/api/generate/route.ts — POST: validate input → rate limit → Gemini → return PromptKit JSON

import { NextResponse } from "next/server";
import { projectInputSchema } from "@/features/generator/generator.schema";
import { generatePromptKitStream } from "@/features/generator/generator.service";
import { checkRateLimit } from "@/lib/rate-limit";
import { successResponse, errorResponse } from "@/types/api";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

function extractIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}

export async function POST(request: Request): Promise<Response> {
  try {
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

    const stream = await generatePromptKitStream(parsed.data);

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(`data: ${chunk}\n\n`);
          }
          controller.enqueue(`data: [DONE]\n\n`);
          controller.close();
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(`data: [ERROR]${msg}\n\n`);
          controller.close();
        }
      }
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
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
