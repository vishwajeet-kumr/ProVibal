// app/api/webhook/razorpay/route.ts — POST: verify Razorpay signature → handle subscription activation

import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { successResponse, errorResponse } from "@/types/api";
import { AppError } from "@/lib/errors";

export const dynamic = "force-dynamic";

interface RazorpaySubscriptionEntity {
  readonly id: string;
}

interface RazorpayWebhookPayload {
  readonly subscription?: {
    readonly entity: RazorpaySubscriptionEntity;
  };
}

interface RazorpayWebhookEvent {
  readonly event: string;
  readonly payload: RazorpayWebhookPayload;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const rawBody = await request.text();

    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json(
        errorResponse("Missing x-razorpay-signature header.", "WEBHOOK_VERIFICATION_FAILED"),
        { status: 400 }
      );
    }

    try {
      verifyWebhookSignature(rawBody, signature);
    } catch (verifyError: unknown) {
      if (AppError.isAppError(verifyError)) {
        return NextResponse.json(
          errorResponse(verifyError.toClientResponse().error, verifyError.code),
          { status: 400 }
        );
      }
      return NextResponse.json(
        errorResponse("Webhook signature verification failed.", "WEBHOOK_VERIFICATION_FAILED"),
        { status: 400 }
      );
    }

    let event: RazorpayWebhookEvent;
    try {
      event = JSON.parse(rawBody) as RazorpayWebhookEvent;
    } catch {
      return NextResponse.json(
        errorResponse("Webhook body must be valid JSON.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (event.event === "subscription.activated") {
      const subscriptionId = event.payload.subscription?.entity.id ?? "unknown";
      console.info("[webhook] subscription.activated", { subscriptionId });
    }

    return NextResponse.json(successResponse({ received: true }), { status: 200 });
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
